import { CreativeTask } from "@/lib/tasks";

const PRAISE_LINES = [
  "Nice choice! That already feels magical.",
  "Great idea! You are shaping a cool world.",
  "Lovely build! Your castle vibe is growing.",
  "Awesome step! That detail really helps.",
];

const NEXT_STEP_LINES = [
  "What could go beside it?",
  "Maybe add an entrance next?",
  "Could this area use height or decoration?",
  "What might make this feel more grand?",
];

export function getIntroLine(task: CreativeTask): string {
  return `Hi explorer! Today's mission is ${task.title}. ${task.prompt}`;
}

export function getStyleLine(style: string): string {
  if (!style.trim()) {
    return "Tell me a style idea, and we can gather matching build parts!";
  }
  return `Ooh, ${style} style! Let's gather shapes and decorations for your world.`;
}

export function getPlacementLine(placedLabel: string, count: number): string {
  const praise = PRAISE_LINES[count % PRAISE_LINES.length];
  const next = NEXT_STEP_LINES[count % NEXT_STEP_LINES.length];
  return `${praise} You placed ${placedLabel}. ${next}`;
}

export function getAskLine(question: string, style: string): string {
  const q = question.toLowerCase();
  if (q.includes("grand") || q.includes("big")) {
    return "To make it grand, try a tall tower, wide stairs, and a strong entrance gate.";
  }
  if (q.includes("egypt")) {
    return "For an Egyptian mood, use sandstone blocks, obelisks, and palm details near paths.";
  }
  if (q.includes("add") || q.includes("what else")) {
    return "You could add a gate, then decorate around it with torches and banners.";
  }
  if (style.trim()) {
    return `Try mixing ${style} landmarks with one nature item to make your scene feel alive.`;
  }
  return "Start with one centerpiece, then add two supporting details around it.";
}

interface BubbleSuggestionContext {
  task: CreativeTask;
  style: string;
  placedCount: number;
  latestObject?: string;
}

const EARLY_QUESTIONS = [
  "How about we start with a grand entrance?",
  "What kind of main shape should your castle have first?",
  "Could we place one main building to lead the scene?",
];

const MID_QUESTIONS = [
  "How about adding a tower near this area?",
  "What could go beside your latest structure?",
  "Would a path or gate make this part feel complete?",
];

const EGYPTIAN_QUESTIONS = [
  "How about we add some tall columns?",
  "Could an obelisk make this feel more Egyptian?",
  "What if we place a sandstone gate near the entrance?",
];

const FANTASY_QUESTIONS = [
  "How about some glowing towers?",
  "What could make this castle feel more magical?",
  "Would floating decorations fit your idea?",
];

export function getRockyBubbleSuggestion(
  context: BubbleSuggestionContext,
  index: number,
): string {
  const style = context.style.toLowerCase();
  const taskHint = context.task.title || "your mission";

  if (style.includes("egypt")) {
    return EGYPTIAN_QUESTIONS[index % EGYPTIAN_QUESTIONS.length];
  }

  if (style.includes("fantasy")) {
    return FANTASY_QUESTIONS[index % FANTASY_QUESTIONS.length];
  }

  if (context.placedCount <= 2) {
    return `${EARLY_QUESTIONS[index % EARLY_QUESTIONS.length]} (${taskHint})`;
  }

  if (context.latestObject) {
    const line = MID_QUESTIONS[index % MID_QUESTIONS.length];
    return `${line} After placing ${context.latestObject.toLowerCase()}, what comes next?`;
  }

  return MID_QUESTIONS[index % MID_QUESTIONS.length];
}
