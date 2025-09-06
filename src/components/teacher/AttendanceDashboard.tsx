
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Users, QrCode } from "lucide-react";
import type { Student } from "@/lib/types";
import Image from "next/image";

interface AttendanceDashboardProps {
  attendedStudents: Student[];
  totalStudents: number;
  qrCodeDataUri: string | null;
  activeLectureDescription?: string;
}

export function AttendanceDashboard({
  attendedStudents,
  totalStudents,
  qrCodeDataUri,
  activeLectureDescription
}: AttendanceDashboardProps) {
  const attendancePercentage = totalStudents > 0 ? (attendedStudents.length / totalStudents) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Users className="text-primary h-5 w-5" />
          Live Attendance
        </CardTitle>
        <CardDescription>
          Real-time attendance tracking for the current lecture.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center p-4 border rounded-lg">
          {qrCodeDataUri ? (
            <div className="text-center">
              <div className="p-2 border rounded-lg inline-block bg-white">
                <Image src={qrCodeDataUri} alt="Generated QR Code" width={150} height={150} />
              </div>
              <p className="text-sm text-muted-foreground mt-2">{activeLectureDescription}</p>
            </div>
          ) : (
            <div className="w-40 h-40 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground p-4">
                <QrCode className="h-10 w-10 mx-auto mb-2" />
                <p className="text-sm">QR code will appear here once a session is started.</p>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-muted-foreground">
              {attendedStudents.length} of {totalStudents} students present
            </p>
            <p className="text-sm font-semibold text-primary">{attendancePercentage.toFixed(0)}%</p>
          </div>
          <Progress value={attendancePercentage} className="h-2" />
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-3">Present Students</h4>
          {attendedStudents.length > 0 ? (
            <ul className="space-y-3 h-48 overflow-y-auto pr-2">
              {attendedStudents.map((student) => (
                <li key={student.id} className="flex items-center gap-3 animate-in fade-in">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{student.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No students have checked in yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
