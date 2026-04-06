"use client";

import { useMemo, useState } from "react";
import { Vector3 } from "three";
import { BuildAsset } from "@/lib/asset-generator";
import { Html } from "@react-three/drei";

export interface PlacedAsset {
  id: string;
  asset: BuildAsset;
  position: Vector3;
  gridX: number;
  gridZ: number;
  scale: number;
  rotationY: number;
}

interface CreativeBuildAreaProps {
  selectedAsset: BuildAsset | null;
  placedAssets: PlacedAsset[];
  selectedPlacedAssetId: string | null;
  onPlaceAsset: (gridX: number, gridZ: number, position: Vector3) => void;
  onSelectPlacedAsset: (assetId: string) => void;
  onScaleDownSelected: () => void;
  onScaleUpSelected: () => void;
  onRotateSelected: () => void;
  onDeleteSelected: () => void;
}

const GRID_CELLS = 12;
const CELL_SIZE = 1;
const BOARD_SIZE = GRID_CELLS * CELL_SIZE;
const HALF_BOARD = BOARD_SIZE / 2;

function snapToGrid(value: number) {
  const clamped = Math.max(-HALF_BOARD + 0.5, Math.min(HALF_BOARD - 0.5, value));
  return Math.round(clamped / CELL_SIZE) * CELL_SIZE;
}

function toGridIndex(worldValue: number) {
  return Math.round(worldValue + HALF_BOARD - 0.5);
}

function AssetMesh({ asset }: { asset: BuildAsset }) {
  switch (asset.type) {
    case "column":
      return (
        <mesh>
          <cylinderGeometry args={[0.2, 0.24, 1.3, 8]} />
          <meshStandardMaterial color={asset.color} />
        </mesh>
      );
    case "roof":
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
  selectedAsset,
  placedAssets,
  selectedPlacedAssetId,
  onPlaceAsset,
  onSelectPlacedAsset,
  onScaleDownSelected,
  onScaleUpSelected,
  onRotateSelected,
  onDeleteSelected,
}: CreativeBuildAreaProps) {
  const [hoveredCellWorld, setHoveredCellWorld] = useState<[number, number] | null>(
    null,
  );
  const ghostPosition = useMemo(() => new Vector3(0, -0.1, 0), []);

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
          const snappedX = snapToGrid(event.point.x);
          const snappedZ = snapToGrid(event.point.z);
          setHoveredCellWorld([snappedX, snappedZ]);
        }}
        onPointerOut={() => setHoveredCellWorld(null)}
        onClick={(event) => {
          const snappedX = snapToGrid(event.point.x);
          const snappedZ = snapToGrid(event.point.z);
          const pos = new Vector3(snappedX, -0.1, snappedZ);
          onPlaceAsset(toGridIndex(snappedX), toGridIndex(snappedZ), pos);
        }}
      >
        <planeGeometry args={[BOARD_SIZE, BOARD_SIZE]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {selectedAsset && hoveredCellWorld && (
        <group position={ghostPosition}>
          <group position={[hoveredCellWorld[0], 0, hoveredCellWorld[1]]}>
            <AssetMesh asset={selectedAsset} />
          </group>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[hoveredCellWorld[0], -0.04, hoveredCellWorld[1]]}
          >
            <ringGeometry args={[0.36, 0.48, 24]} />
            <meshBasicMaterial color="#7dd3fc" transparent opacity={0.7} />
          </mesh>
        </group>
      )}

      {hoveredCellWorld && (
        <mesh
          position={[hoveredCellWorld[0], -0.19, hoveredCellWorld[1]]}
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
            event.stopPropagation();
            onSelectPlacedAsset(placed.id);
          }}
        >
          {selectedPlacedAssetId === placed.id && (
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
                  <p className="mb-2 text-xs font-semibold text-cyan-100">
                    Selected: {placed.asset.label}
                  </p>
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
