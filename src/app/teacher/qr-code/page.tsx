
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
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const [qrCodeDataUri, setQrCodeDataUri] = useState<string | null>(null);
  const [attendedStudents, setAttendedStudents] = useState<Student[]>([]);
  const { classes } = useClasses();
  const [totalStudents, setTotalStudents] = useState(0);

  const handleQrCodeGenerated = (lecture: Lecture, dataUri: string) => {
    // Only set a new active lecture if the ID is different.
    if (activeLecture?.id !== lecture.id) {
        setActiveLecture(lecture);
        // Reset student list for new session
        setAttendedStudents([]);
        
        // Find the selected class to get total student count
        const selectedClass = classes.find(c => c.name === lecture.description.split(' - ')[0]);
        setTotalStudents(selectedClass ? selectedClass.students.length : 0);
    }
    setQrCodeDataUri(dataUri);
  };
  
  // Listen for real-time updates from Firestore
  useEffect(() => {
    if (!activeLecture) return;

    const unsub = onSnapshot(doc(db, "attendance", activeLecture.id), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        // Ensure presentStudents exists and is an array before setting
        const students = data.presentStudents || [];
        setAttendedStudents(students as Student[]);
      } else {
        console.log("No such document!");
      }
    });

    // Cleanup subscription on component unmount or when activeLecture changes
    return () => unsub();
  }, [activeLecture]);


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
              totalStudents={totalStudents}
              qrCodeDataUri={qrCodeDataUri}
              activeLectureDescription={activeLecture?.description}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
