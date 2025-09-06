import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const assignmentsData = [
  { title: "Chapter 3: Thermodynamics Worksheet", subject: "Physics 101", dueDate: "Oct 25, 2024", status: "Pending" },
  { title: "The Great Gatsby: Chapter 1-3 Quiz", subject: "English Literature", dueDate: "Oct 23, 2024", status: "Completed" },
  { title: "Algebra II: Problem Set 5", subject: "Mathematics", dueDate: "Oct 28, 2024", status: "Pending" },
];

export function StudentAssignments() {
  return (
    <Card className="bg-secondary border-0">
      <CardHeader>
        <CardTitle className="font-headline">Recent Assignments</CardTitle>
        <CardDescription>Keep track of your pending and completed tasks.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {assignmentsData.map((item, index) => (
            <li key={index} className="flex items-center justify-between p-3 border-b border-border/50 last:border-b-0">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.subject} &bull; Due: {item.dueDate}</p>
              </div>
              <Badge className={
                item.status === 'Completed' ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black'
              }>
                {item.status}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
