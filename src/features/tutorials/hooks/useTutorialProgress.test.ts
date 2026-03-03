import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTutorialProgress } from "./useTutorialProgress";

describe("useTutorialProgress", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with empty progress", () => {
    const { result } = renderHook(() => useTutorialProgress());
    expect(result.current.state.progress).toEqual({});
    expect(result.current.completedCount).toBe(0);
  });

  it("startTutorial creates progress entry", () => {
    const { result } = renderHook(() => useTutorialProgress());

    act(() => {
      result.current.startTutorial("first-steps");
    });

    const progress = result.current.getProgress("first-steps");
    expect(progress).toBeDefined();
    expect(progress!.currentStepIndex).toBe(0);
    expect(progress!.stepsCompleted).toEqual([]);
    expect(progress!.completed).toBe(false);
  });

  it("startTutorial is idempotent", () => {
    const { result } = renderHook(() => useTutorialProgress());

    act(() => {
      result.current.startTutorial("first-steps");
    });

    const startedAt = result.current.getProgress("first-steps")!.startedAt;

    act(() => {
      result.current.startTutorial("first-steps");
    });

    expect(result.current.getProgress("first-steps")!.startedAt).toBe(
      startedAt,
    );
  });

  it("completeStep advances progress", () => {
    const { result } = renderHook(() => useTutorialProgress());

    act(() => {
      result.current.startTutorial("test");
    });

    act(() => {
      result.current.completeStep("test", "step-1", 3);
    });

    const progress = result.current.getProgress("test")!;
    expect(progress.stepsCompleted).toEqual(["step-1"]);
    expect(progress.currentStepIndex).toBe(1);
    expect(progress.completed).toBe(false);
  });

  it("completeStep does not duplicate steps", () => {
    const { result } = renderHook(() => useTutorialProgress());

    act(() => {
      result.current.startTutorial("test");
    });

    act(() => {
      result.current.completeStep("test", "step-1", 3);
    });

    act(() => {
      result.current.completeStep("test", "step-1", 3);
    });

    expect(result.current.getProgress("test")!.stepsCompleted).toEqual([
      "step-1",
    ]);
  });

  it("completes tutorial when all steps done", () => {
    const { result } = renderHook(() => useTutorialProgress());

    act(() => {
      result.current.startTutorial("test");
    });

    act(() => {
      result.current.completeStep("test", "s1", 2);
    });

    act(() => {
      result.current.completeStep("test", "s2", 2);
    });

    const progress = result.current.getProgress("test")!;
    expect(progress.completed).toBe(true);
    expect(progress.completedAt).not.toBeNull();
    expect(result.current.completedCount).toBe(1);
  });

  it("persists to localStorage", () => {
    const { result } = renderHook(() => useTutorialProgress());

    act(() => {
      result.current.startTutorial("test");
    });

    const stored = localStorage.getItem("mini-marty-tutorials");
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.progress.test).toBeDefined();
  });

  it("loads from localStorage on init", () => {
    localStorage.setItem(
      "mini-marty-tutorials",
      JSON.stringify({
        progress: {
          test: {
            tutorialId: "test",
            currentStepIndex: 1,
            stepsCompleted: ["s1"],
            completed: false,
            startedAt: 1000,
            completedAt: null,
          },
        },
      }),
    );

    const { result } = renderHook(() => useTutorialProgress());
    const progress = result.current.getProgress("test");
    expect(progress).toBeDefined();
    expect(progress!.stepsCompleted).toEqual(["s1"]);
  });

  it("resetProgress removes a tutorial", () => {
    const { result } = renderHook(() => useTutorialProgress());

    act(() => {
      result.current.startTutorial("test");
    });

    act(() => {
      result.current.resetProgress("test");
    });

    expect(result.current.getProgress("test")).toBeUndefined();
  });

  it("resetAll clears everything", () => {
    const { result } = renderHook(() => useTutorialProgress());

    act(() => {
      result.current.startTutorial("a");
      result.current.startTutorial("b");
    });

    act(() => {
      result.current.resetAll();
    });

    expect(result.current.state.progress).toEqual({});
  });

  it("handles corrupt localStorage gracefully", () => {
    localStorage.setItem("mini-marty-tutorials", "not-json");
    const { result } = renderHook(() => useTutorialProgress());
    expect(result.current.state.progress).toEqual({});
  });

  it("completeStep is no-op for unstarted tutorial", () => {
    const { result } = renderHook(() => useTutorialProgress());

    act(() => {
      result.current.completeStep("nonexistent", "s1", 3);
    });

    expect(result.current.getProgress("nonexistent")).toBeUndefined();
  });
});
