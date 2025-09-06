
import { Header } from '@/components/common/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header role="Student" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
          <div className="mb-4">
            <Button asChild variant="outline">
                <Link href="/student/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
                </Link>
            </Button>
          </div>
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                      <BarChart className="text-primary h-5 w-5" />
                      My Reports
                  </CardTitle>
                  <CardDescription>
                      View reports on your attendance and performance.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <p className="text-center text-muted-foreground py-12">
                      Your performance reports will be generated here.
                  </p>
              </CardContent>
          </Card>
      </main>
    </div>
  );
}
