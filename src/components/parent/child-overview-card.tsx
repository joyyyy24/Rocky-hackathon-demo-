import { StudentWithProgress } from "@/lib/teacher-data";

interface ChildOverviewCardProps {
  child: StudentWithProgress;
}

export function ChildOverviewCard({ child }: ChildOverviewCardProps) {
  const { student, totalChallenges, completedChallenges, lastActivity } = child;
  const progressPercentage =
    totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0;

  const formatLastActivity = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffHours > 0)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return "Recently";
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white font-medium text-xl">
            {student.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {student.name}
          </h3>
          <p className="text-gray-600">
            Last active {formatLastActivity(lastActivity)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Challenges Completed</span>
          <span className="text-sm font-medium">
            {completedChallenges} of {totalChallenges}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 text-center">
          {progressPercentage.toFixed(0)}% Complete
        </p>
      </div>
    </div>
  );
}
