import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useChallengeProgress } from "./useChallengeProgress";

describe("useChallengeProgress", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with empty state", () => {
    const { result } = renderHook(() => useChallengeProgress());
    expect(result.current.state.attempts).toEqual({});
    expect(result.current.state.badges).toEqual([]);
    expect(result.current.completedCount).toBe(0);
    expect(result.current.badgeCount).toBe(0);
  });

  it("startChallenge creates attempt", () => {
    const { result } = renderHook(() => useChallengeProgress());
    act(() => result.current.startChallenge("first-walk"));

    const attempt = result.current.getAttempt("first-walk");
    expect(attempt).toBeDefined();
    expect(attempt!.attempts).toBe(1);
    expect(attempt!.completed).toBe(false);
    expect(attempt!.objectivesCompleted).toEqual([]);
  });

  it("startChallenge increments attempt count", () => {
    const { result } = renderHook(() => useChallengeProgress());
    act(() => result.current.startChallenge("test"));
    act(() => result.current.startChallenge("test"));

    expect(result.current.getAttempt("test")!.attempts).toBe(2);
  });

  it("startChallenge does not increment if completed", () => {
    const { result } = renderHook(() => useChallengeProgress());
    act(() => result.current.startChallenge("test"));
    act(() => result.current.completeObjective("test", "o1", 1));
    act(() => result.current.startChallenge("test"));

    expect(result.current.getAttempt("test")!.attempts).toBe(1);
  });

  it("completeObjective adds to completed list", () => {
    const { result } = renderHook(() => useChallengeProgress());
    act(() => result.current.startChallenge("test"));
    act(() => result.current.completeObjective("test", "o1", 3));

    const attempt = result.current.getAttempt("test")!;
    expect(attempt.objectivesCompleted).toEqual(["o1"]);
    expect(attempt.completed).toBe(false);
  });

  it("completeObjective does not duplicate", () => {
    const { result } = renderHook(() => useChallengeProgress());
    act(() => result.current.startChallenge("test"));
    act(() => result.current.completeObjective("test", "o1", 3));
    act(() => result.current.completeObjective("test", "o1", 3));

    expect(result.current.getAttempt("test")!.objectivesCompleted).toEqual([
      "o1",
    ]);
  });

  it("completes challenge and awards badge when all objectives done", () => {
    const { result } = renderHook(() => useChallengeProgress());
    act(() => result.current.startChallenge("test"));
    act(() => result.current.completeObjective("test", "o1", 2));
    act(() => result.current.completeObjective("test", "o2", 2));

    const attempt = result.current.getAttempt("test")!;
    expect(attempt.completed).toBe(true);
    expect(attempt.completedAt).not.toBeNull();
    expect(result.current.state.badges).toContain("test");
    expect(result.current.completedCount).toBe(1);
    expect(result.current.badgeCount).toBe(1);
  });

  it("persists to localStorage", () => {
    const { result } = renderHook(() => useChallengeProgress());
    act(() => result.current.startChallenge("test"));

    const stored = localStorage.getItem("mini-marty-challenges");
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.attempts.test).toBeDefined();
  });

  it("loads from localStorage", () => {
    localStorage.setItem(
      "mini-marty-challenges",
      JSON.stringify({
        attempts: {
          test: {
            challengeId: "test",
            completed: true,
            objectivesCompleted: ["o1"],
            startedAt: 1000,
            completedAt: 2000,
            attempts: 1,
          },
        },
        badges: ["test"],
      }),
    );

    const { result } = renderHook(() => useChallengeProgress());
    expect(result.current.getAttempt("test")!.completed).toBe(true);
    expect(result.current.badgeCount).toBe(1);
  });

  it("resetChallenge removes attempt and badge", () => {
    const { result } = renderHook(() => useChallengeProgress());
    act(() => result.current.startChallenge("test"));
    act(() => result.current.completeObjective("test", "o1", 1));
    act(() => result.current.resetChallenge("test"));

    expect(result.current.getAttempt("test")).toBeUndefined();
    expect(result.current.state.badges).not.toContain("test");
  });

  it("resetAll clears everything", () => {
    const { result } = renderHook(() => useChallengeProgress());
    act(() => {
      result.current.startChallenge("a");
      result.current.startChallenge("b");
    });
    act(() => result.current.resetAll());

    expect(result.current.state.attempts).toEqual({});
    expect(result.current.state.badges).toEqual([]);
  });

  it("handles corrupt localStorage", () => {
    localStorage.setItem("mini-marty-challenges", "broken");
    const { result } = renderHook(() => useChallengeProgress());
    expect(result.current.state.attempts).toEqual({});
  });

  it("completeObjective is no-op for unstarted challenge", () => {
    const { result } = renderHook(() => useChallengeProgress());
    act(() => result.current.completeObjective("missing", "o1", 2));
    expect(result.current.getAttempt("missing")).toBeUndefined();
  });
});
