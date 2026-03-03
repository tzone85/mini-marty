import { useState, useEffect, useCallback } from "react";
import type { PyodideLoadingState } from "../types";
import type { PyodideInstance } from "../pyodide-service";
import {
  loadPyodide,
  onStateChange,
  getLoadingState,
  getInstance,
} from "../pyodide-service";

export interface UsePyodideResult {
  readonly state: PyodideLoadingState;
  readonly error: string | null;
  readonly instance: PyodideInstance | null;
  readonly initialize: () => Promise<void>;
}

export function usePyodide(): UsePyodideResult {
  const [state, setState] = useState<PyodideLoadingState>(getLoadingState);
  const [error, setError] = useState<string | null>(null);
  const [instance, setInstance] = useState<PyodideInstance | null>(getInstance);

  useEffect(() => {
    const unsubscribe = onStateChange(
      (newState: PyodideLoadingState, err?: string) => {
        setState(newState);
        if (err) setError(err);
        if (newState === "ready") {
          setInstance(getInstance());
        }
      },
    );

    return unsubscribe;
  }, []);

  const initialize = useCallback(async () => {
    try {
      setError(null);
      const pyodide = await loadPyodide();
      setInstance(pyodide);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to initialize Pyodide";
      setError(message);
    }
  }, []);

  return { state, error, instance, initialize } as const;
}
