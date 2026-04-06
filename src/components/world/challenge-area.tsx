"use client";

import { useState, useRef } from "react";
import { Mesh, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { AIContext } from "@/types/ai";
import { PlacedCube, isChallengeComplete } from "@/lib/challenge-logic";

interface ChallengeAreaProps {
  onContextUpdate?: (context: AIContext) => void;
}

export function ChallengeArea({ onContextUpdate }: ChallengeAreaProps) {
  const [placedCubes, setPlacedCubes] = useState<PlacedCube[]>([]);
  const [selectedCube, setSelectedCube] = useState<number | null>(null);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  // Configuration constants
  const AVAILABLE_CUBES = [1, 2, 3];
  const CUBE_HEIGHT = 0.5;
  const CHALLENGE_ID = "line_challenge";
  const STORAGE_KEY = "challenge1_completed";

  const handleCubeClick = (cubeId: number) => {
    const isAlreadyPlaced = placedCubes.some((cube) => cube.id === cubeId);

    if (isAlreadyPlaced) {
      // Remove the cube
      const updatedCubes = placedCubes.filter((cube) => cube.id !== cubeId);
      setPlacedCubes(updatedCubes);

      onContextUpdate?.({
        action: "removed_cube",
        progress: updatedCubes.length / AVAILABLE_CUBES.length,
      });
    } else {
      setSelectedCube(cubeId);
    }
  };

  const handleGroundClick = (event: any) => {
    if (!selectedCube || placedCubes.some((cube) => cube.id === selectedCube)) {
      return;
    }

    const position = event.point.clone();
    // Position cubes on the island surface (island is at y=-2, surface at y=-0.5)
    position.y = -0.5 + CUBE_HEIGHT;

    const newCube: PlacedCube = { id: selectedCube, position };
    const updatedCubes = [...placedCubes, newCube];

    setPlacedCubes(updatedCubes);
    setSelectedCube(null);

    onContextUpdate?.({
      action: "placed_cube",
      progress: updatedCubes.length / AVAILABLE_CUBES.length,
    });

    // Check for challenge completion
    if (isChallengeComplete(CHALLENGE_ID, updatedCubes)) {
      setChallengeCompleted(true);
      localStorage.setItem(STORAGE_KEY, "true");

      onContextUpdate?.({
        action: "completed_challenge",
        challengeId: CHALLENGE_ID,
      });
    }
  };

  return (
    <group>
      {/* Available cubes to place - positioned above island */}
      {AVAILABLE_CUBES.map((id) => {
        const isPlaced = placedCubes.some((cube) => cube.id === id);
        if (isPlaced) return null;

        return (
          <mesh
            key={id}
            position={[-6 + id * 2, 1, -6]} // Above island surface
            onClick={() => handleCubeClick(id)}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={selectedCube === id ? "yellow" : "blue"}
            />
          </mesh>
        );
      })}

      {/* Placed cubes */}
      {placedCubes.map((cube) => (
        <mesh key={cube.id} position={cube.position}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="green" />
        </mesh>
      ))}

      {/* Invisible ground for clicking - matches island surface */}
      <mesh
        position={[0, -0.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={handleGroundClick}
        visible={false}
      >
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial />
      </mesh>

      {/* Challenge completion indicator */}
      {challengeCompleted && (
        <mesh position={[0, 2, 0]}>
          <sphereGeometry args={[0.5]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.3}
          />
        </mesh>
      )}
    </group>
  );
}
