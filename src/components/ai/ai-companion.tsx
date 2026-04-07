"use client";

interface AICompanionProps {
  subtitle: string;
}

export default function AICompanion({ subtitle }: AICompanionProps) {
  return (
    <>
      <div
        className="pointer-events-none absolute top-4 left-1/2 z-20 w-[92%] max-w-3xl -translate-x-1/2 rounded-2xl border border-cyan-200/35 bg-[#17243d]/95 px-5 py-3 text-center text-sm font-semibold text-slate-50 shadow-[0_12px_30px_rgba(7,14,33,0.45)] backdrop-blur-md transition-opacity duration-300"
      >
        <p className="text-base tracking-[0.01em]">{subtitle}</p>
      </div>
    </>
  );
}
