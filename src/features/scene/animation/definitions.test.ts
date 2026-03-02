import { describe, it, expect } from "vitest";
import {
  WALK_SEQUENCE,
  DANCE_SEQUENCE,
  KICK_SEQUENCE,
  SLIDE_SEQUENCE,
  LEAN_SEQUENCE,
  WIGGLE_SEQUENCE,
  CIRCLE_DANCE_SEQUENCE,
  CELEBRATE_SEQUENCE,
  GET_READY_SEQUENCE,
  STAND_STRAIGHT_SEQUENCE,
  IDLE_SEQUENCE,
  getSequenceForAction,
} from "./definitions";

describe("animation definitions", () => {
  const allSequences = [
    { name: "WALK", seq: WALK_SEQUENCE, expectLoop: true },
    { name: "DANCE", seq: DANCE_SEQUENCE, expectLoop: true },
    { name: "KICK", seq: KICK_SEQUENCE, expectLoop: false },
    { name: "SLIDE", seq: SLIDE_SEQUENCE, expectLoop: false },
    { name: "LEAN", seq: LEAN_SEQUENCE, expectLoop: false },
    { name: "WIGGLE", seq: WIGGLE_SEQUENCE, expectLoop: true },
    { name: "CIRCLE_DANCE", seq: CIRCLE_DANCE_SEQUENCE, expectLoop: true },
    { name: "CELEBRATE", seq: CELEBRATE_SEQUENCE, expectLoop: true },
    { name: "GET_READY", seq: GET_READY_SEQUENCE, expectLoop: false },
    { name: "STAND_STRAIGHT", seq: STAND_STRAIGHT_SEQUENCE, expectLoop: false },
    { name: "IDLE", seq: IDLE_SEQUENCE, expectLoop: true },
  ];

  for (const { name, seq, expectLoop } of allSequences) {
    describe(name, () => {
      it("has at least 2 keyframes", () => {
        expect(seq.keyframes.length).toBeGreaterThanOrEqual(2);
      });

      it("has positive duration", () => {
        expect(seq.durationMs).toBeGreaterThan(0);
      });

      it(`loop is ${expectLoop}`, () => {
        expect(seq.loop).toBe(expectLoop);
      });

      it("keyframes are sorted by time", () => {
        for (let i = 1; i < seq.keyframes.length; i++) {
          expect(seq.keyframes[i].time).toBeGreaterThanOrEqual(
            seq.keyframes[i - 1].time,
          );
        }
      });

      it("keyframe times are in [0, 1]", () => {
        for (const kf of seq.keyframes) {
          expect(kf.time).toBeGreaterThanOrEqual(0);
          expect(kf.time).toBeLessThanOrEqual(1);
        }
      });

      it("each keyframe has a valid pose with all joints", () => {
        for (const kf of seq.keyframes) {
          expect(kf.pose.joints).toBeDefined();
          expect(kf.pose.eyes).toBeDefined();
          expect(typeof kf.pose.bodyY).toBe("number");
          expect(typeof kf.pose.bodyTilt).toBe("number");
        }
      });
    });
  }
});

describe("getSequenceForAction", () => {
  it("returns walk sequence for walk action", () => {
    expect(getSequenceForAction("walk")).toBe(WALK_SEQUENCE);
  });

  it("returns dance sequence for dance action", () => {
    expect(getSequenceForAction("dance")).toBe(DANCE_SEQUENCE);
  });

  it("returns kick sequence for right kick", () => {
    const seq = getSequenceForAction("kick", { leg: "right" });
    expect(seq).toBe(KICK_SEQUENCE);
  });

  it("returns mirrored kick for left kick", () => {
    const seq = getSequenceForAction("kick", { leg: "left" });
    expect(seq).not.toBe(KICK_SEQUENCE);
    expect(seq.keyframes.length).toBe(KICK_SEQUENCE.keyframes.length);
  });

  it("returns slide with left direction", () => {
    const seq = getSequenceForAction("slide", { direction: "left" });
    expect(seq.keyframes.length).toBe(SLIDE_SEQUENCE.keyframes.length);
  });

  it("returns slide with right direction (mirrored)", () => {
    const leftSeq = getSequenceForAction("slide", { direction: "left" });
    const rightSeq = getSequenceForAction("slide", { direction: "right" });
    // Right slide should mirror the bodyTilt
    const leftTilt = leftSeq.keyframes[1]?.pose.bodyTilt ?? 0;
    const rightTilt = rightSeq.keyframes[1]?.pose.bodyTilt ?? 0;
    expect(leftTilt).toBe(-rightTilt);
  });

  it("returns lean with direction and amount", () => {
    const seq = getSequenceForAction("lean", { direction: "left", amount: 60 });
    expect(seq.keyframes.length).toBe(LEAN_SEQUENCE.keyframes.length);
  });

  it("returns lean mirrored for right direction", () => {
    const leftSeq = getSequenceForAction("lean", { direction: "left" });
    const rightSeq = getSequenceForAction("lean", { direction: "right" });
    const leftTilt = leftSeq.keyframes[1]?.pose.bodyTilt ?? 0;
    const rightTilt = rightSeq.keyframes[1]?.pose.bodyTilt ?? 0;
    expect(leftTilt).toBe(-rightTilt);
  });

  it("returns wiggle sequence", () => {
    expect(getSequenceForAction("wiggle")).toBe(WIGGLE_SEQUENCE);
  });

  it("returns circle_dance sequence", () => {
    expect(getSequenceForAction("circle_dance")).toBe(CIRCLE_DANCE_SEQUENCE);
  });

  it("returns celebrate sequence", () => {
    expect(getSequenceForAction("celebrate")).toBe(CELEBRATE_SEQUENCE);
  });

  it("returns get_ready sequence", () => {
    expect(getSequenceForAction("get_ready")).toBe(GET_READY_SEQUENCE);
  });

  it("returns stand_straight sequence", () => {
    expect(getSequenceForAction("stand_straight")).toBe(STAND_STRAIGHT_SEQUENCE);
  });

  it("returns eyes sequence for normal position", () => {
    const seq = getSequenceForAction("eyes", { position: "normal" });
    expect(seq.keyframes).toHaveLength(2);
  });

  it("returns eyes sequence with wide position scaling", () => {
    const seq = getSequenceForAction("eyes", { position: "wide" });
    const lastKf = seq.keyframes[seq.keyframes.length - 1];
    expect(lastKf.pose.eyes.left.scale).toBe(1.3);
  });

  it("returns eyes sequence with angry position", () => {
    const seq = getSequenceForAction("eyes", { position: "angry" });
    const lastKf = seq.keyframes[seq.keyframes.length - 1];
    expect(lastKf.pose.eyes.left.scale).toBe(0.7);
  });

  it("returns eyes sequence with excited position", () => {
    const seq = getSequenceForAction("eyes", { position: "excited" });
    const lastKf = seq.keyframes[seq.keyframes.length - 1];
    expect(lastKf.pose.eyes.left.scale).toBe(1.2);
  });

  it("returns eyes sequence with squint position", () => {
    const seq = getSequenceForAction("eyes", { position: "squint" });
    const lastKf = seq.keyframes[seq.keyframes.length - 1];
    expect(lastKf.pose.eyes.left.scale).toBe(0.5);
  });

  it("returns arms sequence converting degrees to radians", () => {
    const seq = getSequenceForAction("arms", { left: 90, right: -45 });
    const lastKf = seq.keyframes[seq.keyframes.length - 1];
    expect(lastKf.pose.joints.leftArm).toBeCloseTo(Math.PI / 2);
    expect(lastKf.pose.joints.rightArm).toBeCloseTo(-Math.PI / 4);
  });

  it("returns idle sequence for unknown action", () => {
    expect(getSequenceForAction("unknown_action")).toBe(IDLE_SEQUENCE);
  });
});
