import { describe, it, expect } from "vitest";
import {
  TUTORIALS_STORAGE_KEY,
  INITIAL_TUTORIAL_PROGRESS_STATE,
} from "./types";
import type {
  Tutorial,
  TutorialStep,
  TutorialProgress,
  ValidationKind,
} from "./types";

describe("Tutorial types", () => {
  it("TUTORIALS_STORAGE_KEY is correct", () => {
    expect(TUTORIALS_STORAGE_KEY).toBe("mini-marty-tutorials");
  });

  it("INITIAL_TUTORIAL_PROGRESS_STATE has empty progress", () => {
    expect(INITIAL_TUTORIAL_PROGRESS_STATE).toEqual({ progress: {} });
  });

  it("TutorialStep can be created with all validation kinds", () => {
    const kinds: ValidationKind[] = [
      "manual",
      "block-count",
      "block-type",
      "run-program",
    ];
    kinds.forEach((kind) => {
      const step: TutorialStep = {
        id: "s1",
        title: "Test",
        instructions: "Do something",
        validation: { kind },
      };
      expect(step.validation.kind).toBe(kind);
    });
  });

  it("Tutorial structure is valid", () => {
    const tutorial: Tutorial = {
      id: "test",
      title: "Test Tutorial",
      description: "A test",
      category: "basics",
      difficulty: "beginner",
      estimatedMinutes: 5,
      steps: [
        {
          id: "s1",
          title: "Step 1",
          instructions: "Do this",
          validation: { kind: "manual" },
        },
      ],
    };
    expect(tutorial.steps).toHaveLength(1);
    expect(tutorial.category).toBe("basics");
  });

  it("TutorialProgress tracks completion", () => {
    const progress: TutorialProgress = {
      tutorialId: "test",
      currentStepIndex: 2,
      stepsCompleted: ["s1", "s2"],
      completed: false,
      startedAt: 1000,
      completedAt: null,
    };
    expect(progress.stepsCompleted).toHaveLength(2);
    expect(progress.completed).toBe(false);
  });
});
