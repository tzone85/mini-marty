"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { VirtualMarty } from "@/features/marty/virtual-marty";
import { MartyModel } from "./MartyModel";
import type { MartyModelHandle } from "./MartyModel";
import { AnimatedMarty } from "./AnimatedMarty";
import { SceneEnvironment } from "./SceneEnvironment";
import type { MartyPose, SceneConfig } from "../types";
import { DEFAULT_SCENE_CONFIG } from "../types";

interface MartySceneProps {
  readonly config?: Partial<SceneConfig>;
  readonly marty?: VirtualMarty | null;
  readonly onModelReady?: (handle: MartyModelHandle) => void;
}

// Pause the render loop when the tab is hidden or the user prefers
// reduced motion. Saves battery and respects WCAG 2.3.3.
function useSceneActive(): boolean {
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const reducedMotionMq = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    );

    const evaluate = () => {
      const visible = document.visibilityState !== "hidden";
      const reducedMotion = reducedMotionMq?.matches ?? false;
      setActive(visible && !reducedMotion);
    };

    evaluate();
    document.addEventListener("visibilitychange", evaluate);
    reducedMotionMq?.addEventListener?.("change", evaluate);

    return () => {
      document.removeEventListener("visibilitychange", evaluate);
      reducedMotionMq?.removeEventListener?.("change", evaluate);
    };
  }, []);

  return active;
}

export function MartyScene({
  config: configOverrides,
  marty = null,
  onModelReady,
}: MartySceneProps) {
  const modelRef = useRef<MartyModelHandle>(null);
  const active = useSceneActive();

  const config: SceneConfig = {
    ...DEFAULT_SCENE_CONFIG,
    ...configOverrides,
  };

  const handleRef = useCallback(
    (handle: MartyModelHandle | null) => {
      if (handle) {
        (modelRef as React.MutableRefObject<MartyModelHandle | null>).current =
          handle;
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
        frameloop={active ? "always" : "demand"}
        dpr={[1, 2]}
        camera={{
          position: [...config.cameraPosition],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        style={{ background: config.backgroundColor }}
      >
        <SceneEnvironment showGrid={config.showGrid} />
        {marty ? (
          <AnimatedMarty marty={marty} />
        ) : (
          <MartyModel ref={handleRef} />
        )}
      </Canvas>
    </div>
  );
}

export type { MartyModelHandle, MartyPose };
