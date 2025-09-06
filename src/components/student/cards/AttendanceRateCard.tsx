import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';

interface AttendanceRateCardProps {
  attendedClasses: number;
  totalClasses: number;
}

export function AttendanceRateCard({ attendedClasses, totalClasses }: AttendanceRateCardProps) {
  const percentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;

  return (
    <Card className="bg-blue-50 border-blue-200 shadow-sm hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-blue-800">Attendance Rate</CardTitle>
        <TrendingUp className="h-4 w-4 text-blue-500" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-blue-900">{percentage.toFixed(1)}%</div>
        <p className="text-xs text-blue-600 mt-1">
          {attendedClasses}/{totalClasses} classes
        </p>
        <Progress value={percentage} className="mt-4 h-2 [&>div]:bg-blue-500" />
      </CardContent>
    </Card>
  );
}
