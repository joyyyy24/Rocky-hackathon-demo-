"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PointerLockControls } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FloatingIsland } from "./floating-island";
import { AICompanion3D } from "../ai/ai-companion-3d";
import AICompanion from "../ai/ai-companion";
import { RockySpeechBubble } from "../ai/rocky-speech-bubble";
import { BuildAsset, generateAssetSet } from "@/lib/asset-generator";
import {
  CreativeBuildArea,
  FLOOR_THEMES,
  type FloorThemeId,
  PlacedAsset,
} from "./creative-build-area";
import { CreativeTask, defaultCreativeTask, getActiveTask } from "@/lib/tasks";
import {
  getAskLine,
  getIntroLine,
  getPlacementLine,
  getRockyBubbleSuggestion,
  getStyleLine,
} from "@/lib/companion-script";
import { getBuildSummary, saveBuildSummary } from "@/lib/build-state";
import { Vector3 } from "three";
import {
  loadCurrentStudentDraft,
  getPublishedWorlds,
  publishCurrentStudentWorld,
  saveCurrentStudentDraft,
  type WorldSnapshot,
} from "@/lib/world-storage";
import type { StylePack } from "@/lib/ai-asset-pipeline";
import { getMockSession } from "@/lib/mock-auth";
import { getMockClassmateWorlds } from "@/lib/mock-classmate-worlds";
import {
  buildStudentIdFromName,
  consumeLevelUpNotification,
  getStudentProfile,
} from "@/lib/student-progression";

function shortAssetName(name: string): string {
  if (name.length <= 11) return name;
  return `${name.slice(0, 10)}…`;
}

const BLOCK_COLOR_SWATCHES = [
  "#d6b36a",
  "#b08ad9",
  "#7ea3d8",
  "#8bcf8a",
  "#ef8aa1",
  "#f59e0b",
  "#22c55e",
  "#0ea5e9",
  "#6366f1",
  "#f43f5e",
  "#a3a3a3",
  "#111827",
];

const FLOOR_PAINT_OPTIONS = [
  "#6eb56f",
  "#d4bd93",
  "#9aa0aa",
  "#b35e47",
  "#836047",
  "#f4f3ef",
  "#4165be",
  "#8658be",
];

function buildCoreBlock(color: string): BuildAsset {
  return {
    id: "core-build-block",
    label: "Build Block",
    type: "block",
    color,
    accent: "#f3f4f6",
    templateKey: "core_block",
    category: "structure",
    silhouette: "cube",
    previewShape: "core-block",
    sizeClass: "medium",
    material: "stone",
  };
}

function withCoreBlock(list: BuildAsset[], coreBlock: BuildAsset): BuildAsset[] {
  const withoutCore = list.filter((item) => item.id !== coreBlock.id);
  return [coreBlock, ...withoutCore].slice(0, 10);
}

interface AssetApiResponse {
  assets?: BuildAsset[];
  stylePack?: StylePack;
  fallback?: boolean;
}

async function generateAssetsWithAI(
  style: string,
  customRequest = "",
  existingAssets: BuildAsset[] = [],
  mode: "apply" | "add" | "refresh" = "refresh",
  stylePack?: StylePack | null,
): Promise<AssetApiResponse | null> {
  const refreshNonce = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  const response = await fetch("/api/assets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      style,
      customRequest,
      mode,
      count: 10,
      refreshNonce,
      stylePack: stylePack || undefined,
      existingAssets: existingAssets.map((asset) => ({
        id: asset.id,
        label: asset.label,
        type: asset.type,
        category: asset.category,
        silhouette: asset.silhouette,
      })),
    }),
  });

  if (!response.ok) return null;
  const data = (await response.json()) as AssetApiResponse;
  if (!Array.isArray(data.assets) || data.assets.length === 0) return null;
  return data;
}

function HotbarAssetPreview({ asset }: { asset: BuildAsset }) {
  const baseStyle = { backgroundColor: asset.color };
  const accentStyle = { backgroundColor: asset.accent };
  const label = asset.label.toLowerCase();
  const previewKey = (asset.previewShape || asset.templateKey || asset.type).toLowerCase();

  const columnPreview = (() => {
    if (label.includes("obelisk") || label.includes("spire") || label.includes("minaret")) {
      return <div className="h-11 w-2 rounded-full shadow" style={baseStyle} />;
    }
    if (label.includes("pillar") || label.includes("colonnade") || label.includes("portico")) {
      return <div className="h-6 w-5 rounded-md shadow" style={baseStyle} />;
    }
    return <div className="h-9 w-3 rounded-full shadow" style={baseStyle} />;
  })();

  const shapeByType: Record<BuildAsset["type"], JSX.Element> = {
    block: <div className="h-8 w-8 rounded-sm shadow" style={baseStyle} />,
    column: columnPreview,
    roof: (
      <div
        className="h-0 w-0 border-l-[14px] border-r-[14px] border-b-[24px] border-l-transparent border-r-transparent shadow"
        style={{ borderBottomColor: asset.color }}
      />
    ),
    torch: (
      <div className="relative h-9 w-3">
        <div className="absolute bottom-0 left-1/2 h-7 w-[3px] -translate-x-1/2 rounded" style={baseStyle} />
        <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full" style={accentStyle} />
      </div>
    ),
    tree: (
      <div className="relative h-10 w-8">
        <div className="absolute bottom-0 left-1/2 h-4 w-2 -translate-x-1/2 rounded" style={{ backgroundColor: "#7a5f3b" }} />
        <div className="absolute left-1/2 top-0 h-6 w-6 -translate-x-1/2 rounded-full" style={baseStyle} />
      </div>
    ),
    gate: (
      <div className="relative h-8 w-9 rounded-sm shadow" style={baseStyle}>
        <div className="absolute bottom-0 left-1/2 h-5 w-4 -translate-x-1/2 rounded-t-sm bg-slate-900/45" />
      </div>
    ),
    stairs: (
      <div className="relative h-8 w-9">
        <div className="absolute bottom-0 h-3 w-9 rounded-sm shadow" style={baseStyle} />
        <div className="absolute bottom-3 left-1 h-2 w-7 rounded-sm shadow" style={accentStyle} />
        <div className="absolute bottom-5 left-2 h-2 w-5 rounded-sm shadow" style={baseStyle} />
      </div>
    ),
    banner: (
      <div className="relative h-10 w-8">
        <div className="absolute bottom-0 left-2 h-9 w-[2px] bg-amber-900/70" />
        <div className="absolute left-3 top-2 h-5 w-4 rounded-sm shadow" style={accentStyle} />
      </div>
    ),
    statue: (
      <div className="relative h-9 w-8">
        <div className="absolute bottom-0 h-4 w-8 rounded-sm shadow" style={baseStyle} />
        <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full shadow" style={accentStyle} />
      </div>
    ),
    pond: (
      <div className="h-7 w-9 rounded-full border border-white/20 shadow" style={baseStyle} />
    ),
    rock: (
      <div className="h-8 w-8 rounded-[35%] shadow" style={baseStyle} />
    ),
    tower: (
      <div className="relative h-10 w-8">
        <div className="absolute bottom-0 left-1/2 h-7 w-4 -translate-x-1/2 rounded-sm shadow" style={baseStyle} />
        <div
          className="absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent"
          style={{ borderBottomColor: asset.accent }}
        />
      </div>
    ),
  };

  const previewByTemplate: Record<string, JSX.Element> = {
    "gate-arch": (
      <div className="relative h-9 w-10 rounded-t-full border-b-4 border-slate-900/40" style={baseStyle}>
        <div className="absolute bottom-0 left-1/2 h-5 w-5 -translate-x-1/2 rounded-t-full bg-slate-900/35" />
      </div>
    ),
    "roof-layered": (
      <div className="relative h-9 w-10">
        <div className="absolute bottom-0 h-3 w-10 rounded-sm" style={baseStyle} />
        <div className="absolute bottom-3 left-1 h-3 w-8 rounded-sm" style={accentStyle} />
        <div className="absolute bottom-6 left-2 h-2 w-6 rounded-sm" style={baseStyle} />
      </div>
    ),
    "roof-curved": (
      <div className="h-6 w-10 rounded-t-[999px] border-b-4 border-slate-900/30" style={baseStyle} />
    ),
    "tower-square": (
      <div className="relative h-10 w-9">
        <div className="absolute bottom-0 left-1/2 h-7 w-5 -translate-x-1/2 rounded-sm" style={baseStyle} />
        <div className="absolute left-1/2 top-0 h-3 w-7 -translate-x-1/2 rounded-sm" style={accentStyle} />
      </div>
    ),
    "tree-cluster": (
      <div className="relative h-10 w-10">
        <div className="absolute bottom-0 left-1/2 h-3 w-2 -translate-x-1/2 rounded bg-amber-900/80" />
        <div className="absolute left-1 top-1 h-5 w-5 rounded-full" style={baseStyle} />
        <div className="absolute right-1 top-0 h-5 w-5 rounded-full" style={accentStyle} />
      </div>
    ),
    "banner-double": (
      <div className="relative h-10 w-9">
        <div className="absolute bottom-0 left-2 h-9 w-[2px] bg-amber-900/70" />
        <div className="absolute bottom-0 right-2 h-9 w-[2px] bg-amber-900/70" />
        <div className="absolute left-3 top-2 h-3 w-2 rounded-sm" style={baseStyle} />
        <div className="absolute right-3 top-4 h-3 w-2 rounded-sm" style={accentStyle} />
      </div>
    ),
    "bridge-ceremonial": (
      <div className="relative h-9 w-11">
        <div className="absolute bottom-1 left-0 h-3 w-11 rounded-full border-2 border-slate-900/35" style={baseStyle} />
        <div className="absolute bottom-0 left-1/2 h-2 w-5 -translate-x-1/2 rounded-sm" style={accentStyle} />
      </div>
    ),
    "lantern-post": (
      <div className="relative h-10 w-6">
        <div className="absolute bottom-0 left-1/2 h-8 w-[3px] -translate-x-1/2 rounded" style={baseStyle} />
        <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-md border border-amber-100/40" style={accentStyle} />
      </div>
    ),
  };

  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-md"
      style={{ boxShadow: `inset 0 0 0 2px ${asset.accent}66` }}
    >
      {previewByTemplate[previewKey] || shapeByType[asset.type]}
    </div>
  );
}

interface WorldSceneProps {
  reviewMode?: boolean;
  reviewStudentName?: string;
  initialSnapshot?: WorldSnapshot | null;
}

function FirstPersonRig({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const keyState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    if (!enabled) return;
    camera.position.set(0, 1.25, 8.5);
    camera.lookAt(0, 1.25, 0);
  }, [camera, enabled]);

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "KeyW") keyState.current.forward = true;
      if (event.code === "KeyS") keyState.current.backward = true;
      if (event.code === "KeyA") keyState.current.left = true;
      if (event.code === "KeyD") keyState.current.right = true;
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "KeyW") keyState.current.forward = false;
      if (event.code === "KeyS") keyState.current.backward = false;
      if (event.code === "KeyA") keyState.current.left = false;
      if (event.code === "KeyD") keyState.current.right = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [enabled]);

  useFrame((_, delta) => {
    if (!enabled) return;
    const speed = 5.8;
    const move = speed * delta;
    const forward = keyState.current.forward ? 1 : 0;
    const backward = keyState.current.backward ? 1 : 0;
    const left = keyState.current.left ? 1 : 0;
    const right = keyState.current.right ? 1 : 0;
    const f = forward - backward;
    const s = right - left;
    if (f === 0 && s === 0) return;

    const direction = new Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();
    const rightVec = new Vector3(direction.z, 0, direction.x).normalize();

    camera.position.addScaledVector(direction, f * move);
    camera.position.addScaledVector(rightVec, s * move);
    camera.position.x = Math.max(-140, Math.min(140, camera.position.x));
    camera.position.z = Math.max(-140, Math.min(140, camera.position.z));
    camera.position.y = 1.25;
  });

  if (!enabled) return null;
  return <PointerLockControls />;
}

export default function WorldScene({
  reviewMode = false,
  reviewStudentName = "",
  initialSnapshot = null,
}: WorldSceneProps) {
  const router = useRouter();
  const [subtitle, setSubtitle] = useState("Rocky is waking up...");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPrompt, setTaskPrompt] = useState("");
  const [activeTask, setActiveTask] = useState<CreativeTask>(defaultCreativeTask);
  const [styleInput, setStyleInput] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [assets, setAssets] = useState<BuildAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<BuildAsset | null>(null);
  const [coreBlockColor, setCoreBlockColor] = useState("#d6b36a");
  const [customRequest, setCustomRequest] = useState("");
  const [placedAssets, setPlacedAssets] = useState<PlacedAsset[]>([]);
  const [selectedPlacedAssetId, setSelectedPlacedAssetId] = useState<string | null>(
    null,
  );
  const [isRockyBubbleOpen, setIsRockyBubbleOpen] = useState(false);
  const [rockyBubbleIndex, setRockyBubbleIndex] = useState(0);
  const [rockyBubbleMessage, setRockyBubbleMessage] = useState(
    "What if we add one magical detail here?",
  );
  const [saveLabel, setSaveLabel] = useState("Save");
  const [publishLabel, setPublishLabel] = useState("Publish");
  const [isMissionVisible, setIsMissionVisible] = useState(true);
  const [isApplyingStyle, setIsApplyingStyle] = useState(false);
  const [isAddingAssets, setIsAddingAssets] = useState(false);
  const [isRefreshingAssets, setIsRefreshingAssets] = useState(false);
  const [isAskingRocky, setIsAskingRocky] = useState(false);
  const [activeStylePack, setActiveStylePack] = useState<StylePack | null>(null);
  const [recentHistoryAssets, setRecentHistoryAssets] = useState<BuildAsset[]>([]);
  const [viewMode, setViewMode] = useState<"build" | "explore">("build");
  const [showExploreHint, setShowExploreHint] = useState(false);
  const [floorTheme, setFloorTheme] = useState<FloorThemeId>("warm-castle-stone");
  const [paintMode, setPaintMode] = useState(false);
  const [selectedFloorPaint, setSelectedFloorPaint] = useState(FLOOR_PAINT_OPTIONS[0]);
  const [paintedTiles, setPaintedTiles] = useState<Record<string, string>>({});
  const [rockyPosition, setRockyPosition] = useState<[number, number, number]>([
    6.2,
    1.8,
    3.6,
  ]);
  const [friendsExpanded, setFriendsExpanded] = useState(false);
  const [friendsDocked, setFriendsDocked] = useState(false);
  const [classmateWorlds, setClassmateWorlds] = useState<WorldSnapshot[]>([]);
  const [levelUpToast, setLevelUpToast] = useState<string | null>(null);

  const hotbarAssets = [
    ...assets.filter((asset) => asset.id === "core-build-block"),
    ...assets.filter((asset) => asset.id !== "core-build-block"),
  ].slice(0, 10);

  const handleSelectHotbarAsset = (asset: BuildAsset) => {
    setSelectedAsset(asset);
  };

  useEffect(() => {
    const task = getActiveTask();
    const summary = getBuildSummary();
    const sessionName = getMockSession()?.name?.trim();
    const realClassmates = getPublishedWorlds()
      .filter((item) => item.ownerName !== (sessionName || "Student"))
      .sort(
        (a, b) =>
          +new Date(b.publishedAt || b.updatedAt) - +new Date(a.publishedAt || a.updatedAt),
      );
    const fakeClassmates = getMockClassmateWorlds().filter(
      (item) => item.ownerName !== (sessionName || "Student"),
    );
    const merged = [...realClassmates, ...fakeClassmates].filter(
      (item, idx, arr) => idx === arr.findIndex((x) => x.id === item.id),
    );
    const classmates = merged.slice(0, 12);
    setClassmateWorlds(classmates);
    setActiveTask(task);
    setTaskTitle(task.title);
    setTaskPrompt(task.prompt);
    setSelectedStyle(summary.style);
    setStyleInput(summary.style);
    setSubtitle(getIntroLine(task));
    if (initialSnapshot) {
      setSelectedStyle(initialSnapshot.style);
      setStyleInput(initialSnapshot.style);
      setAssets(withCoreBlock(generateAssetSet(initialSnapshot.style || "default"), buildCoreBlock(coreBlockColor)));
      setPlacedAssets(
        initialSnapshot.placedAssets.map((item) => ({
          ...item,
          position: new Vector3(item.gridX, -0.1 + (item.gridY ?? 0), item.gridZ),
          gridY: item.gridY ?? 0,
        })),
      );
      return;
    }

    if (summary.style) {
      setAssets(withCoreBlock(generateAssetSet(summary.style), buildCoreBlock(coreBlockColor)));
    }

    const draft = loadCurrentStudentDraft();
    if (draft && !reviewMode) {
      setSelectedStyle(draft.style);
      setStyleInput(draft.style);
      setAssets(withCoreBlock(generateAssetSet(draft.style || "default"), buildCoreBlock(coreBlockColor)));
      setPlacedAssets(
        draft.placedAssets.map((item) => ({
          ...item,
          position: new Vector3(item.gridX, -0.1 + (item.gridY ?? 0), item.gridZ),
          gridY: item.gridY ?? 0,
        })),
      );
      setSubtitle("Welcome back! Your canvas has been restored.");
    }
  }, [coreBlockColor, initialSnapshot, reviewMode]);

  useEffect(() => {
    if (reviewMode) return;
    const session = getMockSession();
    if (!session || session.role !== "student") return;
    const studentId = buildStudentIdFromName(session.name || "Student");
    const message = consumeLevelUpNotification(studentId);
    if (!message) return;
    setLevelUpToast(message);
    const timer = window.setTimeout(() => setLevelUpToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [reviewMode]);

  useEffect(() => {
    if (viewMode !== "explore" || reviewMode) {
      setShowExploreHint(false);
      return;
    }
    setShowExploreHint(true);
    const timer = window.setTimeout(() => setShowExploreHint(false), 5000);
    return () => window.clearTimeout(timer);
  }, [reviewMode, viewMode]);

  const persistSummary = (
    next: Partial<{
      style: string;
      objectsPlaced: number;
      latestObject: string;
      latestRockyLine: string;
      completionStatus: "not-started" | "in-progress" | "completed";
      reflections: number;
    }>,
  ) => {
    const current = getBuildSummary();
    saveBuildSummary({
      ...current,
      style: next.style ?? current.style,
      objectsPlaced: next.objectsPlaced ?? current.objectsPlaced,
      latestObject: next.latestObject ?? current.latestObject,
      latestRockyLine: next.latestRockyLine ?? current.latestRockyLine,
      completionStatus: next.completionStatus ?? current.completionStatus,
      reflections: next.reflections ?? current.reflections,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleApplyStyle = async () => {
    if (isApplyingStyle || isRefreshingAssets || isAddingAssets) return;
    const style = styleInput.trim();
    if (!style) {
      setSubtitle("Tell me a style first, like Egyptian, Jungle, or Fantasy!");
      return;
    }

    setIsApplyingStyle(true);
    setSubtitle("Rocky is crafting new materials from your style...");
    let nextAssets = generateAssetSet(style);
    let nextStylePack: StylePack | null = null;
    try {
      const result = await generateAssetsWithAI(
        style,
        "",
        [...assets, ...recentHistoryAssets],
        "apply",
        null,
      );
      if (result?.assets?.length) {
        nextAssets = result.assets;
        nextStylePack = result.stylePack || null;
      }
    } catch {
      // Keep local fallback generation.
    } finally {
      setIsApplyingStyle(false);
    }

    setSelectedStyle(style);
    setActiveStylePack(nextStylePack);
    const mergedAssets = withCoreBlock(nextAssets, buildCoreBlock(coreBlockColor));
    setAssets(mergedAssets);
    setSelectedAsset(mergedAssets[0] || null);
    setRecentHistoryAssets((prev) => [...nextAssets, ...prev].slice(0, 40));
    const line = getStyleLine(style);
    setSubtitle(line);
    persistSummary({ style, latestRockyLine: line, completionStatus: "in-progress" });
  };

  const handleAddAssets = async () => {
    if (isAddingAssets || isRefreshingAssets || isApplyingStyle) return;
    if (!selectedStyle) {
      setSubtitle("Pick a style first and I will gather matching materials!");
      return;
    }

    setIsAddingAssets(true);
    setSubtitle("Rocky is composing a new themed object pack...");
    const prompt = customRequest.trim();
    let refreshed = generateAssetSet(selectedStyle, prompt);
    let nextStylePack = activeStylePack;
    try {
      const result = await generateAssetsWithAI(
        selectedStyle,
        prompt,
        [...assets, ...recentHistoryAssets],
        "add",
        activeStylePack,
      );
      if (result?.assets?.length) {
        refreshed = result.assets;
        nextStylePack = result.stylePack || nextStylePack;
      }
    } catch {
      // Keep local fallback generation.
    } finally {
      setIsAddingAssets(false);
    }

    setActiveStylePack(nextStylePack);
    const mergedAssets = withCoreBlock(refreshed, buildCoreBlock(coreBlockColor));
    setAssets(mergedAssets);
    setSelectedAsset(mergedAssets[0] || null);
    setRecentHistoryAssets((prev) => [...refreshed, ...prev].slice(0, 40));
    setSubtitle(
      prompt
        ? `New ${selectedStyle} variations for "${prompt}" are ready.`
        : "New themed assets are ready.",
    );
  };

  const handleRefreshAssets = async () => {
    if (isRefreshingAssets || isApplyingStyle || isAddingAssets) return;
    if (!selectedStyle) {
      setSubtitle("Pick a style first and I will gather matching materials!");
      return;
    }

    setIsRefreshingAssets(true);
    setSubtitle("Refreshing variants... keeping style, changing silhouettes.");
    let refreshed = generateAssetSet(selectedStyle, customRequest);
    try {
      const result = await generateAssetsWithAI(
        selectedStyle,
        customRequest,
        [...assets, ...recentHistoryAssets],
        "refresh",
        activeStylePack,
      );
      if (result?.assets?.length) {
        refreshed = result.assets;
        setActiveStylePack(result.stylePack || activeStylePack);
      }
    } catch {
      // Keep local fallback generation.
    } finally {
      setIsRefreshingAssets(false);
    }

    const mergedAssets = withCoreBlock(refreshed, buildCoreBlock(coreBlockColor));
    setAssets(mergedAssets);
    setSelectedAsset(mergedAssets[0] || null);
    setRecentHistoryAssets((prev) => [...refreshed, ...prev].slice(0, 40));
    setSubtitle("Fresh style-consistent variants ready. Choose one and build.");
  };

  const handleAskRocky = async (question: string): Promise<string> => {
    if (isAskingRocky) return "Rocky is already thinking. Please wait a moment.";
    setIsAskingRocky(true);
    const fallbackLine = getAskLine(question, selectedStyle);
    setSubtitle("Rocky is thinking...");

    let line = fallbackLine;
    try {
      const response = await fetch("/api/rocky", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          style: selectedStyle,
          taskTitle,
          taskPrompt,
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as { reply?: string };
        if (data.reply?.trim()) {
          line = data.reply.trim();
        }
      }
    } catch {
      // Keep local fallback line when network/API is unavailable.
    }

    try {
      setSubtitle(line);
      const recommendedAssets = withCoreBlock(
        generateAssetSet(selectedStyle || "default", question),
        buildCoreBlock(coreBlockColor),
      );
      setAssets(recommendedAssets);
      persistSummary({
        latestRockyLine: line,
        reflections: getBuildSummary().reflections + 1,
        completionStatus: "in-progress",
      });
      return line;
    } finally {
      setIsAskingRocky(false);
    }
  };

  const handleAskRockyFromBubble = async (question: string): Promise<string> => {
    const line = (await handleAskRocky(question)) || getAskLine(question, selectedStyle);
    setRockyBubbleMessage(line);
    setIsRockyBubbleOpen(true);
    return line;
  };

  const handlePlaceAsset = (gridX: number, gridZ: number) => {
    if (!selectedAsset) {
      setSubtitle("Choose one item from your library first!");
      return;
    }
    const isCoreBlock = selectedAsset.id === "core-build-block";
    const sameCell = placedAssets.filter((item) => item.gridX === gridX && item.gridZ === gridZ);
    const cellHasNonBlocks = sameCell.some((item) => item.asset.id !== "core-build-block");

    let gridY = 0;
    if (isCoreBlock) {
      if (cellHasNonBlocks) {
        setSubtitle("This cell already has a special object. Try stacking blocks on an empty block column.");
        return;
      }
      gridY = sameCell.filter((item) => item.asset.id === "core-build-block").length;
    } else if (sameCell.length > 0) {
      setSubtitle("That spot is already taken. Which nearby cell should we try?");
      return;
    }

    const pos = new Vector3(gridX, -0.1 + gridY, gridZ);
    const placed: PlacedAsset = {
      id: `${selectedAsset.id}-${Date.now()}`,
      asset: selectedAsset,
      position: pos,
      gridX,
      gridZ,
      gridY,
      scale: 1,
      rotationY: 0,
    };
    const nextPlaced = [...placedAssets, placed];
    setPlacedAssets(nextPlaced);
    setSelectedPlacedAssetId(placed.id);
    setSelectedAsset(null);
    const line = getPlacementLine(selectedAsset.label, nextPlaced.length);
    setSubtitle(line);
    persistSummary({
      objectsPlaced: nextPlaced.length,
      latestObject: selectedAsset.label,
      latestRockyLine: line,
      completionStatus: nextPlaced.length >= 8 ? "completed" : "in-progress",
    });
  };

  const selectedPlacedAsset = placedAssets.find(
    (asset) => asset.id === selectedPlacedAssetId,
  );

  const updateSelectedPlacedAsset = (updater: (asset: PlacedAsset) => PlacedAsset) => {
    if (!selectedPlacedAssetId) return;
    setPlacedAssets((current) =>
      current.map((asset) => (asset.id === selectedPlacedAssetId ? updater(asset) : asset)),
    );
  };

  const handleScaleChange = (delta: number) => {
    if (reviewMode) return;
    if (!selectedPlacedAsset) return;
    let updatedScale = selectedPlacedAsset.scale + delta;
    updatedScale = Math.max(0.5, Math.min(2, Number(updatedScale.toFixed(2))));
    updateSelectedPlacedAsset((asset) => ({ ...asset, scale: updatedScale }));
    setSubtitle("Ooh, that size changes the feeling! Does it match your idea?");
  };

  const handleRotateSelected = () => {
    if (reviewMode) return;
    if (!selectedPlacedAsset) return;
    updateSelectedPlacedAsset((asset) => ({
      ...asset,
      rotationY: asset.rotationY + Math.PI / 2,
    }));
    setSubtitle("Nice turn! How does this angle look in your design?");
  };

  const handleDeleteSelected = () => {
    if (reviewMode) return;
    if (!selectedPlacedAsset) return;
    const next = placedAssets.filter((asset) => asset.id !== selectedPlacedAsset.id);
    setPlacedAssets(next);
    setSelectedPlacedAssetId(null);
    setSubtitle("No problem, we can try another spot or shape!");
    persistSummary({
      objectsPlaced: next.length,
      latestObject: next[next.length - 1]?.asset.label || "None yet",
      completionStatus: next.length === 0 ? "not-started" : "in-progress",
    });
  };

  const handleSaveWorld = () => {
    if (reviewMode) return;
    saveCurrentStudentDraft({
      title: "My Creative Canvas",
      taskTitle: taskTitle || "Creative Mission",
      style: selectedStyle,
      placedAssets: placedAssets.map((item) => ({
        ...item,
        position: {
          x: item.position.x,
          y: item.position.y,
          z: item.position.z,
        },
        gridY: item.gridY,
      })),
    });
    setSaveLabel("Saved");
    setTimeout(() => setSaveLabel("Save"), 1200);
    setSubtitle("Great! Your world is saved. You can continue next time.");
  };

  const handlePublishWorld = () => {
    if (reviewMode) return;
    handleSaveWorld();
    const published = publishCurrentStudentWorld();
    if (published) {
      setPublishLabel("Published");
      setTimeout(() => setPublishLabel("Publish"), 1200);
      setSubtitle("Amazing! Your world is now published for teachers and classmates.");
    }
  };

  const showRockyIdea = (nextIndex: number) => {
    const idea = getRockyBubbleSuggestion(
      {
        task: activeTask,
        style: selectedStyle,
        placedCount: placedAssets.length,
        latestObject: placedAssets[placedAssets.length - 1]?.asset.label,
      },
      nextIndex,
    );
    setRockyBubbleIndex(nextIndex);
    setRockyBubbleMessage(idea);
    setIsRockyBubbleOpen(true);
  };

  const handleRockyClick = () => {
    const nextIndex = isRockyBubbleOpen ? rockyBubbleIndex + 1 : rockyBubbleIndex;
    showRockyIdea(nextIndex);
  };

  const handlePaintTile = (gridX: number, gridZ: number, color: string) => {
    if (reviewMode) return;
    const key = `${gridX},${gridZ}`;
    setPaintedTiles((prev) => ({ ...prev, [key]: color }));
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0f1d38]">
      <Canvas camera={{ position: [10.5, 11, 10.5], fov: 52 }}>
        <Suspense fallback={null}>
          {/* Soft global illumination */}
          <ambientLight intensity={0.6} color="#FFF8DC" />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.2}
            color="#FFE4B5"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          {/* Clean background */}
          <color attach="background" args={["#bfd4fb"]} />

          <FloatingIsland />
          <CreativeBuildArea
            readOnly={reviewMode}
            selectedAsset={selectedAsset}
            placedAssets={placedAssets}
            selectedPlacedAssetId={selectedPlacedAssetId}
            floorTheme={floorTheme}
            paintMode={paintMode}
            selectedFloorPaint={selectedFloorPaint}
            paintedTiles={paintedTiles}
            onPaintTile={handlePaintTile}
            onPlaceAsset={handlePlaceAsset}
            onSelectPlacedAsset={setSelectedPlacedAssetId}
            onScaleDownSelected={() => handleScaleChange(-0.1)}
            onScaleUpSelected={() => handleScaleChange(0.1)}
            onRotateSelected={handleRotateSelected}
            onDeleteSelected={handleDeleteSelected}
            onCloseSelected={() => setSelectedPlacedAssetId(null)}
          />
          <AICompanion3D
            position={rockyPosition}
            isActive={true}
            onRockyClick={handleRockyClick}
            draggable={!reviewMode}
            onPositionChange={setRockyPosition}
          />

          {viewMode === "build" ? (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
              target={[0, -0.2, 0]}
              minDistance={9}
              maxDistance={80}
              minPolarAngle={Math.PI / 5}
              maxPolarAngle={Math.PI / 2.15}
            />
          ) : (
            <FirstPersonRig enabled />
          )}
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_40%,rgba(8,12,27,0.3)_100%)]" />

      {isMissionVisible && (
        <div
          className={`absolute left-4 z-20 w-[min(430px,90vw)] rounded-2xl border border-cyan-200/30 bg-[#1a2745]/96 p-5 pr-12 text-white shadow-[0_12px_30px_rgba(2,6,23,0.45)] backdrop-blur ${
            reviewMode ? "top-44" : "top-20"
          }`}
        >
          <button
            type="button"
            onClick={() => setIsMissionVisible(false)}
            aria-label="Close mission reminder"
            className="absolute right-3 top-3 h-8 w-8 rounded-lg border border-cyan-200/30 bg-slate-800/90 text-cyan-100 transition hover:bg-slate-700"
          >
            ×
          </button>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200">Today&apos;s Mission</p>
          <h3 className="text-xl font-extrabold leading-tight text-slate-50">{taskTitle || "Creative Mission"}</h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-100">{taskPrompt}</p>
          {reviewMode && (
            <p className="mt-2 text-xs font-semibold text-amber-200">
              Read-only review for {reviewStudentName || "selected student"}
            </p>
          )}
        </div>
      )}

      {!reviewMode && (
        <div
          className={`absolute left-0 top-[17.2rem] z-30 flex items-start transition-transform duration-300 ${
            friendsDocked ? "-translate-x-[calc(100%-2.75rem)]" : "translate-x-0"
          }`}
        >
          <div className="w-[min(340px,88vw)] rounded-xl border border-cyan-200/30 bg-[#1a2743]/94 p-2 text-white shadow-[0_10px_24px_rgba(2,6,23,0.4)] backdrop-blur">
            <button
              type="button"
              onClick={() => setFriendsExpanded((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-lg border border-slate-500/45 bg-slate-800/90 px-3 py-2 text-left text-xs font-bold text-cyan-100 hover:border-cyan-300/40 hover:bg-slate-700/90"
            >
              <span>Visit Classmates&apos; Worlds</span>
              <span>{friendsExpanded ? "▲" : "▼"}</span>
            </button>
            {friendsExpanded && (
              <div className="mt-2 max-h-56 space-y-2 overflow-y-auto px-1 pb-1">
                {classmateWorlds.length === 0 && (
                  <p className="rounded-lg bg-slate-800/70 px-2 py-2 text-xs text-slate-200">
                    No published classmate worlds yet.
                  </p>
                )}
                {classmateWorlds.map((world) => (
                  (() => {
                    const profile = getStudentProfile(
                      buildStudentIdFromName(world.ownerName),
                      world.ownerName,
                    );
                    return (
                      <button
                        key={world.id}
                        type="button"
                        onClick={() => router.push(`/world/view/${world.id}`)}
                        className="w-full rounded-lg border border-cyan-300/25 bg-slate-800/90 px-3 py-2 text-left hover:border-cyan-300/45 hover:bg-slate-700/90"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-600 text-[11px] font-bold text-white">
                            {world.ownerName.slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-cyan-100">
                              {world.ownerName} · Lv. {profile.level}
                            </p>
                            <p className="text-[11px] font-medium text-slate-200">
                              {profile.title}
                            </p>
                          </div>
                        </div>
                        <p className="mt-1 text-[11px] font-medium text-slate-300">
                          {world.style || "No style"} • {world.placedAssets.length} objects
                        </p>
                      </button>
                    );
                  })()
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setFriendsDocked((prev) => !prev)}
            className="ml-2 mt-2 h-20 w-11 rounded-r-xl border border-cyan-200/35 bg-[#132037]/95 text-xs font-bold text-cyan-100 shadow-[0_8px_20px_rgba(2,6,23,0.45)] hover:bg-[#1b2b48]"
            title={friendsDocked ? "Open classmates panel" : "Dock classmates panel"}
            aria-label={friendsDocked ? "Open classmates panel" : "Dock classmates panel"}
          >
            {friendsDocked ? "›" : "‹"}
          </button>
        </div>
      )}

      {!reviewMode && (
        <div className="absolute left-1/2 bottom-[calc(max(1rem,env(safe-area-inset-bottom))+8.1rem)] z-30 w-[min(900px,95vw)] -translate-x-1/2 rounded-2xl border border-cyan-200/30 bg-[#182743]/96 px-3 py-2 text-white shadow-[0_14px_30px_rgba(2,6,23,0.5)] backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={styleInput}
              onChange={(event) => setStyleInput(event.target.value)}
              placeholder="Style idea: Egyptian style"
              className="h-9 min-w-[190px] flex-1 rounded-lg border border-slate-500 bg-slate-900/95 px-3 text-xs font-medium text-slate-50 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-cyan-400/60"
            />
            <button
              type="button"
              onClick={handleApplyStyle}
              disabled={isApplyingStyle || isRefreshingAssets || isAddingAssets}
              className="h-9 rounded-lg border border-cyan-200/60 bg-gradient-to-r from-cyan-400 to-sky-500 px-3 text-xs font-bold text-slate-950 shadow-[0_6px_16px_rgba(14,165,233,0.4)] hover:brightness-105 active:translate-y-[1px] disabled:cursor-not-allowed disabled:brightness-75 disabled:text-slate-800"
            >
              {isApplyingStyle ? "Applying..." : "Apply Style"}
            </button>
            <input
              value={customRequest}
              onChange={(event) => setCustomRequest(event.target.value)}
              placeholder="Add request: tall gate..."
              className="h-9 min-w-[180px] flex-1 rounded-lg border border-slate-500 bg-slate-900/95 px-3 text-xs font-medium text-slate-50 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-cyan-400/55"
            />
            <button
              type="button"
              onClick={handleAddAssets}
              disabled={isAddingAssets || isRefreshingAssets || isApplyingStyle}
              className="h-9 rounded-lg border border-cyan-200/60 bg-gradient-to-r from-cyan-400 to-sky-500 px-3 text-xs font-bold text-slate-950 shadow-[0_6px_16px_rgba(14,165,233,0.4)] hover:brightness-105 active:translate-y-[1px] disabled:cursor-not-allowed disabled:brightness-75 disabled:text-slate-800"
            >
              {isAddingAssets ? "Adding..." : "Add"}
            </button>
          </div>
          <p className="mt-1 px-1 text-[11px] font-medium text-slate-200">
            Current style: {selectedStyle || "Not set"}
          </p>
        </div>
      )}

      {!reviewMode && (
        <div className="absolute right-4 top-20 z-30 flex items-center gap-2 rounded-xl border border-cyan-200/30 bg-[#18253f]/95 p-2 shadow-[0_10px_24px_rgba(2,6,23,0.42)] backdrop-blur-md">
          <button
            type="button"
            onClick={() => setViewMode((current) => (current === "build" ? "explore" : "build"))}
            className="h-9 rounded-lg border border-slate-300/35 bg-slate-700/70 px-3 text-xs font-bold text-slate-100 hover:border-cyan-300/50 hover:bg-slate-600/80"
            title="Switch camera mode"
          >
            {viewMode === "build" ? "Explore Mode" : "Build Mode"}
          </button>
          <button
            type="button"
            onClick={handleSaveWorld}
            className="h-9 rounded-lg border border-emerald-300/45 bg-emerald-500/20 px-3 text-xs font-bold text-emerald-100 hover:bg-emerald-500/30"
          >
            {saveLabel}
          </button>
          <button
            type="button"
            onClick={handlePublishWorld}
            className="h-9 rounded-lg border border-cyan-200/60 bg-gradient-to-r from-cyan-400 to-blue-500 px-3 text-xs font-bold text-slate-950 shadow-[0_6px_16px_rgba(14,165,233,0.35)] hover:brightness-105"
          >
            {publishLabel}
          </button>
        </div>
      )}

      {!reviewMode && (
        <div className="absolute right-4 top-36 z-30 w-[230px] rounded-xl border border-cyan-200/30 bg-[#172640]/95 p-3 text-white shadow-[0_10px_24px_rgba(2,6,23,0.42)] backdrop-blur-md">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-cyan-200">
            Floor Theme
          </p>
          <select
            value={floorTheme}
            onChange={(event) => setFloorTheme(event.target.value as FloorThemeId)}
            className="h-8 w-full rounded-lg border border-slate-500 bg-slate-900/95 px-2 text-xs font-semibold text-slate-100 outline-none focus:ring-2 focus:ring-cyan-400/50"
          >
            {Object.entries(FLOOR_THEMES).map(([id, config]) => (
              <option key={id} value={id}>
                {config.label}
              </option>
            ))}
          </select>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaintMode((prev) => !prev)}
              className={`h-8 rounded-lg border px-2 text-xs font-bold transition ${
                paintMode
                  ? "border-cyan-200/70 bg-cyan-400/25 text-cyan-100"
                  : "border-slate-400/45 bg-slate-700/70 text-slate-100"
              }`}
            >
              {paintMode ? "Paint Mode: ON" : "Paint Mode: OFF"}
            </button>
            <button
              type="button"
              onClick={() => setPaintedTiles({})}
              className="h-8 rounded-lg border border-rose-300/50 bg-rose-500/20 px-2 text-xs font-bold text-rose-100 hover:bg-rose-500/35"
            >
              Clear
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {FLOOR_PAINT_OPTIONS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedFloorPaint(color)}
                className={`h-5 w-5 rounded-full border ${
                  selectedFloorPaint === color ? "border-white ring-2 ring-cyan-300/70" : "border-slate-300/60"
                }`}
                style={{ backgroundColor: color }}
                title={`Use floor paint ${color}`}
              />
            ))}
          </div>
        </div>
      )}

      {!reviewMode && viewMode === "explore" && showExploreHint && (
        <div className="pointer-events-none absolute left-1/2 top-36 z-30 -translate-x-1/2 rounded-xl border border-cyan-300/35 bg-[#17243d]/95 px-3 py-2 text-xs font-semibold text-cyan-100 shadow-lg backdrop-blur-sm">
          Explore Mode: click the 3D scene, move with WASD, press Esc to unlock mouse.
        </div>
      )}

      {!reviewMode && levelUpToast && (
        <div className="pointer-events-none absolute left-1/2 top-36 z-30 -translate-x-1/2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 shadow-lg">
          {levelUpToast}
        </div>
      )}

      {!reviewMode && (
        <div className="absolute left-1/2 bottom-[max(0.9rem,env(safe-area-inset-bottom))] z-30 w-[min(900px,96vw)] -translate-x-1/2 rounded-2xl border border-cyan-200/30 bg-[#141f38]/96 px-2 py-2 shadow-[0_14px_32px_rgba(2,6,23,0.55)] backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            {hotbarAssets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => handleSelectHotbarAsset(asset)}
                title={asset.label}
                  className={`group flex min-w-[76px] flex-col items-center ${
                  selectedAsset?.id === asset.id ? "scale-[1.02]" : ""
                } transition-transform`}
              >
                <span
                  className={`flex h-[62px] w-[62px] items-center justify-center overflow-hidden rounded-xl border text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all ${
                    selectedAsset?.id === asset.id
                      ? "border-cyan-200 bg-cyan-400/25 shadow-[0_0_18px_rgba(56,189,248,0.42)]"
                      : "border-slate-500/80 bg-slate-800/95 group-hover:border-cyan-400/65 group-hover:bg-slate-700/95"
                  }`}
                >
                  <div
                    className="h-full w-full"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${asset.color}33, ${asset.accent}40)`,
                    }}
                  >
                    <HotbarAssetPreview asset={asset} />
                  </div>
                </span>
                <span
                  className={`mt-1 max-w-[70px] truncate text-center text-[11px] font-bold ${
                    selectedAsset?.id === asset.id ? "text-cyan-100" : "text-slate-100"
                  }`}
                >
                  {shortAssetName(asset.label)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {!reviewMode && selectedAsset?.id === "core-build-block" && (
        <div className="absolute left-1/2 bottom-[calc(max(0.9rem,env(safe-area-inset-bottom))+5.8rem)] z-30 -translate-x-1/2 rounded-xl border border-cyan-200/35 bg-[#1b2741]/96 px-3 py-2 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wide text-cyan-100">Block Color</span>
            <div className="flex items-center gap-1">
              {BLOCK_COLOR_SWATCHES.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    setCoreBlockColor(color);
                    setAssets((prev) => withCoreBlock(prev, buildCoreBlock(color)));
                    setSelectedAsset(buildCoreBlock(color));
                  }}
                  className={`h-5 w-5 rounded-full border transition ${
                    coreBlockColor === color
                      ? "border-white ring-2 ring-cyan-300/70"
                      : "border-slate-300/60"
                  }`}
                  style={{ backgroundColor: color }}
                  title={`Set block color ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {!reviewMode && (
        <button
          type="button"
          onClick={handleRefreshAssets}
          disabled={isRefreshingAssets || isApplyingStyle || isAddingAssets}
          className="absolute left-1/2 bottom-[calc(max(0.9rem,env(safe-area-inset-bottom))+5.8rem)] z-30 ml-[min(440px,47vw)] flex h-[42px] min-w-[42px] -translate-x-1/2 items-center justify-center rounded-xl border border-slate-300/45 bg-slate-700/85 text-slate-100 shadow-[0_8px_18px_rgba(15,23,42,0.35)] transition-all hover:border-cyan-300/60 hover:bg-slate-600/90 disabled:cursor-not-allowed disabled:opacity-55"
          title="Refresh assets"
        >
          <span className={`text-lg leading-none ${isRefreshingAssets ? "animate-spin" : ""}`}>
            ↻
          </span>
        </button>
      )}

      <AICompanion
        subtitle={subtitle}
      />
      <RockySpeechBubble
        visible={isRockyBubbleOpen}
        message={rockyBubbleMessage}
        onClose={() => setIsRockyBubbleOpen(false)}
        onMoreIdeas={() => showRockyIdea(rockyBubbleIndex + 1)}
        onAskRocky={handleAskRockyFromBubble}
        isAskingRocky={isAskingRocky}
      />
    </div>
  );
}
