
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit } from "lucide-react";

// Mock data based on a student getting questions wrong in a Data Structures quiz
const revisionTopics = [
    { topic: "Linked Lists", reason: "Incorrect answer in Quiz 1" },
    { topic: "Time Complexity", reason: "Incorrect answer in Quiz 1" },
    { topic: "Recursion", reason: "Below average score" },
];

export function RevisionTopics() {
  return (
    <Card className="bg-secondary border-0">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary"/>
            Topics to Revise
        </CardTitle>
        <CardDescription>Based on your recent quiz performance.</CardDescription>
      </CardHeader>
      <CardContent>
        {revisionTopics.length > 0 ? (
            <ul className="space-y-3">
            {revisionTopics.map((item, index) => (
                <li key={index} className="flex items-center justify-between p-3 rounded-md bg-background/50">
                <div>
                    <p className="font-medium">{item.topic}</p>
                    <p className="text-sm text-muted-foreground">{item.reason}</p>
                </div>
                <Badge variant="outline">Revise</Badge>
                </li>
            ))}
            </ul>
        ) : (
             <p className="text-center text-muted-foreground py-8">
                Great job! No specific topics to revise right now.
            </p>
        )}
      </CardContent>
    </Card>
  );
}
