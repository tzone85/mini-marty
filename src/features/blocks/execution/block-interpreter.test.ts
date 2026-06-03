import { describe, it, expect, vi, beforeEach } from "vitest";
import { BlockInterpreter } from "./block-interpreter";
import type { InterpreterCallbacks } from "./block-interpreter";
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

function createCallbacks(
  overrides: Partial<InterpreterCallbacks> = {},
): InterpreterCallbacks {
  return {
    onBlockStart: vi.fn(),
    onBlockComplete: vi.fn(),
    onOutput: vi.fn(),
    onError: vi.fn(),
    shouldPause: () => false,
    waitForResume: () => Promise.resolve(),
    isStopped: () => false,
    getSpeedMultiplier: () => 1,
    ...overrides,
  };
}

describe("BlockInterpreter", () => {
  let marty: VirtualMarty;

  beforeEach(() => {
    vi.useFakeTimers();
    marty = new VirtualMarty();
  });

  it("executes a walk block", async () => {
    const walkSpy = vi.spyOn(marty, "walk");
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock({
      type: "marty_walk",
      getFieldValue: (name) => (name === "STEPS" ? 3 : 0),
    });

    const promise = interpreter.executeChain(block);
    await vi.advanceTimersByTimeAsync(2000);
    await promise;

    expect(walkSpy).toHaveBeenCalledWith(3);
    expect(callbacks.onBlockStart).toHaveBeenCalledWith(
      "block-1",
      "Walk 3 steps",
    );
    expect(callbacks.onBlockComplete).toHaveBeenCalledWith("block-1");
  });

  it("executes a chain of blocks", async () => {
    const walkSpy = vi.spyOn(marty, "walk");
    const danceSpy = vi.spyOn(marty, "dance");
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);

    const block2 = createMockBlock({
      id: "block-2",
      type: "marty_dance",
    });
    const block1 = createMockBlock({
      id: "block-1",
      type: "marty_walk",
      getFieldValue: () => 2,
      getNextBlock: () => block2,
    });

    const promise = interpreter.executeChain(block1);
    await vi.advanceTimersByTimeAsync(5000);
    await promise;

    expect(walkSpy).toHaveBeenCalled();
    expect(danceSpy).toHaveBeenCalled();
  });

  it("executes slide block with direction", async () => {
    const slideSpy = vi.spyOn(marty, "slide");
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock({
      type: "marty_slide",
      getFieldValue: () => "left",
    });

    const promise = interpreter.executeChain(block);
    await vi.advanceTimersByTimeAsync(2000);
    await promise;

    expect(slideSpy).toHaveBeenCalledWith("left");
  });

  it("executes kick block with leg", async () => {
    const kickSpy = vi.spyOn(marty, "kick");
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock({
      type: "marty_kick",
      getFieldValue: () => "right",
    });

    const promise = interpreter.executeChain(block);
    await vi.advanceTimersByTimeAsync(2000);
    await promise;

    expect(kickSpy).toHaveBeenCalledWith("right");
  });

  it("executes dance block", async () => {
    const danceSpy = vi.spyOn(marty, "dance");
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock({ type: "marty_dance" });

    const promise = interpreter.executeChain(block);
    await vi.advanceTimersByTimeAsync(3000);
    await promise;

    expect(danceSpy).toHaveBeenCalled();
  });

  it("executes celebrate block", async () => {
    const celebrateSpy = vi.spyOn(marty, "celebrate");
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock({ type: "marty_celebrate" });

    const promise = interpreter.executeChain(block);
    await vi.advanceTimersByTimeAsync(3000);
    await promise;

    expect(celebrateSpy).toHaveBeenCalled();
  });

  it("executes get_ready block", async () => {
    const getSpy = vi.spyOn(marty, "get_ready");
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock({ type: "marty_get_ready" });

    const promise = interpreter.executeChain(block);
    await vi.advanceTimersByTimeAsync(1000);
    await promise;

    expect(getSpy).toHaveBeenCalled();
  });

  it("executes eyes block with position mapping", async () => {
    const eyesSpy = vi.spyOn(marty, "eyes");
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock({
      type: "marty_eyes",
      getFieldValue: () => 75,
    });

    const promise = interpreter.executeChain(block);
    await vi.advanceTimersByTimeAsync(1000);
    await promise;

    expect(eyesSpy).toHaveBeenCalledWith("wide");
  });

  it("executes arms block", async () => {
    const armsSpy = vi.spyOn(marty, "arms");
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock({
      type: "marty_arms",
      getFieldValue: (name) => (name === "LEFT" ? 50 : -50),
    });

    const promise = interpreter.executeChain(block);
    await vi.advanceTimersByTimeAsync(1000);
    await promise;

    expect(armsSpy).toHaveBeenCalledWith(50, -50);
  });

  it("executes play_sound block", async () => {
    const soundSpy = vi.spyOn(marty, "play_sound");
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock({
      type: "marty_play_sound",
      getFieldValue: () => "excited",
    });

    const promise = interpreter.executeChain(block);
    await vi.advanceTimersByTimeAsync(3000);
    await promise;

    expect(soundSpy).toHaveBeenCalledWith("excited");
  });

  it("executes repeat block", async () => {
    const walkSpy = vi.spyOn(marty, "walk");
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);

    const innerBlock = createMockBlock({
      id: "inner",
      type: "marty_walk",
      getFieldValue: () => 1,
    });

    const repeatBlock = createMockBlock({
      id: "repeat",
      type: "marty_repeat",
      getFieldValue: () => 3,
      getInputTargetBlock: (name) => (name === "DO" ? innerBlock : null),
    });

    const promise = interpreter.executeChain(repeatBlock);
    await vi.advanceTimersByTimeAsync(10000);
    await promise;

    expect(walkSpy).toHaveBeenCalledTimes(3);
  });

  it("executes if_else block with true condition", async () => {
    const celebrateSpy = vi.spyOn(marty, "celebrate");
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);

    const conditionBlock = createMockBlock({
      id: "cond",
      type: "marty_foot_on_ground",
      getFieldValue: () => "left",
    });

    const bodyBlock = createMockBlock({
      id: "body",
      type: "marty_celebrate",
    });

    const ifBlock = createMockBlock({
      id: "if",
      type: "marty_if_else",
      getInputTargetBlock: (name) => {
        if (name === "CONDITION") return conditionBlock;
        if (name === "DO") return bodyBlock;
        return null;
      },
    });

    const promise = interpreter.executeChain(ifBlock);
    await vi.advanceTimersByTimeAsync(5000);
    await promise;

    expect(celebrateSpy).toHaveBeenCalled();
  });

  it("stops execution when isStopped returns true", async () => {
    const walkSpy = vi.spyOn(marty, "walk");
    let stopped = false;
    const callbacks = createCallbacks({
      isStopped: () => stopped,
    });
    const interpreter = new BlockInterpreter(marty, callbacks);

    const block2 = createMockBlock({
      id: "block-2",
      type: "marty_dance",
    });
    const block1 = createMockBlock({
      id: "block-1",
      getNextBlock: () => block2,
    });

    const promise = interpreter.executeChain(block1);
    await vi.advanceTimersByTimeAsync(500);
    stopped = true;
    await vi.advanceTimersByTimeAsync(2000);
    await promise;

    expect(walkSpy).toHaveBeenCalledTimes(1);
  });

  it("calls onError when block execution fails", async () => {
    vi.spyOn(marty, "walk").mockRejectedValue(new Error("Walk failed"));
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock();

    await expect(interpreter.executeChain(block)).rejects.toThrow(
      "Walk failed",
    );
    expect(callbacks.onError).toHaveBeenCalledWith(
      expect.stringContaining("Walk failed"),
    );
  });

  it("handles null chain gracefully", async () => {
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);

    await interpreter.executeChain(null);

    expect(callbacks.onBlockStart).not.toHaveBeenCalled();
  });

  it("executes wait block", async () => {
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock({
      type: "marty_wait",
      getFieldValue: () => 2,
    });

    const promise = interpreter.executeChain(block);
    await vi.advanceTimersByTimeAsync(3000);
    await promise;

    expect(callbacks.onOutput).toHaveBeenCalledWith("Waiting 2 seconds...");
  });

  it("handles unknown block type", async () => {
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock({
      type: "unknown_block",
    });

    const promise = interpreter.executeChain(block);
    await vi.advanceTimersByTimeAsync(100);
    await promise;

    expect(callbacks.onOutput).toHaveBeenCalledWith(
      "Unknown block type: unknown_block",
    );
  });

  it("evaluateCondition returns false for unknown type", () => {
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock({ type: "unknown" });

    expect(interpreter.evaluateCondition(block)).toBe(false);
  });

  it("evaluateNumber returns distance for distance block", () => {
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock({ type: "marty_get_distance" });

    expect(interpreter.evaluateNumber(block)).toBe(100);
  });

  it("evaluateNumber returns 0 for unknown type", () => {
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock({ type: "unknown" });

    expect(interpreter.evaluateNumber(block)).toBe(0);
  });

  it("skips event blocks (marty_when_start)", async () => {
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock({
      type: "marty_when_start",
    });

    await interpreter.executeChain(block);
    expect(callbacks.onBlockStart).toHaveBeenCalled();
    expect(callbacks.onBlockComplete).toHaveBeenCalled();
  });

  it("executes wiggle block", async () => {
    const wiggleSpy = vi.spyOn(marty, "wiggle");
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock({ type: "marty_wiggle" });

    const promise = interpreter.executeChain(block);
    await vi.advanceTimersByTimeAsync(2000);
    await promise;

    expect(wiggleSpy).toHaveBeenCalled();
  });

  it("executes lean block", async () => {
    const leanSpy = vi.spyOn(marty, "lean");
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock({
      type: "marty_lean",
      getFieldValue: () => "right",
    });

    const promise = interpreter.executeChain(block);
    await vi.advanceTimersByTimeAsync(1000);
    await promise;

    expect(leanSpy).toHaveBeenCalledWith("right");
  });

  it("executes stand_straight block", async () => {
    const standSpy = vi.spyOn(marty, "stand_straight");
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock({ type: "marty_stand_straight" });

    const promise = interpreter.executeChain(block);
    await vi.advanceTimersByTimeAsync(1000);
    await promise;

    expect(standSpy).toHaveBeenCalled();
  });

  it("executes circle_dance block", async () => {
    const circleSpy = vi.spyOn(marty, "circle_dance");
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock({ type: "marty_circle_dance" });

    const promise = interpreter.executeChain(block);
    await vi.advanceTimersByTimeAsync(4000);
    await promise;

    expect(circleSpy).toHaveBeenCalled();
  });

  it("executes turn block as wiggle", async () => {
    const wiggleSpy = vi.spyOn(marty, "wiggle");
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock({
      type: "marty_turn",
      getFieldValue: () => 90,
    });

    const promise = interpreter.executeChain(block);
    await vi.advanceTimersByTimeAsync(2000);
    await promise;

    expect(wiggleSpy).toHaveBeenCalled();
    expect(callbacks.onOutput).toHaveBeenCalledWith("Turning 90 degrees");
  });

  it("maps eye position correctly", async () => {
    const eyesSpy = vi.spyOn(marty, "eyes");
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);

    // Test "excited" range (21-50)
    const block1 = createMockBlock({
      type: "marty_eyes",
      getFieldValue: () => 30,
    });
    let promise = interpreter.executeChain(block1);
    await vi.advanceTimersByTimeAsync(1000);
    await promise;
    expect(eyesSpy).toHaveBeenCalledWith("excited");

    // Test "squint" range (-50 to -21)
    const block2 = createMockBlock({
      id: "b2",
      type: "marty_eyes",
      getFieldValue: () => -30,
    });
    promise = interpreter.executeChain(block2);
    await vi.advanceTimersByTimeAsync(1000);
    await promise;
    expect(eyesSpy).toHaveBeenCalledWith("squint");

    // Test "angry" range (< -50)
    const block3 = createMockBlock({
      id: "b3",
      type: "marty_eyes",
      getFieldValue: () => -75,
    });
    promise = interpreter.executeChain(block3);
    await vi.advanceTimersByTimeAsync(1000);
    await promise;
    expect(eyesSpy).toHaveBeenCalledWith("angry");

    // Test "normal" range (-20 to 20)
    const block4 = createMockBlock({
      id: "b4",
      type: "marty_eyes",
      getFieldValue: () => 0,
    });
    promise = interpreter.executeChain(block4);
    await vi.advanceTimersByTimeAsync(1000);
    await promise;
    expect(eyesSpy).toHaveBeenCalledWith("normal");
  });

  it("forever loop respects stop signal", async () => {
    const walkSpy = vi.spyOn(marty, "walk");
    let stopped = false;
    const callbacks = createCallbacks({
      isStopped: () => stopped,
    });
    const interpreter = new BlockInterpreter(marty, callbacks);

    const innerBlock = createMockBlock({
      id: "inner",
      type: "marty_walk",
      getFieldValue: () => 1,
    });

    const foreverBlock = createMockBlock({
      id: "forever",
      type: "marty_forever",
      getInputTargetBlock: (name) => (name === "DO" ? innerBlock : null),
    });

    const promise = interpreter.executeChain(foreverBlock);

    // Let a few iterations run
    await vi.advanceTimersByTimeAsync(3000);
    stopped = true;
    await vi.advanceTimersByTimeAsync(2000);
    await promise;

    expect(walkSpy.mock.calls.length).toBeGreaterThan(0);
  });

  it("if_else with no condition block evaluates as false", async () => {
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);

    const ifBlock = createMockBlock({
      id: "if",
      type: "marty_if_else",
      getInputTargetBlock: () => null,
    });

    await interpreter.executeChain(ifBlock);

    expect(callbacks.onOutput).toHaveBeenCalledWith("Condition: false");
  });

  it("evaluateCondition returns is_moving result", () => {
    const callbacks = createCallbacks();
    const interpreter = new BlockInterpreter(marty, callbacks);
    const block = createMockBlock({ type: "marty_is_moving" });

    expect(interpreter.evaluateCondition(block)).toBe(false);
  });
});
