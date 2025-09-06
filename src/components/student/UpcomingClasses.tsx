
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, BookOpen, MapPin } from "lucide-react";
import { useState } from "react";

const classesData = [
  { subject: "Mathematics", time: "10:00 - 11:00", teacher: "Mr. Davison", status: "Next Up", topic: "Introduction to Calculus", location: "Room 301" },
  { subject: "Chemistry Lab", time: "11:00 - 12:00", teacher: "Ms. Curie", status: "Upcoming", topic: "Titration Experiment", location: "Lab B" },
  { subject: "History", time: "13:00 - 14:00", teacher: "Dr. Jones", status: "Upcoming", topic: "The World Wars", location: "Room 102" },
];

export function UpcomingClasses() {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Upcoming Classes</CardTitle>
        <CardDescription>Here's what you have for the rest of the day.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem}>
          {classesData.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index} className="border-b-0">
                <AccordionTrigger
                 className={`p-3 rounded-md hover:bg-secondary/80 data-[state=open]:bg-secondary/50 ${openItem === `item-${index}` ? 'bg-secondary/50' : 'bg-secondary/20'}`}
                >
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4 text-left">
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
                    </div>
                </AccordionTrigger>
              <AccordionContent className="p-4 bg-secondary/20 rounded-b-md">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-muted-foreground"/>
                        <p className="text-sm"><span className="font-semibold">Topic:</span> {item.topic}</p>
                    </div>
                     <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground"/>
                        <p className="text-sm"><span className="font-semibold">Location:</span> {item.location}</p>
                    </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
