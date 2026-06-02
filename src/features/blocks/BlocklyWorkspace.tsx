"use client";

import { useEffect, useRef, useCallback } from "react";
import * as Blockly from "blockly";
import { MARTY_BLOCKS } from "./marty-blocks";
import { TOOLBOX_CONFIG } from "./toolbox-config";
import { createSafeStorage } from "@/lib/storage/safe-storage";
import { migrateRawString } from "@/lib/storage/migrate";
import { BlocksStateSchema } from "@/lib/schemas/blocks";

const STORAGE_KEY = "mini-marty:blocks:v1";
const LEGACY_KEY = "mini-marty-blocks";

const blocksStorage = createSafeStorage(STORAGE_KEY, BlocksStateSchema);

function migrateLegacyBlocks(): void {
  if (typeof window === "undefined") return;
  migrateRawString(
    window.localStorage,
    LEGACY_KEY,
    STORAGE_KEY,
    (raw) => ({ version: 1 as const, xml: raw }),
  );
}

export function BlocklyWorkspace() {
  const containerRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    Blockly.defineBlocksWithJsonArray(
      MARTY_BLOCKS as unknown as Record<string, unknown>[],
    );

    workspaceRef.current = Blockly.inject(containerRef.current, {
      toolbox:
        TOOLBOX_CONFIG as unknown as Blockly.utils.toolbox.ToolboxDefinition,
      grid: {
        spacing: 20,
        length: 3,
        colour: "#ccc",
        snap: true,
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      trashcan: true,
    });

    migrateLegacyBlocks();

    return () => {
      workspaceRef.current?.dispose();
      workspaceRef.current = null;
    };
  }, []);

  const handleSave = useCallback(() => {
    if (!workspaceRef.current) return;
    const state = Blockly.serialization.workspaces.save(workspaceRef.current);
    blocksStorage.set({ version: 1, xml: JSON.stringify(state) });
  }, []);

  const handleLoad = useCallback(() => {
    if (!workspaceRef.current) return;
    const saved = blocksStorage.get();
    if (!saved) return;
    try {
      const state = JSON.parse(saved.xml) as Record<string, unknown>;
      Blockly.serialization.workspaces.load(state, workspaceRef.current);
    } catch {
      // Corrupt payload — discard so future saves can recover.
      blocksStorage.clear();
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
      <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
        <button
          type="button"
          onClick={handleUndo}
          className="rounded bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={handleRedo}
          className="rounded bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Redo
        </button>
        <div className="mx-2 h-4 w-px bg-gray-300 dark:bg-gray-600" />
        <button
          type="button"
          onClick={handleSave}
          className="rounded bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Save
        </button>
        <button
          type="button"
          onClick={handleLoad}
          className="rounded bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Load
        </button>
      </div>
      <div
        ref={containerRef}
        data-testid="blockly-container"
        className="flex-1"
      />
    </div>
  );
}
