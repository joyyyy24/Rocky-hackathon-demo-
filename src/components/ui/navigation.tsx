"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  clearMockSession,
  getMockSession,
  ROLE_LABELS,
  type UserRole,
} from "@/lib/mock-auth";
import { useRouter } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: string;
}

const roleNavItems: Record<UserRole, NavItem[]> = {
  student: [
    { href: "/world", label: "World", description: "3D Experience", icon: "🌍" },
    {
      href: "/student",
      label: "Progress",
      description: "My Learning",
      icon: "📈",
    },
  ],
  teacher: [
    {
      href: "/teacher",
      label: "Teacher Dashboard",
      description: "Monitor Class",
      icon: "📋",
    },
  ],
  parent: [
    {
      href: "/parent",
      label: "Parent View",
      description: "Read-only Progress",
      icon: "🌟",
    },
  ],
};

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const session = getMockSession();
    if (!session) {
      setRole(null);
      setUserName("");
      return;
    }
    setRole(session.role);
    setUserName(session.name);
  }, [pathname]);

  const itemsToShow = useMemo(() => {
    if (!role) return [];
    return roleNavItems[role];
  }, [role]);

  const handleLogout = () => {
    clearMockSession();
    router.push("/");
  };

  if (pathname === "/" || !role) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-cyan-200/20 bg-slate-900/75 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40 pulse-glow">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-xl text-white tracking-wide">Rocky</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {itemsToShow.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-cyan-400/30 to-blue-500/30 text-cyan-100 border border-cyan-300/50 shadow-md shadow-cyan-500/20"
                      : "text-slate-200 hover:text-white hover:bg-slate-700/60",
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              type="button"
              className="ml-2 rounded-xl border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-100 transition-all duration-200 hover:bg-rose-500/20"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="pb-2">
          <p className="text-xs text-slate-300">
            Signed in as{" "}
            <span className="font-semibold text-cyan-100">
              {userName || ROLE_LABELS[role]}
            </span>{" "}
            ({ROLE_LABELS[role]} mode)
          </p>
        </div>
      </div>
    </nav>
  );
}
