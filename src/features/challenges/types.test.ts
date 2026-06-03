import { describe, it, expect } from "vitest";
import {
  CHALLENGES_STORAGE_KEY,
  INITIAL_CHALLENGE_STATE,
  DIFFICULTY_ORDER,
} from "./types";
import type { Challenge, ChallengeAttempt } from "./types";

describe("Challenge types", () => {
  it("CHALLENGES_STORAGE_KEY is correct", () => {
    expect(CHALLENGES_STORAGE_KEY).toBe("mini-marty-challenges");
  });

  it("INITIAL_CHALLENGE_STATE has empty data", () => {
    expect(INITIAL_CHALLENGE_STATE).toEqual({ attempts: {}, badges: [] });
  });

  it("DIFFICULTY_ORDER is beginner, intermediate, advanced", () => {
    expect(DIFFICULTY_ORDER).toEqual(["beginner", "intermediate", "advanced"]);
  });

  it("Challenge structure is valid", () => {
    const challenge: Challenge = {
      id: "test",
      title: "Test",
      description: "A test",
      difficulty: "beginner",
      objectives: [{ id: "o1", description: "Do it", kind: "use-block" }],
      hints: ["Try this"],
      badge: { id: "b1", name: "Badge", description: "Got it", icon: "🏅" },
    };
    expect(challenge.objectives).toHaveLength(1);
  });

  it("ChallengeAttempt tracks completion", () => {
    const attempt: ChallengeAttempt = {
      challengeId: "test",
      completed: true,
      objectivesCompleted: ["o1"],
      startedAt: 1000,
      completedAt: 2000,
      attempts: 1,
    };
    expect(attempt.completed).toBe(true);
    expect(attempt.attempts).toBe(1);
  });
});
