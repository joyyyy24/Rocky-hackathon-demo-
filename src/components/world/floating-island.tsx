"use client";

import { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

export function FloatingIsland() {
  const islandRef = useRef<Mesh>(null);

  // Gentle floating animation
  useFrame((state) => {
    if (islandRef.current) {
      islandRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      islandRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <group position={[0, -2, 0]}>
      {/* Main island base - soft rounded shape */}
      <mesh ref={islandRef} castShadow receiveShadow>
        <cylinderGeometry args={[4, 3.5, 1.5, 16]} />
        <meshStandardMaterial color="#FFB6C1" />
      </mesh>

      {/* Island top surface - slightly raised */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.8, 3.3, 0.8, 16]} />
        <meshStandardMaterial color="#E6E6FA" />
      </mesh>

      {/* Playful grass tufts */}
      <mesh position={[-1.5, 0.8, 1]} castShadow>
        <coneGeometry args={[0.3, 0.8, 6]} />
        <meshStandardMaterial color="#98FB98" />
      </mesh>
      <mesh position={[1.2, 0.8, -0.8]} castShadow>
        <coneGeometry args={[0.25, 0.6, 6]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>
      <mesh position={[0.5, 0.8, 1.5]} castShadow>
        <coneGeometry args={[0.35, 0.9, 6]} />
        <meshStandardMaterial color="#32CD32" />
      </mesh>

      {/* Cute tree */}
      <mesh position={[2, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[2, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.4, 8, 6]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>

      {/* Small flowers */}
      <mesh position={[-2, 0.9, -1]} castShadow>
        <sphereGeometry args={[0.1, 6, 4]} />
        <meshStandardMaterial color="#FF69B4" />
      </mesh>
      <mesh position={[-1.8, 0.9, -1.2]} castShadow>
        <sphereGeometry args={[0.08, 6, 4]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>

      {/* Magical glow effect */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshBasicMaterial color="#FFFACD" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
