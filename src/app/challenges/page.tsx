"use client";

import { useState } from "react";
import {
  CHALLENGES,
  getChallengesByDifficulty,
} from "@/features/challenges/challenge-data";
import type { Challenge } from "@/features/challenges/challenge-data";

const DIFFICULTY_COLORS = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  intermediate:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;

export default function ChallengesPage() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null,
  );
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [filter, setFilter] = useState<
    "all" | "beginner" | "intermediate" | "advanced"
  >("all");

  const challenges =
    filter === "all" ? CHALLENGES : getChallengesByDifficulty(filter);

  if (selectedChallenge) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <button
            type="button"
            onClick={() => {
              setSelectedChallenge(null);
              setRevealedHints(0);
            }}
            className="mb-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            &larr; Back to Challenges
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedChallenge.title}
            </h1>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_COLORS[selectedChallenge.difficulty]}`}
            >
              {selectedChallenge.difficulty}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-gray-600 dark:text-gray-300">
            {selectedChallenge.description}
          </p>

          <div className="mt-6">
            <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Starter Code:
            </h3>
            <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-green-300">
              <code>{selectedChallenge.starterCode}</code>
            </pre>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Copy this into the Python Editor and complete the TODOs!
            </p>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Hints ({revealedHints} of {selectedChallenge.hints.length}{" "}
              revealed):
            </h3>
            <div className="space-y-2">
              {selectedChallenge.hints.map((hint, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-3 text-sm ${
                    i < revealedHints
                      ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
                      : "border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800"
                  }`}
                >
                  {i < revealedHints ? (
                    hint
                  ) : (
                    <span className="italic">
                      Hint {i + 1} — click below to reveal
                    </span>
                  )}
                </div>
              ))}
            </div>
            {revealedHints < selectedChallenge.hints.length && (
              <button
                type="button"
                onClick={() => setRevealedHints((r) => r + 1)}
                className="mt-3 rounded-md bg-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Reveal Next Hint
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Challenges
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Test your programming skills! Solve challenges to practice what you have
        learned.
      </p>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          All ({CHALLENGES.length})
        </button>
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setFilter(d)}
            className={`rounded-full px-3 py-1 text-sm font-medium capitalize transition-colors ${
              filter === d
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
            }`}
          >
            {d} ({getChallengesByDifficulty(d).length})
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <button
            key={challenge.id}
            type="button"
            onClick={() => setSelectedChallenge(challenge)}
            className="rounded-lg border border-gray-200 p-4 text-left transition-all hover:border-blue-400 hover:shadow-md dark:border-gray-700 dark:hover:border-blue-500"
          >
            <div className="flex items-start justify-between">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {challenge.title}
              </h2>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_COLORS[challenge.difficulty]}`}
              >
                {challenge.difficulty}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {challenge.description}
            </p>
            <div className="mt-3 text-xs text-gray-400 dark:text-gray-500">
              {challenge.hints.length} hints available
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
