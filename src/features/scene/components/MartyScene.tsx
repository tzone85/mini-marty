"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { MartyModel } from "./MartyModel";
import type { MartySceneProps } from "../types";

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  );
}

function FloorGrid() {
  return (
    <Grid
      args={[10, 10]}
      position={[0, 0, 0]}
      cellSize={0.5}
      cellThickness={0.5}
      cellColor="#888888"
      sectionSize={2}
      sectionThickness={1}
      sectionColor="#444444"
      fadeDistance={15}
      fadeStrength={1}
      infiniteGrid
    />
  );
}

export function MartyScene({ jointRefs, className }: MartySceneProps) {
  return (
    <div
      className={className ?? "h-full w-full"}
      data-testid="marty-scene-container"
    >
      <Canvas
        camera={{ position: [2, 2, 3], fov: 50 }}
        shadows
        data-testid="marty-canvas"
      >
        <SceneLighting />
        <FloorGrid />
        <MartyModel jointRefs={jointRefs} />
        <OrbitControls
          enableDamping
          dampingFactor={0.1}
          minDistance={1}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
}
