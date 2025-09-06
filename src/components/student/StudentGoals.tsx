
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Edit } from "lucide-react";
import Link from "next/link";

// Mock data, in a real app this would come from the user's profile in Firestore
const userGoal = "Prepare for GATE 2026";

export function StudentGoals() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
            <CardTitle className="font-headline">My Academic Goal</CardTitle>
            <CardDescription>Your primary focus for this academic period.</CardDescription>
        </div>
         <Button asChild variant="ghost" size="icon">
            <Link href="/student/profile">
                <Edit className="h-4 w-4" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
            <Target className="h-8 w-8 text-primary" />
            <p className="text-lg font-semibold">{userGoal}</p>
        </div>
      </CardContent>
    </Card>
  );
}
