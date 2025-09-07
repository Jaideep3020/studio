
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/common/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckSquare, ArrowLeft, LoaderCircle, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import type { Student } from '@/lib/types';

// Mock student data, assuming this is the logged-in student.
// In a real app, you would get this from your authentication context.
const MOCK_STUDENT: Student = { id: 'student_123', name: 'Alex Doe', email: 'alex.doe@example.com' };

interface AttendanceRecord {
  id: string;
  description: string;
  createdAt: Date;
}

export default function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    // This query looks for all attendance documents where the student's ID
    // is present in the 'presentStudents' array.
    const q = query(
      collection(db, 'attendance'),
      where('presentStudents', 'array-contains', { id: MOCK_STUDENT.id, name: MOCK_STUDENT.name })
    );

    // onSnapshot listens for real-time updates.
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const records: AttendanceRecord[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        records.push({
          id: doc.id,
          description: data.description,
          // Convert Firestore Timestamp to JavaScript Date
          createdAt: data.createdAt.toDate(),
        });
      });
      
      // Sort the records by date on the client-side to avoid the composite index requirement.
      records.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      setAttendanceRecords(records);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching attendance records: ", error);
      setIsLoading(false);
      // Optionally, show a toast message on error
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header role="Student" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
          <div className="mb-4">
            <Button asChild variant="outline">
                <Link href="/student/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
                </Link>
            </Button>
          </div>
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                      <CheckSquare className="text-primary h-5 w-5" />
                      Attendance Records
                  </CardTitle>
                  <CardDescription>
                      View your historical attendance data for all your classes.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  {isLoading ? (
                      <div className="flex items-center justify-center gap-2 text-muted-foreground py-12">
                          <LoaderCircle className="w-6 h-6 animate-spin" />
                          <p className="text-lg">Loading your records...</p>
                      </div>
                  ) : attendanceRecords.length === 0 ? (
                      <p className="text-center text-muted-foreground py-12">
                          You have no attendance records yet.
                      </p>
                  ) : (
                      <ul className="space-y-3">
                          {attendanceRecords.map((record) => (
                              <li key={record.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                                  <div>
                                      <p className="font-semibold">{record.description}</p>
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                      <CalendarDays className="mr-2 h-4 w-4" />
                                      {record.createdAt.toLocaleDateString()}
                                  </div>
                              </li>
                          ))}
                      </ul>
                  )}
              </CardContent>
          </Card>
      </main>
    </div>
  );
}
