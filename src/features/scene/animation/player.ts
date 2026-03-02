import type { AnimationSequence, AnimationAction } from "./types";
import type { MartyPose, JointAngles, EyeState } from "../types";
import { DEFAULT_POSE } from "../types";

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpJoints(a: JointAngles, b: JointAngles, t: number): JointAngles {
  return {
    leftHip: lerp(a.leftHip, b.leftHip, t),
    leftKnee: lerp(a.leftKnee, b.leftKnee, t),
    leftFoot: lerp(a.leftFoot, b.leftFoot, t),
    rightHip: lerp(a.rightHip, b.rightHip, t),
    rightKnee: lerp(a.rightKnee, b.rightKnee, t),
    rightFoot: lerp(a.rightFoot, b.rightFoot, t),
    leftArm: lerp(a.leftArm, b.leftArm, t),
    rightArm: lerp(a.rightArm, b.rightArm, t),
    twist: lerp(a.twist, b.twist, t),
  };
}

function lerpEyes(a: EyeState, b: EyeState, t: number): EyeState {
  return {
    left: {
      x: lerp(a.left.x, b.left.x, t),
      y: lerp(a.left.y, b.left.y, t),
      scale: lerp(a.left.scale, b.left.scale, t),
    },
    right: {
      x: lerp(a.right.x, b.right.x, t),
      y: lerp(a.right.y, b.right.y, t),
      scale: lerp(a.right.scale, b.right.scale, t),
    },
  };
}

function lerpPose(a: MartyPose, b: MartyPose, t: number): MartyPose {
  return {
    joints: lerpJoints(a.joints, b.joints, t),
    eyes: lerpEyes(a.eyes, b.eyes, t),
    bodyY: lerp(a.bodyY, b.bodyY, t),
    bodyTilt: lerp(a.bodyTilt, b.bodyTilt, t),
  };
}

function interpolateSequence(
  sequence: AnimationSequence,
  progress: number,
): MartyPose {
  const { keyframes } = sequence;

  if (keyframes.length === 0) {
    return DEFAULT_POSE;
  }

  if (keyframes.length === 1) {
    return keyframes[0].pose;
  }

  // Clamp progress to [0, 1]
  const clampedProgress = Math.max(0, Math.min(1, progress));

  // Find the two surrounding keyframes
  let beforeIndex = 0;
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (keyframes[i].time <= clampedProgress) {
      beforeIndex = i;
    }
  }

  const afterIndex = Math.min(beforeIndex + 1, keyframes.length - 1);
  const before = keyframes[beforeIndex];
  const after = keyframes[afterIndex];

  if (beforeIndex === afterIndex) {
    return before.pose;
  }

  const segmentDuration = after.time - before.time;
  const segmentProgress =
    segmentDuration > 0
      ? (clampedProgress - before.time) / segmentDuration
      : 0;

  return lerpPose(before.pose, after.pose, segmentProgress);
}

export class AnimationPlayer {
  private sequence: AnimationSequence | null = null;
  private action: AnimationAction = "idle";
  private elapsedMs = 0;
  private playing = false;
  private currentPose: MartyPose = DEFAULT_POSE;
  private onCompleteCallback: (() => void) | null = null;

  play(
    action: AnimationAction,
    sequence: AnimationSequence,
    onComplete?: () => void,
  ): void {
    this.sequence = sequence;
    this.action = action;
    this.elapsedMs = 0;
    this.playing = true;
    this.onCompleteCallback = onComplete ?? null;
  }

  stop(): void {
    this.playing = false;
    this.sequence = null;
    this.elapsedMs = 0;
    this.currentPose = DEFAULT_POSE;
    this.onCompleteCallback = null;
  }

  tick(deltaMs: number): MartyPose {
    if (!this.playing || !this.sequence) {
      return this.currentPose;
    }

    this.elapsedMs += deltaMs;
    const { durationMs, loop } = this.sequence;

    if (durationMs <= 0) {
      this.currentPose = DEFAULT_POSE;
      return this.currentPose;
    }

    let progress = this.elapsedMs / durationMs;

    if (loop) {
      progress = progress % 1;
    } else if (progress >= 1) {
      progress = 1;
      this.currentPose = interpolateSequence(this.sequence, 1);
      this.playing = false;
      const cb = this.onCompleteCallback;
      this.onCompleteCallback = null;
      cb?.();
      return this.currentPose;
    }

    this.currentPose = interpolateSequence(this.sequence, progress);
    return this.currentPose;
  }

  isPlaying(): boolean {
    return this.playing;
  }

  getCurrentAction(): AnimationAction {
    return this.action;
  }

  getCurrentPose(): MartyPose {
    return this.currentPose;
  }
}

// Export for testing
export { lerp, lerpJoints, lerpEyes, lerpPose, interpolateSequence };
