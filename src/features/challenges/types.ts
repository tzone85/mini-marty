export type ChallengeDifficulty = "beginner" | "intermediate" | "advanced";

export type ObjectiveKind =
  | "use-block"
  | "use-block-count"
  | "run-program"
  | "use-loop"
  | "use-sensor";

export interface ChallengeObjective {
  readonly id: string;
  readonly description: string;
  readonly kind: ObjectiveKind;
  readonly requiredBlockType?: string;
  readonly requiredCount?: number;
}

export interface Badge {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly icon: string;
}

export interface Challenge {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly difficulty: ChallengeDifficulty;
  readonly objectives: readonly ChallengeObjective[];
  readonly hints: readonly string[];
  readonly badge: Badge;
}

export interface ChallengeAttempt {
  readonly challengeId: string;
  readonly completed: boolean;
  readonly objectivesCompleted: readonly string[];
  readonly startedAt: number;
  readonly completedAt: number | null;
  readonly attempts: number;
}

export interface ChallengeProgressState {
  readonly attempts: Readonly<Record<string, ChallengeAttempt>>;
  readonly badges: readonly string[];
}

export const CHALLENGES_STORAGE_KEY = "mini-marty-challenges" as const;

export const INITIAL_CHALLENGE_STATE: ChallengeProgressState = {
  attempts: {},
  badges: [],
};

export const DIFFICULTY_ORDER: readonly ChallengeDifficulty[] = [
  "beginner",
  "intermediate",
  "advanced",
];
