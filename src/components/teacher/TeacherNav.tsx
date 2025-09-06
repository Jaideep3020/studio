
'use client';

import Link from 'next/link';
import { BarChart, BookOpen, CheckSquare, Home, LayoutDashboard, QrCode, Users, GraduationCap } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/teacher/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/teacher/my-classes', icon: BookOpen, label: 'My Classes' },
  { href: '/teacher/attendance', icon: CheckSquare, label: 'Attendance' },
  { href: '/teacher/reports', icon: BarChart, label: 'Reports' },
];

function NavLinks() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            isActive(item.href) && 'bg-primary/10 text-primary'
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </>
  );
}

export function TeacherNav() {
  return (
    <div className="hidden border-r bg-card md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-lg">ClassZen</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
            <NavLinks />
          </nav>
        </div>
      </div>
    </div>
  );
}

export function MobileNav() {
  return (
     <nav className="grid gap-2 text-lg font-medium p-4">
      <NavLinks />
    </nav>
  )
}
