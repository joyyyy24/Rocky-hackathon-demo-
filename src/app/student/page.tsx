"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RoleGuard } from "@/components/auth/role-guard";
import { getPublishedWorlds, WorldSnapshot } from "@/lib/world-storage";

export default function StudentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [publishedWorlds, setPublishedWorlds] = useState<WorldSnapshot[]>([]);

  const handleGoToWorld = () => {
    setIsLoading(true);
    router.push("/world");
  };

  useEffect(() => {
    setPublishedWorlds(getPublishedWorlds());
  }, []);

  return (
    <RoleGuard requiredRole="student">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Student Progress Hub
            </h1>
            <p className="text-gray-600 mt-2">
              Track your journey, then jump into the 3D world to complete the
              Science mission and unlock more zones.
            </p>
          </div>

        <div className="mt-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Published Worlds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publishedWorlds.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-sm text-gray-600">
                  No published worlds yet. Publish from Student World to share.
                </CardContent>
              </Card>
            )}
            {publishedWorlds.slice(0, 4).map((world) => (
              <Card key={world.id} className="hover:shadow-medium transition-shadow">
                <CardHeader>
                  <CardTitle>{world.ownerName}&apos;s World</CardTitle>
                  <CardDescription>
                    Style: {world.style || "Not set"} • {world.placedAssets.length} objects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={`/world/view/${world.id}`}>Open World</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-medium transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <CardTitle>Explore World</CardTitle>
              <CardDescription>
                Enter the 3D world to explore regions and complete challenges.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={handleGoToWorld}
                loading={isLoading}
                type="button"
              >
                Go to World
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-medium transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <CardTitle>My Progress</CardTitle>
              <CardDescription>
                View your completed challenges and achievements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Progress
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-medium transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <CardTitle>AI Companion</CardTitle>
              <CardDescription>
                Chat with your AI friend for hints and encouragement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>

          {/* Quick Stats */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Learning Journey
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      12
                    </div>
                    <p className="text-sm text-gray-600">Challenges Completed</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success-600 mb-2">
                      8
                    </div>
                    <p className="text-sm text-gray-600">Regions Explored</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning-600 mb-2">
                      24
                    </div>
                    <p className="text-sm text-gray-600">AI Conversations</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-danger-600 mb-2">
                      156
                    </div>
                    <p className="text-sm text-gray-600">Points Earned</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
