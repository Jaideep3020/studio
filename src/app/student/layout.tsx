import { StudentNav } from '@/components/student/StudentNav';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <StudentNav />
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
}
