
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/common/Header';
import { QrCodeGenerator } from '@/components/teacher/QrCodeGenerator';
import { TeacherNav } from '@/components/teacher/TeacherNav';
import { AttendanceDashboard } from '@/components/teacher/AttendanceDashboard';
import type { Lecture, Student } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useClasses } from '@/context/ClassContext';

export default function QrCodePage() {
  const [activeLectureId, setActiveLectureId] = useState<string | null>(null);
  const [activeLectureDescription, setActiveLectureDescription] = useState<string | null>(null);
  const [qrCodeDataUri, setQrCodeDataUri] = useState<string | null>(null);
  const [attendedStudents, setAttendedStudents] = useState<Student[]>([]);
  const { classes } = useClasses();
  const [totalStudents, setTotalStudents] = useState(0);

  const handleSessionStart = (lecture: Lecture, dataUri: string) => {
    // Only update state if it's a new session
    if (activeLectureId !== lecture.id) {
        setActiveLectureId(lecture.id);
        setActiveLectureDescription(lecture.description);
        setAttendedStudents([]); // Reset for a new session

        const selectedClass = classes.find(c => c.name === lecture.description.split(' - ')[0]);
        setTotalStudents(selectedClass ? selectedClass.students.length : 0);
    }
    setQrCodeDataUri(dataUri);
  };
  
  // Listen for real-time updates from Firestore whenever activeLectureId changes
  useEffect(() => {
    if (!activeLectureId) {
      setAttendedStudents([]);
      return;
    }

    const unsub = onSnapshot(doc(db, "attendance", activeLectureId), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const students = data.presentStudents || [];
        setAttendedStudents(students as Student[]);
      } else {
        console.log("No such document for lecture session!");
        setAttendedStudents([]);
      }
    }, (error) => {
      console.error("Error listening to attendance document:", error);
    });

    // Cleanup subscription on component unmount or when activeLectureId changes
    return () => unsub();
  }, [activeLectureId]);


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <TeacherNav />
      <div className="flex flex-col">
        <Header role="Teacher" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8">
            <QrCodeGenerator onSessionStart={handleSessionStart} activeLectureId={activeLectureId}/>
            <AttendanceDashboard 
              attendedStudents={attendedStudents}
              totalStudents={totalStudents}
              qrCodeDataUri={qrCodeDataUri}
              activeLectureDescription={activeLectureDescription}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
