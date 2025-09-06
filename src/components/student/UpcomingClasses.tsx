import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const classesData = [
  { subject: "Mathematics", time: "10:00 - 11:00", teacher: "Mr. Davison", status: "Next Up" },
  { subject: "Chemistry Lab", time: "11:00 - 12:00", teacher: "Ms. Curie", status: "Upcoming" },
  { subject: "History", time: "13:00 - 14:00", teacher: "Dr. Jones", status: "Upcoming" },
];

export function UpcomingClasses() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Upcoming Classes</CardTitle>
        <CardDescription>Here's what you have for the rest of the day.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {classesData.map((item, index) => (
            <li key={index} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
              <div className="flex items-center gap-4">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{item.subject}</p>
                  <p className="text-sm text-muted-foreground">{item.time} &bull; {item.teacher}</p>
                </div>
              </div>
              <Badge className={
                item.status === 'Next Up' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
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
