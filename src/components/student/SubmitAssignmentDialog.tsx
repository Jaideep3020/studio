
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Upload } from 'lucide-react';
import type { Assignment } from '@/lib/types';
import type { User } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

interface SubmitAssignmentDialogProps {
  children: React.ReactNode;
  assignment: Assignment;
  student: User;
}

export function SubmitAssignmentDialog({ children, assignment, student }: SubmitAssignmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a file to submit.' });
      return;
    }
    
    setIsLoading(true);

    try {
      // In a real app, you would upload the file to Firebase Storage here
      // and get a download URL. For now, we'll just simulate it.
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockFileUrl = `uploads/submission_${Date.now()}_${file.name}`;

      await addDoc(collection(db, 'submissions'), {
        assignmentId: assignment.id,
        studentId: student.uid,
        studentName: student.displayName || 'Unknown Student',
        submittedAt: Timestamp.now(),
        status: 'Submitted',
        fileUrl: mockFileUrl,
      });

      toast({
        title: 'Submission Successful!',
        description: `Your work for "${assignment.title}" has been submitted.`,
        className: 'bg-success text-success-foreground',
      });
      
      setFile(null);
      setOpen(false);

    } catch (error) {
        console.error("Error submitting assignment: ", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to submit assignment.' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Submit: {assignment.title}</DialogTitle>
            <DialogDescription>
              Upload your file to complete the submission. You can only submit once.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">File</Label>
              <Input id="file-upload" type="file" onChange={handleFileChange} required />
               {file && <p className="text-xs text-muted-foreground mt-1">Selected: {file.name}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || !file}>
              {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Submitting...' : 'Submit Assignment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
