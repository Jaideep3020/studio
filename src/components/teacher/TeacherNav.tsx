
'use client';

import Link from 'next/link';
import { BarChart, CheckSquare, LayoutDashboard, QrCode, Users, GraduationCap } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

const navItems = [
  { href: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/teacher/qr-code', icon: QrCode, label: 'Generate QR Code' },
  { href: '/teacher/my-classes', icon: Users, label: 'My Classes' },
  { href: '/teacher/attendance', icon: CheckSquare, label: 'Attendance Records' },
  { href: '/teacher/reports', icon: BarChart, label: 'Reports' },
];

function NavLinks() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || (href === '/teacher/dashboard' && (pathname.startsWith('/teacher/qr-code') || pathname.startsWith('/teacher/my-classes')));

  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            isActive(item.href) && 'bg-primary text-primary-foreground hover:text-primary-foreground'
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
            <span className="text-lg">EduTrack</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start gap-2 px-2 text-sm font-medium lg:px-4">
            <div className="p-2">
                <Badge className="w-full justify-start gap-2 bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20">
                    <Users className="h-4 w-4" />
                    Teacher Dashboard
                </Badge>
            </div>
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
