"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

const scheduleData = [
  { time: "09:00 - 10:00", subject: "Physics 101", class: "Grade 10A", status: "Ongoing" },
  { time: "10:00 - 11:00", subject: "Mathematics", class: "Grade 11B", status: "Upcoming" },
  { time: "11:00 - 12:00", subject: "Chemistry Lab", class: "Grade 10A", status: "Upcoming" },
  { time: "13:00 - 14:00", subject: "Physics 101", class: "Grade 12C", status: "Upcoming" },
];

export function Schedule() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="grid gap-2">
            <CardTitle className="font-headline">Today's Schedule</CardTitle>
            <CardDescription>Your timetable for today, {currentDate}.</CardDescription>
        </div>
        <CalendarDays className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Class</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduleData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.time}</TableCell>
                <TableCell>{item.subject}</TableCell>
                <TableCell>{item.class}</TableCell>
                <TableCell className="text-right">
                  <Badge className={
                    item.status === 'Ongoing' ? 'bg-warning text-warning-foreground' : 'bg-secondary text-secondary-foreground'
                  }>
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
