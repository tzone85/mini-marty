import { useState, useCallback, useRef } from "react";
import type { ConsoleEntry } from "../types";
import type { PyodideInstance } from "../pyodide-service";
import { VirtualMarty } from "@/features/marty/virtual-marty";
import { registerMartyModule, executePythonCode } from "../python-executor";

export interface UsePythonExecutionResult {
  readonly isRunning: boolean;
  readonly consoleEntries: readonly ConsoleEntry[];
  readonly lastError: string | null;
  readonly run: (code: string) => Promise<void>;
  readonly stop: () => void;
  readonly clearConsole: () => void;
}

export function usePythonExecution(
  pyodide: PyodideInstance | null,
  marty: VirtualMarty | null,
): UsePythonExecutionResult {
  const [isRunning, setIsRunning] = useState(false);
  const [consoleEntries, setConsoleEntries] = useState<readonly ConsoleEntry[]>(
    [],
  );
  const [lastError, setLastError] = useState<string | null>(null);
  const registeredRef = useRef(false);
  const abortRef = useRef(false);

  const addEntry = useCallback((entry: ConsoleEntry) => {
    setConsoleEntries((prev) => [...prev, entry]);
  }, []);

  const clearConsole = useCallback(() => {
    setConsoleEntries([]);
    setLastError(null);
  }, []);

  const run = useCallback(
    async (code: string) => {
      if (!pyodide || !marty) return;
      if (isRunning) return;

      abortRef.current = false;
      setIsRunning(true);
      setLastError(null);

      try {
        if (!registeredRef.current) {
          await registerMartyModule(pyodide, marty);
          registeredRef.current = true;
        }

        if (abortRef.current) return;

        const result = await executePythonCode(pyodide, code, {
          onStdout: addEntry,
          onStderr: addEntry,
        });

        if (!result.success && result.error) {
          setLastError(result.error);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Execution failed";
        setLastError(message);
      } finally {
        setIsRunning(false);
      }
    },
    [pyodide, marty, isRunning, addEntry],
  );

  const stop = useCallback(() => {
    abortRef.current = true;
    if (marty) {
      marty.stop();
    }
    setIsRunning(false);
  }, [marty]);

  return {
    isRunning,
    consoleEntries,
    lastError,
    run,
    stop,
    clearConsole,
  } as const;
}
