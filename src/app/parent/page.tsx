"use client";

import { useEffect, useState } from "react";
import {
  getCurrentParentWithChild,
  getChildRecentActivity,
  getChallenges,
} from "@/lib/parent-data";
import { ChildOverviewCard } from "@/components/parent/child-overview-card";
import { CompletedChallenges } from "@/components/parent/completed-challenges";
import { ActiveChallenges } from "@/components/parent/active-challenges";
import { ParentRecentActivity } from "@/components/parent/parent-recent-activity";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RoleGuard } from "@/components/auth/role-guard";
import { getActiveTask } from "@/lib/tasks";
import { BuildSummary, getBuildSummary } from "@/lib/build-state";

export default function ParentPage() {
  const parentWithChild = getCurrentParentWithChild();
  const recentActivities = getChildRecentActivity(
    parentWithChild.child.student.id,
    10,
  );
  const challenges = getChallenges();
  const [currentTask, setCurrentTask] = useState(getActiveTask());
  const [buildSummary, setBuildSummary] = useState<BuildSummary>(getBuildSummary());

  useEffect(() => {
    setCurrentTask(getActiveTask());
    setBuildSummary(getBuildSummary());
  }, []);

  return (
    <RoleGuard requiredRole="parent">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Parent View
            </h1>
            <p className="text-gray-600">
              Welcome back, {parentWithChild.parent.name}. This view is read-only
              and focused on {parentWithChild.child.student.name}&apos;s progress
              summary.
            </p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <ChildOverviewCard child={parentWithChild.child} />
          </div>

          <div className="lg:col-span-2">
            <ParentRecentActivity
              activities={recentActivities}
              childName={parentWithChild.child.student.name}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CompletedChallenges
            child={parentWithChild.child}
            challenges={challenges}
          />
          <ActiveChallenges
            child={parentWithChild.child}
            challenges={challenges}
          />
        </div>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <CardTitle>Read-only Parent Access</CardTitle>
              <CardDescription>
                Parent mode is limited to progress summaries and latest completed
                tasks. Building and student world interactions are disabled in this
                role.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <CardTitle>Current Creative Mission</CardTitle>
              <CardDescription>{currentTask.title}</CardDescription>
              <p className="text-sm text-gray-700">{currentTask.description}</p>
              <p className="text-sm text-gray-700 mt-2">
                Latest theme: <span className="font-semibold">{buildSummary.style || "Not set yet"}</span>
              </p>
              <p className="text-sm text-gray-700">
                Items built: <span className="font-semibold">{buildSummary.objectsPlaced}</span>
              </p>
              <p className="text-sm text-gray-700">
                Progress status: <span className="font-semibold capitalize">{buildSummary.completionStatus}</span>
              </p>
              <p className="text-sm text-gray-700 mt-2">
                Latest encouraging reflection: {buildSummary.latestRockyLine}
              </p>
            </CardHeader>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
}
