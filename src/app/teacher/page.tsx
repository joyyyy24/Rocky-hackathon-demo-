"use client";

import { useEffect, useState } from "react";
import {
  getStudentsWithProgress,
  getClassSummary,
  getChallenges,
  getRecentActivity,
} from "@/lib/teacher-data";
import { SummaryCard } from "@/components/teacher/summary-card";
import { StudentList } from "@/components/teacher/student-list";
import { RecentActivity } from "@/components/teacher/recent-activity";
import { StudentDetailModal } from "@/components/teacher/student-detail-modal";
import { StudentWithProgress } from "@/lib/teacher-data";
import { RoleGuard } from "@/components/auth/role-guard";
import { CreativeTask, defaultCreativeTask, getActiveTask, saveActiveTask } from "@/lib/tasks";
import { getBuildSummary } from "@/lib/build-state";

export default function TeacherPage() {
  const [selectedStudent, setSelectedStudent] =
    useState<StudentWithProgress | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskDraft, setTaskDraft] = useState<CreativeTask>(defaultCreativeTask);
  const [isSaved, setIsSaved] = useState(false);
  const [latestBuild, setLatestBuild] = useState(getBuildSummary());

  const students = getStudentsWithProgress();
  const summary = getClassSummary();
  const challenges = getChallenges();
  const activities = getRecentActivity();

  const handleStudentClick = (student: StudentWithProgress) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  useEffect(() => {
    setTaskDraft(getActiveTask());
    setLatestBuild(getBuildSummary());
  }, []);

  const handleSaveTask = () => {
    saveActiveTask(taskDraft);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1800);
  };

  return (
    <RoleGuard requiredRole="teacher">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Teacher Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Monitoring view for class progress, completed zones, reflections,
              and current activity.
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Publish Today&apos;s Creative Task
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              This task is saved locally and shown to Student mode as the active mission.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Task Title
                </label>
                <input
                  value={taskDraft.title}
                  onChange={(event) =>
                    setTaskDraft((prev) => ({ ...prev, title: event.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Theme Examples
                </label>
                <input
                  value={taskDraft.themeExamples}
                  onChange={(event) =>
                    setTaskDraft((prev) => ({
                      ...prev,
                      themeExamples: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={taskDraft.description}
                onChange={(event) =>
                  setTaskDraft((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Starter Prompt
              </label>
              <textarea
                rows={2}
                value={taskDraft.prompt}
                onChange={(event) =>
                  setTaskDraft((prev) => ({ ...prev, prompt: event.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveTask}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Save & Publish
              </button>
              {isSaved && (
                <span className="text-sm font-medium text-green-600">
                  Saved! Student mission updated.
                </span>
              )}
            </div>
          </div>

          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Student Build Snapshot</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-gray-500">Current Task</p>
                <p className="font-semibold text-gray-900">{taskDraft.title}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-gray-500">Objects Placed</p>
                <p className="font-semibold text-gray-900">{latestBuild.objectsPlaced}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-gray-500">Latest Theme</p>
                <p className="font-semibold text-gray-900">{latestBuild.style || "Not set"}</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm">
              <p className="text-gray-500 mb-1">Latest Rocky Reflection</p>
              <p className="text-gray-900">{latestBuild.latestRockyLine}</p>
            </div>
          </div>

        {/* Summary Cards */}
        <div className="mb-8">
          <SummaryCard summary={summary} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student List - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <StudentList
              students={students}
              onStudentClick={handleStudentClick}
            />
          </div>

          {/* Recent Activity - Takes 1 column */}
          <div>
            <RecentActivity activities={activities} />
          </div>
        </div>

          {/* Student Detail Modal */}
          <StudentDetailModal
            studentWithProgress={selectedStudent}
            challenges={challenges}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        </div>
      </div>
    </RoleGuard>
  );
}
