export interface CreativeTask {
  title: string;
  description: string;
  prompt: string;
  themeExamples: string;
}

const TASK_STORAGE_KEY = "rocky_active_task";

export const defaultCreativeTask: CreativeTask = {
  title: "Dream Castle Challenge",
  description: "Build your dream castle world.",
  prompt:
    "Design a castle in a style you like and decorate its surroundings.",
  themeExamples: "Egyptian, Fantasy, Ice, Jungle",
};

export function getActiveTask(): CreativeTask {
  if (typeof window === "undefined") return defaultCreativeTask;

  const stored = localStorage.getItem(TASK_STORAGE_KEY);
  if (!stored) return defaultCreativeTask;

  try {
    const parsed = JSON.parse(stored) as Partial<CreativeTask>;
    return {
      title: parsed.title?.trim() || defaultCreativeTask.title,
      description: parsed.description?.trim() || defaultCreativeTask.description,
      prompt: parsed.prompt?.trim() || defaultCreativeTask.prompt,
      themeExamples:
        parsed.themeExamples?.trim() || defaultCreativeTask.themeExamples,
    };
  } catch {
    return defaultCreativeTask;
  }
}

export function saveActiveTask(task: CreativeTask) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(task));
}
