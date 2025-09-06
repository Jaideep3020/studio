
'use client';

import { useState } from 'react';
import { Header } from '@/components/common/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// This is a mock implementation. In a real app, you'd fetch/save this to a database.
const MOCK_USER_PROFILE = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  goal: 'Prepare for GATE 2026',
};

export default function StudentProfilePage() {
  const [goal, setGoal] = useState(MOCK_USER_PROFILE.goal);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoalSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate saving to a database
    setTimeout(() => {
      MOCK_USER_PROFILE.goal = goal; // Update mock data
      setIsLoading(false);
      toast({
        title: 'Goal Saved!',
        description: 'Your academic goal has been updated successfully.',
        className: 'bg-success text-success-foreground',
      });
    }, 1000);
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
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">My Profile</CardTitle>
            <CardDescription>
              Personalize your account and set your academic goals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGoalSave} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={MOCK_USER_PROFILE.name} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={MOCK_USER_PROFILE.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">My Academic Goal</Label>
                <Input
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., Prepare for GATE 2026, Master Calculus"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Goal'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
