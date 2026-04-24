import { useState, useCallback } from "react";
import { STARTER_TEMPLATE } from "../martypy-completions";

const STORAGE_KEY = "mini-marty-python-code";

export function usePythonEditor() {
  const [code, setCode] = useState(STARTER_TEMPLATE);
  const [isRunning, setIsRunning] = useState(false);

  const clearCode = useCallback(() => {
    setCode(STARTER_TEMPLATE);
  }, []);

  const saveCode = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, code);
  }, [code]);

  const loadCode = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      setCode(saved);
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
