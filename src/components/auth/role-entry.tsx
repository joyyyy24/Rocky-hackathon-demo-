"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getMockSession,
  ROLE_HOME,
  ROLE_LABELS,
  setMockSession,
  type UserRole,
} from "@/lib/mock-auth";

const roleCards: Array<{
  role: UserRole;
  icon: string;
  subtitle: string;
  sampleName: string;
}> = [
  {
    role: "student",
    icon: "🎮",
    subtitle: "Enter the 3D learning world, complete Science mission, unlock zones.",
    sampleName: "Ava",
  },
  {
    role: "teacher",
    icon: "📋",
    subtitle: "Monitor class progress, completed zones, reflections, current activity.",
    sampleName: "Ms. Chen",
  },
  {
    role: "parent",
    icon: "🌟",
    subtitle: "View child progress in a simple, read-only summary page.",
    sampleName: "Emma's Parent",
  },
];

export function RoleEntry() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const session = getMockSession();
    if (session) {
      router.replace(ROLE_HOME[session.role]);
      return;
    }
    setIsReady(true);
  }, [router]);

  const handleEnter = (role: UserRole, sampleName: string) => {
    const finalName = name.trim() || sampleName;
    setMockSession(role, finalName);
    router.push(ROLE_HOME[role]);
  };

  if (!isReady) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-300">Preparing your entry portal...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-game-sky text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <section className="text-center mb-10">
          <p className="inline-flex rounded-full border border-cyan-200/30 bg-cyan-500/10 px-4 py-1 text-sm font-semibold text-cyan-100 mb-5">
            Rocky MVP Entry
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Welcome to Rocky
          </h1>
          <p className="max-w-3xl mx-auto text-slate-200 text-lg">
            Choose your role to enter the right experience. This is a lightweight
            mock login for demo flow testing.
          </p>
        </section>

        <section className="max-w-xl mx-auto mb-10">
          <label
            htmlFor="display-name"
            className="block text-sm font-semibold text-slate-200 mb-2"
          >
            Name (optional)
          </label>
          <input
            id="display-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Try: Ava, Ms. Chen, Emma's Parent"
            className="w-full rounded-xl border border-cyan-200/25 bg-slate-900/70 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-cyan-400/50"
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roleCards.map((card) => (
            <Card
              key={card.role}
              className="card-3d border-cyan-200/20 bg-slate-900/70 text-white backdrop-blur-sm"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-cyan-300/20 border border-cyan-200/30 flex items-center justify-center mb-4 text-2xl">
                  {card.icon}
                </div>
                <CardTitle>{ROLE_LABELS[card.role]}</CardTitle>
                <CardDescription className="text-slate-300">
                  {card.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
                  onClick={() => handleEnter(card.role, card.sampleName)}
                >
                  Enter as {ROLE_LABELS[card.role]}
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
