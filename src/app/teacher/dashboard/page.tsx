import { Header } from '@/components/common/Header';
import { Assignments } from '@/components/teacher/Assignments';
import { QrCodeGenerator } from '@/components/teacher/QrCodeGenerator';
import { Schedule } from '@/components/teacher/Schedule';

export default function TeacherDashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header role="Teacher" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 grid auto-rows-max items-start gap-4 md:gap-8">
            <Schedule />
            <Assignments />
          </div>
          <div className="lg:col-span-1 grid auto-rows-max items-start gap-4 md:gap-8">
            <QrCodeGenerator />
          </div>
        </div>
      </main>
    </div>
  );
}
