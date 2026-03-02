"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { VirtualMarty } from "@/features/marty/virtual-marty";
import type { CommandStartEvent } from "@/features/marty/types";
import type { MartyModelHandle } from "../components/MartyModel";
import type { AnimationAction } from "./types";
import { AnimationPlayer } from "./player";
import { getSequenceForAction } from "./definitions";

interface UseMartyAnimationOptions {
  readonly marty: VirtualMarty | null;
}

interface UseMartyAnimationResult {
  readonly currentAction: AnimationAction;
  readonly isAnimating: boolean;
  readonly onModelReady: (handle: MartyModelHandle) => void;
}

export function useMartyAnimation({
  marty,
}: UseMartyAnimationOptions): UseMartyAnimationResult {
  const playerRef = useRef(new AnimationPlayer());
  const modelRef = useRef<MartyModelHandle | null>(null);
  const [currentAction, setCurrentAction] = useState<AnimationAction>("idle");
  const [isAnimating, setIsAnimating] = useState(false);

  const onModelReady = useCallback((handle: MartyModelHandle) => {
    modelRef.current = handle;
  }, []);

  useEffect(() => {
    if (!marty) {
      return;
    }

    const player = playerRef.current;

    const handleCommandStart = (event: CommandStartEvent) => {
      const { command } = event;
      const action = command.action as AnimationAction;
      const sequence = getSequenceForAction(command.action, command.params);

      player.play(action, sequence);
      setCurrentAction(action);
      setIsAnimating(true);
    };

    const handleCommandComplete = () => {
      player.stop();
      setCurrentAction("idle");
      setIsAnimating(false);
    };

    marty.on("commandStart", handleCommandStart);
    marty.on("commandComplete", handleCommandComplete);

    return () => {
      marty.off("commandStart", handleCommandStart);
      marty.off("commandComplete", handleCommandComplete);
      player.stop();
    };
  }, [marty]);

  // Drive animation per frame — this runs at ~60fps inside the R3F Canvas
  useFrame((_state, delta) => {
    if (!playerRef.current.isPlaying()) {
      return;
    }

    const deltaMs = delta * 1000;
    const pose = playerRef.current.tick(deltaMs);

    if (modelRef.current) {
      modelRef.current.applyPose(pose);
    }

    if (!playerRef.current.isPlaying()) {
      setIsAnimating(false);
      setCurrentAction("idle");
    }
  });

  return {
    currentAction,
    isAnimating,
    onModelReady,
  };
}
