import type { Tutorial, TutorialProgress } from "../types";

interface TutorialCardProps {
  readonly tutorial: Tutorial;
  readonly progress?: TutorialProgress;
  readonly onStart: (tutorialId: string) => void;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  intermediate:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function TutorialCard({
  tutorial,
  progress,
  onStart,
}: TutorialCardProps) {
  const stepsTotal = tutorial.steps.length;
  const stepsComplete = progress?.stepsCompleted.length ?? 0;
  const isComplete = progress?.completed ?? false;
  const isStarted = !!progress && !isComplete;
  const progressPercent =
    stepsTotal > 0 ? Math.round((stepsComplete / stepsTotal) * 100) : 0;

  return (
    <div
      data-testid={`tutorial-card-${tutorial.id}`}
      className="flex flex-col rounded-lg border border-gray-200 p-4 dark:border-gray-700"
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          data-testid="difficulty-badge"
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_COLORS[tutorial.difficulty] ?? ""}`}
        >
          {tutorial.difficulty}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ~{tutorial.estimatedMinutes} min
        </span>
      </div>

      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
        {tutorial.title}
      </h3>
      <p className="mt-1 flex-1 text-sm text-gray-600 dark:text-gray-300">
        {tutorial.description}
      </p>

      {isStarted && (
        <div className="mt-3" data-testid="progress-bar">
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded-full bg-blue-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {stepsComplete}/{stepsTotal} steps
          </p>
        </div>
      )}

      <button
        data-testid={`start-button-${tutorial.id}`}
        onClick={() => onStart(tutorial.id)}
        className={`mt-3 rounded-md px-3 py-1.5 text-sm font-medium ${
          isComplete
            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isComplete ? "Completed ✓" : isStarted ? "Continue" : "Start"}
      </button>
    </div>
  );
}
