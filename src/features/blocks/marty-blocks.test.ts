import { describe, expect, it } from "vitest";
import { MARTY_BLOCKS } from "./marty-blocks";

describe("MARTY_BLOCKS", () => {
  it("has unique block types", () => {
    const types = MARTY_BLOCKS.map((b) => b.type);
    expect(new Set(types).size).toBe(types.length);
  });

  it("every block has a category, message, colour, and tooltip", () => {
    for (const b of MARTY_BLOCKS) {
      expect(b.type).toMatch(/^marty_/);
      expect(b.message0).toBeTruthy();
      expect(b.colour).toMatch(/^#[0-9A-F]{6}$/i);
      expect(b.tooltip).toBeTruthy();
    }
  });

  it("includes blocks from every category", () => {
    const categories = new Set(MARTY_BLOCKS.map((b) => b.category));
    expect(categories.has("Motion")).toBe(true);
    expect(categories.has("Sound")).toBe(true);
    expect(categories.has("Sensing")).toBe(true);
    expect(categories.has("Events")).toBe(true);
    expect(categories.has("Control")).toBe(true);
  });

  it("sensing blocks declare an output type instead of statement connectors", () => {
    const sensing = MARTY_BLOCKS.filter((b) => b.category === "Sensing");
    expect(sensing.length).toBeGreaterThan(0);
    for (const b of sensing) {
      expect(b.output).toBeTruthy();
      expect(b.previousStatement).toBeUndefined();
    }
  });

  it("motion blocks chain together via previous/next statements", () => {
    const motion = MARTY_BLOCKS.filter((b) => b.category === "Motion");
    for (const b of motion) {
      expect(b.previousStatement).toBeNull();
      expect(b.nextStatement).toBeNull();
    }
  });
});
