import type { Tutorial } from "../types";

export const danceSequencesTutorial: Tutorial = {
  id: "dance-sequences",
  title: "Making Marty Dance",
  description:
    "Create fun dance routines by combining movement blocks in creative sequences.",
  category: "sequences",
  difficulty: "beginner",
  estimatedMinutes: 10,
  steps: [
    {
      id: "ds-1",
      title: "Start with a Wiggle",
      instructions:
        'Drag a "Wiggle" block into the workspace. ' +
        "This makes Marty wiggle side to side — a great dance starter!",
      hint: 'The Wiggle block is in the "Motion" category.',
      validation: { kind: "block-type", requiredBlockType: "marty_wiggle" },
    },
    {
      id: "ds-2",
      title: "Add a Circle Dance",
      instructions:
        'Connect a "Circle Dance" block after the Wiggle. ' +
        "Marty will wiggle, then do a full circle dance!",
      hint: "Circle Dance makes Marty spin in a circle while moving.",
      validation: {
        kind: "block-type",
        requiredBlockType: "marty_circle_dance",
      },
    },
    {
      id: "ds-3",
      title: "Build a Longer Routine",
      instructions:
        "Add more movement blocks to create a longer dance. " +
        "Try to use at least 5 blocks total for a full routine.",
      hint: "Mix Walk, Kick, Lean, and Dance blocks for variety.",
      validation: { kind: "block-count", requiredBlockCount: 5 },
    },
    {
      id: "ds-4",
      title: "Add a Celebration",
      instructions:
        'End your routine with a "Celebrate" block. ' +
        "Every great dance deserves a big finish!",
      hint: 'The Celebrate block is in the "Motion" category.',
      validation: { kind: "block-type", requiredBlockType: "marty_celebrate" },
    },
    {
      id: "ds-5",
      title: "Watch the Show",
      instructions:
        "Press Run to watch Marty perform your complete dance routine. " +
        "Amazing — you're a choreographer now!",
      validation: { kind: "run-program" },
    },
  ],
};
