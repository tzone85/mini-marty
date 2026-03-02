import { describe, it, expect } from "vitest";
import { MARTYPY_COMPLETIONS, STARTER_TEMPLATE } from "./martypy-completions";

describe("MARTYPY_COMPLETIONS", () => {
  it("includes movement commands", () => {
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

  it("includes pose commands", () => {
    const labels = MARTYPY_COMPLETIONS.map((c) => c.label);
    expect(labels).toContain("get_ready");
    expect(labels).toContain("stand_straight");
  });

  it("includes sensor functions", () => {
    const labels = MARTYPY_COMPLETIONS.map((c) => c.label);
    expect(labels).toContain("foot_on_ground");
    expect(labels).toContain("get_distance_sensor");
    expect(labels).toContain("get_accelerometer");
  });

  it("includes control functions", () => {
    const labels = MARTYPY_COMPLETIONS.map((c) => c.label);
    expect(labels).toContain("stop");
    expect(labels).toContain("is_moving");
  });

  it("includes joint/eye control", () => {
    const labels = MARTYPY_COMPLETIONS.map((c) => c.label);
    expect(labels).toContain("eyes");
    expect(labels).toContain("arms");
    expect(labels).toContain("move_joint");
  });

  it("includes sound function", () => {
    const labels = MARTYPY_COMPLETIONS.map((c) => c.label);
    expect(labels).toContain("play_sound");
  });

  it("each completion has label, insertText, and detail", () => {
    for (const completion of MARTYPY_COMPLETIONS) {
      expect(completion.label).toBeTruthy();
      expect(completion.insertText).toBeTruthy();
      expect(completion.detail).toBeTruthy();
    }
  });
});

describe("STARTER_TEMPLATE", () => {
  it("imports martypy", () => {
    expect(STARTER_TEMPLATE).toContain("from martypy import Marty");
  });

  it("creates a virtual Marty instance", () => {
    expect(STARTER_TEMPLATE).toContain('Marty("virtual")');
  });

  it("includes a comment explaining the code", () => {
    expect(STARTER_TEMPLATE).toContain("#");
  });
});
