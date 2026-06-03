import type { Tutorial } from "../types";

export const movementMasteryTutorial: Tutorial = {
  id: "movement-mastery",
  title: "Movement Mastery",
  description:
    "Explore all of Marty's movement blocks — walking, turning, kicking, sliding, and leaning.",
  category: "movement",
  difficulty: "beginner",
  estimatedMinutes: 8,
  steps: [
    {
      id: "mm-1",
      title: "Walk with Steps",
      instructions:
        'Drag a "Walk Forward" block into the workspace. ' +
        "Change the number of steps to 4. Marty can walk different distances!",
      hint: "Click the number field on the Walk block to change it.",
      validation: { kind: "block-type", requiredBlockType: "marty_walk" },
    },
    {
      id: "mm-2",
      title: "Turn Around",
      instructions:
        'Add a "Turn" block after the Walk block. ' +
        "Marty can turn left or right — try both directions!",
      hint: 'The Turn block is in the "Motion" category. Use the dropdown to pick a direction.',
      validation: { kind: "block-type", requiredBlockType: "marty_turn" },
    },
    {
      id: "mm-3",
      title: "Kick It",
      instructions:
        'Now add a "Kick" block. Marty can kick with the left or right foot.',
      hint: 'Find the Kick block in the "Motion" category.',
      validation: { kind: "block-type", requiredBlockType: "marty_kick" },
    },
    {
      id: "mm-4",
      title: "Slide Sideways",
      instructions:
        'Try the "Side Step" block to make Marty slide left or right without turning.',
      hint: "Side Step moves Marty sideways — great for dodging obstacles!",
      validation: { kind: "block-type", requiredBlockType: "marty_slide" },
    },
    {
      id: "mm-5",
      title: "Lean and Balance",
      instructions:
        'Add a "Lean" block. Marty can lean left, right, forward, or backward. ' +
        "This is useful for expressive movements.",
      hint: 'The Lean block has a direction dropdown — try "forward".',
      validation: { kind: "block-type", requiredBlockType: "marty_lean" },
    },
    {
      id: "mm-6",
      title: "Put It All Together",
      instructions:
        "Run your program to watch Marty perform all the moves in sequence. " +
        "You've mastered Marty's movement blocks!",
      validation: { kind: "run-program" },
    },
  ],
};
