
import { Header } from '@/components/common/Header';
import { AddClassDialog } from '@/components/teacher/AddClassDialog';
import { TeacherNav } from '@/components/teacher/TeacherNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, PlusCircle, School } from 'lucide-react';

export default function MyClassesPage() {
  // In a real app, this would be fetched from a database
  const classes = []; 

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
                    <AddClassDialog>
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
                            <AddClassDialog>
                              <Button className="mt-4">
                                  <PlusCircle className="mr-2 h-4 w-4" />
                                  Add Your First Class
                              </Button>
                            </AddClassDialog>
                        </div>
                    ) : (
                        <p>
                            {/* Class list will be rendered here */}
                        </p>
                    )}
                </CardContent>
            </Card>
        </main>
      </div>
    </div>
  );
}
