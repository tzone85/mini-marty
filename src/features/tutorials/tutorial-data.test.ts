import { describe, expect, it } from "vitest";
import { TUTORIALS, getTutorialById } from "./tutorial-data";

describe("TUTORIALS", () => {
  it("is a non-empty list with unique ids", () => {
    expect(TUTORIALS.length).toBeGreaterThan(0);
    const ids = TUTORIALS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every tutorial has title, description, and at least one step", () => {
    for (const t of TUTORIALS) {
      expect(t.title).toBeTruthy();
      expect(t.description).toBeTruthy();
      expect(t.estimatedMinutes).toBeGreaterThan(0);
      expect(t.steps.length).toBeGreaterThan(0);
    }
  });

  it("covers all three difficulty tiers", () => {
    const tiers = new Set(TUTORIALS.map((t) => t.difficulty));
    expect(tiers.has("beginner")).toBe(true);
    expect(tiers.has("intermediate")).toBe(true);
    expect(tiers.has("advanced")).toBe(true);
  });

  it("every step carries title, description, and code", () => {
    for (const t of TUTORIALS) {
      for (const step of t.steps) {
        expect(step.title).toBeTruthy();
        expect(step.description).toBeTruthy();
        expect(step.code).toBeTruthy();
      }
    }
  });
});

describe("getTutorialById", () => {
  it("returns the tutorial when the id exists", () => {
    const first = TUTORIALS[0];
    expect(getTutorialById(first.id)).toBe(first);
  });

  it("returns undefined for unknown ids", () => {
    expect(getTutorialById("does-not-exist")).toBeUndefined();
  });
});
