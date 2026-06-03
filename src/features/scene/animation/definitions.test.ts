import { describe, expect, it } from "vitest";
import { getSequenceForAction } from "./definitions";

const ACTIONS = [
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
] as const;

describe("getSequenceForAction", () => {
  it("returns a non-empty keyframe sequence for every known action", () => {
    for (const action of ACTIONS) {
      const seq = getSequenceForAction(action, {});
      expect(seq.keyframes.length).toBeGreaterThan(0);
      expect(seq.durationMs).toBeGreaterThan(0);
    }
  });

  it("falls back to an idle sequence for unknown actions", () => {
    const seq = getSequenceForAction("does-not-exist", {});
    expect(seq.loop).toBe(true);
    expect(seq.keyframes.length).toBeGreaterThan(0);
  });

  it("mirrors the kick sequence to the left leg when leg=left", () => {
    const right = getSequenceForAction("kick", { leg: "right" });
    const left = getSequenceForAction("kick", { leg: "left" });
    // Find the peak kick frame (time 0.5)
    const rightPeak = right.keyframes.find((k) => k.time === 0.5);
    const leftPeak = left.keyframes.find((k) => k.time === 0.5);
    expect(rightPeak).toBeDefined();
    expect(leftPeak).toBeDefined();
    // Right-kick raises right hip; left-kick raises left hip instead.
    expect(rightPeak!.pose.joints.rightHip).toBeGreaterThan(0);
    expect(leftPeak!.pose.joints.leftHip).toBeGreaterThan(0);
    expect(leftPeak!.pose.joints.rightHip).toBe(0);
  });

  it("inverts slide direction when direction=right", () => {
    const left = getSequenceForAction("slide", { direction: "left" });
    const right = getSequenceForAction("slide", { direction: "right" });
    const leftTilted = left.keyframes.find((k) => k.time === 0.3);
    const rightTilted = right.keyframes.find((k) => k.time === 0.3);
    expect(leftTilted!.pose.bodyTilt).toBeGreaterThan(0);
    expect(rightTilted!.pose.bodyTilt).toBeLessThan(0);
  });

  it("scales lean amount by the params.amount value", () => {
    const small = getSequenceForAction("lean", {
      direction: "left",
      amount: 15,
    });
    const big = getSequenceForAction("lean", {
      direction: "left",
      amount: 60,
    });
    const smallPeak = small.keyframes.find((k) => k.time === 0.4)!;
    const bigPeak = big.keyframes.find((k) => k.time === 0.4)!;
    expect(Math.abs(bigPeak.pose.bodyTilt)).toBeGreaterThan(
      Math.abs(smallPeak.pose.bodyTilt),
    );
  });

  it("encodes eye position presets into the final keyframe", () => {
    const wide = getSequenceForAction("eyes", { position: "wide" });
    const squint = getSequenceForAction("eyes", { position: "squint" });
    const wideFinal = wide.keyframes[wide.keyframes.length - 1].pose;
    const squintFinal = squint.keyframes[squint.keyframes.length - 1].pose;
    expect(wideFinal.eyes.left.scale).toBeGreaterThan(1);
    expect(squintFinal.eyes.left.scale).toBeLessThan(1);
  });

  it("converts arms degrees into radians on the final pose", () => {
    const seq = getSequenceForAction("arms", { left: 90, right: -90 });
    const final = seq.keyframes[seq.keyframes.length - 1].pose;
    expect(final.joints.leftArm).toBeCloseTo(Math.PI / 2, 5);
    expect(final.joints.rightArm).toBeCloseTo(-Math.PI / 2, 5);
  });
});
