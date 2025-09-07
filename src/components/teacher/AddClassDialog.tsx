
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
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useClasses } from '@/context/ClassContext';

interface AddClassDialogProps {
  children: React.ReactNode;
}

export function AddClassDialog({ children }: AddClassDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addClass } = useClasses();

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newClassData = {
        name,
        subject,
        students: [], // Kept for local context, though Firestore will use studentIds
        studentIds: [], // The source of truth for enrollments
      };
      
      const docRef = await addDoc(collection(db, 'classes'), newClassData);

      // Update local state via context
      addClass({ id: docRef.id, ...newClassData });

      setIsLoading(false);
      setOpen(false); // Close the dialog
      setName(''); // Reset form
      setSubject('');   // Reset form

      toast({
        title: 'Class Added!',
        description: `The class "${name}" has been created successfully.`,
        className: 'bg-success text-success-foreground',
      });
    } catch (error) {
      console.error("Error adding class: ", error);
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not add the class. Please try again.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleAddClass}>
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
            <DialogDescription>
              Enter the details for your new class below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="class-name" className="text-right">
                Class Name
              </Label>
              <Input
                id="class-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Grade 10A"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Physics 101"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Adding...' : 'Add Class'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
