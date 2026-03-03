"use client";

import { useState, useCallback } from "react";
import type { TutorialProgress, TutorialProgressState } from "../types";
import {
  TUTORIALS_STORAGE_KEY,
  INITIAL_TUTORIAL_PROGRESS_STATE,
} from "../types";

function loadState(): TutorialProgressState {
  if (typeof window === "undefined") return INITIAL_TUTORIAL_PROGRESS_STATE;
  try {
    const raw = localStorage.getItem(TUTORIALS_STORAGE_KEY);
    if (!raw) return INITIAL_TUTORIAL_PROGRESS_STATE;
    return JSON.parse(raw) as TutorialProgressState;
  } catch {
    return INITIAL_TUTORIAL_PROGRESS_STATE;
  }
}

function saveState(state: TutorialProgressState): void {
  localStorage.setItem(TUTORIALS_STORAGE_KEY, JSON.stringify(state));
}

export function useTutorialProgress() {
  const [state, setState] = useState<TutorialProgressState>(loadState);

  const getProgress = useCallback(
    (tutorialId: string): TutorialProgress | undefined => {
      return state.progress[tutorialId];
    },
    [state],
  );

  const startTutorial = useCallback(
    (tutorialId: string) => {
      if (state.progress[tutorialId]) return;
      const newProgress: TutorialProgress = {
        tutorialId,
        currentStepIndex: 0,
        stepsCompleted: [],
        completed: false,
        startedAt: Date.now(),
        completedAt: null,
      };
      const next: TutorialProgressState = {
        progress: { ...state.progress, [tutorialId]: newProgress },
      };
      setState(next);
      saveState(next);
    },
    [state],
  );

  const completeStep = useCallback(
    (tutorialId: string, stepId: string, totalSteps: number) => {
      const current = state.progress[tutorialId];
      if (!current) return;
      if (current.stepsCompleted.includes(stepId)) return;

      const stepsCompleted = [...current.stepsCompleted, stepId];
      const nextIndex = Math.min(current.currentStepIndex + 1, totalSteps - 1);
      const isComplete = stepsCompleted.length >= totalSteps;

      const updated: TutorialProgress = {
        ...current,
        currentStepIndex: isComplete ? current.currentStepIndex : nextIndex,
        stepsCompleted,
        completed: isComplete,
        completedAt: isComplete ? Date.now() : null,
      };

      const next: TutorialProgressState = {
        progress: { ...state.progress, [tutorialId]: updated },
      };
      setState(next);
      saveState(next);
    },
    [state],
  );

  const resetProgress = useCallback(
    (tutorialId: string) => {
      const { [tutorialId]: _, ...rest } = state.progress;
      void _;
      const next: TutorialProgressState = { progress: rest };
      setState(next);
      saveState(next);
    },
    [state],
  );

  const resetAll = useCallback(() => {
    setState(INITIAL_TUTORIAL_PROGRESS_STATE);
    saveState(INITIAL_TUTORIAL_PROGRESS_STATE);
  }, []);

  const completedCount = Object.values(state.progress).filter(
    (p) => p.completed,
  ).length;

  return {
    state,
    getProgress,
    startTutorial,
    completeStep,
    resetProgress,
    resetAll,
    completedCount,
  };
}
