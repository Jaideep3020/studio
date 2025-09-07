'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/common/Header';
import { Assignments } from '@/components/teacher/Assignments';
import { Schedule } from '@/components/teacher/Schedule';
import { TeacherNav } from '@/components/teacher/TeacherNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, CalendarPlus, FileText, Activity, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useClasses } from '@/context/ClassContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import type { Assignment, Submission } from '@/lib/types';


interface GradingStats {
  graded: number;
  total: number;
}

export default function TeacherDashboard() {
  const { classes, isLoading: isClassesLoading } = useClasses();
  const [gradingStats, setGradingStats] = useState<GradingStats>({ graded: 0, total: 0 });
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  
  const totalStudents = classes.reduce((sum, currentClass) => sum + currentClass.students.length, 0);

  useEffect(() => {
    if (isClassesLoading || classes.length === 0) {
      setIsStatsLoading(false);
      setGradingStats({ graded: 0, total: 0 });
      return;
    }

    setIsStatsLoading(true);
    const classIds = classes.map(c => c.id);
    const assignmentsQuery = query(collection(db, 'assignments'), where('classId', 'in', classIds));

    const unsubscribe = onSnapshot(assignmentsQuery, async (assignmentsSnapshot) => {
      const assignments = assignmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assignment));
      const totalAssignments = assignments.length;
      let gradedCount = 0;

      if (totalAssignments > 0) {
        const submissionsSnapshot = await getDocs(query(collection(db, 'submissions'), where('assignmentId', 'in', assignments.map(a => a.id))));
        const submissions = submissionsSnapshot.docs.map(doc => doc.data() as Submission);

        const submissionsByAssignment = submissions.reduce((acc, sub) => {
          (acc[sub.assignmentId] = acc[sub.assignmentId] || []).push(sub);
          return acc;
        }, {} as Record<string, Submission[]>);

        gradedCount = assignments.filter(assignment => {
            const classInfo = classes.find(c => c.id === assignment.classId);
            const totalStudentsInClass = classInfo?.students?.length ?? 0;
            const assignmentSubmissions = submissionsByAssignment[assignment.id] ?? [];
            return totalStudentsInClass > 0 && assignmentSubmissions.length === totalStudentsInClass && assignmentSubmissions.every(s => s.status === 'Graded');
        }).length;
      }
      
      setGradingStats({ graded: gradedCount, total: totalAssignments });
      setIsStatsLoading(false);
    });

    return () => unsubscribe();
  }, [classes, isClassesLoading]);


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <TeacherNav />
      <div className="flex flex-col">
        <Header role="Teacher" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Button asChild variant="ghost" size="icon">
                  <Link href="/teacher/enroll-student">
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {isClassesLoading ? (
                  <LoaderCircle className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <div className="text-2xl font-bold">{totalStudents}</div>
                )}
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                 <Button asChild variant="ghost" size="icon">
                  <Link href="/teacher/attendance">
                    <CalendarPlus className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92.8%</div>
                <p className="text-xs text-muted-foreground">+1.2% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assignments Graded</CardTitle>
                 <Button asChild variant="ghost" size="icon">
                  <Link href="#assignments">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {isStatsLoading ? (
                  <LoaderCircle className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <div className="text-2xl font-bold">{gradingStats.graded}/{gradingStats.total}</div>
                )}
                <p className="text-xs text-muted-foreground">
                  {gradingStats.total - gradingStats.graded} assignments pending
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isClassesLoading ? (
                   <LoaderCircle className="h-6 w-6 animate-spin text-muted-foreground" />
                ): (
                  <div className="text-2xl font-bold">{classes.length}</div>
                )}
                <p className="text-xs text-muted-foreground">2 ongoing, 2 upcoming</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <div className="xl:col-span-2 grid auto-rows-max items-start gap-4 md:gap-8">
              <Schedule />
            </div>
            <div id="assignments" className="grid auto-rows-max items-start gap-4 md:gap-8">
              <Assignments />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
