import { describe, it, expect } from "vitest";
import { TOOLBOX_CONFIG } from "./toolbox-config";

describe("TOOLBOX_CONFIG", () => {
  it("has kind set to categoryToolbox", () => {
    expect(TOOLBOX_CONFIG.kind).toBe("categoryToolbox");
  });

  it("has Motion category", () => {
    const motion = TOOLBOX_CONFIG.contents.find((c) => c.name === "Motion");
    expect(motion).toBeDefined();
    expect(motion!.kind).toBe("category");
  });

  it("has Sound category", () => {
    const sound = TOOLBOX_CONFIG.contents.find((c) => c.name === "Sound");
    expect(sound).toBeDefined();
  });

  it("has Sensing category", () => {
    const sensing = TOOLBOX_CONFIG.contents.find((c) => c.name === "Sensing");
    expect(sensing).toBeDefined();
  });

  it("has Events category", () => {
    const events = TOOLBOX_CONFIG.contents.find((c) => c.name === "Events");
    expect(events).toBeDefined();
  });

  it("has Control category", () => {
    const control = TOOLBOX_CONFIG.contents.find((c) => c.name === "Control");
    expect(control).toBeDefined();
  });

  it("has Variables category", () => {
    const vars = TOOLBOX_CONFIG.contents.find((c) => c.name === "Variables");
    expect(vars).toBeDefined();
  });

  it("has at least 7 categories", () => {
    expect(TOOLBOX_CONFIG.contents.length).toBeGreaterThanOrEqual(7);
  });

  it("Motion category contains walk block", () => {
    const motion = TOOLBOX_CONFIG.contents.find((c) => c.name === "Motion");
    const blockTypes = motion!.contents?.map((b) => b.type);
    expect(blockTypes).toContain("marty_walk");
  });

  it("each category has a colour", () => {
    for (const category of TOOLBOX_CONFIG.contents) {
      expect(category.colour).toBeTruthy();
    }
  });
});
