import { describe, it, expect } from "vitest";
import type {
  AnimationKeyframe,
  AnimationSequence,
  AnimationAction,
  AnimationState,
  AnimationPlayerState,
} from "./types";
import { DEFAULT_POSE } from "../types";

describe("animation types", () => {
  it("AnimationKeyframe can be constructed with time and pose", () => {
    const kf: AnimationKeyframe = { time: 0.5, pose: DEFAULT_POSE };
    expect(kf.time).toBe(0.5);
    expect(kf.pose).toEqual(DEFAULT_POSE);
  });

  it("AnimationSequence can be constructed", () => {
    const seq: AnimationSequence = {
      keyframes: [
        { time: 0, pose: DEFAULT_POSE },
        { time: 1, pose: DEFAULT_POSE },
      ],
      loop: false,
      durationMs: 1000,
    };
    expect(seq.keyframes).toHaveLength(2);
    expect(seq.loop).toBe(false);
    expect(seq.durationMs).toBe(1000);
  });

  it("AnimationAction union covers expected actions", () => {
    const actions: AnimationAction[] = [
      "walk",
      "dance",
      "kick",
      "slide",
      "lean",
      "wiggle",
      "circle_dance",
      "celebrate",
      "get_ready",
      "stand_straight",
      "eyes",
      "arms",
      "idle",
    ];
    expect(actions).toHaveLength(13);
  });

  it("AnimationState includes action and sequence", () => {
    const state: AnimationState = {
      action: "walk",
      sequence: {
        keyframes: [{ time: 0, pose: DEFAULT_POSE }],
        loop: true,
        durationMs: 1000,
      },
      startTime: Date.now(),
      params: {},
    };
    expect(state.action).toBe("walk");
    expect(state.sequence.loop).toBe(true);
  });

  it("AnimationPlayerState tracks current state", () => {
    const playerState: AnimationPlayerState = {
      currentAnimation: null,
      currentPose: DEFAULT_POSE,
      isPlaying: false,
    };
    expect(playerState.isPlaying).toBe(false);
    expect(playerState.currentAnimation).toBeNull();
  });
});
