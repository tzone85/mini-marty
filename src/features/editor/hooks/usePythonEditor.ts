import { useState, useCallback } from "react";
import { STARTER_TEMPLATE } from "../martypy-completions";
import { createSafeStorage } from "@/lib/storage/safe-storage";
import { migrateRawString } from "@/lib/storage/migrate";
import { PythonStateSchema } from "@/lib/schemas/python";

const STORAGE_KEY = "mini-marty:python:v1";
const LEGACY_KEY = "mini-marty-python-code";

const pythonStorage = createSafeStorage(STORAGE_KEY, PythonStateSchema);

function migrateLegacyPython(): void {
  if (typeof window === "undefined") return;
  migrateRawString(
    window.localStorage,
    LEGACY_KEY,
    STORAGE_KEY,
    (raw) => ({ version: 1 as const, source: raw }),
  );
}

export function usePythonEditor() {
  const [code, setCode] = useState(STARTER_TEMPLATE);
  const [isRunning, setIsRunning] = useState(false);

  const clearCode = useCallback(() => {
    setCode(STARTER_TEMPLATE);
  }, []);

  const saveCode = useCallback(() => {
    pythonStorage.set({ version: 1, source: code });
  }, [code]);

  const loadCode = useCallback(() => {
    migrateLegacyPython();
    const saved = pythonStorage.get();
    if (saved !== null) {
      setCode(saved.source);
    }
  }, []);

  const run = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  return {
    code,
    setCode,
    isRunning,
    clearCode,
    saveCode,
    loadCode,
    run,
    stop,
  } as const;
}
