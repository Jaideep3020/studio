
'use client';

import Link from 'next/link';
import { LayoutDashboard, Users, BookText, BarChart, Settings, GraduationCap, QrCode, UserPlus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/teacher/my-classes', icon: Users, label: 'My Classes' },
  { href: '/teacher/enroll-student', icon: UserPlus, label: 'Enroll Student' },
  { href: '/teacher/attendance', icon: BookText, label: 'Attendance' },
  { href: '/teacher/reports', icon: BarChart, label: 'Reports' },
  { href: '/teacher/qr-code', icon: QrCode, label: 'QR Code' },
  { href: '#', icon: Settings, label: 'Settings' },
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
            'flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary',
            isActive(item.href) && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
          )}
        >
          <item.icon className="h-5 w-5" />
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
          <nav className="grid items-start gap-2 px-3 text-sm font-medium lg:px-4 py-4">
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
