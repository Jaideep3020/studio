import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers } from 'lucide-react';

interface AssignmentsCardProps {
  pendingCount: number;
}

export function AssignmentsCard({ pendingCount }: AssignmentsCardProps) {
  return (
    <Card className="bg-green-50 border-green-200 shadow-sm hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-green-800">Assignments</CardTitle>
        <Layers className="h-4 w-4 text-green-500" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-green-900">{pendingCount}</div>
        <p className="text-xs text-green-600">Pending submissions</p>
      </CardContent>
    </Card>
  );
}
