
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/common/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { generateStudyPlan, GenerateStudyPlanInput } from '@/ai/flows/generate-study-plan';
import { getPlannerInsights, GetPlannerInsightsInput } from '@/ai/flows/planner-insights-flow';
import { BrainCircuit, CalendarPlus, Clock, LoaderCircle, Trash2, Wand2, ArrowLeft, PlusCircle, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import type { Assignment } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Task {
  id: number;
  name: string;
  duration: number; // in minutes
  deadline: string;
}

interface TimeSlot {
  id: number;
  day: string;
  start: string;
  end: string;
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
  
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: 1, day: 'Today', start: '09:00', end: '12:00' },
    { id: 2, day: 'Today', start: '14:00', end: '18:00' },
  ]);
  const [day, setDay] = useState('Today');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [schedule, setSchedule] = useState<ScheduleItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [academicGoal, setAcademicGoal] = useState<string>('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  
  const [insightQuery, setInsightQuery] = useState('');
  const [insightResult, setInsightResult] = useState<string | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      // Fetch academic goal
      const userDocRef = doc(db, 'users', currentUser.uid);
      getDoc(userDocRef).then(docSnap => {
        if (docSnap.exists()) {
          setAcademicGoal(docSnap.data().goal || 'No goal set.');
        }
      });

      // Fetch assignments
      const classesQuery = query(collection(db, 'classes'), where('studentIds', 'array-contains', currentUser.uid));
      const unsubscribeClasses = onSnapshot(classesQuery, (querySnapshot) => {
        const studentClassIds = querySnapshot.docs.map(doc => doc.id);
        if (studentClassIds.length > 0) {
          const assignmentsQuery = query(collection(db, 'assignments'), where('classId', 'in', studentClassIds));
          const unsubscribeAssignments = onSnapshot(assignmentsQuery, (snapshot) => {
            const now = new Date();
            const assignmentsData = snapshot.docs
              .map(doc => ({
                id: doc.id,
                ...doc.data(),
                dueDate: (doc.data().dueDate as Timestamp).toDate(),
              } as Assignment))
              .filter(assignment => assignment.dueDate > now); // Filter for future due dates on the client
            
            setAssignments(assignmentsData);
          });
          return () => unsubscribeAssignments();
        }
      });
      return () => unsubscribeClasses();
    }
  }, [currentUser]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName || !duration) {
      toast({ variant: 'destructive', title: 'Missing Information', description: 'Please provide a task name and duration.' });
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

  const handleRemoveTask = (id: number) => setTasks(tasks.filter((task) => task.id !== id));

  const handleAddTimeSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!day || !startTime || !endTime) {
      toast({ variant: 'destructive', title: 'Missing Information', description: 'Please provide a day, start time, and end time.' });
      return;
    }
    const newTimeSlot: TimeSlot = { id: Date.now(), day, start: startTime, end: endTime };
    setTimeSlots([...timeSlots, newTimeSlot]);
    setDay('Today');
    setStartTime('');
    setEndTime('');
  };

  const handleRemoveTimeSlot = (id: number) => setTimeSlots(timeSlots.filter((slot) => slot.id !== id));

  const handleGeneratePlan = async () => {
    if (tasks.length === 0 || timeSlots.length === 0) {
      toast({ variant: 'destructive', title: 'Missing Inputs', description: 'Please add at least one task and one time slot.' });
      return;
    }
    setIsLoading(true);
    setSchedule(null);
    const input: GenerateStudyPlanInput = {
      tasks: tasks.map(t => ({ name: t.name, duration: t.duration, deadline: t.deadline })),
      availableSlots: timeSlots.map(t => ({ day: t.day, start: t.start, end: t.end })),
    };
    try {
      const result = await generateStudyPlan(input);
      setSchedule(result.schedule);
      toast({ title: 'Plan Generated!', description: 'Your personalized study plan is ready.', className: 'bg-success text-success-foreground' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error Generating Plan', description: 'The AI could not generate a plan. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGetInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!insightQuery.trim()) return;

    setIsInsightLoading(true);
    setInsightResult(null);
    const input: GetPlannerInsightsInput = {
      query: insightQuery,
      goal: academicGoal,
      assignments: assignments.map(a => ({ title: a.title, dueDate: a.dueDate.toISOString() })),
      schedule: schedule || [],
    };
    try {
      const result = await getPlannerInsights(input);
      setInsightResult(result.insight);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error Getting Insight', description: 'The AI could not generate an insight. Please try again.' });
    } finally {
      setIsInsightLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header role="Student" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mb-4 flex items-center justify-between">
          <Button asChild variant="outline">
            <Link href="/student/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* AI Insight Search Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Sparkles className="text-primary h-5 w-5" />
              Get AI-Powered Insights
            </CardTitle>
            <CardDescription>
              Ask questions about your schedule, goals, and assignments to get personalized advice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGetInsight} className="flex items-center gap-2">
              <Input
                value={insightQuery}
                onChange={(e) => setInsightQuery(e.target.value)}
                placeholder="e.g., How can I better prepare for my upcoming assignments?"
                disabled={isInsightLoading}
              />
              <Button type="submit" disabled={isInsightLoading}>
                {isInsightLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span className="sr-only">Get Insight</span>
              </Button>
            </form>
             {isInsightLoading && (
                <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    <span>The AI is analyzing your plan...</span>
                </div>
            )}
            {insightResult && (
              <Alert className="mt-4 bg-primary/5 border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary font-semibold">AI Insight</AlertTitle>
                <AlertDescription className="prose prose-sm max-w-none text-foreground">
                  <p>{insightResult}</p>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-8 mt-4">
          <div className="lg:col-span-1 space-y-8">
             <Card>
                <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><CalendarPlus className="text-primary h-5 w-5" /> Add Your Tasks</CardTitle>
                <CardDescription>List everything you need to accomplish.</CardDescription>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleAddTask} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="task-name">Task Name</Label>
                        <Input id="task-name" value={taskName} onChange={(e) => setTaskName(e.target.value)} placeholder="e.g., Read Chapter 4" />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (mins)</Label>
                            <Input id="duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 60" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                        </div>
                    </div>
                    <Button type="submit" className="w-full"><PlusCircle className="mr-2 h-4 w-4" /> Add Task</Button>
                </form>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Clock className="text-primary h-5 w-5" /> Set Your Availability</CardTitle>
                <CardDescription>Tell the AI when you are free to study.</CardDescription>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleAddTimeSlot} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="day">Day</Label>
                        <Input id="day" value={day} onChange={(e) => setDay(e.target.value)} placeholder="e.g., Today, Monday" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start-time">Start Time</Label>
                            <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end-time">End Time</Label>
                            <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                        </div>
                    </div>
                    <Button type="submit" className="w-full"><PlusCircle className="mr-2 h-4 w-4" /> Add Time Slot</Button>
                </form>
                </CardContent>
            </Card>
          </div>
          
          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><BrainCircuit className="text-primary h-5 w-5" /> Your Personalized Plan</CardTitle>
              <CardDescription>An optimized schedule based on your tasks and availability.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1">
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium">Inputs for AI Planner</h3>
                        <div className="p-4 rounded-lg bg-secondary/50 space-y-4 h-full">
                            <div>
                                <h4 className="font-semibold mb-2">Task List</h4>
                                {tasks.length === 0 ? (<p className="text-muted-foreground text-sm">No tasks added yet.</p>) : (
                                <ul className="space-y-2">
                                    {tasks.map((task) => (
                                    <li key={task.id} className="flex items-center justify-between p-2 rounded-md bg-background text-sm">
                                        <div>
                                            <p className="font-semibold">{task.name}</p>
                                            <p className="text-muted-foreground">{task.duration} mins{task.deadline !== 'Not specified' && ` - Due: ${task.deadline}`}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveTask(task.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                    </li>
                                    ))}
                                </ul>
                                )}
                            </div>
                             <Separator />
                             <div>
                                <h4 className="font-semibold mb-2">Available Times</h4>
                                {timeSlots.length === 0 ? (<p className="text-muted-foreground text-sm">No time slots added.</p>) : (
                                <ul className="space-y-2">
                                    {timeSlots.map((slot) => (
                                    <li key={slot.id} className="flex items-center justify-between p-2 rounded-md bg-background text-sm">
                                        <div>
                                            <p className="font-semibold">{slot.day}</p>
                                            <p className="text-muted-foreground">{slot.start} - {slot.end}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveTimeSlot(slot.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                    </li>
                                    ))}
                                </ul>
                                )}
                            </div>
                        </div>
                    </div>
                     <div className="space-y-3">
                        <h3 className="text-lg font-medium">AI Generated Schedule</h3>
                        <div className="p-4 rounded-lg bg-secondary/50 h-full">
                            {schedule ? (
                                <ul className="space-y-4">
                                    {schedule.map((item, index) => (
                                        <li key={index} className="flex items-start gap-4 p-3 border-l-4 border-primary rounded-r-lg bg-background">
                                            <div className="font-semibold text-sm w-20">{item.time}</div>
                                            <div className="flex-1">
                                                <p className="font-medium">{item.task}</p>
                                                <div className="flex items-center text-xs text-muted-foreground"><Clock className="mr-1.5 h-3 w-3"/>{item.duration} minutes</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (<div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg h-full flex flex-col justify-center"><p>Your schedule will appear here.</p></div>)}
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleGeneratePlan} disabled={isLoading || tasks.length === 0} className="w-full">
                    {isLoading ? (<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />) : (<Wand2 className="mr-2 h-4 w-4" />)}
                    {isLoading ? 'Generating Plan...' : 'Generate My Study Plan'}
                </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
