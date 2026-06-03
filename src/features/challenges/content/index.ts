import type { Challenge } from "../types";
import { beginnerChallenges } from "./beginner-challenges";
import { intermediateChallenges } from "./intermediate-challenges";
import { advancedChallenges } from "./advanced-challenges";

export const ALL_CHALLENGES: readonly Challenge[] = [
  ...beginnerChallenges,
  ...intermediateChallenges,
  ...advancedChallenges,
];

export function getChallengeById(id: string): Challenge | undefined {
  return ALL_CHALLENGES.find((c) => c.id === id);
}

export function getChallengesByDifficulty(
  difficulty: string,
): readonly Challenge[] {
  return ALL_CHALLENGES.filter((c) => c.difficulty === difficulty);
}

export { beginnerChallenges, intermediateChallenges, advancedChallenges };
