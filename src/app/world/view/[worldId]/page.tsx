"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { RoleGuard } from "@/components/auth/role-guard";
import WorldScene from "@/components/world/world-scene";
import { getPublishedWorldById } from "@/lib/world-storage";
import { getRubricAverage, getWorldRubric } from "@/lib/review-rubric";
import { getMockClassmateWorldById } from "@/lib/mock-classmate-worlds";

export default function PublishedWorldPage() {
  const params = useParams<{ worldId: string }>();
  const worldId = params?.worldId || "";
  const snapshot = useMemo(
    () => getPublishedWorldById(worldId) || getMockClassmateWorldById(worldId),
    [worldId],
  );
  const rubric = useMemo(() => getWorldRubric(worldId), [worldId]);

  return (
    <RoleGuard>
      <div className="relative h-[calc(100dvh-4rem)] overflow-hidden bg-slate-950">
        <div className="absolute left-4 top-20 z-40 rounded-xl border border-white/20 bg-slate-900/85 px-4 py-3 text-white backdrop-blur">
          <p className="text-xs uppercase tracking-widest text-cyan-200">
            Published World
          </p>
          <h1 className="text-base font-semibold">
            {snapshot
              ? `${snapshot.ownerName}'s World`
              : "Published student world"}
          </h1>
          <Link
            href="/student"
            className="mt-2 inline-block text-xs font-semibold text-cyan-300 hover:text-cyan-200"
          >
            ← Back
          </Link>
        </div>
        {rubric && (
          <div className="absolute left-4 top-52 z-40 w-[min(360px,88vw)] rounded-xl border border-emerald-200/30 bg-slate-900/85 px-4 py-3 text-white backdrop-blur">
            <p className="text-[11px] uppercase tracking-widest text-emerald-200">
              Teacher Rubric
            </p>
            <p className="text-sm font-semibold text-emerald-100">
              Avg {getRubricAverage(rubric.scores).toFixed(1)} / 4
            </p>
            <p className="mt-1 text-xs text-slate-200">
              C {rubric.scores.creativity} • S {rubric.scores.structure} • T {rubric.scores.taskCompletion} • E {rubric.scores.expression}
            </p>
            <p className="mt-2 text-xs text-slate-200">{rubric.feedback || "No feedback yet."}</p>
          </div>
        )}
        <WorldScene
          reviewMode={true}
          reviewStudentName={snapshot?.ownerName || ""}
          initialSnapshot={snapshot}
        />
      </div>
    </RoleGuard>
  );
}
