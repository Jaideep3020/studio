
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle, AlertTriangle, Camera, RefreshCw, XCircle, QrCode, LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import jsQR from 'jsqr';
import { Student, LecturePayload } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { markAttendance } from '@/ai/flows/mark-attendance';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

type ScanResult = 'success' | 'failure' | 'scanning' | 'idle' | 'no-user';

export function Attendance() {
  const [scanResult, setScanResult] = useState<ScanResult>('idle');
  const [scannedData, setScannedData] = useState<LecturePayload | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setScanResult('no-user');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const stopCamera = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = undefined;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);
  
  const handleScanFailure = useCallback((message: string) => {
    stopCamera();
    setScanResult('failure');
    toast({
      variant: 'destructive',
      title: 'Attendance Failed',
      description: message,
    });
  }, [stopCamera, toast]);

  const handleScanSuccess = useCallback(async (data: LecturePayload) => {
    if (!currentUser || !currentUser.displayName) {
      handleScanFailure('Could not verify your identity. Please log in again.');
      return;
    }
    stopCamera();
    setScannedData(data);
    
    try {
      const studentForDb: Student = { id: currentUser.uid, name: currentUser.displayName, email: currentUser.email || '' };
      const result = await markAttendance({ lectureId: data.id, student: studentForDb });
      
      if (result.success) {
        setScanResult('success');
        toast({
          variant: 'default',
          className: 'bg-success text-success-foreground',
          title: 'Attendance Marked!',
          description: `You are checked in for ${data.description}.`,
        });
      } else {
        handleScanFailure(result.message || 'The QR code is not for the currently active lecture.');
      }
    } catch (error) {
      console.error('Error calling markAttendance flow:', error);
      handleScanFailure('An error occurred while communicating with the server.');
    }
  }, [stopCamera, toast, handleScanFailure, currentUser]);

  const handleTryAgain = () => {
    setScanResult('idle');
    setScannedData(null);
    setHasCameraPermission(null);
  };
  
  const handleCancelScan = () => {
    stopCamera();
    setScanResult('idle');
  }

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
                if (animationFrameId.current) {
                    cancelAnimationFrame(animationFrameId.current);
                    animationFrameId.current = undefined;
                }
                
                try {
                  const parsedData = JSON.parse(code.data);
                  const isDataValid = typeof parsedData === 'object' && parsedData !== null && 
                                      'id' in parsedData && 'description' in parsedData && 'timestamp' in parsedData &&
                                      typeof parsedData.id === 'string' && parsedData.id.startsWith('lecture_');
                  
                  if (isDataValid) {
                    handleScanSuccess(parsedData as LecturePayload);
                  } else {
                    handleScanFailure('This QR code is not a valid attendance code.');
                  }
                } catch (e) {
                  handleScanFailure('The scanned QR code has an invalid format.');
                }
                return;
              }
            }
        }
        if (animationFrameId.current !== undefined) {
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
            if (error.name !== 'AbortError') console.error('Video play failed:', error);
          });
          animationFrameId.current = requestAnimationFrame(tick);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        setScanResult('failure');
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
  }, [scanResult, stopCamera, toast, handleScanSuccess, handleScanFailure]);

  if (authLoading) {
     return (
        <Card className="text-center bg-secondary border-0">
          <CardHeader>
            <CardTitle className="font-headline">Mark Attendance</CardTitle>
            <CardDescription>Scan the QR code displayed by your teacher.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4 p-8">
            <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Verifying your session...</p>
          </CardContent>
        </Card>
      );
  }

  return (
    <Card className="text-center bg-secondary border-0">
      <CardHeader>
        <CardTitle className="font-headline">Mark Attendance</CardTitle>
        <CardDescription>Scan the QR code displayed by your teacher.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        {scanResult === 'idle' && (
            <div className="flex flex-col items-center justify-center gap-4 p-8 w-full">
                <Camera className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">Click the button to start scanning.</p>
                <Button onClick={() => { setHasCameraPermission(null); setScanResult('scanning'); }}>
                    <QrCode className="mr-2 h-4 w-4" />
                    Scan Attendance QR
                </Button>
            </div>
        )}
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
                <p className="text-lg font-semibold text-destructive">Scan Failed</p>
                <p className="text-sm text-muted-foreground max-w-xs">
                    Could not mark attendance. Please ensure the QR is valid and try again.
                </p>
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
                <QrCode className="mr-2 h-4 w-4 animate-pulse" />
                <span>Scanning for QR Code...</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleCancelScan}>
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
