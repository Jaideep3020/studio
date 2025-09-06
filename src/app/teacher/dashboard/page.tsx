
'use client';

import { useState } from 'react';
import { Header } from '@/components/common/Header';
import { Assignments } from '@/components/teacher/Assignments';
import { QrCodeGenerator } from '@/components/teacher/QrCodeGenerator';
import { Schedule } from '@/components/teacher/Schedule';
import { AttendanceDashboard } from '@/components/teacher/AttendanceDashboard';
import { Lecture, Student } from '@/lib/types';
import { TeacherNav } from '@/components/teacher/TeacherNav';

const TOTAL_STUDENTS = 25; // Mock total students for the class

export default function TeacherDashboard() {
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const [attendedStudents, setAttendedStudents] = useState<Student[]>([]);

  const handleQrCodeGenerated = (lecture: Lecture) => {
    setActiveLecture(lecture);
    setAttendedStudents([]); // Reset for new lecture
  };

  const handleStudentAttended = (student: Student) => {
    // Prevent duplicate entries
    if (!attendedStudents.some((s) => s.id === student.id)) {
      setAttendedStudents((prev) => [...prev, student]);
    }
  };

  // This function would be passed to the student component in a real app
  // For this simulation, we'll call it from the student page via window object
  if (typeof window !== 'undefined') {
    (window as any).markStudentAttendance = (student: Student, lectureId: string) => {
      if (activeLecture?.id === lectureId) {
        handleStudentAttended(student);
        return true;
      }
      return false;
    };
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <TeacherNav />
      <div className="flex flex-col">
        <Header role="Teacher" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 grid auto-rows-max items-start gap-4 md:gap-8">
              <Schedule />
              <Assignments />
            </div>
            <div className="lg:col-span-1 grid auto-rows-max items-start gap-4 md:gap-8">
              <QrCodeGenerator onQrCodeGenerated={handleQrCodeGenerated} />
              {activeLecture && (
                  <AttendanceDashboard attendedStudents={attendedStudents} totalStudents={TOTAL_STUDENTS} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
