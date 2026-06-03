import type { Tutorial } from "../types";
import { firstStepsTutorial } from "./first-steps";
import { movementMasteryTutorial } from "./movement-mastery";
import { danceSequencesTutorial } from "./dance-sequences";
import { loopsAndRepetitionTutorial } from "./loops-and-repetition";
import { sensorsAndDecisionsTutorial } from "./sensors-and-decisions";
import { pythonBasicsTutorial } from "./python-basics";

export const ALL_TUTORIALS: readonly Tutorial[] = [
  firstStepsTutorial,
  movementMasteryTutorial,
  danceSequencesTutorial,
  loopsAndRepetitionTutorial,
  sensorsAndDecisionsTutorial,
  pythonBasicsTutorial,
];

export function getTutorialById(id: string): Tutorial | undefined {
  return ALL_TUTORIALS.find((t) => t.id === id);
}

export {
  firstStepsTutorial,
  movementMasteryTutorial,
  danceSequencesTutorial,
  loopsAndRepetitionTutorial,
  sensorsAndDecisionsTutorial,
  pythonBasicsTutorial,
};
