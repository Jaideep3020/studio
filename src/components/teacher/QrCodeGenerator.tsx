
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { generateLectureQrCode } from '@/ai/flows/generate-lecture-qr-code';
import { QrCode, Zap, LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Lecture } from '@/lib/types';

interface QrCodeGeneratorProps {
    onQrCodeGenerated: (lecture: Lecture) => void;
}

export function QrCodeGenerator({ onQrCodeGenerated }: QrCodeGeneratorProps) {
  const [lectureDescription, setLectureDescription] = useState('Physics 101 - Introduction to Mechanics');
  const [qrCodeDataUri, setQrCodeDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setQrCodeDataUri(null);

    try {
      const lectureId = `lecture_${Date.now()}`;
      const lecturePayload = JSON.stringify({ id: lectureId, description: lectureDescription });

      const result = await generateLectureQrCode({ lectureDescription: lecturePayload });

      if (result.qrCodeDataUri) {
        setQrCodeDataUri(result.qrCodeDataUri);
        const newLecture = { id: lectureId, description: lectureDescription };
        setCurrentLecture(newLecture);
        onQrCodeGenerated(newLecture);
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
        <CardTitle className="font-headline flex items-center gap-2">
          <QrCode className="text-primary" />
          Attendance QR Code
        </CardTitle>
        <CardDescription>Generate a unique QR code for the current lecture.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="lecture-description">Lecture Description</Label>
            <Textarea
              id="lecture-description"
              placeholder="e.g., Physics 101 - Introduction to Mechanics"
              value={lectureDescription}
              onChange={(e) => setLectureDescription(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Zap className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Generating...' : 'Generate Code'}
          </Button>
        </form>

        {error && (
            <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        
        {qrCodeDataUri && currentLecture && (
          <div className="mt-6 text-center">
            <h3 className="font-semibold mb-2">Scan for Attendance</h3>
            <div className="p-4 border rounded-lg inline-block bg-white">
              <Image src={qrCodeDataUri} alt="Generated QR Code" width={200} height={200} />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{currentLecture.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
