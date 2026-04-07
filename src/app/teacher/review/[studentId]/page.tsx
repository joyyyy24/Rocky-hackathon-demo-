"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RoleGuard } from "@/components/auth/role-guard";
import WorldScene from "@/components/world/world-scene";
import { getStudentById } from "@/lib/teacher-data";
import { getLatestPublishedWorldByOwner } from "@/lib/world-storage";

export default function TeacherReviewWorldPage() {
  const params = useParams<{ studentId: string }>();
  const studentId = params?.studentId || "";

  const studentEntry = useMemo(() => getStudentById(studentId), [studentId]);
  const latestPublished = useMemo(
    () =>
      studentEntry
        ? getLatestPublishedWorldByOwner(studentEntry.student.name)
        : null,
    [studentEntry],
  );

  return (
    <RoleGuard requiredRole="teacher">
      <div className="relative h-[calc(100dvh-4rem)] overflow-hidden bg-gray-950">
        <div className="absolute left-4 top-20 z-40 rounded-xl border border-white/20 bg-slate-900/85 px-4 py-3 text-white backdrop-blur">
          <p className="text-xs uppercase tracking-widest text-cyan-200">
            Teacher Review Mode
          </p>
          <h1 className="text-base font-semibold">
            {studentEntry
              ? `Reviewing ${studentEntry.student.name}'s 3D World`
              : "Reviewing student 3D world"}
          </h1>
          <Link
            href="/teacher"
            className="mt-2 inline-block text-xs font-semibold text-cyan-300 hover:text-cyan-200"
          >
            ← Back to Teacher Dashboard
          </Link>
        </div>

        <WorldScene
          reviewMode={true}
          reviewStudentName={studentEntry?.student.name || ""}
          initialSnapshot={latestPublished}
        />
      </div>
    </RoleGuard>
  );
}
