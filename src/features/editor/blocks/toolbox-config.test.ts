import { describe, it, expect } from "vitest";
import { TOOLBOX_CATEGORIES, getToolboxConfig } from "./toolbox-config";

describe("TOOLBOX_CATEGORIES", () => {
  it("includes all expected categories", () => {
    const names = TOOLBOX_CATEGORIES.map((c) => c.name);
    expect(names).toContain("Motion");
    expect(names).toContain("Sound");
    expect(names).toContain("Sensing");
    expect(names).toContain("Events");
    expect(names).toContain("Control");
  });

  it("each category has a name, colour, and block types", () => {
    for (const cat of TOOLBOX_CATEGORIES) {
      expect(cat.name).toBeTruthy();
      expect(cat.colour).toBeTruthy();
      expect(cat.blockTypes.length).toBeGreaterThan(0);
    }
  });

  it("Motion category has the most blocks", () => {
    const motion = TOOLBOX_CATEGORIES.find((c) => c.name === "Motion");
    expect(motion!.blockTypes.length).toBeGreaterThanOrEqual(13);
  });
});

describe("getToolboxConfig", () => {
  it("returns a toolbox definition object", () => {
    const config = getToolboxConfig();
    expect(config.kind).toBe("categoryToolbox");
    expect(config.contents.length).toBeGreaterThan(0);
  });

  it("each content entry has kind, name, colour, and contents", () => {
    const config = getToolboxConfig();
    for (const entry of config.contents) {
      expect(entry.kind).toBe("category");
      expect(entry.name).toBeTruthy();
      expect(entry.colour).toBeTruthy();
      expect(entry.contents.length).toBeGreaterThan(0);
    }
  });

  it("block entries within categories have kind and type", () => {
    const config = getToolboxConfig();
    const firstCategory = config.contents[0];
    for (const block of firstCategory.contents) {
      expect(block.kind).toBe("block");
      expect(block.type).toBeTruthy();
    }
  });
});
