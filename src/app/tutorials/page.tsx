"use client";

import { useRouter } from "next/navigation";
import { ALL_TUTORIALS } from "@/features/tutorials/content";
import { TutorialCard } from "@/features/tutorials/components/TutorialCard";
import { useTutorialProgress } from "@/features/tutorials/hooks/useTutorialProgress";

export default function TutorialsPage() {
  const router = useRouter();
  const { state, startTutorial, completedCount } = useTutorialProgress();

  function handleStart(tutorialId: string) {
    startTutorial(tutorialId);
    router.push(`/tutorials/${tutorialId}`);
  }

  return (
    <div className="flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tutorials
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Follow step-by-step lessons to learn programming with Marty.
        </p>
        <p
          data-testid="progress-summary"
          className="mt-1 text-sm text-gray-500 dark:text-gray-400"
        >
          {completedCount} of {ALL_TUTORIALS.length} tutorials completed
        </p>
      </div>

      <div
        data-testid="tutorials-grid"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {ALL_TUTORIALS.map((tutorial) => (
          <TutorialCard
            key={tutorial.id}
            tutorial={tutorial}
            progress={state.progress[tutorial.id]}
            onStart={handleStart}
          />
        ))}
      </div>
    </div>
  );
}
