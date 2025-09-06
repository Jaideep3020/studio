
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateLectureQrCode } from '@/ai/flows/generate-lecture-qr-code';
import { QrCode, LoaderCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Lecture } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QrCodeGeneratorProps {
    onQrCodeGenerated: (lecture: Lecture, qrCodeDataUri: string) => void;
}

const availableClasses = [
    'Physics 101 - Introduction to Mechanics',
    'Mathematics 202 - Advanced Calculus',
    'History 301 - The World Wars',
    'English Literature 101 - Shakespeare',
]

export function QrCodeGenerator({ onQrCodeGenerated }: QrCodeGeneratorProps) {
  const [lectureDescription, setLectureDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!lectureDescription) {
        setError('Please select a class to generate a QR code.');
        return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const lectureId = `lecture_${Date.now()}`;
      const lecturePayload = JSON.stringify({ id: lectureId, description: lectureDescription });

      const result = await generateLectureQrCode({ lectureDescription: lecturePayload });

      if (result.qrCodeDataUri) {
        const newLecture = { id: lectureId, description: lectureDescription };
        onQrCodeGenerated(newLecture, result.qrCodeDataUri);
      } else {
        setError('Failed to generate QR code. The AI did not return valid data.');
      }
    } catch (e) {
      setError('An error occurred while generating the QR code. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate QR Code</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium">Select Class</label>
            <Select onValueChange={setLectureDescription} value={lectureDescription}>
                <SelectTrigger id="class-select" className="w-full">
                    <SelectValue placeholder="Choose a class" />
                </SelectTrigger>
                <SelectContent position="popper">
                    {availableClasses.map((className) => (
                        <SelectItem key={className} value={className}>
                            {className}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isLoading || !lectureDescription}>
            {isLoading ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <QrCode className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Generating...' : 'Generate QR Code'}
          </Button>
        </form>

        {error && (
            <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
      </CardContent>
    </Card>
  );
}
