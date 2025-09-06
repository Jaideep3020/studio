'use client';

import { Header } from '@/components/common/Header';
import { WelcomeBanner } from '@/components/student/WelcomeBanner';
import { AttendanceRateCard } from '@/components/student/cards/AttendanceRateCard';
import { AssignmentsCard } from '@/components/student/cards/AssignmentsCard';
import { ThisWeekCard } from '@/components/student/cards/ThisWeekCard';
import { NextClassCard } from '@/components/student/cards/NextClassCard';

export default function StudentDashboard() {
  return (
    <>
      <Header role="Student" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/40">
        <WelcomeBanner name="John Doe" />
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <AttendanceRateCard attendedClasses={38} totalClasses={45} />
          <AssignmentsCard pendingCount={2} />
          <ThisWeekCard daysAttended={4} totalDays={5} />
          <NextClassCard time="2:30 PM" subject="Mathematics" location="Room 101" />
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2 grid auto-rows-max items-start gap-4 md:gap-8">
            {/* Add other dashboard components here like in the old design if needed */}
          </div>
          <div className="grid auto-rows-max items-start gap-4 md:gap-8">
             {/* Add other dashboard components here */}
          </div>
        </div>
      </main>
    </>
  );
}
