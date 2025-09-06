
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileQuestion, ArrowRight } from "lucide-react";
import type { Quiz } from "@/lib/types";

const availableQuizzes: Quiz[] = [
    { id: 'quiz_ds1', title: "CSE201 - Data Structures Quiz 1", subject: "Data Structures", questions: 10, timeLimit: 15 },
    { id: 'quiz_algo1', title: "CSE301 - Algorithms Quiz 1", subject: "Algorithms", questions: 15, timeLimit: 20 },
    { id: 'quiz_dbms1', title: "CSE202 - DBMS Quiz 1", subject: "Database Systems", questions: 10, timeLimit: 10 },
];

export function StudentQuizzes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Available Quizzes</CardTitle>
        <CardDescription>Tests and quizzes assigned by your teachers.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {availableQuizzes.map((quiz) => (
            <li key={quiz.id} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
              <div className="flex items-center gap-4">
                <FileQuestion className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{quiz.title}</p>
                  <p className="text-sm text-muted-foreground">{quiz.questions} Questions &bull; {quiz.timeLimit} mins</p>
                </div>
              </div>
              <Button size="sm">
                Start Test
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
