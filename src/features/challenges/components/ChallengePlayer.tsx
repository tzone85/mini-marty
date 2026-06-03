"use client";

import { useState } from "react";
import type { Challenge, ChallengeAttempt } from "../types";
import { ObjectiveList } from "./ObjectiveList";

interface ChallengePlayerProps {
  readonly challenge: Challenge;
  readonly attempt: ChallengeAttempt;
  readonly onCompleteObjective: (objectiveId: string) => void;
  readonly onBack: () => void;
  readonly onReset: () => void;
}

export function ChallengePlayer({
  challenge,
  attempt,
  onCompleteObjective,
  onBack,
  onReset,
}: ChallengePlayerProps) {
  const [hintIndex, setHintIndex] = useState(-1);

  const showNextHint = () => {
    if (hintIndex < challenge.hints.length - 1) {
      setHintIndex(hintIndex + 1);
    }
  };

  const allDone = attempt.completed;
  const nextObjective = challenge.objectives.find(
    (obj) => !attempt.objectivesCompleted.includes(obj.id),
  );

  return (
    <div data-testid="challenge-player" className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button
            data-testid="back-button"
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            &larr; Back
          </button>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {challenge.title}
          </h2>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Attempt #{attempt.attempts}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl">
          <p className="text-gray-700 dark:text-gray-300">
            {challenge.description}
          </p>

          <h3 className="mb-3 mt-6 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
            Objectives
          </h3>
          <ObjectiveList
            objectives={challenge.objectives}
            completedObjectives={attempt.objectivesCompleted}
          />

          {/* Hints */}
          {hintIndex >= 0 && (
            <div className="mt-4 space-y-2" data-testid="hints-list">
              {challenge.hints.slice(0, hintIndex + 1).map((hint, i) => (
                <div
                  key={i}
                  className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                >
                  {hint}
                </div>
              ))}
            </div>
          )}

          {/* Completion badge */}
          {allDone && (
            <div
              data-testid="completion-banner"
              className="mt-6 rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20"
            >
              <span className="text-3xl">{challenge.badge.icon}</span>
              <h3 className="mt-2 font-semibold text-green-800 dark:text-green-200">
                {challenge.badge.name}
              </h3>
              <p className="text-sm text-green-600 dark:text-green-300">
                {challenge.badge.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700">
        <div className="flex gap-3">
          <button
            data-testid="reset-button"
            onClick={onReset}
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
          >
            Reset
          </button>
          {hintIndex < challenge.hints.length - 1 && (
            <button
              data-testid="hint-button"
              onClick={showNextHint}
              className="text-sm text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
            >
              Need a hint?
            </button>
          )}
        </div>

        {!allDone && nextObjective && (
          <button
            data-testid="complete-objective-button"
            onClick={() => onCompleteObjective(nextObjective.id)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Complete: {nextObjective.description}
          </button>
        )}
      </div>
    </div>
  );
}
