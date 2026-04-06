import Link from "next/link";
import {
  getCurrentParentWithChild,
  getChildRecentActivity,
  getChallenges,
} from "@/lib/parent-data";
import { ChildOverviewCard } from "@/components/parent/child-overview-card";
import { CompletedChallenges } from "@/components/parent/completed-challenges";
import { ActiveChallenges } from "@/components/parent/active-challenges";
import { ParentRecentActivity } from "@/components/parent/parent-recent-activity";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ParentPage() {
  const parentWithChild = getCurrentParentWithChild();
  const recentActivities = getChildRecentActivity(
    parentWithChild.child.student.id,
    10,
  );
  const challenges = getChallenges();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Parent Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {parentWithChild.parent.name}. Here&apos;s how{" "}
            {parentWithChild.child.student.name} is doing in their educational
            world.
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
              <span className="text-2xl">🌍</span>
            </div>
            <CardTitle>Explore Your Child&apos;s World</CardTitle>
            <CardDescription>
              View {parentWithChild.child.student.name}&apos;s creations and
              completed challenges in their educational world.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/world">View World</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
