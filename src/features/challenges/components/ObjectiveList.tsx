import type { ChallengeObjective } from "../types";

interface ObjectiveListProps {
  readonly objectives: readonly ChallengeObjective[];
  readonly completedObjectives: readonly string[];
}

export function ObjectiveList({
  objectives,
  completedObjectives,
}: ObjectiveListProps) {
  return (
    <ul data-testid="objective-list" className="space-y-2">
      {objectives.map((obj) => {
        const isDone = completedObjectives.includes(obj.id);
        return (
          <li
            key={obj.id}
            data-testid={`objective-${obj.id}`}
            className={`flex items-center gap-2 rounded-md p-2 text-sm ${
              isDone
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                : "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            <span data-testid={`objective-status-${obj.id}`}>
              {isDone ? "✓" : "○"}
            </span>
            <span>{obj.description}</span>
          </li>
        );
      })}
    </ul>
  );
}
