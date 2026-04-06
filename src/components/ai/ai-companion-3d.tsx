"use client";

import { useMemo, useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

interface AICompanion3DProps {
  position?: [number, number, number];
  isActive?: boolean;
  onRockyClick?: () => void;
}

export function AICompanion3D({
  position = [3.8, 2.1, 3.8],
  isActive = true,
  onRockyClick,
}: AICompanion3DProps) {
  const meshRef = useRef<Mesh>(null);
  const particles = useMemo(
    () =>
      [
        [0.7, 0.2, 0],
        [-0.7, -0.1, 0.1],
        [0, 0.35, 0.7],
        [0, -0.2, -0.7],
      ] as Array<[number, number, number]>,
    [],
  );

  useFrame((state) => {
    if (meshRef.current && isActive) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 1.6) * 0.18;
      meshRef.current.rotation.y += 0.01;
    }
  });

  if (!isActive) return null;

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        onRockyClick?.();
      }}
    >
      <group>
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[0.48, 0]} />
          <meshStandardMaterial
            color="#4aa8ff"
            emissive="#2a73ff"
            emissiveIntensity={0.65}
            roughness={0.25}
            metalness={0.1}
          />
        </mesh>
        <mesh position={[-0.1, 0.04, 0.42]}>
          <sphereGeometry args={[0.055]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0.1, 0.04, 0.42]}>
          <sphereGeometry args={[0.055]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0, -0.08, 0.42]}>
          <torusGeometry args={[0.08, 0.015, 10, 20, Math.PI]} />
          <meshStandardMaterial color="#d8f4ff" emissive="#7bd9ff" emissiveIntensity={0.25} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <torusGeometry args={[0.68, 0.03, 8, 40]} />
          <meshStandardMaterial color="#9ed5ff" emissive="#57a9ff" emissiveIntensity={0.45} />
        </mesh>
        {particles.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <sphereGeometry args={[0.06]} />
            <meshStandardMaterial color="#c9efff" emissive="#93ddff" emissiveIntensity={0.8} />
          </mesh>
        ))}
      </group>
    </mesh>
  );
}
