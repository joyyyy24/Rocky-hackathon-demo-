interface RecentActivityProps {
  activities: Array<{
    action: string;
    challengeTitle: string;
    timestamp: Date;
    details?: string;
  }>;
  childName: string;
}

export function ParentRecentActivity({
  activities,
  childName,
}: RecentActivityProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return new Intl.DateTimeFormat("en-US").format(date);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <p className="text-sm text-gray-600 mt-1">
          {childName}&apos;s latest accomplishments
        </p>
      </div>

      <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <div className="text-4xl mb-2">📚</div>
            <p>No recent activity</p>
            <p className="text-sm">
              Activity will appear here as {childName} progresses
            </p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div key={index} className="px-6 py-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">🎯</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    {childName} {activity.action}{" "}
                    <span className="font-medium">
                      {activity.challengeTitle}
                    </span>
                  </p>
                  {activity.details && (
                    <p className="text-xs text-gray-600 mt-1">
                      {activity.details}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(activity.timestamp)} at{" "}
                    {formatTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
