import { ClassSummary } from "@/lib/teacher-data";

interface SummaryCardProps {
  summary: ClassSummary;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Class Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {summary.totalStudents}
          </div>
          <div className="text-sm text-gray-600">Total Students</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {summary.activeStudents}
          </div>
          <div className="text-sm text-gray-600">Active Students</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {summary.completedChallenges}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {summary.averageProgress.toFixed(0)}%
          </div>
          <div className="text-sm text-gray-600">Avg Progress</div>
        </div>
      </div>
    </div>
  );
}
