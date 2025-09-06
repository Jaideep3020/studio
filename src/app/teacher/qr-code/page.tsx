
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/common/Header';
import { QrCodeGenerator } from '@/components/teacher/QrCodeGenerator';
import { TeacherNav } from '@/components/teacher/TeacherNav';
import { AttendanceDashboard } from '@/components/teacher/AttendanceDashboard';
import type { Lecture, Student } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Mock total students for the selected class
const MOCK_TOTAL_STUDENTS = 25;

export default function QrCodePage() {
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const [qrCodeDataUri, setQrCodeDataUri] = useState<string | null>(null);
  const [attendedStudents, setAttendedStudents] = useState<Student[]>([]);
  const { toast } = useToast();

  const handleQrCodeGenerated = (lecture: Lecture, dataUri: string) => {
    setActiveLecture(lecture);
    setQrCodeDataUri(dataUri);
    setAttendedStudents([]); // Reset attendance when a new QR is generated
  };
  
  useEffect(() => {
    // This function will be called by the student's portal
    (window as any).markStudentAttendance = (student: Student, lectureId: string): boolean => {
      if (activeLecture && lectureId === activeLecture.id) {
        // Prevent duplicate entries
        if (attendedStudents.some(s => s.id === student.id)) {
            return true; // Already marked, count as success
        }
        
        setAttendedStudents((prev) => [...prev, student]);
        toast({
          title: 'Student Checked In!',
          description: `${student.name} has been marked as present.`,
          className: 'bg-success text-success-foreground',
        });
        return true;
      }
      return false; // QR code does not match active lecture
    };

    // Cleanup function
    return () => {
      delete (window as any).markStudentAttendance;
    };
  }, [activeLecture, attendedStudents, toast]);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <TeacherNav />
      <div className="flex flex-col">
        <Header role="Teacher" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8">
            <QrCodeGenerator onQrCodeGenerated={handleQrCodeGenerated} activeLecture={activeLecture} />
            <AttendanceDashboard 
              attendedStudents={attendedStudents}
              totalStudents={MOCK_TOTAL_STUDENTS}
              qrCodeDataUri={qrCodeDataUri}
              activeLectureDescription={activeLecture?.description}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
