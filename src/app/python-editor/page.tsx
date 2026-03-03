"use client";

import { useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { PythonEditor } from "@/features/editor/components/PythonEditor";
import { EditorToolbar } from "@/features/editor/components/EditorToolbar";
import { usePythonEditor } from "@/features/editor/hooks/usePythonEditor";
import { ConsoleOutput } from "@/features/python-runtime/components/ConsoleOutput";
import { PyodideStatus } from "@/features/python-runtime/components/PyodideStatus";
import { usePyodide } from "@/features/python-runtime/hooks/usePyodide";
import { usePythonExecution } from "@/features/python-runtime/hooks/usePythonExecution";
import { VirtualMarty } from "@/features/marty/virtual-marty";

const MartyScene = dynamic(
  () =>
    import("@/features/scene/components/MartyScene").then(
      (mod) => mod.MartyScene,
    ),
  { ssr: false },
);

export default function PythonEditorPage() {
  const { code, setCode, clearCode, saveCode, loadCode } = usePythonEditor();
  const {
    state: pyodideState,
    error: pyodideError,
    instance,
    initialize,
  } = usePyodide();

  const marty = useMemo(() => new VirtualMarty(), []);

  const { isRunning, consoleEntries, run, stop, clearConsole } =
    usePythonExecution(instance, marty);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleRun = () => {
    run(code);
  };

  const handleStop = () => {
    stop();
  };

  const isReady = pyodideState === "ready";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Python Editor
        </h1>
        <PyodideStatus
          state={pyodideState}
          error={pyodideError}
          onRetry={initialize}
        />
      </div>
      <EditorToolbar
        onRun={handleRun}
        onStop={handleStop}
        onClear={clearCode}
        onSave={saveCode}
        onLoad={loadCode}
        isRunning={isRunning || !isReady}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-1/2 flex-col border-r border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            <PythonEditor value={code} onChange={setCode} />
          </div>
          <div className="h-48 border-t border-gray-200 dark:border-gray-700">
            <ConsoleOutput entries={consoleEntries} onClear={clearConsole} />
          </div>
        </div>
        <div className="w-1/2" data-testid="marty-viewport">
          <MartyScene marty={marty} />
        </div>
      </div>
    </div>
  );
}
