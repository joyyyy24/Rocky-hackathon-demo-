export interface BuildSummary {
  style: string;
  objectsPlaced: number;
  latestObject: string;
  latestRockyLine: string;
  reflections: number;
  completionStatus: "not-started" | "in-progress" | "completed";
  updatedAt: string;
}

const SUMMARY_STORAGE_KEY = "rocky_build_summary";

export const defaultBuildSummary: BuildSummary = {
  style: "",
  objectsPlaced: 0,
  latestObject: "None yet",
  latestRockyLine: "Rocky is ready to help!",
  reflections: 0,
  completionStatus: "not-started",
  updatedAt: new Date().toISOString(),
};

export function getBuildSummary(): BuildSummary {
  if (typeof window === "undefined") return defaultBuildSummary;

  const stored = localStorage.getItem(SUMMARY_STORAGE_KEY);
  if (!stored) return defaultBuildSummary;

  try {
    const parsed = JSON.parse(stored) as Partial<BuildSummary>;
    return {
      style: parsed.style || "",
      objectsPlaced: parsed.objectsPlaced || 0,
      latestObject: parsed.latestObject || "None yet",
      latestRockyLine: parsed.latestRockyLine || "Rocky is ready to help!",
      reflections: parsed.reflections || 0,
      completionStatus: parsed.completionStatus || "not-started",
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch {
    return defaultBuildSummary;
  }
}

export function saveBuildSummary(summary: BuildSummary) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SUMMARY_STORAGE_KEY, JSON.stringify(summary));
}
