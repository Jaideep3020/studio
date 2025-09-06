
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, LoaderCircle } from 'lucide-react';
import { EmailAuthForm } from '@/components/common/EmailAuthForm';

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setError(null);

      if (currentUser) {
        setUser(currentUser);
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const userRole = userData.role;

            if (userRole === 'teacher') {
              router.push('/teacher/dashboard');
            } else if (userRole === 'student') {
              router.push('/student/dashboard');
            } else {
              setError('Your role is not configured. Please contact support.');
              try {
                  await signOut(auth);
              } catch (e) {
                  console.error("Sign out failed", e);
              }
              setUser(null);
            }
          } else {
            // This case can happen if a user is created in Auth but their Firestore doc fails
            setError('User data not found. Please sign up again or contact support.');
            try {
                await signOut(auth);
            } catch (e) {
                console.error("Sign out failed", e);
            }
            setUser(null);
          }
        } catch (dbError) {
          console.error('Error fetching user role from Firestore:', dbError);
          setError('Could not verify your role. Please try again later.');
          try {
            await signOut(auth);
          } catch(e) {
            console.error("Sign out failed", e)
          }
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading || user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground">
        <div className="flex items-center gap-2 text-muted-foreground">
          <LoaderCircle className="w-6 h-6 animate-spin" />
          <p className="text-lg">{user ? 'Redirecting to your dashboard...' : 'Loading...'}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-background text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-headline">ClassZen</CardTitle>
          <CardDescription>
            Sign in or create an account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <EmailAuthForm />
        </CardContent>
      </Card>
    </main>
  );
}
