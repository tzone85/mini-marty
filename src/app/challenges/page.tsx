"use client";

import { useRouter } from "next/navigation";
import { ALL_CHALLENGES } from "@/features/challenges/content";
import { ChallengeCard } from "@/features/challenges/components/ChallengeCard";
import { BadgeDisplay } from "@/features/challenges/components/BadgeDisplay";
import { useChallengeProgress } from "@/features/challenges/hooks/useChallengeProgress";
import { DIFFICULTY_ORDER } from "@/features/challenges/types";

export default function ChallengesPage() {
  const router = useRouter();
  const { state, startChallenge, completedCount, badgeCount } =
    useChallengeProgress();

  function handleStart(challengeId: string) {
    startChallenge(challengeId);
    router.push(`/challenges/${challengeId}`);
  }

  const earnedBadges = ALL_CHALLENGES.filter((c) =>
    state.badges.includes(c.id),
  ).map((c) => c.badge);

  return (
    <div className="flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Challenges
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Solve programming puzzles and earn badges with Marty.
        </p>
        <p
          data-testid="challenge-summary"
          className="mt-1 text-sm text-gray-500 dark:text-gray-400"
        >
          {completedCount} of {ALL_CHALLENGES.length} challenges completed
          {badgeCount > 0 && ` · ${badgeCount} badges earned`}
        </p>
      </div>

      {/* Badges */}
      {earnedBadges.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
            Your Badges
          </h2>
          <BadgeDisplay badges={earnedBadges} />
        </div>
      )}

      {/* Challenges by difficulty */}
      {DIFFICULTY_ORDER.map((difficulty) => {
        const challenges = ALL_CHALLENGES.filter(
          (c) => c.difficulty === difficulty,
        );
        if (challenges.length === 0) return null;
        return (
          <div key={difficulty} className="mb-6">
            <h2 className="mb-3 text-sm font-semibold capitalize text-gray-700 dark:text-gray-300">
              {difficulty}
            </h2>
            <div
              data-testid={`challenges-${difficulty}`}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {challenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  attempt={state.attempts[challenge.id]}
                  onStart={handleStart}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
