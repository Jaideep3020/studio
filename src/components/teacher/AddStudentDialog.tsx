
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
import { LoaderCircle } from 'lucide-react';

interface AddStudentDialogProps {
  children: React.ReactNode;
  classId: string;
  onStudentAdded: (classId: string, studentName: string, studentEmail: string) => void;
}

export function AddStudentDialog({ children, classId, onStudentAdded }: AddStudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate saving to a database
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    onStudentAdded(classId, studentName, studentEmail);

    setIsLoading(false);
    setOpen(false); // Close the dialog
    setStudentName(''); // Reset form
    setStudentEmail(''); // Reset form

    toast({
      title: 'Student Added!',
      description: `"${studentName}" has been enrolled in the class.`,
      className: 'bg-success text-success-foreground',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleAddStudent}>
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
            <DialogDescription>
              Enter the student's details to enroll them in this class.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="student-name" className="text-right">
                Full Name
              </Label>
              <Input
                id="student-name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g., John Doe"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="student-email" className="text-right">
                Email
              </Label>
              <Input
                id="student-email"
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="e.g., john.doe@example.com"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Adding...' : 'Add Student'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
