import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, User } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground">
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
