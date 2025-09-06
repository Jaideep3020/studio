
'use client';

import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';
import { FirebaseUI } from '@/components/common/FirebaseUI';
import { signOut } from 'firebase/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            {user ? 'Welcome back!' : 'Please sign in with Google to continue.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {user ? (
            <div className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{user.displayName}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex flex-col gap-2 mt-6">
                 <Button asChild>
                    <Link href="/">Go to Homepage</Link>
                 </Button>
                 <Button onClick={handleSignOut} variant="outline">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                 </Button>
              </div>
            </div>
          ) : (
            <FirebaseUI />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
