import { StudentWithProgress } from "@/lib/teacher-data";
import { Challenge } from "@/types";

interface ActiveChallengesProps {
  child: StudentWithProgress;
  challenges?: Challenge[];
}

export function ActiveChallenges({
  child,
  challenges = [],
}: ActiveChallengesProps) {
  const activeProgress = child.progress.filter(
    (p) => p.status === "in-progress" || p.status === "not-started",
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Current Challenges
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          What {child.student.name} is working on
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {activeProgress.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <div className="text-4xl mb-2">🚀</div>
            <p>All challenges completed!</p>
            <p className="text-sm">Great job!</p>
          </div>
        ) : (
          activeProgress.map((progress) => {
            const challenge = challenges.find(
              (c) => c.id === progress.challengeId,
            );
            if (!challenge) return null;

            const isInProgress = progress.status === "in-progress";

            return (
              <div key={progress.challengeId} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isInProgress ? "bg-yellow-100" : "bg-gray-100"
                        }`}
                      >
                        <span
                          className={`text-sm ${
                            isInProgress ? "text-yellow-600" : "text-gray-600"
                          }`}
                        >
                          {isInProgress ? "○" : "○"}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {challenge.title}
                        </h4>
                        <p className="text-xs text-gray-600 capitalize">
                          {challenge.subject} • {challenge.difficulty}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2 ml-10">
                      {challenge.description}
                    </p>
                    <div className="mt-2 ml-10">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isInProgress
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {isInProgress ? "In Progress" : "Not Started"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
