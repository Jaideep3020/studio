
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { GraduationCap, LogIn, LoaderCircle } from 'lucide-react';

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
          <div className="flex items-center gap-2 text-muted-foreground">
              <LoaderCircle className="w-6 h-6 animate-spin" />
              <p className="text-lg">Redirecting you to the login page...</p>
          </div>
        </main>
    </div>
  );
}
