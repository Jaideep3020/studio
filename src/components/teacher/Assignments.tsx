
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookMarked, PlusCircle, LoaderCircle } from "lucide-react";
import { CreateAssignmentDialog } from "./CreateAssignmentDialog";
import { useClasses } from "@/context/ClassContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, getDocs, Timestamp } from "firebase/firestore";
import type { Assignment, Submission } from "@/lib/types";

interface EnrichedAssignment extends Assignment {
  submissionCount: number;
}

export function Assignments() {
  const { classes } = useClasses();
  const [assignments, setAssignments] = useState<EnrichedAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (classes.length === 0) {
      setIsLoading(false);
      setAssignments([]);
      return;
    }
    
    setIsLoading(true);
    const classIds = classes.map(c => c.id);
    const assignmentsQuery = query(collection(db, "assignments"), where('classId', 'in', classIds));

    const unsubscribe = onSnapshot(assignmentsQuery, async (snapshot) => {
      const assignmentsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          dueDate: (data.dueDate as Timestamp).toDate()
        } as Assignment
      });
      
      const enrichedAssignments = await Promise.all(
        assignmentsData.map(async (assignment) => {
          const submissionsQuery = query(collection(db, "submissions"), where('assignmentId', '==', assignment.id));
          const submissionsSnapshot = await getDocs(submissionsQuery);
          return { ...assignment, submissionCount: submissionsSnapshot.size };
        })
      );
      
      setAssignments(enrichedAssignments);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching assignments: ", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [classes]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="grid gap-2">
            <CardTitle className="font-headline">Assignments</CardTitle>
            <CardDescription>View existing assignments and create new ones.</CardDescription>
        </div>
        <CreateAssignmentDialog classes={classes}>
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </CreateAssignmentDialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground py-12">
            <LoaderCircle className="w-6 h-6 animate-spin" />
            <p>Loading assignments...</p>
          </div>
        ) : assignments.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No assignments created yet.</p>
        ) : (
          <ul className="space-y-4">
            {assignments.map((assignment) => (
              <li key={assignment.id} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
                <div className="flex items-center gap-4">
                  <BookMarked className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{assignment.title}</p>
                    <p className="text-sm text-muted-foreground">{assignment.className} &bull; Due: {assignment.dueDate.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{assignment.submissionCount}</p>
                  <p className="text-sm text-muted-foreground">Submissions</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
