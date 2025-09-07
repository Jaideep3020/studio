
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { TeacherNav } from '@/components/teacher/TeacherNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, LoaderCircle, FileText, CheckCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, onSnapshot, updateDoc } from 'firebase/firestore';
import type { Assignment, Submission } from '@/lib/types';
import Link from 'next/link';
import { GradeSubmissionDialog } from '@/components/teacher/GradeSubmissionDialog';

export default function AssignmentSubmissionsPage() {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const assignmentId = params.id as string;

  useEffect(() => {
    if (!assignmentId) return;

    setIsLoading(true);

    // Fetch assignment details
    const assignmentRef = doc(db, 'assignments', assignmentId);
    getDoc(assignmentRef).then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAssignment({ 
          id: docSnap.id, 
          ...data,
          dueDate: (data.dueDate as any).toDate(),
          createdAt: (data.createdAt as any).toDate(),
        } as Assignment);
      }
    });

    // Listen for submissions in real-time
    const submissionsQuery = query(collection(db, 'submissions'), where('assignmentId', '==', assignmentId));
    const unsubscribe = onSnapshot(submissionsQuery, (snapshot) => {
      const submissionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: (doc.data().submittedAt as any).toDate(),
      } as Submission));
      setSubmissions(submissionsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [assignmentId]);
  
  const handleGradeUpdate = async (submissionId: string, grade: string) => {
    const submissionRef = doc(db, 'submissions', submissionId);
    await updateDoc(submissionRef, {
        grade: grade,
        status: 'Graded'
    });
  };

  const getStatusBadge = (status: Submission['status']) => {
    switch (status) {
      case 'Graded':
        return <Badge className="bg-success text-success-foreground">Graded</Badge>;
      case 'Submitted':
        return <Badge className="bg-blue-500 text-white">Submitted</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <TeacherNav />
      <div className="flex flex-col">
        <Header role="Teacher" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
          <div className="mb-4">
            <Button asChild variant="outline">
              <Link href="/teacher/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <Card>
            <CardHeader>
              {isLoading ? (
                 <CardTitle>Loading Assignment...</CardTitle>
              ) : (
                <>
                  <CardTitle className="font-headline">{assignment?.title}</CardTitle>
                  <CardDescription>
                    Due: {assignment?.dueDate.toLocaleDateString()} &bull; {submissions.length} submission(s)
                  </CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 text-muted-foreground py-12">
                  <LoaderCircle className="w-6 h-6 animate-spin" />
                  <p>Loading submissions...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Submitted At</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.length > 0 ? submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.studentName}</TableCell>
                        <TableCell>{submission.submittedAt.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(submission.status)}</TableCell>
                        <TableCell>{submission.grade || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="mr-2" disabled>
                              <FileText className="mr-2 h-4 w-4" />
                              View File
                          </Button>
                          <GradeSubmissionDialog submission={submission} onGradeUpdate={handleGradeUpdate}>
                            <Button size="sm">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Grade
                            </Button>
                          </GradeSubmissionDialog>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                          No submissions yet for this assignment.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
