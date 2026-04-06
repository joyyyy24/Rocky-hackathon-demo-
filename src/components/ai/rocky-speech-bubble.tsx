"use client";

interface RockySpeechBubbleProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  onMoreIdeas: () => void;
}

export function RockySpeechBubble({
  visible,
  message,
  onClose,
  onMoreIdeas,
}: RockySpeechBubbleProps) {
  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 z-40"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="absolute right-[8%] top-[35%] w-[min(360px,88vw)] origin-bottom-right animate-[bubble-pop_220ms_ease-out] rounded-[26px] border-[3px] border-slate-800 bg-white px-4 py-4 text-slate-900 shadow-[0_12px_28px_rgba(15,23,42,0.35)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-label="Rocky suggestion bubble"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 rounded-full border border-slate-300 px-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
          aria-label="Close Rocky bubble"
        >
          ×
        </button>
        <p className="mb-3 pr-6 text-lg font-semibold leading-snug text-slate-800">
          {message}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMoreIdeas}
            className="rounded-full border border-cyan-300 bg-cyan-500/15 px-3 py-1.5 text-sm font-semibold text-cyan-800 hover:bg-cyan-500/25"
          >
            More ideas
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Got it
          </button>
        </div>

        <div className="absolute -bottom-4 right-8 h-0 w-0 border-l-[14px] border-r-[14px] border-t-[18px] border-l-transparent border-r-transparent border-t-slate-800" />
        <div className="absolute -bottom-3 right-[35px] h-0 w-0 border-l-[11px] border-r-[11px] border-t-[14px] border-l-transparent border-r-transparent border-t-white" />

      </div>
    </div>
  );
}
