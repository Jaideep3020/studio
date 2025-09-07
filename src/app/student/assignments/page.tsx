
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/common/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, ArrowLeft, LoaderCircle, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, onSnapshot, getDocs, collectionGroup } from 'firebase/firestore';
import type { Assignment, Submission } from '@/lib/types';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Badge } from '@/components/ui/badge';
import { SubmitAssignmentDialog } from '@/components/student/SubmitAssignmentDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


interface EnrichedAssignment extends Assignment {
  submission?: Submission;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<EnrichedAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setIsLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    // First, find out which classes the student is in.
    // This is a simplified approach. A real app might have a 'classes' subcollection on the user doc.
    const findStudentClasses = async () => {
      setIsLoading(true);
      const classesCollectionRef = collection(db, 'classes');
      const q = query(classesCollectionRef, where('studentIds', 'array-contains', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const studentClassIds = querySnapshot.docs.map(doc => doc.id);
      
      if (studentClassIds.length === 0) {
        setIsLoading(false);
        return () => {};
      }

      // Now, listen for assignments in those classes.
      const assignmentsQuery = query(collection(db, 'assignments'), where('classId', 'in', studentClassIds));
      
      const unsubscribeAssignments = onSnapshot(assignmentsQuery, async (snapshot) => {
        const assignmentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assignment));
        
        // For each assignment, check for a submission from the current user
        const enrichedAssignments = await Promise.all(
          assignmentsData.map(async (assignment) => {
            const submissionsQuery = query(
              collection(db, 'submissions'),
              where('assignmentId', '==', assignment.id),
              where('studentId', '==', currentUser.uid)
            );
            const submissionSnapshot = await getDocs(submissionsQuery);
            const submission = submissionSnapshot.docs.length > 0
              ? { id: submissionSnapshot.docs[0].id, ...submissionSnapshot.docs[0].data() } as Submission
              : undefined;
              
            return { ...assignment, submission };
          })
        );

        setAssignments(enrichedAssignments);
        setIsLoading(false);
      }, (error) => {
        console.error("Error fetching assignments: ", error);
        setIsLoading(false);
      });
      
      return unsubscribeAssignments;
    };

    const promise = findStudentClasses();
    
    // Return a cleanup function
    return () => {
      promise.then(cleanup => {
        if (typeof cleanup === 'function') {
          cleanup();
        }
      });
    };
  }, [currentUser]);

  const getStatusBadge = (assignment: EnrichedAssignment) => {
    if (assignment.submission?.status === 'Graded') {
      return <Badge className="bg-success text-success-foreground">Graded: {assignment.submission.grade}</Badge>;
    }
    if (assignment.submission?.status === 'Submitted') {
      return <Badge className="bg-blue-500 text-white">Submitted</Badge>;
    }
    if (new Date(assignment.dueDate) < new Date()) {
       return <Badge variant="destructive">Overdue</Badge>
    }
    return <Badge variant="secondary">Pending</Badge>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header role="Student" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
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
                  <CardTitle className="font-headline flex items-center gap-2">
                      <BookOpen className="text-primary h-5 w-5" />
                      My Assignments
                  </CardTitle>
                  <CardDescription>
                      View and manage all your assignments.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground py-12">
                      <LoaderCircle className="w-6 h-6 animate-spin" />
                      <p className="text-lg">Loading assignments...</p>
                    </div>
                  ) : assignments.length === 0 ? (
                      <p className="text-center text-muted-foreground py-12">
                          You have no assignments at the moment.
                      </p>
                  ) : (
                    <ul className="space-y-4">
                        {assignments.map((assignment) => (
                          <li key={assignment.id} className="p-4 rounded-lg bg-secondary/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-semibold text-lg">{assignment.title}</p>
                                  {getStatusBadge(assignment)}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{assignment.className}</p>
                                <p className="mt-2 text-sm">{assignment.description}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                </p>
                            </div>
                            {!assignment.submission && (
                              <SubmitAssignmentDialog assignment={assignment} student={currentUser!}>
                                  <Button>
                                    <FileUp className="mr-2 h-4 w-4" />
                                    Submit Work
                                  </Button>
                              </SubmitAssignmentDialog>
                            )}
                          </li>
                        ))}
                    </ul>
                  )}
              </CardContent>
          </Card>
      </main>
    </div>
  );
}
