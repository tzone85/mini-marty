/**
 * Validation strategies for tutorial steps.
 * - "manual": user clicks "Done" to advance
 * - "block-count": workspace must contain >= requiredBlockCount blocks
 * - "block-type": workspace must contain a block of requiredBlockType
 * - "run-program": user must run the program at least once
 */
export type ValidationKind =
  | "manual"
  | "block-count"
  | "block-type"
  | "run-program";

export interface StepValidation {
  readonly kind: ValidationKind;
  readonly requiredBlockCount?: number;
  readonly requiredBlockType?: string;
}

export interface TutorialStep {
  readonly id: string;
  readonly title: string;
  readonly instructions: string;
  readonly hint?: string;
  readonly validation: StepValidation;
}

export type TutorialCategory =
  | "basics"
  | "movement"
  | "sequences"
  | "loops"
  | "sensors"
  | "python";

export type TutorialDifficulty = "beginner" | "intermediate" | "advanced";

export interface Tutorial {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: TutorialCategory;
  readonly difficulty: TutorialDifficulty;
  readonly estimatedMinutes: number;
  readonly steps: readonly TutorialStep[];
}

export interface TutorialStepProgress {
  readonly stepId: string;
  readonly completed: boolean;
}

export interface TutorialProgress {
  readonly tutorialId: string;
  readonly currentStepIndex: number;
  readonly stepsCompleted: readonly string[];
  readonly completed: boolean;
  readonly startedAt: number;
  readonly completedAt: number | null;
}

export interface TutorialProgressState {
  readonly progress: Readonly<Record<string, TutorialProgress>>;
}

export const TUTORIALS_STORAGE_KEY = "mini-marty-tutorials" as const;

export const INITIAL_TUTORIAL_PROGRESS_STATE: TutorialProgressState = {
  progress: {},
};
