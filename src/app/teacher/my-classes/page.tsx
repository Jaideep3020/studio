'use client';

import { Header } from '@/components/common/Header';
import { AddClassDialog } from '@/components/teacher/AddClassDialog';
import { AddStudentDialog } from '@/components/teacher/AddStudentDialog';
import { TeacherNav } from '@/components/teacher/TeacherNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, PlusCircle, School, BookOpen, Trash2, ChevronDown } from 'lucide-react';
import type { Class, Student } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useClasses } from '@/context/ClassContext';

export default function MyClassesPage() {
  const { classes, addClass, addStudentToClass, removeStudentFromClass } = useClasses();

  const handleAddClass = (newClass: Omit<Class, 'id'>) => {
    addClass(newClass);
  };
  
  const handleAddStudent = (classId: string, studentName: string, studentEmail: string) => {
    const newStudent: Omit<Student, 'id'> = { name: studentName, email: studentEmail };
    addStudentToClass(classId, newStudent);
  };
  
  const handleDropStudent = (classId: string, studentId: string) => {
    removeStudentFromClass(classId, studentId);
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
                        <Accordion type="multiple" className="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                          {classes.map((classItem) => (
                            <Card key={classItem.id} className="hover:shadow-md transition-shadow flex flex-col">
                              <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                  <BookOpen className="h-6 w-6 text-primary" />
                                  {classItem.name}
                                </CardTitle>
                                <CardDescription>{classItem.subject}</CardDescription>
                              </CardHeader>
                              <CardContent className="flex-grow flex flex-col justify-between">
                                <AccordionItem value={classItem.id} className="border-b-0">
                                  <AccordionTrigger className="hover:no-underline -mx-6 px-6 py-3 rounded-md hover:bg-accent">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Users className="h-4 w-4" />
                                      <span>{classItem.students.length} Student{classItem.students.length !== 1 ? 's' : ''}</span>
                                      <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="pt-4 px-1 -mx-1">
                                    {classItem.students.length > 0 ? (
                                      <ul className="space-y-3 max-h-48 overflow-y-auto pr-2">
                                        {classItem.students.map((student) => (
                                          <li key={student.id} className="flex items-center justify-between animate-in fade-in">
                                            <div className="flex items-center gap-3">
                                              <Avatar className="h-8 w-8">
                                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                              </Avatar>
                                              <div>
                                                <p className="font-medium text-sm">{student.name}</p>
                                                <p className="text-xs text-muted-foreground">{student.email}</p>
                                              </div>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => handleDropStudent(classItem.id, student.id)}>
                                              <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-sm text-muted-foreground text-center py-4">No students enrolled yet.</p>
                                    )}
                                  </AccordionContent>
                                </AccordionItem>
                                <div className="mt-4 flex gap-2">
                                  <AddStudentDialog classId={classItem.id} onStudentAdded={handleAddStudent}>
                                    <Button size="sm" className="w-full">
                                      <PlusCircle className="mr-2 h-4 w-4" />
                                      Add Student
                                    </Button>
                                  </AddStudentDialog>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </Accordion>
                    )}
                </CardContent>
            </Card>
        </main>
      </div>
    </div>
  );
}
