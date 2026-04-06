"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { RoleGuard } from "@/components/auth/role-guard";
import WorldScene from "@/components/world/world-scene";
import { getPublishedWorldById } from "@/lib/world-storage";

export default function PublishedWorldPage() {
  const params = useParams<{ worldId: string }>();
  const worldId = params?.worldId || "";
  const snapshot = useMemo(() => getPublishedWorldById(worldId), [worldId]);

  return (
    <RoleGuard>
      <div className="min-h-screen bg-slate-950">
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
        <WorldScene
          reviewMode={true}
          reviewStudentName={snapshot?.ownerName || ""}
          initialSnapshot={snapshot}
        />
      </div>
    </RoleGuard>
  );
}
