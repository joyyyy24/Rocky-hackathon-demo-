"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useState } from "react";
import { FloatingIsland } from "./floating-island";
import { ChallengeArea } from "./challenge-area";
import { AICompanion3D } from "../ai/ai-companion-3d";
import AICompanion from "../ai/ai-companion";
import { AIContext } from "@/types/ai";

export default function WorldScene() {
  const [aiContext, setAiContext] = useState<AIContext>({
    action: "started_challenge",
  });

  const handleChallengeUpdate = (context: AIContext) => {
    setAiContext(context);
  };

  return (
    <div className="relative w-full h-screen">
      <Canvas camera={{ position: [8, 6, 8], fov: 60 }}>
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
          <ChallengeArea onContextUpdate={handleChallengeUpdate} />
          <AICompanion3D position={[6, 1, 6]} isActive={true} />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={15}
          />
        </Suspense>
      </Canvas>
      <AICompanion context={aiContext} />
    </div>
  );
}
