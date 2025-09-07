
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/common/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, ArrowLeft, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function StudentProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user data from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setGoal(userData.goal || '');
        }
      } else {
        // Handle user not logged in case
        setUser(null);
      }
      setIsPageLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to save a goal.' });
      return;
    }

    setIsLoading(true);

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { goal });
      
      setIsLoading(false);
      toast({
        title: 'Goal Saved!',
        description: 'Your academic goal has been updated successfully.',
        className: 'bg-success text-success-foreground',
      });
    } catch (error) {
        console.error("Error saving goal: ", error);
        setIsLoading(false);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not save your goal. Please try again.' });
    }
  };
  
  if (isPageLoading) {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header role="Student" />
            <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
                <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Loading profile...</p>
            </main>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header role="Student" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mb-4">
          <Button asChild variant="outline">
            <Link href="/student/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">My Profile</CardTitle>
            <CardDescription>
              Personalize your account and set your academic goals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGoalSave} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={user?.displayName || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={user?.email || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">My Academic Goal</Label>
                <Input
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., Prepare for GATE 2026, Master Calculus"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Goal'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
