"use client";

import WorldScene from "@/components/world/world-scene";
import { RoleGuard } from "@/components/auth/role-guard";

export default function WorldPage() {
  return (
    <RoleGuard requiredRole="student">
      <div className="min-h-screen">
        <WorldScene />
      </div>
    </RoleGuard>
  );
}
