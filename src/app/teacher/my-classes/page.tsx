
'use client';

import { useState } from 'react';
import { Header } from '@/components/common/Header';
import { AddClassDialog } from '@/components/teacher/AddClassDialog';
import { TeacherNav } from '@/components/teacher/TeacherNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, PlusCircle, School, BookOpen } from 'lucide-react';
import type { Class } from '@/lib/types';

export default function MyClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);

  const handleAddClass = (newClass: Omit<Class, 'id' | 'studentCount'>) => {
    const newClassWithDetails: Class = {
      id: `class_${Date.now()}`,
      ...newClass,
      studentCount: 0, // Default to 0 students for a new class
    };
    setClasses((prevClasses) => [...prevClasses, newClassWithDetails]);
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <TeacherNav />
      <div className="flex flex-col">
        <Header role="Teacher" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <Users className="text-primary h-5 w-5" />
                            My Classes
                        </CardTitle>
                        <CardDescription>
                            View and manage your classes and student rosters.
                        </CardDescription>
                    </div>
                    <AddClassDialog onClassAdded={handleAddClass}>
                      <Button>
                          <PlusCircle className="mr-2 h-4 w-4"/>
                          Add New Class
                      </Button>
                    </AddClassDialog>
                </CardHeader>
                <CardContent>
                    {classes.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
                            <School className="mx-auto h-12 w-12" />
                            <h3 className="mt-4 text-lg font-semibold">No Classes Found</h3>
                            <p className="mt-2 text-sm">
                                You haven't added any classes yet.
                            </p>
                            <AddClassDialog onClassAdded={handleAddClass}>
                              <Button className="mt-4">
                                  <PlusCircle className="mr-2 h-4 w-4" />
                                  Add Your First Class
                              </Button>
                            </AddClassDialog>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {classes.map((classItem) => (
                                <Card key={classItem.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <BookOpen className="h-6 w-6 text-primary" />
                                            {classItem.name}
                                        </CardTitle>
                                        <CardDescription>{classItem.subject}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users className="h-4 w-4" />
                                            <span>{classItem.studentCount} Students</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
      </div>
    </div>
  );
}
