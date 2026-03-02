"use client";

import { useRef, useMemo, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { VirtualMarty } from "@/features/marty/virtual-marty";
import { useExecutionEngine } from "@/features/blocks/execution/useExecutionEngine";
import { ExecutionControls } from "@/features/blocks/components/ExecutionControls";
import { ConsoleOutput } from "@/features/blocks/components/ConsoleOutput";
import type { BlocklyWorkspaceHandle } from "@/features/blocks/BlocklyWorkspace";

const BlocklyWorkspace = dynamic(
  () =>
    import("@/features/blocks/BlocklyWorkspace").then(
      (mod) => mod.BlocklyWorkspace,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-1 items-center justify-center text-gray-400">
        Loading Blockly workspace...
      </div>
    ),
  },
);

const MartyScene = dynamic(
  () =>
    import("@/features/scene/components/MartyScene").then(
      (mod) => mod.MartyScene,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-1 items-center justify-center text-gray-400">
        Loading 3D view...
      </div>
    ),
  },
);

export default function BlockEditorPage() {
  const workspaceRef = useRef<BlocklyWorkspaceHandle>(null);
  const marty = useMemo(() => new VirtualMarty(), []);
  const { state, run, step, pause, resume, stop, setSpeed } =
    useExecutionEngine({ marty });

  // Highlight the currently executing block
  useEffect(() => {
    workspaceRef.current?.highlightBlock(state.currentBlockId);
  }, [state.currentBlockId]);

  const handleRun = useCallback(() => {
    const blocks = workspaceRef.current?.getTopBlocks() ?? [];
    run(blocks);
  }, [run]);

  const handleStep = useCallback(() => {
    const blocks = workspaceRef.current?.getTopBlocks() ?? [];
    step(blocks);
  }, [step]);

  return (
    <div className="flex h-full flex-col">
      {/* Header with execution controls */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-700">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Block Editor
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Drag and drop blocks to program Marty the robot.
          </p>
        </div>
        <ExecutionControls
          status={state.status}
          speed={state.speed}
          onRun={handleRun}
          onStop={stop}
          onPause={pause}
          onResume={resume}
          onStep={handleStep}
          onSpeedChange={setSpeed}
        />
      </div>

      {/* Split view: blocks left, 3D right */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Blockly workspace */}
        <div className="flex w-3/5 flex-col border-r border-gray-200 dark:border-gray-700">
          <div className="flex-1 overflow-hidden">
            <BlocklyWorkspace ref={workspaceRef} />
          </div>
        </div>

        {/* Right: 3D viewport + console */}
        <div className="flex w-2/5 flex-col">
          {/* 3D Marty viewport */}
          <div className="flex-1 border-b border-gray-200 dark:border-gray-700">
            <MartyScene marty={marty} />
          </div>

          {/* Console output */}
          <div className="h-48 shrink-0">
            <ConsoleOutput entries={state.consoleEntries} />
          </div>
        </div>
      </div>
    </div>
  );
}
