export interface RubricScores {
  creativity: number;
  structure: number;
  taskCompletion: number;
  expression: number;
}

export interface WorldRubric {
  worldId: string;
  teacherName: string;
  scores: RubricScores;
  feedback: string;
  updatedAt: string;
}

const RUBRIC_KEY = "rocky_world_rubrics";

function loadRubrics(): Record<string, WorldRubric> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(RUBRIC_KEY) || "{}") as Record<
      string,
      WorldRubric
    >;
  } catch {
    return {};
  }
}

function saveRubrics(map: Record<string, WorldRubric>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(RUBRIC_KEY, JSON.stringify(map));
}

export function getWorldRubric(worldId: string) {
  return loadRubrics()[worldId] || null;
}

export function saveWorldRubric(input: Omit<WorldRubric, "updatedAt">) {
  const map = loadRubrics();
  map[input.worldId] = {
    ...input,
    updatedAt: new Date().toISOString(),
  };
  saveRubrics(map);
  return map[input.worldId];
}

export function getRubricAverage(scores: RubricScores) {
  return (
    (scores.creativity +
      scores.structure +
      scores.taskCompletion +
      scores.expression) /
    4
  );
}

