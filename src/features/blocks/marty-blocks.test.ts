import { describe, it, expect } from "vitest";
import { MARTY_BLOCKS, type MartyBlockDefinition } from "./marty-blocks";

describe("MARTY_BLOCKS", () => {
  it("has motion blocks", () => {
    const motionTypes = MARTY_BLOCKS.filter((b) => b.category === "Motion").map(
      (b) => b.type,
    );
    expect(motionTypes).toContain("marty_walk");
    expect(motionTypes).toContain("marty_turn");
    expect(motionTypes).toContain("marty_slide");
    expect(motionTypes).toContain("marty_kick");
    expect(motionTypes).toContain("marty_dance");
    expect(motionTypes).toContain("marty_circle_dance");
    expect(motionTypes).toContain("marty_wiggle");
    expect(motionTypes).toContain("marty_lean");
    expect(motionTypes).toContain("marty_celebrate");
    expect(motionTypes).toContain("marty_get_ready");
    expect(motionTypes).toContain("marty_stand_straight");
    expect(motionTypes).toContain("marty_eyes");
    expect(motionTypes).toContain("marty_arms");
  });

  it("has sound blocks", () => {
    const soundTypes = MARTY_BLOCKS.filter((b) => b.category === "Sound").map(
      (b) => b.type,
    );
    expect(soundTypes).toContain("marty_play_sound");
  });

  it("has sensing blocks", () => {
    const sensingTypes = MARTY_BLOCKS.filter(
      (b) => b.category === "Sensing",
    ).map((b) => b.type);
    expect(sensingTypes).toContain("marty_foot_on_ground");
    expect(sensingTypes).toContain("marty_get_distance");
    expect(sensingTypes).toContain("marty_is_moving");
  });

  it("has event blocks", () => {
    const eventTypes = MARTY_BLOCKS.filter((b) => b.category === "Events").map(
      (b) => b.type,
    );
    expect(eventTypes).toContain("marty_when_start");
    expect(eventTypes).toContain("marty_when_key_pressed");
  });

  it("has control blocks", () => {
    const controlTypes = MARTY_BLOCKS.filter(
      (b) => b.category === "Control",
    ).map((b) => b.type);
    expect(controlTypes).toContain("marty_wait");
    expect(controlTypes).toContain("marty_repeat");
    expect(controlTypes).toContain("marty_if_else");
    expect(controlTypes).toContain("marty_forever");
  });

  it("each block has required fields", () => {
    for (const block of MARTY_BLOCKS) {
      expect(block.type).toBeTruthy();
      expect(block.category).toBeTruthy();
      expect(block.message0).toBeTruthy();
      expect(block.colour).toBeTruthy();
      expect(block.tooltip).toBeTruthy();
    }
  });

  it("has at least 20 blocks total", () => {
    expect(MARTY_BLOCKS.length).toBeGreaterThanOrEqual(20);
  });

  it("all block types are unique", () => {
    const types = MARTY_BLOCKS.map((b) => b.type);
    expect(new Set(types).size).toBe(types.length);
  });
});
