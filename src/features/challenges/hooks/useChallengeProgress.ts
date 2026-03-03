"use client";

import { useState, useCallback } from "react";
import type { ChallengeAttempt, ChallengeProgressState } from "../types";
import { CHALLENGES_STORAGE_KEY, INITIAL_CHALLENGE_STATE } from "../types";

function loadState(): ChallengeProgressState {
  if (typeof window === "undefined") return INITIAL_CHALLENGE_STATE;
  try {
    const raw = localStorage.getItem(CHALLENGES_STORAGE_KEY);
    if (!raw) return INITIAL_CHALLENGE_STATE;
    return JSON.parse(raw) as ChallengeProgressState;
  } catch {
    return INITIAL_CHALLENGE_STATE;
  }
}

function saveState(state: ChallengeProgressState): void {
  localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(state));
}

export function useChallengeProgress() {
  const [state, setState] = useState<ChallengeProgressState>(loadState);

  const getAttempt = useCallback(
    (challengeId: string): ChallengeAttempt | undefined => {
      return state.attempts[challengeId];
    },
    [state],
  );

  const startChallenge = useCallback(
    (challengeId: string) => {
      if (state.attempts[challengeId]) {
        // Increment attempt count
        const existing = state.attempts[challengeId];
        if (existing.completed) return;
        const updated: ChallengeAttempt = {
          ...existing,
          attempts: existing.attempts + 1,
        };
        const next: ChallengeProgressState = {
          ...state,
          attempts: { ...state.attempts, [challengeId]: updated },
        };
        setState(next);
        saveState(next);
        return;
      }
      const attempt: ChallengeAttempt = {
        challengeId,
        completed: false,
        objectivesCompleted: [],
        startedAt: Date.now(),
        completedAt: null,
        attempts: 1,
      };
      const next: ChallengeProgressState = {
        ...state,
        attempts: { ...state.attempts, [challengeId]: attempt },
      };
      setState(next);
      saveState(next);
    },
    [state],
  );

  const completeObjective = useCallback(
    (challengeId: string, objectiveId: string, totalObjectives: number) => {
      const current = state.attempts[challengeId];
      if (!current || current.completed) return;
      if (current.objectivesCompleted.includes(objectiveId)) return;

      const objectivesCompleted = [...current.objectivesCompleted, objectiveId];
      const isComplete = objectivesCompleted.length >= totalObjectives;

      const updated: ChallengeAttempt = {
        ...current,
        objectivesCompleted,
        completed: isComplete,
        completedAt: isComplete ? Date.now() : null,
      };

      const badges = isComplete ? [...state.badges, challengeId] : state.badges;

      const next: ChallengeProgressState = {
        ...state,
        attempts: { ...state.attempts, [challengeId]: updated },
        badges: [...new Set(badges)],
      };
      setState(next);
      saveState(next);
    },
    [state],
  );

  const resetChallenge = useCallback(
    (challengeId: string) => {
      const { [challengeId]: _, ...rest } = state.attempts;
      void _;
      const next: ChallengeProgressState = {
        ...state,
        attempts: rest,
        badges: state.badges.filter((b) => b !== challengeId),
      };
      setState(next);
      saveState(next);
    },
    [state],
  );

  const resetAll = useCallback(() => {
    setState(INITIAL_CHALLENGE_STATE);
    saveState(INITIAL_CHALLENGE_STATE);
  }, []);

  const completedCount = Object.values(state.attempts).filter(
    (a) => a.completed,
  ).length;

  const badgeCount = state.badges.length;

  return {
    state,
    getAttempt,
    startChallenge,
    completeObjective,
    resetChallenge,
    resetAll,
    completedCount,
    badgeCount,
  };
}
