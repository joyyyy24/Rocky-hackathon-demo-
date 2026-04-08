"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getStudentsWithProgress,
  getClassSummary,
  getRecentActivity,
} from "@/lib/teacher-data";
import { SummaryCard } from "@/components/teacher/summary-card";
import { StudentList } from "@/components/teacher/student-list";
import { RecentActivity } from "@/components/teacher/recent-activity";
import { StudentWithProgress } from "@/lib/teacher-data";
import { RoleGuard } from "@/components/auth/role-guard";
import { CreativeTask, defaultCreativeTask, getActiveTask, saveActiveTask } from "@/lib/tasks";
import { getPublishedWorlds, WorldSnapshot } from "@/lib/world-storage";
import {
  getRubricAverage,
  getWorldRubric,
  saveWorldRubric,
  type RubricScores,
} from "@/lib/review-rubric";
import { getMockSession } from "@/lib/mock-auth";
import {
  AssignmentGrade,
  buildStudentIdFromName,
  getExpForGrade,
  getExpProgress,
  getStudentProfile,
  gradeStudentAssignment,
} from "@/lib/student-progression";

export default function TeacherPage() {
  const router = useRouter();
  const [taskDraft, setTaskDraft] = useState<CreativeTask>(defaultCreativeTask);
  const [isSaved, setIsSaved] = useState(false);
  const [publishedWorlds, setPublishedWorlds] = useState<WorldSnapshot[]>([]);
  const [activeRubricWorldId, setActiveRubricWorldId] = useState<string | null>(null);
  const [rubricScores, setRubricScores] = useState<RubricScores>({
    creativity: 3,
    structure: 3,
    taskCompletion: 3,
    expression: 3,
  });
  const [rubricFeedback, setRubricFeedback] = useState("");
  const [rubricSavedWorldId, setRubricSavedWorldId] = useState<string | null>(null);
  const [gradedWorldId, setGradedWorldId] = useState<string | null>(null);

  const students = getStudentsWithProgress();
  const summary = getClassSummary();
  const activities = getRecentActivity();
  const studentProgressionMap = students.reduce<Record<string, ReturnType<typeof getStudentProfile>>>(
    (acc, entry) => {
      const id = buildStudentIdFromName(entry.student.name);
      acc[entry.student.id] = getStudentProfile(id, entry.student.name);
      return acc;
    },
    {},
  );

  const handleStudentClick = (student: StudentWithProgress) => {
    router.push(`/teacher/review/${student.student.id}`);
  };

  useEffect(() => {
    setTaskDraft(getActiveTask());
    setPublishedWorlds(getPublishedWorlds());
  }, []);

  const handleSaveTask = () => {
    saveActiveTask(taskDraft);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1800);
  };

  const openRubric = (world: WorldSnapshot) => {
    const current = getWorldRubric(world.id);
    setActiveRubricWorldId(world.id);
    setRubricScores(
      current?.scores || {
        creativity: 3,
        structure: 3,
        taskCompletion: 3,
        expression: 3,
      },
    );
    setRubricFeedback(current?.feedback || "");
    setRubricSavedWorldId(null);
  };

  const saveRubric = (world: WorldSnapshot) => {
    const teacherName = getMockSession()?.name || "Teacher";
    saveWorldRubric({
      worldId: world.id,
      teacherName,
      scores: rubricScores,
      feedback: rubricFeedback,
    });
    setRubricSavedWorldId(world.id);
    setTimeout(() => setRubricSavedWorldId(null), 1500);
  };

  const gradeWorld = (world: WorldSnapshot, grade: AssignmentGrade) => {
    const teacherName = getMockSession()?.name || "Teacher";
    const studentName = world.ownerName || "Student";
    const studentId = buildStudentIdFromName(studentName);
    gradeStudentAssignment({
      studentId,
      studentName,
      assignmentId: world.id,
      assignmentTitle: world.taskTitle || "Creative Assignment",
      grade,
      teacherName,
    });
    setGradedWorldId(world.id);
    setTimeout(() => setGradedWorldId(null), 1800);
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
            <h2 className="text-xl font-bold text-gray-900 mb-3">Published Student Worlds</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {publishedWorlds.length === 0 && (
                <p className="text-sm text-gray-600">
                  No published worlds yet. Students can publish from the world editor.
                </p>
              )}
              {publishedWorlds.slice(0, 6).map((world) => {
                const profile = getStudentProfile(
                  buildStudentIdFromName(world.ownerName),
                  world.ownerName,
                );
                const expProgress = getExpProgress(profile);
                return (
                <div
                  key={world.id}
                  className="rounded-xl border border-slate-200 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{world.ownerName}</p>
                      <p className="text-xs text-gray-600">
                        {world.style || "No style"} • {world.placedAssets.length} objects
                      </p>
                      <p className="mt-1 text-xs font-semibold text-indigo-700">
                        Lv. {profile.level} · {profile.title}
                      </p>
                      <p className="text-[11px] text-slate-600">
                        EXP {expProgress.currentExp}/{expProgress.requiredExp} · Total {profile.exp}
                      </p>
                      <div className="mt-1 h-1.5 w-40 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${Math.max(6, Math.round(expProgress.ratio * 100))}%` }}
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Latest Grade: {profile.latestGrade || "Not graded"}
                      </p>
                      {getWorldRubric(world.id) && (
                        <p className="mt-1 text-xs font-semibold text-emerald-700">
                          Rubric: {getRubricAverage(getWorldRubric(world.id)!.scores).toFixed(1)} / 4
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1">
                        {(["A", "B", "C", "D"] as AssignmentGrade[]).map((grade) => (
                          <button
                            key={grade}
                            type="button"
                            onClick={() => gradeWorld(world, grade)}
                            className="rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100"
                            title={`Grade ${grade} (+${getExpForGrade(grade)} EXP)`}
                          >
                            {grade}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => openRubric(world)}
                        className="rounded-lg border border-indigo-300 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-500/20"
                      >
                        Rubric
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push(`/world/view/${world.id}`)}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        Open World
                      </button>
                    </div>
                  </div>
                  {gradedWorldId === world.id && (
                    <p className="mt-2 text-xs font-semibold text-emerald-700">
                      Grade saved. Progression updated.
                    </p>
                  )}
                  {activeRubricWorldId === world.id && (
                    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Teacher Rubric (1-4)
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {(
                          [
                            ["creativity", "Creativity"],
                            ["structure", "Structure"],
                            ["taskCompletion", "Task Completion"],
                            ["expression", "Expression"],
                          ] as const
                        ).map(([key, label]) => (
                          <label key={key} className="rounded-md bg-white p-2">
                            <span className="block text-slate-600">{label}</span>
                            <select
                              value={rubricScores[key]}
                              onChange={(event) =>
                                setRubricScores((prev) => ({
                                  ...prev,
                                  [key]: Number(event.target.value),
                                }))
                              }
                              className="mt-1 w-full rounded border border-slate-300 px-2 py-1"
                            >
                              {[1, 2, 3, 4].map((n) => (
                                <option key={n} value={n}>
                                  {n}
                                </option>
                              ))}
                            </select>
                          </label>
                        ))}
                      </div>
                      <label className="mt-2 block text-xs text-slate-600">
                        One-line feedback
                        <textarea
                          rows={2}
                          value={rubricFeedback}
                          onChange={(event) => setRubricFeedback(event.target.value)}
                          className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs"
                          placeholder="Strong style consistency. Try clearer path connections next."
                        />
                      </label>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => saveRubric(world)}
                          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                        >
                          Save Rubric
                        </button>
                        {rubricSavedWorldId === world.id && (
                          <span className="text-xs font-semibold text-emerald-600">
                            Saved
                          </span>
                        )}
                        <span className="text-xs text-slate-500">
                          Avg {getRubricAverage(rubricScores).toFixed(1)} / 4
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )})}
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
              progressionMap={studentProgressionMap}
              onStudentClick={handleStudentClick}
            />
          </div>

          {/* Recent Activity - Takes 1 column */}
          <div>
            <RecentActivity activities={activities} />
          </div>
        </div>

        </div>
      </div>
    </RoleGuard>
  );
}
