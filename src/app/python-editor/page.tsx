"use client";

import { PythonEditor } from "@/features/editor/components/PythonEditor";
import { EditorToolbar } from "@/features/editor/components/EditorToolbar";
import { usePythonEditor } from "@/features/editor/hooks/usePythonEditor";

export default function PythonEditorPage() {
  const { code, setCode, isRunning, clearCode, saveCode, loadCode, run, stop } =
    usePythonEditor();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Python Editor
        </h1>
      </div>
      <EditorToolbar
        onRun={run}
        onStop={stop}
        onClear={clearCode}
        onSave={saveCode}
        onLoad={loadCode}
        isRunning={isRunning}
      />
      <div className="flex-1">
        <PythonEditor value={code} onChange={setCode} />
      </div>
    </div>
  );
}
