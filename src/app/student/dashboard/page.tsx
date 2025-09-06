
import { Header } from '@/components/common/Header';
import { StudentAssignments } from '@/components/student/StudentAssignments';
import { UpcomingClasses } from '@/components/student/UpcomingClasses';
import { StudentGoals } from '@/components/student/StudentGoals';
import { StudentQuizzes } from '@/components/student/StudentQuizzes';
import { RevisionTopics } from '@/components/student/RevisionTopics';
import { Attendance } from '@/components/student/Attendance';


export default function StudentDashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header role="Student" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2 grid auto-rows-max items-start gap-4 md:gap-8">
              <StudentGoals />
              <UpcomingClasses />
              <StudentQuizzes />
              <StudentAssignments />
            </div>
            <div className="lg:col-span-1 grid auto-rows-max items-start gap-4 md:gap-8">
              <Attendance />
              <RevisionTopics />
            </div>
        </div>
      </main>
    </div>
  );
}
