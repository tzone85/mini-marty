import { describe, expect, it, vi } from "vitest";
import { AnimationPlayer, lerp, interpolateSequence } from "./player";
import { DEFAULT_POSE } from "../types";
import type { AnimationSequence } from "./types";

const seq: AnimationSequence = {
  durationMs: 1000,
  loop: false,
  keyframes: [
    { time: 0, pose: DEFAULT_POSE },
    { time: 1, pose: { ...DEFAULT_POSE, bodyY: 10 } },
  ],
};

describe("lerp", () => {
  it("interpolates", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
  });
});

describe("AnimationPlayer", () => {
  it("plays and reaches end pose at duration", () => {
    const p = new AnimationPlayer();
    p.play("walk", seq);
    const final = p.tick(1000);
    expect(final.bodyY).toBeCloseTo(10);
  });
  it("calls onComplete once at end", () => {
    const cb = vi.fn();
    const p = new AnimationPlayer();
    p.play("walk", seq, cb);
    p.tick(1000);
    expect(cb).toHaveBeenCalledTimes(1);
  });
  it("loops when sequence.loop=true", () => {
    const loopSeq: AnimationSequence = { ...seq, loop: true };
    const p = new AnimationPlayer();
    p.play("walk", loopSeq);
    p.tick(500);
    p.tick(800);
    expect(p.isPlaying()).toBe(true);
  });
  it("stop resets to default", () => {
    const p = new AnimationPlayer();
    p.play("walk", seq);
    p.tick(100);
    p.stop();
    expect(p.getCurrentPose()).toEqual(DEFAULT_POSE);
  });
  it("getCurrentAction returns the active action", () => {
    const p = new AnimationPlayer();
    p.play("walk", seq);
    expect(p.getCurrentAction()).toBe("walk");
  });
  it("tick returns currentPose when not playing", () => {
    const p = new AnimationPlayer();
    const result = p.tick(100);
    expect(result).toEqual(DEFAULT_POSE);
  });
  it("treats zero-duration sequence as default pose", () => {
    const p = new AnimationPlayer();
    p.play("walk", { durationMs: 0, loop: false, keyframes: [] });
    expect(p.tick(10)).toEqual(DEFAULT_POSE);
  });
});

describe("interpolateSequence", () => {
  it("returns DEFAULT_POSE for empty", () => {
    expect(
      interpolateSequence({ durationMs: 0, loop: false, keyframes: [] }, 0),
    ).toEqual(DEFAULT_POSE);
  });
  it("returns single-keyframe pose unchanged", () => {
    const single: AnimationSequence = {
      durationMs: 100,
      loop: false,
      keyframes: [{ time: 0, pose: { ...DEFAULT_POSE, bodyY: 7 } }],
    };
    expect(interpolateSequence(single, 0.5).bodyY).toBe(7);
  });
});
