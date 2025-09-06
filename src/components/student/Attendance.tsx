"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import jsQR from 'jsqr';

export function Attendance() {
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const animationFrameId = useRef<number>();

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  };

  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          setAttendanceMarked(true);
          setScannedData(code.data);
          stopCamera();
          return;
        }
      }
    }
    animationFrameId.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener('loadeddata', () => {
            animationFrameId.current = requestAnimationFrame(tick);
          });
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

    if (!attendanceMarked) {
      getCameraPermission();
    }

    return () => {
      stopCamera();
    };
  }, [toast, attendanceMarked]);


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
            <p className="text-sm text-muted-foreground">You're all set for {scannedData || 'your class'}.</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-2 border-dashed rounded-lg w-full relative">
              <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
              <canvas ref={canvasRef} className="hidden" />
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-2/3 h-2/3 border-4 border-primary/50 rounded-lg shadow-lg" />
              </div>
            </div>
            {hasCameraPermission === false && (
                <Alert variant="destructive">
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access to use this feature.
                  </AlertDescription>
                </Alert>
            )}
            <Button className="w-full" disabled={!hasCameraPermission}>
              <Camera className="mr-2 h-4 w-4" />
              Scanning for QR Code...
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
