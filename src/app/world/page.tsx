"use client";

import WorldScene from "@/components/world/world-scene";
import { RoleGuard } from "@/components/auth/role-guard";

export default function WorldPage() {
  return (
    <RoleGuard requiredRole="student">
      <div className="h-[calc(100dvh-4rem)] overflow-hidden">
        <WorldScene />
      </div>
    </RoleGuard>
  );
}
