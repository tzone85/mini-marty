import type { Challenge, ChallengeAttempt } from "../types";

interface ChallengeCardProps {
  readonly challenge: Challenge;
  readonly attempt?: ChallengeAttempt;
  readonly onStart: (challengeId: string) => void;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  intermediate:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function ChallengeCard({
  challenge,
  attempt,
  onStart,
}: ChallengeCardProps) {
  const isComplete = attempt?.completed ?? false;
  const isStarted = !!attempt && !isComplete;
  const objectivesDone = attempt?.objectivesCompleted.length ?? 0;
  const objectivesTotal = challenge.objectives.length;

  return (
    <div
      data-testid={`challenge-card-${challenge.id}`}
      className="flex flex-col rounded-lg border border-gray-200 p-4 dark:border-gray-700"
    >
      <div className="mb-2 flex items-center justify-between">
        <span
          data-testid="difficulty-badge"
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_COLORS[challenge.difficulty] ?? ""}`}
        >
          {challenge.difficulty}
        </span>
        {isComplete && (
          <span data-testid="badge-icon" className="text-xl">
            {challenge.badge.icon}
          </span>
        )}
      </div>

      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
        {challenge.title}
      </h3>
      <p className="mt-1 flex-1 text-sm text-gray-600 dark:text-gray-300">
        {challenge.description}
      </p>

      <div className="mt-3" data-testid="objectives-summary">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {objectivesDone}/{objectivesTotal} objectives
        </p>
      </div>

      <button
        data-testid={`start-button-${challenge.id}`}
        onClick={() => onStart(challenge.id)}
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
