import { StudentWithProgress } from "@/lib/teacher-data";

interface StudentRowProps {
  studentWithProgress: StudentWithProgress;
  onClick: () => void;
}

export function StudentRow({ studentWithProgress, onClick }: StudentRowProps) {
  const {
    student,
    progress,
    lastActivity,
    totalChallenges,
    completedChallenges,
  } = studentWithProgress;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700";
      case "not-started":
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div
      className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {student.name}
              </div>
              <div className="text-sm text-gray-500">
                Last active {formatLastActivity(lastActivity)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {completedChallenges}/{totalChallenges} challenges
            </div>
            <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="flex space-x-1">
            {progress.slice(0, 3).map((p, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(p.status)}`}
              >
                {p.status === "completed"
                  ? "✓"
                  : p.status === "in-progress"
                    ? "○"
                    : "○"}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
