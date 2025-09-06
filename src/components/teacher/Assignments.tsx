import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookMarked, PlusCircle } from "lucide-react";

const assignmentsData = [
  { title: "Chapter 3: Thermodynamics Worksheet", class: "Grade 10A", dueDate: "Oct 25, 2024", submissions: 18, total: 25 },
  { title: "Algebra II: Problem Set 5", class: "Grade 11B", dueDate: "Oct 28, 2024", submissions: 10, total: 22 },
  { title: "Lab Report: Titration Experiment", class: "Grade 12C", dueDate: "Nov 2, 2024", submissions: 0, total: 20 },
];

export function Assignments() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="grid gap-2">
            <CardTitle className="font-headline">Assignments</CardTitle>
            <CardDescription>View existing assignments and create new ones.</CardDescription>
        </div>
        <Button size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {assignmentsData.map((assignment, index) => (
            <li key={index} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
              <div className="flex items-center gap-4">
                <BookMarked className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{assignment.title}</p>
                  <p className="text-sm text-muted-foreground">{assignment.class} &bull; Due: {assignment.dueDate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{assignment.submissions}/{assignment.total}</p>
                <p className="text-sm text-muted-foreground">Submissions</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
