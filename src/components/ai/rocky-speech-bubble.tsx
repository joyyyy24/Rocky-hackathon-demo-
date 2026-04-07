"use client";

import { useState } from "react";

interface RockySpeechBubbleProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  onMoreIdeas: () => void;
  onAskRocky: (question: string) => Promise<string>;
  isAskingRocky?: boolean;
}

export function RockySpeechBubble({
  visible,
  message,
  onClose,
  onMoreIdeas,
  onAskRocky,
  isAskingRocky = false,
}: RockySpeechBubbleProps) {
  const [question, setQuestion] = useState("");

  const handleAsk = async () => {
    const trimmed = question.trim();
    if (!trimmed || isAskingRocky) return;
    await onAskRocky(trimmed);
    setQuestion("");
  };

  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 z-40"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="absolute right-[8%] top-[35%] w-[min(380px,90vw)] origin-bottom-right animate-[bubble-pop_220ms_ease-out] rounded-[26px] border border-amber-200/50 bg-[#1b2742]/97 px-5 py-4 text-slate-100 shadow-[0_16px_36px_rgba(2,6,23,0.5)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-label="Rocky suggestion bubble"
      >
        <div className="absolute -top-3 right-11 rounded-full border border-cyan-200/60 bg-gradient-to-r from-cyan-300 to-sky-400 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-slate-950 shadow-[0_4px_12px_rgba(56,189,248,0.45)]">
          💬 Ask
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 rounded-full border border-amber-200/40 bg-slate-800/75 px-2 text-xs font-bold text-amber-100 hover:bg-slate-700"
          aria-label="Close Rocky bubble"
        >
          ×
        </button>
        <p className="mb-3 pr-6 text-lg font-bold leading-snug text-slate-50">
          {message}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMoreIdeas}
            className="rounded-full border border-cyan-200/60 bg-gradient-to-r from-cyan-400 to-sky-500 px-3 py-1.5 text-sm font-bold text-slate-950 shadow-[0_5px_14px_rgba(14,165,233,0.35)] hover:brightness-105"
          >
            More ideas
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300/45 bg-slate-700/75 px-3 py-1.5 text-sm font-bold text-slate-100 hover:bg-slate-600/85"
          >
            Got it
          </button>
        </div>
        <div className="mt-3 rounded-xl border border-cyan-200/35 bg-slate-900/75 p-2">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-cyan-100">
            Ask Rocky
          </p>
          <div className="flex items-center gap-2">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="How can I improve this build?"
              className="h-9 flex-1 rounded-lg border border-slate-500 bg-slate-800/90 px-3 text-xs font-medium text-slate-50 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-cyan-400/60"
            />
            <button
              type="button"
              onClick={handleAsk}
              disabled={isAskingRocky || !question.trim()}
              className="h-9 rounded-lg border border-cyan-200/60 bg-gradient-to-r from-cyan-400 to-sky-500 px-3 text-xs font-bold text-slate-950 hover:brightness-105 disabled:cursor-not-allowed disabled:brightness-75 disabled:text-slate-800"
            >
              {isAskingRocky ? "Thinking..." : "Send"}
            </button>
          </div>
        </div>

        <div className="absolute -bottom-4 right-8 h-0 w-0 border-l-[14px] border-r-[14px] border-t-[18px] border-l-transparent border-r-transparent border-t-amber-200/50" />
        <div className="absolute -bottom-3 right-[35px] h-0 w-0 border-l-[11px] border-r-[11px] border-t-[14px] border-l-transparent border-r-transparent border-t-[#1b2742]" />

      </div>
    </div>
  );
}
