import { describe, it, expect } from "vitest";
import { MARTYPY_COMPLETIONS, STARTER_TEMPLATE } from "./martypy-completions";

describe("MARTYPY_COMPLETIONS", () => {
  it("contains movement commands", () => {
    const labels = MARTYPY_COMPLETIONS.map((c) => c.label);
    expect(labels).toContain("walk");
    expect(labels).toContain("dance");
    expect(labels).toContain("kick");
    expect(labels).toContain("slide");
    expect(labels).toContain("lean");
    expect(labels).toContain("wiggle");
    expect(labels).toContain("circle_dance");
    expect(labels).toContain("celebrate");
  });

  it("contains pose commands", () => {
    const labels = MARTYPY_COMPLETIONS.map((c) => c.label);
    expect(labels).toContain("get_ready");
    expect(labels).toContain("stand_straight");
  });

  it("contains sensor commands", () => {
    const labels = MARTYPY_COMPLETIONS.map((c) => c.label);
    expect(labels).toContain("foot_on_ground");
    expect(labels).toContain("get_distance_sensor");
  });

  it("contains control commands", () => {
    const labels = MARTYPY_COMPLETIONS.map((c) => c.label);
    expect(labels).toContain("stop");
    expect(labels).toContain("is_moving");
  });

  it("each completion has label, insertText, and documentation", () => {
    for (const completion of MARTYPY_COMPLETIONS) {
      expect(completion.label).toBeTruthy();
      expect(completion.insertText).toBeTruthy();
      expect(completion.documentation).toBeTruthy();
    }
  });

  it("has at least 15 completions", () => {
    expect(MARTYPY_COMPLETIONS.length).toBeGreaterThanOrEqual(15);
  });
});

describe("STARTER_TEMPLATE", () => {
  it("imports martypy", () => {
    expect(STARTER_TEMPLATE).toContain("from martypy import Marty");
  });

  it("creates a Marty instance", () => {
    expect(STARTER_TEMPLATE).toContain('Marty("virtual")');
  });

  it("includes a sample command", () => {
    expect(STARTER_TEMPLATE).toContain("my_marty");
  });
});
