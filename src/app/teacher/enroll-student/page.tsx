
'use client';

import { useState } from 'react';
import { Header } from '@/components/common/Header';
import { TeacherNav } from '@/components/teacher/TeacherNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, LoaderCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Class } from '@/lib/types';

// Mock data for existing classes. In a real app, this would be fetched from a database.
const MOCK_CLASSES: Class[] = [
  { id: 'class_1', name: 'Grade 10A', subject: 'Physics 101' },
  { id: 'class_2', name: 'Grade 11B', subject: 'Algebra II' },
  { id: 'class_3', name: 'Grade 12C', subject: 'Lab Report' },
];

export default function EnrollStudentPage() {
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentEmail || !selectedClassId) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out all fields to enroll a student.',
      });
      return;
    }
    
    setIsLoading(true);

    // Simulate an API call to enroll the student
    console.log('Enrolling student:', { studentName, studentEmail, selectedClassId });
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setStudentName('');
    setStudentEmail('');
    setSelectedClassId('');
    
    toast({
      title: 'Student Enrolled!',
      description: `${studentName} has been successfully enrolled.`,
      className: 'bg-success text-success-foreground',
    });
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <TeacherNav />
      <div className="flex flex-col">
        <Header role="Teacher" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
          <div className="mx-auto grid w-full max-w-2xl gap-2">
            <h1 className="text-3xl font-semibold">Enroll New Student</h1>
          </div>
          <div className="mx-auto grid w-full max-w-2xl items-start gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Student Enrollment Form</CardTitle>
                <CardDescription>
                  Enter the student's details and select the class to enroll them in.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEnrollStudent} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="student-name">Student Full Name</Label>
                    <Input
                      id="student-name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g., Jane Doe"
                      required
                    />
                  </div>
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
                        {MOCK_CLASSES.map((classItem) => (
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
