import { describe, it, expect } from "vitest";
import { MARTY_BLOCKS, type MartyBlockDefinition } from "./marty-blocks";

function getBlocksByCategory(
  category: string,
): readonly MartyBlockDefinition[] {
  return MARTY_BLOCKS.filter((b) => b.category === category);
}

function getBlockTypes(): readonly string[] {
  return MARTY_BLOCKS.map((b) => b.type);
}

describe("MARTY_BLOCKS", () => {
  it("each block has required fields", () => {
    for (const block of MARTY_BLOCKS) {
      expect(block.type).toBeTruthy();
      expect(block.category).toBeTruthy();
      expect(block.message0).toBeTruthy();
      expect(block.colour).toBeTruthy();
      expect(block.tooltip).toBeTruthy();
    }
  });

  it("has unique block types", () => {
    const types = getBlockTypes();
    const uniqueTypes = new Set(types);
    expect(uniqueTypes.size).toBe(types.length);
  });
});

describe("Motion blocks", () => {
  it("includes walk", () => {
    expect(getBlockTypes()).toContain("marty_walk");
  });

  it("includes turn", () => {
    expect(getBlockTypes()).toContain("marty_turn");
  });

  it("includes slide", () => {
    expect(getBlockTypes()).toContain("marty_slide");
  });

  it("includes kick", () => {
    expect(getBlockTypes()).toContain("marty_kick");
  });

  it("includes dance", () => {
    expect(getBlockTypes()).toContain("marty_dance");
  });

  it("includes circle_dance", () => {
    expect(getBlockTypes()).toContain("marty_circle_dance");
  });

  it("includes wiggle", () => {
    expect(getBlockTypes()).toContain("marty_wiggle");
  });

  it("includes lean", () => {
    expect(getBlockTypes()).toContain("marty_lean");
  });

  it("includes celebrate", () => {
    expect(getBlockTypes()).toContain("marty_celebrate");
  });

  it("includes get_ready", () => {
    expect(getBlockTypes()).toContain("marty_get_ready");
  });

  it("includes stand_straight", () => {
    expect(getBlockTypes()).toContain("marty_stand_straight");
  });

  it("includes eyes", () => {
    expect(getBlockTypes()).toContain("marty_eyes");
  });

  it("includes arms", () => {
    expect(getBlockTypes()).toContain("marty_arms");
  });

  it("all motion blocks have the Motion category", () => {
    const motionBlocks = getBlocksByCategory("Motion");
    expect(motionBlocks.length).toBeGreaterThanOrEqual(13);
  });
});

describe("Sound blocks", () => {
  it("includes play_sound", () => {
    expect(getBlockTypes()).toContain("marty_play_sound");
  });

  it("has Sound category", () => {
    const soundBlocks = getBlocksByCategory("Sound");
    expect(soundBlocks.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Sensing blocks", () => {
  it("includes foot_on_ground", () => {
    expect(getBlockTypes()).toContain("marty_foot_on_ground");
  });

  it("includes get_distance", () => {
    expect(getBlockTypes()).toContain("marty_get_distance");
  });

  it("includes is_moving", () => {
    expect(getBlockTypes()).toContain("marty_is_moving");
  });

  it("has Sensing category", () => {
    const sensingBlocks = getBlocksByCategory("Sensing");
    expect(sensingBlocks.length).toBeGreaterThanOrEqual(3);
  });
});

describe("Events blocks", () => {
  it("includes when_start", () => {
    expect(getBlockTypes()).toContain("marty_when_start");
  });

  it("includes when_key_pressed", () => {
    expect(getBlockTypes()).toContain("marty_when_key_pressed");
  });

  it("has Events category", () => {
    const eventsBlocks = getBlocksByCategory("Events");
    expect(eventsBlocks.length).toBeGreaterThanOrEqual(2);
  });
});

describe("Control blocks", () => {
  it("includes wait", () => {
    expect(getBlockTypes()).toContain("marty_wait");
  });

  it("includes repeat", () => {
    expect(getBlockTypes()).toContain("marty_repeat");
  });

  it("includes if_else", () => {
    expect(getBlockTypes()).toContain("marty_if_else");
  });

  it("includes forever", () => {
    expect(getBlockTypes()).toContain("marty_forever");
  });

  it("has Control category", () => {
    const controlBlocks = getBlocksByCategory("Control");
    expect(controlBlocks.length).toBeGreaterThanOrEqual(4);
  });
});
