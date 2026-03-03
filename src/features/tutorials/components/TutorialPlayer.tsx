"use client";

import type { Tutorial, TutorialProgress } from "../types";
import { StepIndicator } from "./StepIndicator";
import { HintPanel } from "./HintPanel";

interface TutorialPlayerProps {
  readonly tutorial: Tutorial;
  readonly progress: TutorialProgress;
  readonly onCompleteStep: (stepId: string) => void;
  readonly onBack: () => void;
  readonly onReset: () => void;
}

export function TutorialPlayer({
  tutorial,
  progress,
  onCompleteStep,
  onBack,
  onReset,
}: TutorialPlayerProps) {
  const currentIndex = progress.completed
    ? tutorial.steps.length - 1
    : progress.currentStepIndex;
  const currentStep = tutorial.steps[currentIndex];
  const isStepDone = progress.stepsCompleted.includes(currentStep.id);
  const isLastStep = currentIndex === tutorial.steps.length - 1;

  return (
    <div data-testid="tutorial-player" className="flex h-full flex-col">
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
            {tutorial.title}
          </h2>
        </div>
        <StepIndicator
          totalSteps={tutorial.steps.length}
          currentStep={currentIndex}
          completedSteps={progress.stepsCompleted}
          stepIds={tutorial.steps.map((s) => s.id)}
        />
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Step {currentIndex + 1} of {tutorial.steps.length}
          </p>
          <h3
            data-testid="step-title"
            className="mt-1 text-xl font-semibold text-gray-900 dark:text-white"
          >
            {currentStep.title}
          </h3>
          <div
            data-testid="step-instructions"
            className="mt-4 whitespace-pre-line text-gray-700 dark:text-gray-300"
          >
            {currentStep.instructions}
          </div>

          {currentStep.hint && <HintPanel hint={currentStep.hint} />}
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700">
        <button
          data-testid="reset-button"
          onClick={onReset}
          className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
        >
          Reset Tutorial
        </button>

        {progress.completed ? (
          <span
            data-testid="completed-message"
            className="text-sm font-medium text-green-600 dark:text-green-400"
          >
            Tutorial Complete!
          </span>
        ) : (
          <button
            data-testid="complete-step-button"
            onClick={() => onCompleteStep(currentStep.id)}
            disabled={isStepDone}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              isStepDone
                ? "cursor-not-allowed bg-gray-200 text-gray-500"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isStepDone
              ? isLastStep
                ? "Completed"
                : "Done"
              : currentStep.validation.kind === "manual"
                ? "Done"
                : "Mark Complete"}
          </button>
        )}
      </div>
    </div>
  );
}
