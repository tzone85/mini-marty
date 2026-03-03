"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type { VirtualMarty } from "@/features/marty/virtual-marty";
import type { CommandStartEvent } from "@/features/marty/types";
import type { MartyPose } from "../types";
import { DEFAULT_POSE } from "../types";
import type { MartyModelHandle } from "../components/MartyModel";

interface UseMartyModelOptions {
  readonly marty: VirtualMarty | null;
}

interface UseMartyModelResult {
  readonly pose: MartyPose;
  readonly isConnected: boolean;
  readonly currentAction: string | null;
  readonly onModelReady: (handle: MartyModelHandle) => void;
}

export function useMartyModel({
  marty,
}: UseMartyModelOptions): UseMartyModelResult {
  const [pose, setPose] = useState<MartyPose>(DEFAULT_POSE);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const modelHandleRef = useRef<MartyModelHandle | null>(null);

  const isConnected = useMemo(() => marty !== null, [marty]);

  const onModelReady = useCallback((handle: MartyModelHandle) => {
    modelHandleRef.current = handle;
  }, []);

  useEffect(() => {
    if (!marty) {
      return;
    }

    const handleCommandStart = (event: CommandStartEvent) => {
      setCurrentAction(event.command.action);
    };

    const handleCommandComplete = () => {
      setCurrentAction(null);
      setPose(DEFAULT_POSE);
      if (modelHandleRef.current) {
        modelHandleRef.current.applyPose(DEFAULT_POSE);
      }
    };

    marty.on("commandStart", handleCommandStart);
    marty.on("commandComplete", handleCommandComplete);

    return () => {
      marty.off("commandStart", handleCommandStart);
      marty.off("commandComplete", handleCommandComplete);
    };
  }, [marty]);

  useEffect(() => {
    if (modelHandleRef.current) {
      modelHandleRef.current.applyPose(pose);
    }
  }, [pose]);

  return {
    pose,
    isConnected,
    currentAction,
    onModelReady,
  };
}
