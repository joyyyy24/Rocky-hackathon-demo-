import type { WorldSnapshot } from "@/lib/world-storage";

const now = new Date().toISOString();

export const MOCK_CLASSMATE_WORLDS: WorldSnapshot[] = [
  {
    id: "mock-world-ava-sky-castle",
    ownerName: "Ava",
    title: "Sky Lantern Castle",
    taskTitle: "Dream Castle Challenge",
    style: "magical asian sky castle",
    updatedAt: now,
    publishedAt: now,
    placedAssets: [
      {
        id: "a1",
        asset: {
          id: "gate-ava",
          label: "Moon Gate",
          type: "gate",
          color: "#b993d6",
          accent: "#f7d9ff",
          templateKey: "gate_arch",
        },
        position: { x: 0, y: -0.1, z: 0 },
        gridX: 6,
        gridZ: 6,
        scale: 1,
        rotationY: 0,
      },
      {
        id: "a2",
        asset: {
          id: "tower-ava",
          label: "Lantern Tower",
          type: "tower",
          color: "#8d7bcf",
          accent: "#ffdca8",
          templateKey: "tower_square",
        },
        position: { x: 2, y: -0.1, z: -1 },
        gridX: 8,
        gridZ: 5,
        scale: 1,
        rotationY: 0,
      },
      {
        id: "a3",
        asset: {
          id: "bridge-ava",
          label: "Cloud Bridge",
          type: "stairs",
          color: "#8fc2e6",
          accent: "#e6f7ff",
          templateKey: "bridge_ceremonial",
        },
        position: { x: -2, y: -0.1, z: 1 },
        gridX: 4,
        gridZ: 7,
        scale: 1,
        rotationY: Math.PI / 2,
      },
    ],
  },
  {
    id: "mock-world-liam-desert-fort",
    ownerName: "Liam",
    title: "Golden Desert Fort",
    taskTitle: "Dream Castle Challenge",
    style: "egyptian desert fortress",
    updatedAt: now,
    publishedAt: now,
    placedAssets: [
      {
        id: "l1",
        asset: {
          id: "obelisk-liam",
          label: "Royal Obelisk",
          type: "column",
          color: "#d8b46e",
          accent: "#f5e2b3",
          templateKey: "obelisk_tall",
        },
        position: { x: 1, y: -0.1, z: -1 },
        gridX: 7,
        gridZ: 5,
        scale: 1,
        rotationY: 0,
      },
      {
        id: "l2",
        asset: {
          id: "stairs-liam",
          label: "Temple Stairs",
          type: "stairs",
          color: "#c79b59",
          accent: "#e8c48c",
          templateKey: "stairs_broad",
        },
        position: { x: -1, y: -0.1, z: 0 },
        gridX: 5,
        gridZ: 6,
        scale: 1,
        rotationY: 0,
      },
      {
        id: "l3",
        asset: {
          id: "statue-liam",
          label: "Sun Guardian",
          type: "statue",
          color: "#b68f52",
          accent: "#f5d28f",
          templateKey: "statue_guardian",
        },
        position: { x: 0, y: -0.1, z: 2 },
        gridX: 6,
        gridZ: 8,
        scale: 1,
        rotationY: 0,
      },
    ],
  },
  {
    id: "mock-world-sophia-forest-palace",
    ownerName: "Sophia",
    title: "Emerald Forest Palace",
    taskTitle: "Dream Castle Challenge",
    style: "forest fantasy palace",
    updatedAt: now,
    publishedAt: now,
    placedAssets: [
      {
        id: "s1",
        asset: {
          id: "tree-sophia",
          label: "Sacred Grove",
          type: "tree",
          color: "#5f9f6b",
          accent: "#9dd6a2",
          templateKey: "palm_cluster",
        },
        position: { x: -2, y: -0.1, z: -1 },
        gridX: 4,
        gridZ: 5,
        scale: 1,
        rotationY: 0,
      },
      {
        id: "s2",
        asset: {
          id: "roof-sophia",
          label: "Leaf Roof Hall",
          type: "roof",
          color: "#4f8d59",
          accent: "#b5e9bf",
          templateKey: "roof_layered",
        },
        position: { x: 0, y: -0.1, z: 0 },
        gridX: 6,
        gridZ: 6,
        scale: 1,
        rotationY: 0,
      },
      {
        id: "s3",
        asset: {
          id: "pond-sophia",
          label: "Crystal Pond",
          type: "pond",
          color: "#5bb8cf",
          accent: "#b7f0ff",
          templateKey: "crystal_pond",
        },
        position: { x: 2, y: -0.1, z: 1 },
        gridX: 8,
        gridZ: 7,
        scale: 1,
        rotationY: 0,
      },
    ],
  },
];

export function getMockClassmateWorlds() {
  return MOCK_CLASSMATE_WORLDS;
}

export function getMockClassmateWorldById(worldId: string) {
  return MOCK_CLASSMATE_WORLDS.find((item) => item.id === worldId) || null;
}

