import { describe, it, expect } from "vitest";
import type {
  ExecutionStatus,
  ExecutionSpeed,
  ConsoleEntry,
  ExecutionState,
  BlockLike,
} from "./types";
import { SPEED_MULTIPLIER, INITIAL_EXECUTION_STATE } from "./types";

describe("execution types", () => {
  it("SPEED_MULTIPLIER has correct values", () => {
    expect(SPEED_MULTIPLIER.slow).toBe(0.5);
    expect(SPEED_MULTIPLIER.normal).toBe(1);
    expect(SPEED_MULTIPLIER.fast).toBe(2);
  });

  it("INITIAL_EXECUTION_STATE is idle with normal speed", () => {
    expect(INITIAL_EXECUTION_STATE.status).toBe("idle");
    expect(INITIAL_EXECUTION_STATE.speed).toBe("normal");
    expect(INITIAL_EXECUTION_STATE.currentBlockId).toBeNull();
    expect(INITIAL_EXECUTION_STATE.consoleEntries).toEqual([]);
  });

  it("ExecutionStatus covers all states", () => {
    const statuses: ExecutionStatus[] = [
      "idle",
      "running",
      "paused",
      "stepping",
      "error",
      "completed",
    ];
    expect(statuses).toHaveLength(6);
  });

  it("ExecutionSpeed covers all speeds", () => {
    const speeds: ExecutionSpeed[] = ["slow", "normal", "fast"];
    expect(speeds).toHaveLength(3);
  });

  it("ConsoleEntry can be constructed", () => {
    const entry: ConsoleEntry = {
      id: "1",
      timestamp: Date.now(),
      type: "command",
      message: "Walk 2 steps",
    };
    expect(entry.type).toBe("command");
  });

  it("ExecutionState can be constructed", () => {
    const state: ExecutionState = {
      status: "running",
      speed: "fast",
      currentBlockId: "block-1",
      consoleEntries: [],
    };
    expect(state.status).toBe("running");
    expect(state.currentBlockId).toBe("block-1");
  });

  it("BlockLike interface shape is correct", () => {
    const block: BlockLike = {
      id: "test",
      type: "marty_walk",
      getFieldValue: () => 2,
      getInputTargetBlock: () => null,
      getNextBlock: () => null,
    };
    expect(block.id).toBe("test");
    expect(block.getFieldValue("STEPS")).toBe(2);
    expect(block.getNextBlock()).toBeNull();
  });
});
