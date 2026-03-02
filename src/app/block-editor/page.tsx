"use client";

import dynamic from "next/dynamic";

const BlocklyWorkspace = dynamic(
  () =>
    import("@/features/editor/components/BlocklyWorkspace").then(
      (mod) => mod.BlocklyWorkspace,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        data-testid="blockly-loading"
        className="flex flex-1 items-center justify-center text-gray-400 dark:text-gray-500"
      >
        Loading Blockly editor…
      </div>
    ),
  },
);

export default function BlockEditorPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Block Editor
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Drag and drop blocks to program Marty the robot.
        </p>
      </div>
      <div className="flex-1">
        <BlocklyWorkspace />
      </div>
    </div>
  );
}
