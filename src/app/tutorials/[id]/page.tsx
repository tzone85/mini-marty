"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTutorialById } from "@/features/tutorials/content";
import { TutorialPlayer } from "@/features/tutorials/components/TutorialPlayer";
import { useTutorialProgress } from "@/features/tutorials/hooks/useTutorialProgress";

const FALLBACK_PROGRESS = {
  tutorialId: "",
  currentStepIndex: 0,
  stepsCompleted: [] as readonly string[],
  completed: false,
  startedAt: 0,
  completedAt: null,
} as const;

export default function TutorialDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { state, startTutorial, completeStep, resetProgress } =
    useTutorialProgress();

  const tutorial = getTutorialById(params.id);

  // Auto-start progress tracking when visiting a tutorial
  useEffect(() => {
    if (tutorial && !state.progress[tutorial.id]) {
      startTutorial(tutorial.id);
    }
  }, [tutorial, state.progress, startTutorial]);

  if (!tutorial) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Tutorial Not Found
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            The tutorial &ldquo;{params.id}&rdquo; does not exist.
          </p>
          <button
            data-testid="back-to-tutorials"
            onClick={() => router.push("/tutorials")}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Back to Tutorials
          </button>
        </div>
      </div>
    );
  }

  const progress = state.progress[tutorial.id] ?? FALLBACK_PROGRESS;

  function handleCompleteStep(stepId: string) {
    completeStep(tutorial!.id, stepId, tutorial!.steps.length);
  }

  function handleReset() {
    resetProgress(tutorial!.id);
  }

  return (
    <TutorialPlayer
      tutorial={tutorial}
      progress={progress}
      onCompleteStep={handleCompleteStep}
      onBack={() => router.push("/tutorials")}
      onReset={handleReset}
    />
  );
}
