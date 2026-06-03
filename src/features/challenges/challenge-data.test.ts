import { describe, expect, it } from "vitest";
import {
  CHALLENGES,
  getChallengeById,
  getChallengesByDifficulty,
} from "./challenge-data";

describe("CHALLENGES", () => {
  it("is a non-empty list with unique ids", () => {
    expect(CHALLENGES.length).toBeGreaterThan(0);
    const ids = CHALLENGES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers all three difficulty tiers", () => {
    const tiers = new Set(CHALLENGES.map((c) => c.difficulty));
    expect(tiers.has("beginner")).toBe(true);
    expect(tiers.has("intermediate")).toBe(true);
    expect(tiers.has("advanced")).toBe(true);
  });

  it("every challenge has hints, starterCode, and expectedActions arrays", () => {
    for (const c of CHALLENGES) {
      expect(Array.isArray(c.hints)).toBe(true);
      expect(c.hints.length).toBeGreaterThan(0);
      expect(typeof c.starterCode).toBe("string");
      expect(c.starterCode.length).toBeGreaterThan(0);
      expect(Array.isArray(c.expectedActions)).toBe(true);
    }
  });
});

describe("getChallengesByDifficulty", () => {
  it("returns only challenges matching the given tier", () => {
    const beginner = getChallengesByDifficulty("beginner");
    expect(beginner.length).toBeGreaterThan(0);
    for (const c of beginner) {
      expect(c.difficulty).toBe("beginner");
    }
  });
});

describe("getChallengeById", () => {
  it("returns the challenge when the id exists", () => {
    const first = CHALLENGES[0];
    expect(getChallengeById(first.id)).toBe(first);
  });

  it("returns undefined for unknown ids", () => {
    expect(getChallengeById("does-not-exist")).toBeUndefined();
  });
});
