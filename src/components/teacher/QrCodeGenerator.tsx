
"use client";

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { QrCode, LoaderCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Lecture } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const REGENERATION_INTERVAL_MS = 10000;

interface QrCodeGeneratorProps {
    onSessionStart: (lecture: Lecture, qrCodeDataUri: string) => void;
    activeLectureId: string | null;
}

const availableClasses = [
    'Physics 101 - Introduction to Mechanics',
    'Mathematics 202 - Advanced Calculus',
    'History 301 - The World Wars',
    'English Literature 101 - Shakespeare',
]

export function QrCodeGenerator({ onSessionStart, activeLectureId }: QrCodeGeneratorProps) {
  const [lectureDescription, setLectureDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const regenerationInterval = useRef<NodeJS.Timeout | null>(null);
  const activeLectureRef = useRef<{ id: string; description: string } | null>(null);


  const stopRegeneration = () => {
    if (regenerationInterval.current) {
      clearInterval(regenerationInterval.current);
      regenerationInterval.current = null;
    }
  };

  const generateAndDisplayQrCode = async () => {
    const currentLecture = activeLectureRef.current;
    if (!currentLecture) return;

    try {
      const timestamp = Date.now();
      const lecturePayload = { id: currentLecture.id, description: currentLecture.description, timestamp };
      
      const qrCodeDataUri = await QRCode.toDataURL(JSON.stringify(lecturePayload));
      
      onSessionStart(currentLecture, qrCodeDataUri);

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate QR code: ${errorMessage}`);
      stopRegeneration();
      console.error(e);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!lectureDescription) {
        setError('Please select a class to generate a QR code.');
        return;
    }
    
    setIsLoading(true);
    setError(null);
    stopRegeneration(); // Stop any previous timers

    try {
      const initialTimestamp = Date.now();
      const lectureId = `lecture_${initialTimestamp}`;
      const newLecture = { id: lectureId, description: lectureDescription };
      activeLectureRef.current = newLecture;


      // Create a document in Firestore for this attendance session
      await setDoc(doc(db, 'attendance', lectureId), {
        lectureId: lectureId,
        description: lectureDescription,
        createdAt: new Date(initialTimestamp),
        presentStudents: [],
      });
      
      await generateAndDisplayQrCode();
      
      // Start the regeneration interval
      regenerationInterval.current = setInterval(() => {
        generateAndDisplayQrCode();
      }, REGENERATION_INTERVAL_MS);

    } catch (e) {
      setError('An error occurred while starting the session. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      stopRegeneration();
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate QR Code</CardTitle>
        <CardDescription>Select a class to start a new attendance session.</CardDescription>
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
            {isLoading ? 'Generating...' : 'Start Session & Generate QR'}
          </Button>
        </form>

        {activeLectureId && (
            <Alert variant="default" className="mt-4 bg-success/10 border-success/30">
                <CheckCircle className="h-4 w-4 text-success" />
                <AlertTitle className="text-success">Session Active</AlertTitle>
                <AlertDescription>
                   An attendance session for "{lectureDescription}" is currently active. The QR code will refresh automatically.
                </AlertDescription>
            </Alert>
        )}

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
