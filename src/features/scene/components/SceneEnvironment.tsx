"use client";

import { Grid, OrbitControls } from "@react-three/drei";

interface SceneEnvironmentProps {
  readonly showGrid?: boolean;
}

export function SceneEnvironment({ showGrid = true }: SceneEnvironmentProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-3, 4, -2]} intensity={0.3} />

      {/* Camera controls */}
      <OrbitControls
        makeDefault
        minDistance={2}
        maxDistance={12}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.1}
        enablePan={false}
      />

      {/* Ground grid */}
      {showGrid && (
        <Grid
          position={[0, 0, 0]}
          args={[10, 10]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#d0d0d0"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#a0a0a0"
          fadeDistance={15}
          fadeStrength={1}
          followCamera={false}
        />
      )}
    </>
  );
}
