import { describe, it, expect } from "vitest";
import { ALL_TUTORIALS, getTutorialById } from "./index";

describe("Tutorial content", () => {
  it("has exactly 6 tutorials", () => {
    expect(ALL_TUTORIALS).toHaveLength(6);
  });

  it("all tutorials have unique IDs", () => {
    const ids = ALL_TUTORIALS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all tutorials have at least 4 steps", () => {
    ALL_TUTORIALS.forEach((t) => {
      expect(t.steps.length).toBeGreaterThanOrEqual(4);
    });
  });

  it("all step IDs are unique within a tutorial", () => {
    ALL_TUTORIALS.forEach((t) => {
      const ids = t.steps.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  it("all tutorials have required metadata", () => {
    ALL_TUTORIALS.forEach((t) => {
      expect(t.title).toBeTruthy();
      expect(t.description).toBeTruthy();
      expect(t.category).toBeTruthy();
      expect(t.difficulty).toBeTruthy();
      expect(t.estimatedMinutes).toBeGreaterThan(0);
    });
  });

  it("getTutorialById returns correct tutorial", () => {
    const result = getTutorialById("first-steps");
    expect(result).toBeDefined();
    expect(result!.title).toBe("First Steps with Marty");
  });

  it("getTutorialById returns undefined for unknown ID", () => {
    expect(getTutorialById("nonexistent")).toBeUndefined();
  });

  it("covers learning progression from basics to python", () => {
    const categories = ALL_TUTORIALS.map((t) => t.category);
    expect(categories).toContain("basics");
    expect(categories).toContain("movement");
    expect(categories).toContain("loops");
    expect(categories).toContain("sensors");
    expect(categories).toContain("python");
  });

  it("all validation kinds are valid", () => {
    const validKinds = ["manual", "block-count", "block-type", "run-program"];
    ALL_TUTORIALS.forEach((t) => {
      t.steps.forEach((s) => {
        expect(validKinds).toContain(s.validation.kind);
      });
    });
  });
});
