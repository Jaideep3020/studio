
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { Student } from "@/lib/types";

interface AttendanceListProps {
  students: Student[];
}

export function AttendanceList({ students }: AttendanceListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Users className="text-primary" />
            Live Attendance
        </CardTitle>
        <CardDescription>
            {students.length} student{students.length !== 1 ? 's' : ''} marked as present.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {students.length > 0 ? (
            <ul className="space-y-3">
            {students.map((student) => (
                <li key={student.id} className="flex items-center gap-3">
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
      </CardContent>
    </Card>
  );
}
