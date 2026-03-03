"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getChallengeById } from "@/features/challenges/content";
import { ChallengePlayer } from "@/features/challenges/components/ChallengePlayer";
import { useChallengeProgress } from "@/features/challenges/hooks/useChallengeProgress";

const FALLBACK_ATTEMPT = {
  challengeId: "",
  completed: false,
  objectivesCompleted: [] as readonly string[],
  startedAt: 0,
  completedAt: null,
  attempts: 0,
} as const;

export default function ChallengeDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { state, startChallenge, completeObjective, resetChallenge } =
    useChallengeProgress();

  const challenge = getChallengeById(params.id);

  useEffect(() => {
    if (challenge && !state.attempts[challenge.id]) {
      startChallenge(challenge.id);
    }
  }, [challenge, state.attempts, startChallenge]);

  if (!challenge) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Challenge Not Found
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            The challenge &ldquo;{params.id}&rdquo; does not exist.
          </p>
          <button
            data-testid="back-to-challenges"
            onClick={() => router.push("/challenges")}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Back to Challenges
          </button>
        </div>
      </div>
    );
  }

  const attempt = state.attempts[challenge.id] ?? FALLBACK_ATTEMPT;

  function handleCompleteObjective(objectiveId: string) {
    completeObjective(challenge!.id, objectiveId, challenge!.objectives.length);
  }

  function handleReset() {
    resetChallenge(challenge!.id);
  }

  return (
    <ChallengePlayer
      challenge={challenge}
      attempt={attempt}
      onCompleteObjective={handleCompleteObjective}
      onBack={() => router.push("/challenges")}
      onReset={handleReset}
    />
  );
}
