import type { Tutorial } from "../types";

export const loopsAndRepetitionTutorial: Tutorial = {
  id: "loops-and-repetition",
  title: "Loops & Repetition",
  description:
    "Learn to use repeat blocks to make Marty perform actions multiple times without duplicating blocks.",
  category: "loops",
  difficulty: "intermediate",
  estimatedMinutes: 10,
  steps: [
    {
      id: "lr-1",
      title: "The Problem with Copying",
      instructions:
        "Imagine you want Marty to walk forward 5 times. " +
        "You could drag 5 Walk blocks… but there's a better way! " +
        "Start by adding one Walk block to your workspace.",
      validation: { kind: "block-type", requiredBlockType: "marty_walk" },
    },
    {
      id: "lr-2",
      title: "Meet the Repeat Block",
      instructions:
        'Find the "Repeat" block in the Control category. ' +
        "This special block runs everything inside it multiple times. " +
        "Drag it into your workspace.",
      hint: 'Look in the "Control" category — it has a loop icon.',
      validation: { kind: "block-type", requiredBlockType: "marty_repeat" },
    },
    {
      id: "lr-3",
      title: "Put Walk Inside the Loop",
      instructions:
        "Move your Walk block inside the Repeat block. " +
        "Set the repeat count to 3. Now one Walk block does the work of three!",
      hint: "Drag the Walk block into the slot inside the Repeat block.",
      validation: { kind: "block-count", requiredBlockCount: 2 },
    },
    {
      id: "lr-4",
      title: "Run the Loop",
      instructions:
        "Press Run and watch the console output. " +
        'You\'ll see "Walk" appear 3 times — one block, three actions!',
      validation: { kind: "run-program" },
    },
    {
      id: "lr-5",
      title: "Loop a Dance Routine",
      instructions:
        "Now add a Dance block inside the Repeat loop too. " +
        "Marty will walk then dance, walk then dance, walk then dance — a pattern!",
      hint: "Put the Dance block after the Walk block, but still inside the Repeat.",
      validation: { kind: "block-type", requiredBlockType: "marty_dance" },
    },
    {
      id: "lr-6",
      title: "Experiment with Count",
      instructions:
        "Change the repeat count to 5 and run again. " +
        "Loops make it easy to change how many times something happens. " +
        "You've learned one of the most powerful concepts in programming!",
      validation: { kind: "run-program" },
    },
  ],
};
