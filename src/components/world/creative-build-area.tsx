"use client";

import { useState } from "react";
import { Vector3 } from "three";
import { BuildAsset } from "@/lib/asset-generator";
import { Html } from "@react-three/drei";

export interface PlacedAsset {
  id: string;
  asset: BuildAsset;
  position: Vector3;
  gridX: number;
  gridZ: number;
  gridY: number;
  scale: number;
  rotationY: number;
}

interface CreativeBuildAreaProps {
  readOnly?: boolean;
  selectedAsset: BuildAsset | null;
  placedAssets: PlacedAsset[];
  selectedPlacedAssetId: string | null;
  onPlaceAsset: (gridX: number, gridZ: number) => void;
  onSelectPlacedAsset: (assetId: string) => void;
  onScaleDownSelected: () => void;
  onScaleUpSelected: () => void;
  onRotateSelected: () => void;
  onDeleteSelected: () => void;
  onCloseSelected: () => void;
}

const GRID_CELLS = 12;
const CELL_SIZE = 1;
const BOARD_SIZE = GRID_CELLS * CELL_SIZE;
const HALF_BOARD = BOARD_SIZE / 2;

function toWorldFromGrid(gridIndex: number) {
  return gridIndex - HALF_BOARD + 0.5;
}

function getSnappedGridCoords(worldX: number, worldZ: number) {
  const gridX = toGridIndex(snapToGrid(worldX));
  const gridZ = toGridIndex(snapToGrid(worldZ));
  return { gridX, gridZ };
}

function snapToGrid(value: number) {
  const clamped = Math.max(-HALF_BOARD + 0.5, Math.min(HALF_BOARD - 0.5, value));
  return Math.round(clamped / CELL_SIZE) * CELL_SIZE;
}

function toGridIndex(worldValue: number) {
  return Math.round(worldValue + HALF_BOARD - 0.5);
}

export function AssetMesh({ asset }: { asset: BuildAsset }) {
  switch (asset.type) {
    case "column": {
      const l = asset.label.toLowerCase();
      const tall = l.includes("obelisk") || l.includes("spire") || l.includes("minaret");
      const wide = l.includes("pillar") || l.includes("colonnade") || l.includes("portico");
      const rTop = tall ? 0.12 : wide ? 0.28 : 0.2;
      const rBot = tall ? 0.14 : wide ? 0.32 : 0.24;
      const h = tall ? 1.55 : wide ? 0.95 : 1.3;
      return (
        <mesh>
          <cylinderGeometry args={[rTop, rBot, h, 8]} />
          <meshStandardMaterial color={asset.color} />
        </mesh>
      );
    }
    case "roof":
      if (asset.templateKey?.includes("layered")) {
        return (
          <group>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.62, 0.72, 0.18, 4]} />
              <meshStandardMaterial color={asset.color} />
            </mesh>
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.45, 0.55, 0.18, 4]} />
              <meshStandardMaterial color={asset.accent} />
            </mesh>
            <mesh position={[0, 0.55, 0]}>
              <cylinderGeometry args={[0.28, 0.38, 0.16, 4]} />
              <meshStandardMaterial color={asset.color} />
            </mesh>
          </group>
        );
      }
      if (asset.templateKey?.includes("curved")) {
        return (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.45, 0.12, 10, 14, Math.PI]} />
            <meshStandardMaterial color={asset.color} />
          </mesh>
        );
      }
      return (
        <mesh>
          <coneGeometry args={[0.55, 0.8, 4]} />
          <meshStandardMaterial color={asset.color} />
        </mesh>
      );
    case "torch":
      return (
        <group>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.9, 6]} />
            <meshStandardMaterial color={asset.color} />
          </mesh>
          <mesh position={[0, 0.95, 0]}>
            <sphereGeometry args={[0.12]} />
            <meshStandardMaterial color={asset.accent} emissive={asset.accent} emissiveIntensity={0.5} />
          </mesh>
        </group>
      );
    case "tree":
      if (asset.templateKey?.includes("cluster")) {
        return (
          <group>
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.08, 0.1, 0.8, 6]} />
              <meshStandardMaterial color="#7a5f3b" />
            </mesh>
            <mesh position={[-0.18, 0.9, 0]}>
              <sphereGeometry args={[0.24, 8, 8]} />
              <meshStandardMaterial color={asset.color} />
            </mesh>
            <mesh position={[0.18, 0.96, 0.06]}>
              <sphereGeometry args={[0.24, 8, 8]} />
              <meshStandardMaterial color={asset.accent} />
            </mesh>
          </group>
        );
      }
      return (
        <group>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 0.9, 6]} />
            <meshStandardMaterial color="#7a5f3b" />
          </mesh>
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.35, 8, 8]} />
            <meshStandardMaterial color={asset.color} />
          </mesh>
        </group>
      );
    case "gate":
      if (asset.templateKey?.includes("wide")) {
        return (
          <group>
            <mesh position={[0, 0.42, 0]}>
              <boxGeometry args={[1.35, 0.84, 0.24]} />
              <meshStandardMaterial color={asset.color} />
            </mesh>
            <mesh position={[0, 0.36, 0.13]}>
              <boxGeometry args={[0.7, 0.45, 0.12]} />
              <meshStandardMaterial color="#3f2f1a" />
            </mesh>
          </group>
        );
      }
      if (asset.templateKey?.includes("tall")) {
        return (
          <group>
            <mesh position={[0, 0.6, 0]}>
              <boxGeometry args={[1.05, 1.2, 0.25]} />
              <meshStandardMaterial color={asset.color} />
            </mesh>
            <mesh position={[0, 0.48, 0.14]}>
              <boxGeometry args={[0.42, 0.68, 0.13]} />
              <meshStandardMaterial color="#3f2f1a" />
            </mesh>
          </group>
        );
      }
      return (
        <group>
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[1.1, 0.9, 0.25]} />
            <meshStandardMaterial color={asset.color} />
          </mesh>
          <mesh position={[0, 0.45, 0.14]}>
            <boxGeometry args={[0.45, 0.5, 0.15]} />
            <meshStandardMaterial color="#3f2f1a" />
          </mesh>
        </group>
      );
    case "stairs":
      if (asset.templateKey?.includes("steep")) {
        return (
          <group>
            <mesh position={[0, 0.15, 0]}>
              <boxGeometry args={[1, 0.3, 0.95]} />
              <meshStandardMaterial color={asset.color} />
            </mesh>
            <mesh position={[0, 0.36, -0.18]}>
              <boxGeometry args={[0.74, 0.22, 0.64]} />
              <meshStandardMaterial color={asset.accent} />
            </mesh>
            <mesh position={[0, 0.52, -0.29]}>
              <boxGeometry args={[0.5, 0.16, 0.38]} />
              <meshStandardMaterial color={asset.color} />
            </mesh>
          </group>
        );
      }
      return (
        <group>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[1.2, 0.3, 1]} />
            <meshStandardMaterial color={asset.color} />
          </mesh>
          <mesh position={[0, 0.35, -0.15]}>
            <boxGeometry args={[0.8, 0.2, 0.7]} />
            <meshStandardMaterial color={asset.accent} />
          </mesh>
        </group>
      );
    case "banner":
      if (asset.templateKey?.includes("double")) {
        return (
          <group>
            <mesh position={[-0.1, 0.55, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 1.1, 8]} />
              <meshStandardMaterial color="#6e5432" />
            </mesh>
            <mesh position={[0.1, 0.55, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 1.1, 8]} />
              <meshStandardMaterial color="#6e5432" />
            </mesh>
            <mesh position={[-0.22, 0.76, 0]}>
              <boxGeometry args={[0.24, 0.3, 0.05]} />
              <meshStandardMaterial color={asset.color} />
            </mesh>
            <mesh position={[0.22, 0.7, 0]}>
              <boxGeometry args={[0.24, 0.3, 0.05]} />
              <meshStandardMaterial color={asset.accent} />
            </mesh>
          </group>
        );
      }
      return (
        <group>
          <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.1, 8]} />
            <meshStandardMaterial color="#6e5432" />
          </mesh>
          <mesh position={[0.22, 0.75, 0]}>
            <boxGeometry args={[0.4, 0.35, 0.05]} />
            <meshStandardMaterial color={asset.accent} />
          </mesh>
        </group>
      );
    case "statue":
      if (asset.templateKey?.includes("guardian")) {
        return (
          <group>
            <mesh position={[0, 0.22, 0]}>
              <boxGeometry args={[0.9, 0.44, 0.9]} />
              <meshStandardMaterial color={asset.color} />
            </mesh>
            <mesh position={[0, 0.7, 0]}>
              <octahedronGeometry args={[0.23, 0]} />
              <meshStandardMaterial color={asset.accent} />
            </mesh>
          </group>
        );
      }
      return (
        <group>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.8, 0.5, 0.8]} />
            <meshStandardMaterial color={asset.color} />
          </mesh>
          <mesh position={[0, 0.75, 0]}>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshStandardMaterial color={asset.accent} />
          </mesh>
        </group>
      );
    case "pond":
      return (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.08, 20]} />
          <meshStandardMaterial color={asset.color} emissive={asset.accent} emissiveIntensity={0.2} />
        </mesh>
      );
    case "rock":
      return (
        <mesh>
          <dodecahedronGeometry args={[0.45, 0]} />
          <meshStandardMaterial color={asset.color} />
        </mesh>
      );
    case "tower":
      if (asset.templateKey?.includes("square")) {
        return (
          <group>
            <mesh position={[0, 0.8, 0]}>
              <boxGeometry args={[0.62, 1.6, 0.62]} />
              <meshStandardMaterial color={asset.color} />
            </mesh>
            <mesh position={[0, 1.8, 0]}>
              <boxGeometry args={[0.72, 0.34, 0.72]} />
              <meshStandardMaterial color={asset.accent} />
            </mesh>
          </group>
        );
      }
      return (
        <group>
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.26, 0.3, 1.6, 10]} />
            <meshStandardMaterial color={asset.color} />
          </mesh>
          <mesh position={[0, 1.8, 0]}>
            <coneGeometry args={[0.33, 0.55, 8]} />
            <meshStandardMaterial color={asset.accent} />
          </mesh>
        </group>
      );
    default:
      return (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={asset.color} />
        </mesh>
      );
  }
}

export function CreativeBuildArea({
  readOnly = false,
  selectedAsset,
  placedAssets,
  selectedPlacedAssetId,
  onPlaceAsset,
  onSelectPlacedAsset,
  onScaleDownSelected,
  onScaleUpSelected,
  onRotateSelected,
  onDeleteSelected,
  onCloseSelected,
}: CreativeBuildAreaProps) {
  const [hoveredCell, setHoveredCell] = useState<{ gridX: number; gridZ: number } | null>(
    null,
  );

  const getPreviewGridY = (gridX: number, gridZ: number) => {
    if (!selectedAsset || selectedAsset.id !== "core-build-block") return 0;

    return placedAssets.filter(
      (item) =>
        item.gridX === gridX &&
        item.gridZ === gridZ &&
        item.asset.id === "core-build-block",
    ).length;
  };

  return (
    <group>
      <mesh position={[0, -0.45, 0]} receiveShadow>
        <boxGeometry args={[BOARD_SIZE + 1, 0.28, BOARD_SIZE + 1]} />
        <meshStandardMaterial color="#9cb4d8" />
      </mesh>

      <mesh
        position={[0, -0.23, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[BOARD_SIZE, BOARD_SIZE]} />
        <meshStandardMaterial color="#edf2ff" />
      </mesh>

      <gridHelper
        args={[BOARD_SIZE, GRID_CELLS, "#7aa5dd", "#a6c4e8"]}
        position={[0, -0.22, 0]}
      />

      <mesh
        position={[0, -0.21, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerMove={(event) => {
          if (readOnly) return;
          const { gridX, gridZ } = getSnappedGridCoords(event.point.x, event.point.z);
          setHoveredCell({ gridX, gridZ });
        }}
        onPointerOut={() => setHoveredCell(null)}
        onClick={(event) => {
          if (readOnly) return;
          const { gridX, gridZ } = getSnappedGridCoords(event.point.x, event.point.z);
          onPlaceAsset(gridX, gridZ);
        }}
      >
        <planeGeometry args={[BOARD_SIZE, BOARD_SIZE]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {!readOnly && selectedAsset && hoveredCell && (
        (() => {
          const previewGridY = getPreviewGridY(hoveredCell.gridX, hoveredCell.gridZ);
          const previewX = toWorldFromGrid(hoveredCell.gridX);
          const previewZ = toWorldFromGrid(hoveredCell.gridZ);
          const previewY = -0.1 + previewGridY;

          return (
            <group>
              <group position={[previewX, previewY, previewZ]}>
                <AssetMesh asset={selectedAsset} />
              </group>
              <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[previewX, previewY - 0.04, previewZ]}
              >
                <ringGeometry args={[0.36, 0.48, 24]} />
                <meshBasicMaterial color="#7dd3fc" transparent opacity={0.7} />
              </mesh>
            </group>
          );
        })()
      )}

      {!readOnly && hoveredCell && (
        <mesh
          position={[
            toWorldFromGrid(hoveredCell.gridX),
            -0.19,
            toWorldFromGrid(hoveredCell.gridZ),
          ]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.92, 0.92]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.2} />
        </mesh>
      )}

      {placedAssets.map((placed) => (
        <group
          key={placed.id}
          position={placed.position}
          scale={[placed.scale, placed.scale, placed.scale]}
          rotation={[0, placed.rotationY, 0]}
          onClick={(event) => {
            if (!readOnly) {
              event.stopPropagation();
              onSelectPlacedAsset(placed.id);
            }
          }}
        >
          {!readOnly && selectedPlacedAssetId === placed.id && (
            <>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
                <ringGeometry args={[0.58, 0.72, 28]} />
                <meshBasicMaterial color="#22d3ee" transparent opacity={0.75} />
              </mesh>
              <Html
                position={[0, 1.95 + placed.scale * 0.35, 0]}
                center
                distanceFactor={10}
              >
                <div
                  className="min-w-[260px] rounded-2xl border border-cyan-200/35 bg-slate-900/88 px-3 py-2 text-white shadow-[0_10px_22px_rgba(15,23,42,0.35)] backdrop-blur-md"
                  onPointerDown={(event) => event.stopPropagation()}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-cyan-100">
                      Selected: {placed.asset.label}
                    </p>
                    <button
                      type="button"
                      onClick={onCloseSelected}
                      className="h-6 w-6 rounded-md border border-cyan-300/40 bg-cyan-500/10 text-xs font-bold text-cyan-100 hover:bg-cyan-400/20"
                      title="Close panel"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onScaleDownSelected}
                      className="h-8 w-8 rounded-lg border border-slate-500 bg-slate-800 text-sm font-bold hover:bg-slate-700"
                      title="Scale down"
                    >
                      -
                    </button>
                    <span className="min-w-[74px] text-center text-xs">
                      Scale {placed.scale.toFixed(1)}x
                    </span>
                    <button
                      type="button"
                      onClick={onScaleUpSelected}
                      className="h-8 w-8 rounded-lg border border-slate-500 bg-slate-800 text-sm font-bold hover:bg-slate-700"
                      title="Scale up"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={onRotateSelected}
                      className="rounded-lg border border-cyan-300/50 bg-cyan-500/15 px-2 py-1 text-xs font-semibold text-cyan-100 hover:bg-cyan-400/25"
                      title="Rotate 90 degrees"
                    >
                      Rotate
                    </button>
                    <button
                      type="button"
                      onClick={onDeleteSelected}
                      className="rounded-lg border border-rose-300/50 bg-rose-500/15 px-2 py-1 text-xs font-semibold text-rose-100 hover:bg-rose-400/25"
                      title="Delete selected object"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Html>
            </>
          )}
          <AssetMesh asset={placed.asset} />
        </group>
      ))}
    </group>
  );
}
