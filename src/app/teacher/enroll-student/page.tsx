
'use client';

import { useState } from 'react';
import { Header } from '@/components/common/Header';
import { TeacherNav } from '@/components/teacher/TeacherNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, LoaderCircle, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClasses } from '@/context/ClassContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function EnrollStudentPage() {
  const [studentEmail, setStudentEmail] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { classes, addStudentToClass } = useClasses();

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail || !selectedClassId) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide a student email and select a class.',
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // 1. Find the student user by their email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', studentEmail), where('role', '==', 'student'));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('No student found with this email address.');
      }

      const studentDoc = querySnapshot.docs[0];
      const studentData = studentDoc.data();
      const studentId = studentDoc.id;

      // 2. Add the student's UID to the class's studentIds array in Firestore
      const classRef = doc(db, 'classes', selectedClassId);
      await updateDoc(classRef, {
        studentIds: arrayUnion(studentId)
      });
      
      // 3. (Optional) Update local context state if needed for immediate UI updates
      addStudentToClass(selectedClassId, { id: studentId, name: studentData.name, email: studentData.email });

      setIsLoading(false);
      setStudentEmail('');
      setSelectedClassId('');
      
      toast({
        title: 'Student Enrolled!',
        description: `${studentData.name} has been successfully enrolled.`,
        className: 'bg-success text-success-foreground',
      });

    } catch (err: any) {
      console.error("Enrollment failed: ", err);
      setError(err.message || 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <TeacherNav />
      <div className="flex flex-col">
        <Header role="Teacher" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
          <div className="mx-auto grid w-full max-w-2xl gap-2">
            <h1 className="text-3xl font-semibold">Enroll Student</h1>
          </div>
          <div className="mx-auto grid w-full max-w-2xl items-start gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Student Enrollment Form</CardTitle>
                <CardDescription>
                  Enter the student's email and select the class to enroll them in. The student must have a ClassZen account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Enrollment Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleEnrollStudent} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="student-email">Student Email Address</Label>
                    <Input
                      id="student-email"
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="e.g., jane.doe@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class-select">Select Class</Label>
                    <Select onValueChange={setSelectedClassId} value={selectedClassId}>
                      <SelectTrigger id="class-select" className="w-full">
                        <SelectValue placeholder="Choose a class to enroll into" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {classes.map((classItem) => (
                          <SelectItem key={classItem.id} value={classItem.id}>
                            {classItem.name} - {classItem.subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <UserPlus className="mr-2 h-4 w-4" />
                    )}
                    {isLoading ? 'Enrolling...' : 'Enroll Student'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
