import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { LifeBuoy, LogOut, Settings, GraduationCap, Menu, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { MobileNav } from '../teacher/TeacherNav';
import { Badge } from '../ui/badge';


interface HeaderProps {
  role: 'Teacher' | 'Student';
}

export function Header({ role }: HeaderProps) {
  const userInitial = role.charAt(0);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6">
       <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-transparent border-0 hover:bg-accent">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 bg-card border-r-0">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-lg">EduTrack</span>
            </Link>
          </div>
          <MobileNav />
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1 flex justify-end">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{role}</Badge>
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold">System Administrator</p>
              <p className="text-xs text-muted-foreground">{role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
