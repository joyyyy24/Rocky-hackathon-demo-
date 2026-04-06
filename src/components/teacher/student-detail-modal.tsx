import { StudentWithProgress } from "@/lib/teacher-data";
import { Challenge } from "@/types";

interface StudentDetailModalProps {
  studentWithProgress: StudentWithProgress | null;
  challenges: Challenge[];
  isOpen: boolean;
  onClose: () => void;
}

export function StudentDetailModal({
  studentWithProgress,
  challenges,
  isOpen,
  onClose,
}: StudentDetailModalProps) {
  if (!isOpen || !studentWithProgress) return null;

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completed
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            In Progress
          </span>
        );
      case "not-started":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Not Started
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      onClick={onClose}
    >
      <div
        className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Student Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Student Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-lg">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <h4 className="text-xl font-medium">{student.name}</h4>
              <p className="text-gray-600">{student.email}</p>
              <p className="text-sm text-gray-500">
                Last active {formatLastActivity(lastActivity)}
              </p>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-medium mb-2">Progress Summary</h5>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {completedChallenges} of {totalChallenges} challenges completed
              </span>
              <span className="text-sm font-medium">
                {progressPercentage.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Challenge Details */}
          <div>
            <h5 className="font-medium mb-3">Challenge Progress</h5>
            <div className="space-y-3">
              {challenges.map((challenge) => {
                const studentProgress = progress.find(
                  (p) => p.challengeId === challenge.id,
                );
                const status = studentProgress?.status || "not-started";

                return (
                  <div
                    key={challenge.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {challenge.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        {challenge.subject} • {challenge.difficulty}
                      </div>
                      {studentProgress?.completedAt && (
                        <div className="text-xs text-gray-500">
                          Completed{" "}
                          {studentProgress.completedAt.toLocaleDateString()}
                          {studentProgress.score &&
                            ` • Score: ${studentProgress.score}%`}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">{getStatusBadge(status)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
