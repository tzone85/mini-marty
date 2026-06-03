import type { Tutorial } from "../types";

export const firstStepsTutorial: Tutorial = {
  id: "first-steps",
  title: "First Steps with Marty",
  description:
    "Learn the basics of block programming by making Marty walk and dance.",
  category: "basics",
  difficulty: "beginner",
  estimatedMinutes: 5,
  steps: [
    {
      id: "fs-1",
      title: "Welcome to Block Editor",
      instructions:
        "Welcome! In this tutorial you'll learn to program Marty using blocks. " +
        "Look at the block palette on the left — these are the commands you can give Marty. " +
        'Click "Done" when you\'re ready to continue.',
      validation: { kind: "manual" },
    },
    {
      id: "fs-2",
      title: "Add a Walk Block",
      instructions:
        'Drag a "Walk Forward" block from the Motion category into the workspace. ' +
        "This block tells Marty to take steps forward.",
      hint: 'Look in the "Motion" category for the Walk Forward block.',
      validation: { kind: "block-type", requiredBlockType: "marty_walk" },
    },
    {
      id: "fs-3",
      title: "Run Your Program",
      instructions:
        "Great! Now press the green Run button at the top to watch Marty walk. " +
        "You should see Marty move in the 3D view on the right.",
      hint: "The Run button is in the toolbar at the top of the page.",
      validation: { kind: "run-program" },
    },
    {
      id: "fs-4",
      title: "Make Marty Dance",
      instructions:
        'Now drag a "Dance" block and connect it after the Walk block. ' +
        "Marty will walk first, then dance!",
      hint: 'The Dance block is also in the "Motion" category.',
      validation: { kind: "block-type", requiredBlockType: "marty_dance" },
    },
    {
      id: "fs-5",
      title: "Run the Sequence",
      instructions:
        "Press Run again to see Marty walk and then dance. " +
        "Congratulations — you've created your first program!",
      validation: { kind: "run-program" },
    },
  ],
};
