import { StudentWithProgress } from "@/lib/teacher-data";
import { Challenge } from "@/types";

interface CompletedChallengesProps {
  child: StudentWithProgress;
  challenges?: Challenge[];
}

export function CompletedChallenges({
  child,
  challenges = [],
}: CompletedChallengesProps) {
  const completedProgress = child.progress.filter(
    (p) => p.status === "completed",
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Completed Challenges
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          What {child.student.name} has accomplished
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {completedProgress.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <div className="text-4xl mb-2">🎯</div>
            <p>No challenges completed yet</p>
            <p className="text-sm">Check back soon to see progress!</p>
          </div>
        ) : (
          completedProgress.map((progress) => {
            const challenge = challenges.find(
              (c) => c.id === progress.challengeId,
            );
            if (!challenge) return null;

            return (
              <div key={progress.challengeId} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">✓</span>
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
                    <div className="flex items-center space-x-4 mt-2 ml-10">
                      <span className="text-xs text-gray-500">
                        Completed {progress.completedAt?.toLocaleDateString()}
                      </span>
                      {progress.score && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Score: {progress.score}%
                        </span>
                      )}
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
