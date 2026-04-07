"use client";

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
import { getMockSession } from "@/lib/mock-auth";
import {
  buildStudentIdFromName,
  consumeLevelUpNotification,
  getExpProgress,
  getStudentProfile,
} from "@/lib/student-progression";

export default function StudentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const sessionName = getMockSession()?.name || "Student";
  const studentId = buildStudentIdFromName(sessionName);
  const profile = getStudentProfile(studentId, sessionName);
  const expProgress = getExpProgress(profile);
  const [levelUpMessage, setLevelUpMessage] = useState<string | null>(null);

  const handleGoToWorld = () => {
    setIsLoading(true);
    router.push("/world");
  };

  useEffect(() => {
    const message = consumeLevelUpNotification(studentId);
    if (message) setLevelUpMessage(message);
  }, [studentId]);

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

          {levelUpMessage && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {levelUpMessage}
            </div>
          )}

          <Card className="mb-8 border-cyan-200/60 bg-gradient-to-r from-cyan-50 to-blue-50">
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-600 text-lg font-bold text-white">
                    {sessionName.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-slate-900">
                      {sessionName} · Lv. {profile.level} · {profile.title}
                    </p>
                    <p className="text-sm text-slate-700">
                      EXP {expProgress.currentExp} / {expProgress.requiredExp}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  Latest Grade: {profile.latestGrade || "Not graded yet"}
                </p>
              </div>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                  style={{ width: `${Math.max(6, Math.round(expProgress.ratio * 100))}%` }}
                />
              </div>
            </CardContent>
          </Card>

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
                      {profile.level}
                    </div>
                    <p className="text-sm text-gray-600">Current Level</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success-600 mb-2">
                      {profile.exp}
                    </div>
                    <p className="text-sm text-gray-600">Total EXP</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning-600 mb-2">
                      {profile.gradeHistory.length}
                    </div>
                    <p className="text-sm text-gray-600">Assignments Graded</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-danger-600 mb-2">
                      {profile.title}
                    </div>
                    <p className="text-sm text-gray-600">Current Title</p>
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
