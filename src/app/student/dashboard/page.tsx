
import { Header } from '@/components/common/Header';
import { StudentAssignments } from '@/components/student/StudentAssignments';
import { UpcomingClasses } from '@/components/student/UpcomingClasses';
import { StudentGoals } from '@/components/student/StudentGoals';
import { StudentQuizzes } from '@/components/student/StudentQuizzes';
import { RevisionTopics } from '@/components/student/RevisionTopics';
import { Attendance } from '@/components/student/Attendance';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarCheck, ArrowRight } from 'lucide-react';


export default function StudentDashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header role="Student" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2 grid auto-rows-max items-start gap-4 md:gap-8">
              <StudentGoals />
              <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <CalendarCheck className="h-5 w-5 text-primary"/>
                        My Planner
                    </CardTitle>
                    <CardDescription>
                        Use our new AI-powered planner to organize your study schedule.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/student/my-planner">
                        <Button>
                            Go to Planner
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </CardContent>
              </Card>
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
