"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { FloatingIsland } from "./floating-island";
import { AICompanion3D } from "../ai/ai-companion-3d";
import AICompanion from "../ai/ai-companion";
import { RockySpeechBubble } from "../ai/rocky-speech-bubble";
import { BuildAsset, generateAssetSet } from "@/lib/asset-generator";
import { CreativeBuildArea, PlacedAsset } from "./creative-build-area";
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

function getAssetPreviewEmoji(type: BuildAsset["type"]): string {
  switch (type) {
    case "block":
      return "🧱";
    case "column":
      return "🏛️";
    case "roof":
      return "🔺";
    case "torch":
      return "🔥";
    case "tree":
      return "🌴";
    case "gate":
      return "🚪";
    case "stairs":
      return "🪜";
    case "banner":
      return "🏳️";
    case "statue":
      return "🗿";
    case "pond":
      return "💧";
    case "rock":
      return "🪨";
    case "tower":
      return "🗼";
    default:
      return "✨";
  }
}

function shortAssetName(name: string): string {
  if (name.length <= 11) return name;
  return `${name.slice(0, 10)}…`;
}

export default function WorldScene() {
  const [subtitle, setSubtitle] = useState("Rocky is waking up...");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPrompt, setTaskPrompt] = useState("");
  const [activeTask, setActiveTask] = useState<CreativeTask>(defaultCreativeTask);
  const [styleInput, setStyleInput] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [assets, setAssets] = useState<BuildAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<BuildAsset | null>(null);
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

  useEffect(() => {
    const task = getActiveTask();
    const summary = getBuildSummary();
    setActiveTask(task);
    setTaskTitle(task.title);
    setTaskPrompt(task.prompt);
    setSelectedStyle(summary.style);
    setStyleInput(summary.style);
    setSubtitle(getIntroLine(task));
    if (summary.style) {
      setAssets(generateAssetSet(summary.style));
    }
  }, []);

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

  const handleApplyStyle = () => {
    const style = styleInput.trim();
    if (!style) {
      setSubtitle("Tell me a style first, like Egyptian, Jungle, or Fantasy!");
      return;
    }
    const nextAssets = generateAssetSet(style);
    setSelectedStyle(style);
    setAssets(nextAssets);
    setSelectedAsset(nextAssets[0] || null);
    const line = getStyleLine(style);
    setSubtitle(line);
    persistSummary({ style, latestRockyLine: line, completionStatus: "in-progress" });
  };

  const handleRefreshAssets = () => {
    if (!selectedStyle) {
      setSubtitle("Pick a style first and I will gather matching materials!");
      return;
    }
    const refreshed = generateAssetSet(selectedStyle, customRequest);
    setAssets(refreshed);
    setSelectedAsset(refreshed[0] || null);
    setSubtitle("Fresh materials ready! Choose one and place it in your world.");
  };

  const handleAskRocky = (question: string) => {
    const line = getAskLine(question, selectedStyle);
    setSubtitle(line);
    const recommendedAssets = generateAssetSet(selectedStyle || "default", question);
    setAssets(recommendedAssets);
    persistSummary({
      latestRockyLine: line,
      reflections: getBuildSummary().reflections + 1,
      completionStatus: "in-progress",
    });
  };

  const handlePlaceAsset = (gridX: number, gridZ: number, position: Vector3) => {
    if (!selectedAsset) {
      setSubtitle("Choose one item from your library first!");
      return;
    }
    if (placedAssets.some((item) => item.gridX === gridX && item.gridZ === gridZ)) {
      setSubtitle("That spot is already taken. Which nearby cell should we try?");
      return;
    }
    const placed: PlacedAsset = {
      id: `${selectedAsset.id}-${Date.now()}`,
      asset: selectedAsset,
      position,
      gridX,
      gridZ,
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
    if (!selectedPlacedAsset) return;
    let updatedScale = selectedPlacedAsset.scale + delta;
    updatedScale = Math.max(0.5, Math.min(2, Number(updatedScale.toFixed(2))));
    updateSelectedPlacedAsset((asset) => ({ ...asset, scale: updatedScale }));
    setSubtitle("Ooh, that size changes the feeling! Does it match your idea?");
  };

  const handleRotateSelected = () => {
    if (!selectedPlacedAsset) return;
    updateSelectedPlacedAsset((asset) => ({
      ...asset,
      rotationY: asset.rotationY + Math.PI / 2,
    }));
    setSubtitle("Nice turn! How does this angle look in your design?");
  };

  const handleDeleteSelected = () => {
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

  return (
    <div className="relative w-full h-screen">
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
          <color attach="background" args={["#F0F8FF"]} />

          <FloatingIsland />
          <CreativeBuildArea
            selectedAsset={selectedAsset}
            placedAssets={placedAssets}
            selectedPlacedAssetId={selectedPlacedAssetId}
            onPlaceAsset={handlePlaceAsset}
            onSelectPlacedAsset={setSelectedPlacedAssetId}
            onScaleDownSelected={() => handleScaleChange(-0.1)}
            onScaleUpSelected={() => handleScaleChange(0.1)}
            onRotateSelected={handleRotateSelected}
            onDeleteSelected={handleDeleteSelected}
          />
          <AICompanion3D
            position={[3.8, 1.8, 3.8]}
            isActive={true}
            onRockyClick={handleRockyClick}
          />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            target={[0, -0.2, 0]}
            minDistance={9}
            maxDistance={24}
            minPolarAngle={Math.PI / 5}
            maxPolarAngle={Math.PI / 2.15}
          />
        </Suspense>
      </Canvas>

      <div className="absolute left-4 top-20 z-20 w-[min(420px,90vw)] rounded-2xl border border-cyan-200/30 bg-slate-900/75 p-4 text-white backdrop-blur">
        <p className="text-xs uppercase tracking-wider text-cyan-200 mb-1">Today&apos;s Mission</p>
        <h3 className="text-lg font-bold">{taskTitle || "Creative Mission"}</h3>
        <p className="text-sm text-slate-200 mt-1">{taskPrompt}</p>
      </div>

      <div className="absolute left-1/2 bottom-[calc(max(1rem,env(safe-area-inset-bottom))+8.1rem)] z-30 w-[min(860px,95vw)] -translate-x-1/2 rounded-2xl border border-cyan-200/30 bg-slate-900/78 px-3 py-2 text-white backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={styleInput}
            onChange={(event) => setStyleInput(event.target.value)}
            placeholder="Style idea: Egyptian style"
            className="h-9 min-w-[180px] flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 text-xs outline-none focus:ring-2 focus:ring-cyan-400/50"
          />
          <button
            type="button"
            onClick={handleApplyStyle}
            className="h-9 rounded-lg bg-cyan-500 px-3 text-xs font-semibold text-slate-950 hover:bg-cyan-400"
          >
            Apply Style
          </button>
          <input
            value={customRequest}
            onChange={(event) => setCustomRequest(event.target.value)}
            placeholder="Add request: tall gate..."
            className="h-9 min-w-[170px] flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 text-xs outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
          <button
            type="button"
            onClick={handleRefreshAssets}
            className="h-9 rounded-lg bg-cyan-500 px-3 text-xs font-semibold text-slate-950 hover:bg-cyan-400"
          >
            Add
          </button>
        </div>
        <p className="mt-1 px-1 text-[11px] text-slate-300">
          Current style: {selectedStyle || "Not set"}
        </p>
      </div>

      <div className="absolute left-1/2 bottom-[max(0.9rem,env(safe-area-inset-bottom))] z-30 w-[min(880px,96vw)] -translate-x-1/2 rounded-2xl border border-cyan-200/30 bg-slate-950/72 px-2 py-2 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
          {assets.slice(0, 10).map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => setSelectedAsset(asset)}
              title={asset.label}
              className={`group flex min-w-[76px] flex-col items-center ${
                selectedAsset?.id === asset.id ? "scale-[1.02]" : ""
              } transition-transform`}
            >
              <span
                className={`flex h-[62px] w-[62px] items-center justify-center rounded-xl border text-2xl shadow-inner transition-all ${
                  selectedAsset?.id === asset.id
                    ? "border-cyan-300 bg-cyan-400/20 shadow-[0_0_18px_rgba(56,189,248,0.35)]"
                    : "border-slate-500/80 bg-slate-800/80 group-hover:border-cyan-400/55 group-hover:bg-slate-700/90"
                }`}
                style={{
                  backgroundImage: `linear-gradient(135deg, ${asset.color}33, ${asset.accent}40)`,
                }}
              >
                {getAssetPreviewEmoji(asset.type)}
              </span>
              <span
                className={`mt-1 max-w-[70px] truncate text-center text-[11px] font-semibold ${
                  selectedAsset?.id === asset.id ? "text-cyan-100" : "text-slate-200"
                }`}
              >
                {shortAssetName(asset.label)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleRefreshAssets}
        className="absolute left-1/2 bottom-[calc(max(0.9rem,env(safe-area-inset-bottom))+5.8rem)] z-30 ml-[min(440px,47vw)] flex h-[42px] min-w-[42px] -translate-x-1/2 items-center justify-center rounded-xl border border-cyan-300/50 bg-cyan-500/15 text-cyan-100 shadow-[0_0_12px_rgba(56,189,248,0.2)] transition-all hover:bg-cyan-400/25"
        title="Refresh assets"
      >
        <span className="text-lg leading-none">↻</span>
      </button>

      <AICompanion subtitle={subtitle} onAskRocky={handleAskRocky} />
      <RockySpeechBubble
        visible={isRockyBubbleOpen}
        message={rockyBubbleMessage}
        onClose={() => setIsRockyBubbleOpen(false)}
        onMoreIdeas={() => showRockyIdea(rockyBubbleIndex + 1)}
      />
    </div>
  );
}
