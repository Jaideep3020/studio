
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TeacherNav } from '@/components/teacher/TeacherNav';
import { GraduationCap, Users, BarChart3, Presentation, UserPlus, CalendarPlus, FileDown, PlusCircle, CalendarCheck2, AlertCircle } from 'lucide-react';

const kpiData = [
    { title: 'Total Students', value: '0', icon: <GraduationCap />, color: 'text-sky-500' },
    { title: 'Active Teachers', value: '0', icon: <Users />, color: 'text-yellow-500' },
    { title: 'Avg. Attendance', value: '83%', icon: <BarChart3 />, color: 'text-green-500' },
    { title: 'Active Classes', value: '1', icon: <Presentation />, color: 'text-purple-500' },
];

const recentActivity = [
    { title: 'New student registered', subtitle: 'Alice Johnson - 2 hours ago', icon: <PlusCircle className="text-green-500" />, bgColor: 'bg-green-500/10' },
    { title: 'Timetable updated', subtitle: 'Computer Science Dept - 5 hours ago', icon: <CalendarCheck2 className="text-yellow-500" />, bgColor: 'bg-yellow-500/10' },
    { title: 'Low attendance alert', subtitle: 'Chemistry Department - 1 day ago', icon: <AlertCircle className="text-red-500" />, bgColor: 'bg-red-500/10' },
]

export default function TeacherDashboard() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-muted/40">
      <TeacherNav />
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Card className="bg-card border-none shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-3xl font-bold">Admin Dashboard</CardTitle>
                            <CardDescription>Comprehensive management of users, attendance, and institutional data.</CardDescription>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-bold text-red-500">0</p>
                            <p className="text-sm text-muted-foreground">Total Students</p>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                {kpiData.map((kpi) => (
                    <Card key={kpi.title} className="bg-card border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <div className={kpi.color}>{kpi.icon}</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Card className="xl:col-span-1 bg-card border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Button className="w-full justify-start gap-3 p-6 text-base bg-muted hover:bg-muted/80">
                            <UserPlus className="h-5 w-5" /> Add New User
                        </Button>
                        <Button className="w-full justify-start gap-3 p-6 text-base bg-muted hover:bg-muted/80">
                            <CalendarPlus className="h-5 w-5" /> Create Timetable
                        </Button>
                        <Button className="w-full justify-start gap-3 p-6 text-base bg-muted hover:bg-muted/80">
                            <FileDown className="h-5 w-5" /> Export Reports
                        </Button>
                    </CardContent>
                </Card>

                <Card className="xl:col-span-2 bg-card border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {recentActivity.map((activity) => (
                                <li key={activity.title} className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full ${activity.bgColor}`}>
                                        {activity.icon}
                                    </div>
                                    <div>
                                        <p className="font-medium">{activity.title}</p>
                                        <p className="text-sm text-muted-foreground">{activity.subtitle}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </main>
      </div>
    </div>
  );
}
