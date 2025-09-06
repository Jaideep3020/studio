import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface NextClassCardProps {
  time: string;
  subject: string;
  location: string;
}

export function NextClassCard({ time, subject, location }: NextClassCardProps) {
  return (
    <Card className="bg-orange-50 border-orange-200 shadow-sm hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-orange-800">Next Class</CardTitle>
        <Clock className="h-4 w-4 text-orange-500" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-orange-900">{time}</div>
        <p className="text-xs text-orange-600">
          {subject} - {location}
        </p>
      </CardContent>
    </Card>
  );
}
