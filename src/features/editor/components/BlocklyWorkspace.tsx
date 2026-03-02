"use client";

import { useEffect, useRef, useCallback } from "react";
import * as Blockly from "blockly";
import { MARTY_BLOCKS } from "../blocks/marty-blocks";
import { getToolboxConfig } from "../blocks/toolbox-config";

const STORAGE_KEY = "mini-marty-blockly-workspace";

export function BlocklyWorkspace() {
  const containerRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    Blockly.defineBlocksWithJsonArray(
      MARTY_BLOCKS.map((block) => ({
        type: block.type,
        message0: block.message0,
        args0: block.args0 ? [...block.args0] : undefined,
        message1: block.message1,
        args1: block.args1 ? [...block.args1] : undefined,
        colour: block.colour,
        tooltip: block.tooltip,
        previousStatement: block.previousStatement,
        nextStatement: block.nextStatement,
        output: block.output,
      })),
    );

    const workspace = Blockly.inject(containerRef.current, {
      toolbox: getToolboxConfig(),
      grid: { spacing: 20, length: 3, colour: "#ccc", snap: true },
      zoom: { controls: true, wheel: true, startScale: 1.0 },
      trashcan: true,
    });

    workspaceRef.current = workspace;

    return () => {
      workspace.dispose();
    };
  }, []);

  const handleSave = useCallback(() => {
    if (!workspaceRef.current) return;
    const state = Blockly.serialization.workspaces.save(workspaceRef.current);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, []);

  const handleLoad = useCallback(() => {
    if (!workspaceRef.current) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      Blockly.serialization.workspaces.load(
        JSON.parse(saved),
        workspaceRef.current,
      );
    }
  }, []);

  const handleUndo = useCallback(() => {
    workspaceRef.current?.undo(false);
  }, []);

  const handleRedo = useCallback(() => {
    workspaceRef.current?.undo(true);
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div
        role="toolbar"
        aria-label="Workspace controls"
        className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
      >
        <button
          onClick={handleUndo}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          Undo
        </button>
        <button
          onClick={handleRedo}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          Redo
        </button>
        <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" />
        <button
          onClick={handleSave}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          Save
        </button>
        <button
          onClick={handleLoad}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          Load
        </button>
      </div>
      <div
        ref={containerRef}
        data-testid="blockly-workspace"
        className="flex-1"
      />
    </div>
  );
}
