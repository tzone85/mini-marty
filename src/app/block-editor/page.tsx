"use client";

import dynamic from "next/dynamic";

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

export default function BlockEditorPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 px-4 py-2 dark:border-gray-700">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          Block Editor
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Drag and drop blocks to program Marty the robot.
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <BlocklyWorkspace />
      </div>
    </div>
  );
}
