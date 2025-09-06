
"use client";

import { useState, useEffect, useRef } from 'react';
import { CheckCircle, AlertTriangle, Camera, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import jsQR from 'jsqr';
import { Student, LecturePayload } from '@/lib/types';
import { Button } from '@/components/ui/button';

// Mock student data for this simulation
const MOCK_STUDENT: Student = { id: 'student_123', name: 'Alex Doe' };

export function Attendance() {
  const [scanResult, setScanResult] = useState<'success' | 'failure' | 'scanning'>('scanning');
  const [scannedData, setScannedData] = useState<LecturePayload | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const { toast } = useToast();

  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = undefined;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  
  const handleScanFailure = () => {
    stopCamera();
    setScanResult('failure');
    toast({
      variant: 'destructive',
      title: 'Invalid QR Code',
      description: 'This QR code is not for an active lecture. Please try again.',
    });
  };

  const handleScanSuccess = (data: LecturePayload) => {
    stopCamera();
    setScannedData(data);
    
    if (typeof window !== 'undefined' && (window as any).markStudentAttendance) {
      const success = (window as any).markStudentAttendance(MOCK_STUDENT, data.id);
      if (success) {
        setScanResult('success');
        toast({
          variant: 'default',
          className: 'bg-success text-success-foreground',
          title: 'Attendance Marked!',
          description: `You are checked in for ${data.description}.`,
        });
      } else {
        handleScanFailure();
      }
    } else {
        setScanResult('failure');
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not connect to the attendance system. Are both portals open?',
        });
    }
  };

  const handleTryAgain = () => {
    setScanResult('scanning');
    setScannedData(null);
    setHasCameraPermission(null); // This will re-trigger the permission request and camera stream
  };


  useEffect(() => {
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
      
              if (code && code.data) {
                // We have a QR code, stop the scanning loop to process it.
                if (animationFrameId.current) {
                    cancelAnimationFrame(animationFrameId.current);
                    animationFrameId.current = undefined;
                }
                
                try {
                  // This is a simple check assuming the QR is just a string.
                  // For the app, we need to parse it as JSON.
                  const lecturePayloadString = code.data;
                  // Let's try parsing it as JSON for our app's lecture format
                  const parsedData = JSON.parse(lecturePayloadString);

                  if (typeof parsedData === 'object' && parsedData !== null && 'id' in parsedData && 'description' in parsedData && typeof parsedData.id === 'string' && parsedData.id.startsWith('lecture_')) {
                    handleScanSuccess(parsedData as LecturePayload);
                  } else {
                    // It's a valid QR code, but not for a lecture
                    handleScanFailure();
                  }

                } catch (e) {
                  // It's a valid QR code but not in JSON format, so it's invalid for us.
                  handleScanFailure();
                }
                return; // Stop the function after processing a valid QR code
              }
            }
        }
        // Only request next frame if we are still in scanning mode
        if (scanResult === 'scanning' && animationFrameId.current !== undefined) {
             animationFrameId.current = requestAnimationFrame(tick);
        }
    };

    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(error => {
            // Ignore interruption errors, as they are expected during navigation or re-renders.
            if (error.name !== 'AbortError') {
              console.error('Video play failed:', error);
            }
          });
          animationFrameId.current = requestAnimationFrame(tick);
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

    if (scanResult === 'scanning') {
      getCameraPermission();
    }

    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanResult]);


  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="font-headline">Mark Attendance</CardTitle>
        <CardDescription>Scan the QR code displayed by your teacher.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        {scanResult === 'success' && (
          <div className="flex flex-col items-center justify-center gap-4 p-8 bg-success/10 rounded-lg w-full">
            <CheckCircle className="h-16 w-16 text-success" />
            <p className="text-lg font-semibold text-success">Attendance Marked!</p>
            <p className="text-sm text-muted-foreground">You're all set for {scannedData?.description || 'your class'}.</p>
          </div>
        )}
        {scanResult === 'failure' && (
            <div className="flex flex-col items-center justify-center gap-4 p-8 bg-destructive/10 rounded-lg w-full">
                <AlertTriangle className="h-16 w-16 text-destructive" />
                <p className="text-lg font-semibold text-destructive">Attendance Failed</p>
                <p className="text-sm text-muted-foreground">The QR code is invalid or expired. Please try again.</p>
                 <Button onClick={handleTryAgain} variant="destructive">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
            </div>
        )}
        {scanResult === 'scanning' && (
          <>
            <div className="p-4 border-2 border-dashed rounded-lg w-full relative overflow-hidden">
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
             <div className="flex items-center text-muted-foreground">
                <Camera className="mr-2 h-4 w-4 animate-pulse" />
                <span>Scanning for QR Code...</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
