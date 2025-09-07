
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Edit, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

export function StudentGoals() {
  const [user, setUser] = useState<User | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setIsLoading(false);
        setGoal(null);
      }
    });
    return () => unsubscribeAuth();
  }, []);
  
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setGoal(doc.data().goal || 'No goal set yet.');
        } else {
          setGoal('No goal set yet.');
        }
        setIsLoading(false);
      });
      return () => unsubscribeFirestore();
    }
  }, [user]);

  return (
    <Card className="bg-secondary border-0">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
            <CardTitle className="font-headline">My Academic Goal</CardTitle>
            <CardDescription>Your primary focus for this academic period.</CardDescription>
        </div>
         <Button asChild variant="ghost" size="icon">
            <Link href="/student/profile">
                <Edit className="h-4 w-4" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50 min-h-[68px]">
            {isLoading ? (
               <div className="flex items-center gap-2 text-muted-foreground">
                 <LoaderCircle className="h-5 w-5 animate-spin"/>
                 <span>Loading goal...</span>
               </div>
            ) : (
                <>
                    <Target className="h-8 w-8 text-primary" />
                    <p className="text-lg font-semibold">{goal}</p>
                </>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
