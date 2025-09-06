
'use client';

import Link from 'next/link';
import { BarChart, CheckSquare, Users, Menu, Package2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/teacher/dashboard', icon: Users, label: 'My Classes' },
  { href: '/teacher/attendance', icon: CheckSquare, label: 'Attendance Records' },
  { href: '/teacher/reports', icon: BarChart, label: 'Reports' },
];

export function TeacherNav() {
  const pathname = usePathname();

  const renderNavLinks = (isMobile = false) => (
    <nav className={cn('grid items-start text-sm font-medium', isMobile ? 'gap-4 px-2' : 'gap-2')}>
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            pathname === item.href && 'bg-muted text-primary'
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <div className="hidden border-r bg-background md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6 text-primary" />
              <span className="">ClassZen Teacher</span>
            </Link>
          </div>
          <div className="flex-1 py-4">
            {renderNavLinks()}
          </div>
        </div>
      </div>
      <div className="md:hidden sticky top-0 z-40">
        <Sheet>
          <SheetTrigger asChild>
            <div className="flex items-center p-4 bg-background border-b">
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
               <div className="flex-1 text-center">
                 <h1 className="font-semibold text-lg">Dashboard</h1>
               </div>
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <div className="flex h-[60px] items-center border-b px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Package2 className="h-6 w-6 text-primary" />
                <span>ClassZen</span>
              </Link>
            </div>
            <div className="py-4">
              {renderNavLinks(true)}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
