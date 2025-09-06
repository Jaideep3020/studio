
import { Header } from '@/components/common/Header';
import { Assignments } from '@/components/teacher/Assignments';
import { Schedule } from '@/components/teacher/Schedule';
import { TeacherNav } from '@/components/teacher/TeacherNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, CalendarPlus, FileText, Activity } from 'lucide-react';
import Link from 'next/link';


export default function TeacherDashboard() {
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
                <div className="text-2xl font-bold">1,257</div>
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
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78/94</div>
                <p className="text-xs text-muted-foreground">Physics 101 pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">2 ongoing, 2 upcoming</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <div className="xl:col-span-2 grid auto-rows-max items-start gap-4 md:gap-8">
              <Schedule />
            </div>
            <div className="grid auto-rows-max items-start gap-4 md:gap-8">
              <Assignments />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
