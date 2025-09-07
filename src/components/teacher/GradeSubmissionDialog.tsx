
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
import { LoaderCircle, CheckCircle } from 'lucide-react';
import type { Submission } from '@/lib/types';

interface GradeSubmissionDialogProps {
  children: React.ReactNode;
  submission: Submission;
  onGradeUpdate: (submissionId: string, grade: string) => void;
}

export function GradeSubmissionDialog({ children, submission, onGradeUpdate }: GradeSubmissionDialogProps) {
  const [open, setOpen] = useState(false);
  const [grade, setGrade] = useState(submission.grade || '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grade) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a grade.' });
      return;
    }
    
    setIsLoading(true);
    try {
      await onGradeUpdate(submission.id, grade);
      toast({
        title: 'Grade Saved!',
        description: `The grade for ${submission.studentName} has been recorded.`,
        className: 'bg-success text-success-foreground',
      });
      setOpen(false);
    } catch (error) {
      console.error("Error grading submission: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save the grade.' });
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
        <form onSubmit={handleGradeSubmit}>
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
            <DialogDescription>
              Enter a grade for {submission.studentName}'s submission.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade (e.g., A+, 85/100)</Label>
              <Input
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Enter grade"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Saving...' : 'Save Grade'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
