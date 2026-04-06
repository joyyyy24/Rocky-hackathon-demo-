"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  getMockSession,
  ROLE_HOME,
  UserRole,
  type MockSession,
} from "@/lib/mock-auth";

interface RoleGuardProps {
  requiredRole?: UserRole;
  children: React.ReactNode;
}

export function RoleGuard({ requiredRole, children }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<MockSession | null | undefined>(
    undefined,
  );

  useEffect(() => {
    const currentSession = getMockSession();
    setSession(currentSession);

    if (!currentSession) {
      router.replace("/");
      return;
    }

    if (requiredRole && currentSession.role !== requiredRole) {
      router.replace(ROLE_HOME[currentSession.role]);
      return;
    }

    if (pathname === "/") {
      router.replace(ROLE_HOME[currentSession.role]);
    }
  }, [pathname, requiredRole, router]);

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-300">Loading role session...</p>
      </div>
    );
  }

  if (!session) return null;
  if (requiredRole && session.role !== requiredRole) return null;

  return <>{children}</>;
}
