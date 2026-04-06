interface RecentActivityProps {
  activities: Array<{
    studentName: string;
    action: string;
    timestamp: Date;
    challengeTitle: string;
  }>;
}

export function RecentActivity({ activities }: RecentActivityProps) {
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
        <h3 className="text-lg font-semibold">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="px-6 py-4 text-gray-500 text-center">
            No recent activity
          </div>
        ) : (
          activities.map((activity, index) => (
            <div key={index} className="px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.studentName}</span>{" "}
                    {activity.action}{" "}
                    <span className="font-medium">
                      {activity.challengeTitle}
                    </span>
                  </p>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  <div>{formatDate(activity.timestamp)}</div>
                  <div>{formatTime(activity.timestamp)}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
