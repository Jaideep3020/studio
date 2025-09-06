import { Header } from '@/components/common/Header';
import { Attendance } from '@/components/student/Attendance';
import { StudentAssignments } from '@/components/student/StudentAssignments';
import { UpcomingClasses } from '@/components/student/UpcomingClasses';

export default function StudentDashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header role="Student" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2 grid auto-rows-max items-start gap-4 md:gap-8">
              <UpcomingClasses />
              <StudentAssignments />
            </div>
            <div className="lg:col-span-1 grid auto-rows-max items-start gap-4 md:gap-8">
              <Attendance />
            </div>
        </div>
      </main>
    </div>
  );
}
