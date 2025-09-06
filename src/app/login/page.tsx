
'use client';

import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  AuthError,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LogOut, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

function isAuthError(error: unknown): error is AuthError {
    return typeof error === 'object' && error !== null && 'code' in error;
}

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setError(null); // Clear previous errors
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google', error);
      
      let title = 'Login Failed';
      let description = 'An unknown error occurred. Please try again.';

      if (isAuthError(error)) {
        switch (error.code) {
          case 'auth/popup-closed-by-user':
            title = 'Login Canceled';
            description = 'You closed the sign-in window before completing the process.';
            break;
          case 'auth/network-request-failed':
            title = 'Network Error';
            description = 'Could not connect to Google. Please check your internet connection.';
            break;
          case 'auth/operation-not-allowed':
          case 'auth/configuration-not-found':
            title = 'Configuration Required';
            description = 'Google Sign-In is not enabled for this app. Please enable it in the Firebase Authentication console under Sign-in method.';
            setError(description); // Set persistent error message
            break;
          default:
            description = `An error occurred: ${error.message}`;
            break;
        }
      }

      // We only show a toast for non-configuration errors now
      if (!error) {
        toast({
            variant: 'destructive',
            title: title,
            description: description,
        });
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
      toast({
        variant: 'destructive',
        title: 'Sign Out Failed',
        description: 'An unexpected error occurred while signing out.',
      });
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
            <div className="w-full flex flex-col items-center gap-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Action Required</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button onClick={handleSignIn}>
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 172.9 56.6l-67.1 66.8C293.7 99.6 273.1 86 248 86c-49.1 0-89.2 39.2-89.2 87.2 0 47.9 40.1 87.1 89.2 87.1 35.2 0 62.2-14.3 73.4-24.8l-52.2-35.8-5.3 1.8c-13.2 5.1-28.3 7.9-44.1 7.9-21.9 0-42.2-7.8-58.6-21.9l-6.5-5.5-59.5 46.2c35.4 31.8 81.1 50.4 130.9 50.4 57 0 102.9-18.2 133.5-45.7 30.6-27.5 47.5-67.8 47.5-109.2z"></path></svg>
                  Sign in with Google
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
