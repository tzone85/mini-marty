import type { MartyPose } from "../types";

export interface AnimationKeyframe {
  readonly time: number; // 0..1 normalized progress
  readonly pose: MartyPose;
}

export interface AnimationSequence {
  readonly keyframes: readonly AnimationKeyframe[];
  readonly loop: boolean;
  readonly durationMs: number;
}

export type AnimationAction =
  | "walk"
  | "dance"
  | "kick"
  | "slide"
  | "lean"
  | "wiggle"
  | "circle_dance"
  | "celebrate"
  | "get_ready"
  | "stand_straight"
  | "eyes"
  | "arms"
  | "idle";

export interface AnimationState {
  readonly action: AnimationAction;
  readonly sequence: AnimationSequence;
  readonly startTime: number;
  readonly params: Readonly<Record<string, unknown>>;
}

export interface AnimationPlayerState {
  readonly currentAnimation: AnimationState | null;
  readonly currentPose: MartyPose;
  readonly isPlaying: boolean;
}
