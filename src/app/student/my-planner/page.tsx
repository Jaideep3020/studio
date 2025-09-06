
'use client';

import { useState } from 'react';
import { Header } from '@/components/common/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { generateStudyPlan, GenerateStudyPlanInput, GenerateStudyPlanOutput } from '@/ai/flows/generate-study-plan';
import { BrainCircuit, CalendarPlus, Clock, LoaderCircle, Trash2, Wand2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Task {
  id: number;
  name: string;
  duration: number; // in minutes
  deadline: string;
}

interface ScheduleItem {
    time: string;
    task: string;
    duration: number;
}

export default function MyPlannerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState('');
  const [duration, setDuration] = useState('');
  const [deadline, setDeadline] = useState('');
  const [schedule, setSchedule] = useState<ScheduleItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName || !duration) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide a task name and duration.',
      });
      return;
    }
    const newTask: Task = {
      id: Date.now(),
      name: taskName,
      duration: parseInt(duration, 10),
      deadline: deadline || 'Not specified',
    };
    setTasks([...tasks, newTask]);
    setTaskName('');
    setDuration('');
    setDeadline('');
  };

  const handleRemoveTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleGeneratePlan = async () => {
    if (tasks.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Tasks',
        description: 'Please add at least one task to generate a plan.',
      });
      return;
    }

    setIsLoading(true);
    setSchedule(null);

    const input: GenerateStudyPlanInput = {
      tasks: tasks.map(t => ({ name: t.name, duration: t.duration, deadline: t.deadline })),
      availableSlots: [
          { day: 'Today', start: '09:00', end: '12:00' },
          { day: 'Today', start: '14:00', end: '18:00' },
      ]
    };

    try {
      const result = await generateStudyPlan(input);
      setSchedule(result.schedule);
       toast({
        title: 'Plan Generated!',
        description: 'Your personalized study plan is ready.',
        className: 'bg-success text-success-foreground',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Plan',
        description: 'The AI could not generate a plan. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header role="Student" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mb-4">
          <Button asChild variant="outline">
            <Link href="/student/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8">
          {/* Task Input and List */}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <CalendarPlus className="text-primary h-5 w-5" />
                Add Your Tasks
              </CardTitle>
              <CardDescription>
                List everything you need to accomplish. The AI will organize it for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="task-name">Task Name</Label>
                        <Input
                        id="task-name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        placeholder="e.g., Read Chapter 4"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                        id="duration"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="e.g., 60"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline (Optional)</Label>
                    <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    />
                </div>
                <Button type="submit">Add Task</Button>
              </form>
              <Separator className="my-6" />
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Task List</h3>
                {tasks.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No tasks added yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {tasks.map((task) => (
                      <li key={task.id} className="flex items-center justify-between p-2 rounded-md bg-secondary/50 text-sm">
                        <div>
                            <p className="font-semibold">{task.name}</p>
                            <p className="text-muted-foreground">
                                {task.duration} mins
                                {task.deadline !== 'Not specified' && ` - Due: ${task.deadline}`}
                            </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveTask(task.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Generated Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <BrainCircuit className="text-primary h-5 w-5" />
                AI Generated Schedule
              </CardTitle>
              <CardDescription>
                Your optimized plan for the day based on your tasks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleGeneratePlan} disabled={isLoading || tasks.length === 0} className="w-full">
                {isLoading ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Generating Plan...' : 'Generate Plan'}
              </Button>
              
              <div className="mt-6">
                {schedule ? (
                    <ul className="space-y-4">
                        {schedule.map((item, index) => (
                            <li key={index} className="flex items-start gap-4 p-3 border-l-4 border-primary rounded-r-lg bg-secondary/50">
                                <div className="font-semibold text-sm w-20">{item.time}</div>
                                <div className="flex-1">
                                    <p className="font-medium">{item.task}</p>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <Clock className="mr-1.5 h-3 w-3"/>
                                        {item.duration} minutes
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
                        <p>Your schedule will appear here after generation.</p>
                    </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
