import { BuildAsset } from "@/lib/asset-generator";
import { getMockSession } from "@/lib/mock-auth";

export interface StoredPlacedAsset {
  id: string;
  asset: BuildAsset;
  position: { x: number; y: number; z: number };
  gridX: number;
  gridZ: number;
  scale: number;
  rotationY: number;
}

export interface WorldSnapshot {
  id: string;
  ownerName: string;
  title: string;
  taskTitle: string;
  style: string;
  placedAssets: StoredPlacedAsset[];
  updatedAt: string;
  publishedAt?: string;
}

const DRAFTS_KEY = "rocky_world_drafts";
const PUBLISHED_KEY = "rocky_published_worlds";

function loadMap(): Record<string, WorldSnapshot> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(DRAFTS_KEY) || "{}") as Record<
      string,
      WorldSnapshot
    >;
  } catch {
    return {};
  }
}

function saveMap(map: Record<string, WorldSnapshot>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(map));
}

function loadPublished(): WorldSnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(PUBLISHED_KEY) || "[]") as WorldSnapshot[];
  } catch {
    return [];
  }
}

function savePublished(list: WorldSnapshot[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PUBLISHED_KEY, JSON.stringify(list));
}

function ownerKey() {
  const session = getMockSession();
  const name = session?.name?.trim() || "Student";
  return name.toLowerCase().replace(/\s+/g, "-");
}

function ownerName() {
  const session = getMockSession();
  return session?.name?.trim() || "Student";
}

export function loadCurrentStudentDraft(): WorldSnapshot | null {
  const map = loadMap();
  return map[ownerKey()] || null;
}

export function saveCurrentStudentDraft(
  input: Omit<WorldSnapshot, "id" | "ownerName" | "updatedAt">,
) {
  const map = loadMap();
  const key = ownerKey();
  const current = map[key];
  map[key] = {
    id: current?.id || key,
    ownerName: ownerName(),
    title: input.title,
    taskTitle: input.taskTitle,
    style: input.style,
    placedAssets: input.placedAssets,
    updatedAt: new Date().toISOString(),
    publishedAt: current?.publishedAt,
  };
  saveMap(map);
  return map[key];
}

export function publishCurrentStudentWorld() {
  const draft = loadCurrentStudentDraft();
  if (!draft) return null;

  const published = loadPublished();
  const snapshot: WorldSnapshot = {
    ...draft,
    publishedAt: new Date().toISOString(),
  };

  const next = [snapshot, ...published.filter((item) => item.id !== snapshot.id)];
  savePublished(next);

  const map = loadMap();
  map[snapshot.id] = snapshot;
  saveMap(map);

  return snapshot;
}

export function getPublishedWorlds() {
  return loadPublished();
}

export function getPublishedWorldById(worldId: string) {
  return loadPublished().find((item) => item.id === worldId) || null;
}

export function getLatestPublishedWorldByOwner(owner: string) {
  return (
    loadPublished()
      .filter((item) => item.ownerName === owner)
      .sort((a, b) => +new Date(b.publishedAt || b.updatedAt) - +new Date(a.publishedAt || a.updatedAt))[0] ||
    null
  );
}
