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
    <nav className="sticky top-0 z-50 border-b border-indigo-200/20 bg-[#18233d]/96 shadow-[0_8px_24px_rgba(7,12,28,0.38)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_14px_rgba(56,189,248,0.6)] pulse-glow">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-xl text-slate-50 tracking-wide">Rocky</span>
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
                    "flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border",
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/30 to-sky-500/25 text-sky-100 border-cyan-300/60 shadow-[0_0_14px_rgba(56,189,248,0.32)]"
                      : "text-slate-100 border-slate-500/50 bg-slate-800/70 hover:text-white hover:border-cyan-300/45 hover:bg-slate-700/85",
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              type="button"
              className="ml-2 rounded-xl border border-rose-300/50 bg-rose-500/20 px-3 py-2 text-sm font-semibold text-rose-50 transition-all duration-200 hover:bg-rose-500/35 hover:border-rose-300/70"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="p-2 rounded-md text-slate-100 hover:text-white hover:bg-slate-700">
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
          <p className="text-xs text-slate-100">
            Signed in as{" "}
            <span className="font-semibold text-cyan-200">
              {userName || ROLE_LABELS[role]}
            </span>{" "}
            <span className="text-slate-200">({ROLE_LABELS[role]} mode)</span>
          </p>
        </div>
      </div>
    </nav>
  );
}
