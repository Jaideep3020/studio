'use client';

import { Header } from '@/components/common/Header';
import { Attendance } from '@/components/student/Attendance';
import { StudentAssignments } from '@/components/student/StudentAssignments';
import { StudentGoals } from '@/components/student/StudentGoals';
import { StudentQuizzes } from '@/components/student/StudentQuizzes';
import { UpcomingClasses } from '@/components/student/UpcomingClasses';

export default function StudentDashboard() {
  return (
    <>
      <Header role="Student" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
        <div className="grid gap-4 md:gap-8">
            <StudentGoals />
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
          <Attendance />
          <UpcomingClasses />
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8">
          <StudentQuizzes />
          <StudentAssignments />
        </div>
      </main>
    </>
  );
}
