import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface ThisWeekCardProps {
  daysAttended: number;
  totalDays: number;
}

export function ThisWeekCard({ daysAttended, totalDays }: ThisWeekCardProps) {
  return (
    <Card className="bg-purple-50 border-purple-200 shadow-sm hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-purple-800">This Week</CardTitle>
        <Calendar className="h-4 w-4 text-purple-500" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-purple-900">
          {daysAttended}/{totalDays}
        </div>
        <p className="text-xs text-purple-600">Days attended</p>
      </CardContent>
    </Card>
  );
}
