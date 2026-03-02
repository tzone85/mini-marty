"use client";

import { useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { MartyModel } from "./MartyModel";
import type { MartyModelHandle } from "./MartyModel";
import { SceneEnvironment } from "./SceneEnvironment";
import type { MartyPose, SceneConfig } from "../types";
import { DEFAULT_SCENE_CONFIG } from "../types";

interface MartySceneProps {
  readonly config?: Partial<SceneConfig>;
  readonly onModelReady?: (handle: MartyModelHandle) => void;
}

export function MartyScene({
  config: configOverrides,
  onModelReady,
}: MartySceneProps) {
  const modelRef = useRef<MartyModelHandle>(null);

  const config: SceneConfig = {
    ...DEFAULT_SCENE_CONFIG,
    ...configOverrides,
  };

  const handleRef = useCallback(
    (handle: MartyModelHandle | null) => {
      if (handle) {
        (modelRef as React.MutableRefObject<MartyModelHandle | null>).current = handle;
        onModelReady?.(handle);
      }
    },
    [onModelReady],
  );

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
      data-testid="marty-scene"
    >
      <Canvas
        camera={{
          position: [...config.cameraPosition],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        style={{ background: config.backgroundColor }}
      >
        <SceneEnvironment showGrid={config.showGrid} />
        <MartyModel ref={handleRef} />
      </Canvas>
    </div>
  );
}

export type { MartyModelHandle, MartyPose };
