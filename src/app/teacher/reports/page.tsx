
import { Header } from '@/components/common/Header';
import { TeacherNav } from '@/components/teacher/TeacherNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <TeacherNav />
      <div className="flex flex-col">
        <Header role="Teacher" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <BarChart className="text-primary h-5 w-5" />
                        Reports
                    </CardTitle>
                    <CardDescription>
                        Generate and view reports on student attendance and performance.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground py-12">
                        Reporting functionality will be implemented here.
                    </p>
                </CardContent>
            </Card>
        </main>
      </div>
    </div>
  );
}
