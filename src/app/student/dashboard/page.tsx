'use client';

import { Header } from '@/components/common/Header';
import { Attendance } from '@/components/student/Attendance';
import { RevisionTopics } from '@/components/student/RevisionTopics';
import { StudentAssignments } from '@/components/student/StudentAssignments';
import { StudentGoals } from '@/components/student/StudentGoals';
import { StudentQuizzes } from '@/components/student/StudentQuizzes';
import { UpcomingClasses } from '@/components/student/UpcomingClasses';

export default function StudentDashboard() {
  return (
    <>
      <Header role="Student" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
          <Attendance />
          <UpcomingClasses />
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2 grid auto-rows-max items-start gap-4 md:gap-8">
            <StudentQuizzes />
            <StudentAssignments />
          </div>
          <div className="grid auto-rows-max items-start gap-4 md:gap-8">
            <RevisionTopics />
            <StudentGoals />
          </div>
        </div>
      </main>
    </>
  );
}
