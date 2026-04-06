"use client";

import { useState } from "react";

interface AICompanionProps {
  subtitle: string;
  onAskRocky: (question: string) => void;
}

export default function AICompanion({ subtitle, onAskRocky }: AICompanionProps) {
  const [isAskOpen, setIsAskOpen] = useState(false);
  const [question, setQuestion] = useState("");

  const handleSubmitAsk = () => {
    if (!question.trim()) return;
    onAskRocky(question.trim());
    setQuestion("");
    setIsAskOpen(false);
  };

  return (
    <>
      <div
        className="pointer-events-none absolute top-4 left-1/2 z-20 w-[92%] max-w-3xl -translate-x-1/2 rounded-2xl border border-cyan-200/35 bg-slate-950/75 px-4 py-3 text-center text-sm font-medium text-cyan-50 backdrop-blur-md transition-opacity duration-300"
      >
        <p className="text-base">{subtitle}</p>
      </div>

      <div className="absolute right-4 bottom-4 z-20">
        <button
          type="button"
          onClick={() => setIsAskOpen(true)}
          className="rounded-full border border-cyan-200/50 bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-50 shadow-md transition-all hover:bg-cyan-500/35"
        >
          Ask Rocky
        </button>
      </div>

      {isAskOpen && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-cyan-200/35 bg-slate-900/95 p-5 text-white">
            <h3 className="text-lg font-bold mb-2">Need ideas?</h3>
            <p className="text-sm text-slate-300 mb-3">
              Ask Rocky for inspiration. Example: &quot;What else can I add?&quot;
            </p>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400/50"
              placeholder="How can I make it look more Egyptian?"
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAskOpen(false)}
                className="rounded-lg border border-slate-500 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitAsk}
                className="rounded-lg bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Send to Rocky
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
