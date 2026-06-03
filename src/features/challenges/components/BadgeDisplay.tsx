import type { Badge } from "../types";

interface BadgeDisplayProps {
  readonly badges: readonly Badge[];
}

export function BadgeDisplay({ badges }: BadgeDisplayProps) {
  if (badges.length === 0) {
    return (
      <div data-testid="badge-display" className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Complete challenges to earn badges!
        </p>
      </div>
    );
  }

  return (
    <div data-testid="badge-display" className="flex flex-wrap gap-3">
      {badges.map((badge) => (
        <div
          key={badge.id}
          data-testid={`badge-${badge.id}`}
          className="flex flex-col items-center rounded-lg border border-gray-200 p-3 dark:border-gray-700"
        >
          <span className="text-2xl">{badge.icon}</span>
          <span className="mt-1 text-xs font-medium text-gray-900 dark:text-white">
            {badge.name}
          </span>
        </div>
      ))}
    </div>
  );
}
