
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, User, LogIn } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
       <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6">
         <div className="flex items-center gap-2 font-semibold text-foreground">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-lg">ClassZen</span>
            </div>
            <Button asChild>
                <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                </Link>
            </Button>
       </header>
        <main className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-4 mb-4">
            <GraduationCap className="w-16 h-16 text-primary" />
            <h1 className="text-6xl font-bold">ClassZen</h1>
            </div>
            <p className="text-muted-foreground text-xl">Next-Gen Student Management</p>
        </div>
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
            <RoleCard
            role="Teacher"
            description="Manage your classes, generate attendance codes, and create assignments."
            icon={<GraduationCap className="w-12 h-12 text-primary" />}
            href="/teacher/dashboard"
            />
            <RoleCard
            role="Student"
            description="View your schedule, submit assignments, and mark your attendance."
            icon={<User className="w-12 h-12 text-primary" />}
            href="/student/dashboard"
            />
        </div>
        </main>
    </div>
  );
}

interface RoleCardProps {
  role: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

function RoleCard({ role, description, icon, href }: RoleCardProps) {
  return (
    <Link href={href} className="group">
      <Card className="h-full flex flex-col items-center text-center p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary bg-card">
        <CardHeader>
          <div className="mx-auto bg-primary/10 rounded-full p-4 mb-4">
            {icon}
          </div>
          <CardTitle className="text-2xl font-headline">{role}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="mt-auto">
          <Button variant="ghost" className="text-primary group-hover:underline">
            Go to {role} Portal
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
