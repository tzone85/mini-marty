import { describe, it, expect } from "vitest";
import {
  ALL_CHALLENGES,
  getChallengeById,
  getChallengesByDifficulty,
} from "./index";

describe("Challenge content", () => {
  it("has 7 challenges total", () => {
    expect(ALL_CHALLENGES).toHaveLength(7);
  });

  it("all challenges have unique IDs", () => {
    const ids = ALL_CHALLENGES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all challenges have at least 2 objectives", () => {
    ALL_CHALLENGES.forEach((c) => {
      expect(c.objectives.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("all challenges have at least 1 hint", () => {
    ALL_CHALLENGES.forEach((c) => {
      expect(c.hints.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("all challenges have a badge", () => {
    ALL_CHALLENGES.forEach((c) => {
      expect(c.badge.id).toBeTruthy();
      expect(c.badge.name).toBeTruthy();
      expect(c.badge.icon).toBeTruthy();
    });
  });

  it("all badge IDs are unique", () => {
    const ids = ALL_CHALLENGES.map((c) => c.badge.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers all difficulty levels", () => {
    const difficulties = [...new Set(ALL_CHALLENGES.map((c) => c.difficulty))];
    expect(difficulties).toContain("beginner");
    expect(difficulties).toContain("intermediate");
    expect(difficulties).toContain("advanced");
  });

  it("getChallengeById returns correct challenge", () => {
    const result = getChallengeById("first-walk");
    expect(result).toBeDefined();
    expect(result!.title).toBe("First Walk");
  });

  it("getChallengeById returns undefined for unknown ID", () => {
    expect(getChallengeById("nonexistent")).toBeUndefined();
  });

  it("getChallengesByDifficulty filters correctly", () => {
    const beginner = getChallengesByDifficulty("beginner");
    expect(beginner.length).toBe(3);
    beginner.forEach((c) => expect(c.difficulty).toBe("beginner"));
  });

  it("all objective IDs are unique within a challenge", () => {
    ALL_CHALLENGES.forEach((c) => {
      const ids = c.objectives.map((o) => o.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });
});
