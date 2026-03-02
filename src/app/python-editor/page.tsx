"use client";

import { useState, useCallback } from "react";
import { PythonEditor } from "@/features/editor/PythonEditor";
import { EditorToolbar } from "@/features/editor/EditorToolbar";
import {
  ConsoleOutput,
  type ConsoleEntry,
} from "@/features/editor/ConsoleOutput";
import { STARTER_TEMPLATE } from "@/features/editor/martypy-completions";
import { useTheme } from "@/lib/theme-context";

const STORAGE_KEY = "mini-marty-python-code";

export default function PythonEditorPage() {
  const { theme } = useTheme();
  const [code, setCode] = useState(STARTER_TEMPLATE);
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    setConsoleEntries((prev) => [
      ...prev,
      { type: "info" as const, text: "Running program..." },
    ]);
    // Actual execution will be handled by STORY-009 (Pyodide bridge)
    setTimeout(() => {
      setConsoleEntries((prev) => [
        ...prev,
        {
          type: "info" as const,
          text: "Python runtime not yet connected (STORY-009)",
        },
      ]);
      setIsRunning(false);
    }, 500);
  }, []);

  const handleStop = useCallback(() => {
    setIsRunning(false);
    setConsoleEntries((prev) => [
      ...prev,
      { type: "info" as const, text: "Program stopped." },
    ]);
  }, []);

  const handleClear = useCallback(() => {
    setConsoleEntries([]);
  }, []);

  const handleSave = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, code);
    setConsoleEntries((prev) => [
      ...prev,
      { type: "info" as const, text: "Code saved to browser storage." },
    ]);
  }, [code]);

  const handleLoad = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setCode(saved);
      setConsoleEntries((prev) => [
        ...prev,
        { type: "info" as const, text: "Code loaded from browser storage." },
      ]);
    } else {
      setConsoleEntries((prev) => [
        ...prev,
        { type: "info" as const, text: "No saved code found." },
      ]);
    }
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-700">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Python Editor
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Write Python code to control Marty the robot.
          </p>
        </div>
      </div>
      <EditorToolbar
        onRun={handleRun}
        onStop={handleStop}
        onClear={handleClear}
        onSave={handleSave}
        onLoad={handleLoad}
        isRunning={isRunning}
      />
      <div className="flex-1 overflow-hidden">
        <PythonEditor initialValue={code} onChange={setCode} theme={theme} />
      </div>
      <ConsoleOutput entries={consoleEntries} />
    </div>
  );
}
