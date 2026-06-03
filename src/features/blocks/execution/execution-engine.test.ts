import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExecutionEngine } from "./execution-engine";
import { VirtualMarty } from "@/features/marty/virtual-marty";
import type { BlockLike } from "./types";

function createMockBlock(overrides: Partial<BlockLike> = {}): BlockLike {
  return {
    id: "block-1",
    type: "marty_walk",
    getFieldValue: () => 2,
    getInputTargetBlock: () => null,
    getNextBlock: () => null,
    ...overrides,
  };
}

describe("ExecutionEngine", () => {
  let engine: ExecutionEngine;
  let marty: VirtualMarty;

  beforeEach(() => {
    vi.useFakeTimers();
    engine = new ExecutionEngine();
    marty = new VirtualMarty();
    engine.setMarty(marty);
  });

  it("starts in idle state", () => {
    const state = engine.getState();
    expect(state.status).toBe("idle");
    expect(state.speed).toBe("normal");
    expect(state.currentBlockId).toBeNull();
    expect(state.consoleEntries).toEqual([]);
  });

  it("notifies listeners on state change", () => {
    const listener = vi.fn();
    engine.subscribe(listener);
    engine.setSpeed("fast");
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ speed: "fast" }),
    );
  });

  it("unsubscribe removes listener", () => {
    const listener = vi.fn();
    const unsub = engine.subscribe(listener);
    unsub();
    engine.setSpeed("fast");
    expect(listener).not.toHaveBeenCalled();
  });

  it("run sets status to running", async () => {
    const listener = vi.fn();
    engine.subscribe(listener);

    const block = createMockBlock();
    engine.run([block]);

    expect(engine.getState().status).toBe("running");
  });

  it("run executes blocks and completes", async () => {
    const walkSpy = vi.spyOn(marty, "walk");
    const block = createMockBlock();

    const promise = engine.run([block]);
    await vi.advanceTimersByTimeAsync(5000);
    await promise;

    expect(walkSpy).toHaveBeenCalled();
    expect(engine.getState().status).toBe("completed");
  });

  it("run with marty_when_start block uses it as entry point", async () => {
    const walkSpy = vi.spyOn(marty, "walk");

    const walkBlock = createMockBlock({
      id: "walk-1",
      type: "marty_walk",
      getFieldValue: () => 2,
    });

    const startBlock = createMockBlock({
      id: "start",
      type: "marty_when_start",
      getNextBlock: () => walkBlock,
    });

    const promise = engine.run([startBlock]);
    await vi.advanceTimersByTimeAsync(5000);
    await promise;

    expect(walkSpy).toHaveBeenCalled();
  });

  it("stop halts execution and resets to idle", async () => {
    const block = createMockBlock();
    engine.run([block]);

    engine.stop();

    expect(engine.getState().status).toBe("idle");
  });

  it("pause sets status to paused", async () => {
    const block = createMockBlock();
    engine.run([block]);

    engine.pause();

    expect(engine.getState().status).toBe("paused");
  });

  it("resume after pause sets status back to running", async () => {
    const block = createMockBlock();
    engine.run([block]);

    engine.pause();
    expect(engine.getState().status).toBe("paused");

    engine.resume();
    expect(engine.getState().status).toBe("running");
  });

  it("run without marty logs error", async () => {
    const noMartyEngine = new ExecutionEngine();
    const block = createMockBlock();

    await noMartyEngine.run([block]);

    const entries = noMartyEngine.getState().consoleEntries;
    expect(entries.some((e) => e.type === "error")).toBe(true);
  });

  it("setSpeed changes speed", () => {
    engine.setSpeed("slow");
    expect(engine.getState().speed).toBe("slow");
  });

  it("run adds console entries", async () => {
    const block = createMockBlock();
    const promise = engine.run([block]);
    await vi.advanceTimersByTimeAsync(5000);
    await promise;

    const entries = engine.getState().consoleEntries;
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0].type).toBe("info");
    expect(entries[0].message).toContain("started");
  });

  it("does not run if already running", async () => {
    const block = createMockBlock();
    engine.run([block]);

    // Second run should be ignored
    await engine.run([block]);

    // Still running from first call
    expect(engine.getState().status).toBe("running");
  });

  it("stop clears console entries on next run", async () => {
    const block = createMockBlock();
    const promise = engine.run([block]);
    await vi.advanceTimersByTimeAsync(5000);
    await promise;

    expect(engine.getState().consoleEntries.length).toBeGreaterThan(0);

    // New run clears entries
    const promise2 = engine.run([block]);
    expect(engine.getState().consoleEntries.length).toBeGreaterThan(0);
    const firstEntry = engine.getState().consoleEntries[0];
    expect(firstEntry.message).toContain("started");
    await vi.advanceTimersByTimeAsync(5000);
    await promise2;
  });

  it("step without marty logs error", async () => {
    const noMartyEngine = new ExecutionEngine();
    const block = createMockBlock();

    await noMartyEngine.step([block]);

    const entries = noMartyEngine.getState().consoleEntries;
    expect(entries.some((e) => e.type === "error")).toBe(true);
  });

  it("step sets status to stepping", async () => {
    const block = createMockBlock();
    engine.step([block]);

    expect(engine.getState().status).toBe("stepping");
  });

  it("pause when not running is no-op", () => {
    engine.pause();
    expect(engine.getState().status).toBe("idle");
  });

  it("resume when not paused is no-op", () => {
    engine.resume();
    expect(engine.getState().status).toBe("idle");
  });

  it("handles execution errors gracefully", async () => {
    vi.spyOn(marty, "walk").mockRejectedValue(new Error("Walk failed"));

    const block = createMockBlock();
    const promise = engine.run([block]);
    await vi.advanceTimersByTimeAsync(1000);
    await promise;

    expect(engine.getState().status).toBe("error");
    const entries = engine.getState().consoleEntries;
    expect(
      entries.some(
        (e) => e.type === "error" && e.message.includes("Walk failed"),
      ),
    ).toBe(true);
  });

  it("stop during execution prevents completion", async () => {
    const block2 = createMockBlock({
      id: "block-2",
      type: "marty_dance",
    });
    const block1 = createMockBlock({
      id: "block-1",
      getNextBlock: () => block2,
    });

    engine.run([block1]);
    await vi.advanceTimersByTimeAsync(500);

    engine.stop();
    await vi.advanceTimersByTimeAsync(5000);

    expect(engine.getState().status).toBe("idle");
  });

  it("step does not start if already running", async () => {
    const block = createMockBlock();
    engine.run([block]);

    await engine.step([block]);

    expect(engine.getState().status).toBe("running");
  });
});
