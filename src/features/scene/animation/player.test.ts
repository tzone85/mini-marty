import { describe, it, expect, vi } from "vitest";
import {
  AnimationPlayer,
  lerp,
  lerpJoints,
  lerpEyes,
  lerpPose,
  interpolateSequence,
} from "./player";
import {
  DEFAULT_POSE,
  DEFAULT_JOINT_ANGLES,
  DEFAULT_EYE_STATE,
} from "../types";
import type { AnimationSequence } from "./types";

describe("lerp utilities", () => {
  describe("lerp", () => {
    it("returns a when t=0", () => {
      expect(lerp(0, 10, 0)).toBe(0);
    });

    it("returns b when t=1", () => {
      expect(lerp(0, 10, 1)).toBe(10);
    });

    it("returns midpoint when t=0.5", () => {
      expect(lerp(0, 10, 0.5)).toBe(5);
    });

    it("works with negative values", () => {
      expect(lerp(-5, 5, 0.5)).toBe(0);
    });
  });

  describe("lerpJoints", () => {
    it("interpolates all joint angles", () => {
      const a = DEFAULT_JOINT_ANGLES;
      const b = { ...DEFAULT_JOINT_ANGLES, leftHip: 1, rightArm: -1 };
      const result = lerpJoints(a, b, 0.5);
      expect(result.leftHip).toBeCloseTo(0.5);
      expect(result.rightArm).toBeCloseTo(-0.5);
      expect(result.twist).toBe(0);
    });
  });

  describe("lerpEyes", () => {
    it("interpolates eye positions", () => {
      const a = DEFAULT_EYE_STATE;
      const b = {
        left: { x: 0.1, y: 0.2, scale: 1.5 },
        right: { x: -0.1, y: -0.2, scale: 0.5 },
      };
      const result = lerpEyes(a, b, 0.5);
      expect(result.left.x).toBeCloseTo(0.05);
      expect(result.left.scale).toBeCloseTo(1.25);
      expect(result.right.scale).toBeCloseTo(0.75);
    });
  });

  describe("lerpPose", () => {
    it("interpolates full pose", () => {
      const a = DEFAULT_POSE;
      const b = { ...DEFAULT_POSE, bodyY: 1, bodyTilt: 0.5 };
      const result = lerpPose(a, b, 0.5);
      expect(result.bodyY).toBeCloseTo(0.5);
      expect(result.bodyTilt).toBeCloseTo(0.25);
    });
  });
});

describe("interpolateSequence", () => {
  it("returns DEFAULT_POSE for empty keyframes", () => {
    const seq: AnimationSequence = {
      keyframes: [],
      loop: false,
      durationMs: 1000,
    };
    expect(interpolateSequence(seq, 0.5)).toEqual(DEFAULT_POSE);
  });

  it("returns single keyframe pose", () => {
    const customPose = { ...DEFAULT_POSE, bodyY: 0.5 };
    const seq: AnimationSequence = {
      keyframes: [{ time: 0, pose: customPose }],
      loop: false,
      durationMs: 1000,
    };
    expect(interpolateSequence(seq, 0.5)).toEqual(customPose);
  });

  it("interpolates between two keyframes", () => {
    const seq: AnimationSequence = {
      keyframes: [
        { time: 0, pose: DEFAULT_POSE },
        { time: 1, pose: { ...DEFAULT_POSE, bodyY: 1 } },
      ],
      loop: false,
      durationMs: 1000,
    };
    const result = interpolateSequence(seq, 0.5);
    expect(result.bodyY).toBeCloseTo(0.5);
  });

  it("returns first keyframe at progress 0", () => {
    const seq: AnimationSequence = {
      keyframes: [
        { time: 0, pose: { ...DEFAULT_POSE, bodyY: 0.2 } },
        { time: 1, pose: { ...DEFAULT_POSE, bodyY: 1 } },
      ],
      loop: false,
      durationMs: 1000,
    };
    const result = interpolateSequence(seq, 0);
    expect(result.bodyY).toBeCloseTo(0.2);
  });

  it("returns last keyframe at progress 1", () => {
    const seq: AnimationSequence = {
      keyframes: [
        { time: 0, pose: DEFAULT_POSE },
        { time: 1, pose: { ...DEFAULT_POSE, bodyY: 1 } },
      ],
      loop: false,
      durationMs: 1000,
    };
    const result = interpolateSequence(seq, 1);
    expect(result.bodyY).toBeCloseTo(1);
  });

  it("clamps progress to [0, 1]", () => {
    const seq: AnimationSequence = {
      keyframes: [
        { time: 0, pose: DEFAULT_POSE },
        { time: 1, pose: { ...DEFAULT_POSE, bodyY: 1 } },
      ],
      loop: false,
      durationMs: 1000,
    };
    expect(interpolateSequence(seq, -0.5).bodyY).toBeCloseTo(0);
    expect(interpolateSequence(seq, 1.5).bodyY).toBeCloseTo(1);
  });

  it("handles multiple keyframes", () => {
    const seq: AnimationSequence = {
      keyframes: [
        { time: 0, pose: { ...DEFAULT_POSE, bodyY: 0 } },
        { time: 0.5, pose: { ...DEFAULT_POSE, bodyY: 1 } },
        { time: 1, pose: { ...DEFAULT_POSE, bodyY: 0 } },
      ],
      loop: false,
      durationMs: 1000,
    };
    expect(interpolateSequence(seq, 0.25).bodyY).toBeCloseTo(0.5);
    expect(interpolateSequence(seq, 0.5).bodyY).toBeCloseTo(1);
    expect(interpolateSequence(seq, 0.75).bodyY).toBeCloseTo(0.5);
  });
});

describe("AnimationPlayer", () => {
  it("starts in idle state", () => {
    const player = new AnimationPlayer();
    expect(player.isPlaying()).toBe(false);
    expect(player.getCurrentAction()).toBe("idle");
    expect(player.getCurrentPose()).toEqual(DEFAULT_POSE);
  });

  it("plays an animation", () => {
    const player = new AnimationPlayer();
    const seq: AnimationSequence = {
      keyframes: [
        { time: 0, pose: DEFAULT_POSE },
        { time: 1, pose: { ...DEFAULT_POSE, bodyY: 1 } },
      ],
      loop: false,
      durationMs: 1000,
    };
    player.play("walk", seq);
    expect(player.isPlaying()).toBe(true);
    expect(player.getCurrentAction()).toBe("walk");
  });

  it("tick advances animation and returns interpolated pose", () => {
    const player = new AnimationPlayer();
    const seq: AnimationSequence = {
      keyframes: [
        { time: 0, pose: DEFAULT_POSE },
        { time: 1, pose: { ...DEFAULT_POSE, bodyY: 1 } },
      ],
      loop: false,
      durationMs: 1000,
    };
    player.play("walk", seq);
    const pose = player.tick(500); // 50% through
    expect(pose.bodyY).toBeCloseTo(0.5);
  });

  it("non-looping animation stops at completion", () => {
    const player = new AnimationPlayer();
    const seq: AnimationSequence = {
      keyframes: [
        { time: 0, pose: DEFAULT_POSE },
        { time: 1, pose: { ...DEFAULT_POSE, bodyY: 1 } },
      ],
      loop: false,
      durationMs: 1000,
    };
    player.play("kick", seq);
    player.tick(1100); // Past duration
    expect(player.isPlaying()).toBe(false);
    expect(player.getCurrentPose().bodyY).toBeCloseTo(1);
  });

  it("looping animation wraps around", () => {
    const player = new AnimationPlayer();
    const seq: AnimationSequence = {
      keyframes: [
        { time: 0, pose: { ...DEFAULT_POSE, bodyY: 0 } },
        { time: 0.5, pose: { ...DEFAULT_POSE, bodyY: 1 } },
        { time: 1, pose: { ...DEFAULT_POSE, bodyY: 0 } },
      ],
      loop: true,
      durationMs: 1000,
    };
    player.play("dance", seq);

    // First cycle at 25%
    player.tick(250);
    expect(player.getCurrentPose().bodyY).toBeCloseTo(0.5);

    // Past full cycle, should wrap
    player.tick(1000);
    expect(player.isPlaying()).toBe(true);
  });

  it("calls onComplete callback for non-looping animation", () => {
    const player = new AnimationPlayer();
    const onComplete = vi.fn();
    const seq: AnimationSequence = {
      keyframes: [
        { time: 0, pose: DEFAULT_POSE },
        { time: 1, pose: DEFAULT_POSE },
      ],
      loop: false,
      durationMs: 100,
    };
    player.play("kick", seq, onComplete);
    player.tick(150);
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it("stop resets to idle", () => {
    const player = new AnimationPlayer();
    const seq: AnimationSequence = {
      keyframes: [
        { time: 0, pose: DEFAULT_POSE },
        { time: 1, pose: { ...DEFAULT_POSE, bodyY: 1 } },
      ],
      loop: true,
      durationMs: 1000,
    };
    player.play("walk", seq);
    player.tick(500);
    player.stop();

    expect(player.isPlaying()).toBe(false);
    expect(player.getCurrentPose()).toEqual(DEFAULT_POSE);
  });

  it("tick returns current pose when not playing", () => {
    const player = new AnimationPlayer();
    const pose = player.tick(100);
    expect(pose).toEqual(DEFAULT_POSE);
  });

  it("handles zero-duration sequence", () => {
    const player = new AnimationPlayer();
    const seq: AnimationSequence = {
      keyframes: [{ time: 0, pose: DEFAULT_POSE }],
      loop: false,
      durationMs: 0,
    };
    player.play("idle", seq);
    const pose = player.tick(100);
    expect(pose).toEqual(DEFAULT_POSE);
  });

  it("does not call onComplete for looping animations", () => {
    const player = new AnimationPlayer();
    const onComplete = vi.fn();
    const seq: AnimationSequence = {
      keyframes: [
        { time: 0, pose: DEFAULT_POSE },
        { time: 1, pose: DEFAULT_POSE },
      ],
      loop: true,
      durationMs: 100,
    };
    player.play("dance", seq, onComplete);
    player.tick(500); // Several loops
    expect(onComplete).not.toHaveBeenCalled();
  });
});
