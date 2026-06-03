import { describe, expect, it } from "vitest";
import { TOOLBOX_CONFIG } from "./toolbox-config";
import { MARTY_BLOCKS } from "./marty-blocks";

describe("TOOLBOX_CONFIG", () => {
  it("declares a categoryToolbox", () => {
    expect(TOOLBOX_CONFIG.kind).toBe("categoryToolbox");
    expect(TOOLBOX_CONFIG.contents.length).toBeGreaterThan(0);
  });

  it("includes a category for every BlockCategory plus Variables + Operators", () => {
    const names = TOOLBOX_CONFIG.contents.map((c) => c.name);
    expect(names).toContain("Motion");
    expect(names).toContain("Sound");
    expect(names).toContain("Sensing");
    expect(names).toContain("Events");
    expect(names).toContain("Control");
    expect(names).toContain("Variables");
    expect(names).toContain("Operators");
  });

  it("each named block category lists at least one block", () => {
    const blockCategories = ["Motion", "Sound", "Sensing", "Events", "Control"];
    for (const name of blockCategories) {
      const cat = TOOLBOX_CONFIG.contents.find((c) => c.name === name);
      expect(cat).toBeDefined();
      expect(cat!.contents).toBeDefined();
      expect(cat!.contents!.length).toBeGreaterThan(0);
    }
  });

  it("only references block types defined in MARTY_BLOCKS", () => {
    const definedTypes = new Set(MARTY_BLOCKS.map((b) => b.type));
    for (const cat of TOOLBOX_CONFIG.contents) {
      if (!cat.contents) continue;
      for (const block of cat.contents) {
        expect(definedTypes.has(block.type)).toBe(true);
      }
    }
  });

  it("uses dynamic (custom) categories for Variables and Operators", () => {
    const variables = TOOLBOX_CONFIG.contents.find(
      (c) => c.name === "Variables",
    );
    const operators = TOOLBOX_CONFIG.contents.find(
      (c) => c.name === "Operators",
    );
    expect(variables?.custom).toBe("VARIABLE");
    expect(operators?.custom).toBe("PROCEDURE");
  });
});
