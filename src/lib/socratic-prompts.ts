interface SocraticContext {
  style: string;
  placedCount: number;
  latestObject?: string;
}

const EARLY_PROMPTS = [
  "What is the main idea of your world, and which object shows that idea best?",
  "If someone saw this from far away, what shape would they notice first?",
  "Which part should be the hero piece, and why?",
];

const BALANCE_PROMPTS = [
  "Do the left and right sides feel balanced, or did you choose intentional asymmetry?",
  "Where is your tallest part, and how does it guide the eye?",
  "If this area feels crowded, which object could move to improve spacing?",
];

const STRUCTURE_PROMPTS = [
  "If this bridge or stair becomes longer, what would make it feel stable?",
  "Which object connects spaces together, and does that path feel clear?",
  "What support detail could make this structure feel stronger?",
];

const STYLE_PROMPTS = [
  "Which two details most clearly show your chosen style?",
  "How can color help the style feel more consistent across your build?",
  "What motif can repeat in different places without feeling repetitive?",
];

export function getSocraticPrompt(context: SocraticContext, promptIndex: number): string {
  const style = context.style.toLowerCase();
  const latest = context.latestObject?.toLowerCase() || "";

  if (latest.includes("bridge") || latest.includes("stairs") || latest.includes("gate")) {
    return STRUCTURE_PROMPTS[promptIndex % STRUCTURE_PROMPTS.length];
  }

  if (style.includes("egypt") || style.includes("asian") || style.includes("fantasy")) {
    return STYLE_PROMPTS[promptIndex % STYLE_PROMPTS.length];
  }

  if (context.placedCount <= 2) {
    return EARLY_PROMPTS[promptIndex % EARLY_PROMPTS.length];
  }

  return BALANCE_PROMPTS[promptIndex % BALANCE_PROMPTS.length];
}

