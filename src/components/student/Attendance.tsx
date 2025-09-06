"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, QrCode } from 'lucide-react';

export function Attendance() {
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  const handleMarkAttendance = () => {
    setAttendanceMarked(true);
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
            <div className="p-4 border-2 border-dashed rounded-lg">
                <QrCode className="h-24 w-24 text-muted-foreground" />
            </div>
            <Button onClick={handleMarkAttendance} className="w-full">
              Simulate Scan
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
