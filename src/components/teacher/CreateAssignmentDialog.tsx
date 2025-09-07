
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, PlusCircle } from 'lucide-react';
import type { Class } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

interface CreateAssignmentDialogProps {
  children: React.ReactNode;
  classes: (Class & { students: any[] })[];
}

export function CreateAssignmentDialog({ children, classes }: CreateAssignmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !dueDate || !selectedClassId) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields.' });
        return;
    }
    
    setIsLoading(true);

    try {
      const selectedClass = classes.find(c => c.id === selectedClassId);
      if (!selectedClass) throw new Error("Selected class not found.");
        
      await addDoc(collection(db, 'assignments'), {
        title,
        description,
        dueDate: Timestamp.fromDate(new Date(dueDate)),
        createdAt: Timestamp.now(),
        classId: selectedClass.id,
        className: selectedClass.name,
      });

      toast({
        title: 'Assignment Created!',
        description: `"${title}" has been assigned to ${selectedClass.name}.`,
        className: 'bg-success text-success-foreground',
      });
      
      // Reset form and close dialog
      setTitle('');
      setDescription('');
      setDueDate('');
      setSelectedClassId('');
      setOpen(false);

    } catch (error) {
        console.error("Error creating assignment: ", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to create assignment.' });
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
        <form onSubmit={handleCreateAssignment}>
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>
              Fill in the details for the new assignment. It will be visible to all students in the selected class.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="class-select">Assign to Class</Label>
              <Select onValueChange={setSelectedClassId} value={selectedClassId}>
                  <SelectTrigger id="class-select">
                      <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                      {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Creating...' : 'Create Assignment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
