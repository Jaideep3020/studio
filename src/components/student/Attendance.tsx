"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export function Attendance() {
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);

  const handleMarkAttendance = () => {
    setAttendanceMarked(true);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="font-headline">Mark Attendance</CardTitle>
        <CardDescription>Scan the QR code displayed by your teacher.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        {attendanceMarked ? (
          <div className="flex flex-col items-center justify-center gap-4 p-8 bg-success/10 rounded-lg w-full">
            <CheckCircle className="h-16 w-16 text-success" />
            <p className="text-lg font-semibold text-success">Attendance Marked!</p>
            <p className="text-sm text-muted-foreground">You're all set for Physics 101.</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-2 border-dashed rounded-lg w-full">
              <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
            </div>
            {hasCameraPermission === false && (
                <Alert variant="destructive">
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access to use this feature.
                  </AlertDescription>
                </Alert>
            )}
            <Button onClick={handleMarkAttendance} className="w-full" disabled={!hasCameraPermission}>
              <Camera className="mr-2 h-4 w-4" />
              Scan QR Code
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
