"use client";

import {
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import * as Blockly from "blockly";
import { MARTY_BLOCKS } from "./marty-blocks";
import { TOOLBOX_CONFIG } from "./toolbox-config";
import type { BlockLike } from "./execution/types";

const STORAGE_KEY = "mini-marty-blocks";

export interface BlocklyWorkspaceHandle {
  getTopBlocks(): BlockLike[];
  highlightBlock(blockId: string | null): void;
}

export const BlocklyWorkspace = forwardRef<BlocklyWorkspaceHandle>(
  function BlocklyWorkspace(_props, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

    useImperativeHandle(ref, () => ({
      getTopBlocks(): BlockLike[] {
        if (!workspaceRef.current) return [];
        return workspaceRef.current.getTopBlocks(
          true,
        ) as unknown as BlockLike[];
      },
      highlightBlock(blockId: string | null) {
        if (!workspaceRef.current) return;
        workspaceRef.current.highlightBlock(blockId ?? "");
      },
    }));

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

      return () => {
        workspaceRef.current?.dispose();
        workspaceRef.current = null;
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
        try {
          const state = JSON.parse(saved) as Record<string, unknown>;
          Blockly.serialization.workspaces.load(state, workspaceRef.current);
        } catch (error) {
          console.error("Failed to load workspace:", error);
        }
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
            onClick={handleUndo}
            className="rounded bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Undo
          </button>
          <button
            onClick={handleRedo}
            className="rounded bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Redo
          </button>
          <div className="mx-2 h-4 w-px bg-gray-300 dark:bg-gray-600" />
          <button
            onClick={handleSave}
            className="rounded bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Save
          </button>
          <button
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
  },
);
