import { ClassProvider } from '@/context/ClassContext';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClassProvider>{children}</ClassProvider>;
}
