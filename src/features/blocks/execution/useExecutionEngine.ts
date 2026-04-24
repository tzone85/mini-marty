"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import type { VirtualMarty } from "@/features/marty/virtual-marty";
import type { ExecutionState, ExecutionSpeed, BlockLike } from "./types";
import { INITIAL_EXECUTION_STATE } from "./types";
import { ExecutionEngine } from "./execution-engine";

interface UseExecutionEngineOptions {
  readonly marty: VirtualMarty | null;
}

interface UseExecutionEngineResult {
  readonly state: ExecutionState;
  readonly run: (topBlocks: readonly BlockLike[]) => void;
  readonly step: (topBlocks: readonly BlockLike[]) => void;
  readonly pause: () => void;
  readonly resume: () => void;
  readonly stop: () => void;
  readonly setSpeed: (speed: ExecutionSpeed) => void;
}

export function useExecutionEngine({
  marty,
}: UseExecutionEngineOptions): UseExecutionEngineResult {
  const engineRef = useRef(new ExecutionEngine());
  const [state, setState] = useState<ExecutionState>(INITIAL_EXECUTION_STATE);

  useEffect(() => {
    const engine = engineRef.current;
    engine.setMarty(marty);

    const unsubscribe = engine.subscribe((newState) => {
      setState(newState);
    });

    return () => {
      unsubscribe();
      engine.stop();
    };
  }, [marty]);

  const run = useCallback((topBlocks: readonly BlockLike[]) => {
    engineRef.current.run(topBlocks);
  }, []);

  const step = useCallback((topBlocks: readonly BlockLike[]) => {
    engineRef.current.step(topBlocks);
  }, []);

  const pause = useCallback(() => {
    engineRef.current.pause();
  }, []);

  const resume = useCallback(() => {
    engineRef.current.resume();
  }, []);

  const stop = useCallback(() => {
    engineRef.current.stop();
  }, []);

  const setSpeed = useCallback((speed: ExecutionSpeed) => {
    engineRef.current.setSpeed(speed);
  }, []);

  return { state, run, step, pause, resume, stop, setSpeed };
}
