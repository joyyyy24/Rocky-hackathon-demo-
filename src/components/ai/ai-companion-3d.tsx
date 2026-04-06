"use client";

import { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

interface AICompanion3DProps {
  position?: [number, number, number];
  isActive?: boolean;
}

export function AICompanion3D({
  position = [8, 2, 8],
  isActive = true,
}: AICompanion3DProps) {
  const meshRef = useRef<Mesh>(null);

  // Gentle floating animation
  useFrame((state) => {
    if (meshRef.current && isActive) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  if (!isActive) return null;

  return (
    <mesh ref={meshRef} position={position}>
      {/* Simple robot-like avatar */}
      <group>
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 1.2, 0.6]} />
          <meshStandardMaterial color="#4A90E2" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color="#5BA0F2" />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.15, 0.85, 0.31]}>
          <sphereGeometry args={[0.08]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.15, 0.85, 0.31]}>
          <sphereGeometry args={[0.08]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Antenna */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4]} />
          <meshStandardMaterial color="#FF6B6B" />
        </mesh>
        <mesh position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial
            color="#FFD93D"
            emissive="#FFD93D"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
    </mesh>
  );
}
