import type { Challenge } from "../types";

export const intermediateChallenges: readonly Challenge[] = [
  {
    id: "loop-walker",
    title: "Loop Walker",
    description:
      "Use a repeat loop to make Marty walk efficiently. Why use 5 blocks when 1 loop will do?",
    difficulty: "intermediate",
    objectives: [
      {
        id: "lw-1",
        description: "Use a Repeat block",
        kind: "use-loop",
      },
      {
        id: "lw-2",
        description: "Use a Walk block inside the loop",
        kind: "use-block",
        requiredBlockType: "marty_walk",
      },
      {
        id: "lw-3",
        description: "Run your program",
        kind: "run-program",
      },
    ],
    hints: [
      "Find the Repeat block in the Control category.",
      "Put a Walk block inside the Repeat block.",
      "Set the repeat count to at least 3.",
    ],
    badge: {
      id: "badge-loop-walker",
      name: "Loop Master",
      description: "Used loops to make Marty repeat actions!",
      icon: "🔁",
    },
  },
  {
    id: "dance-routine",
    title: "Choreographer",
    description:
      "Create a complex dance routine with at least 6 blocks. Make it creative!",
    difficulty: "intermediate",
    objectives: [
      {
        id: "dr-1",
        description: "Use at least 6 blocks",
        kind: "use-block-count",
        requiredCount: 6,
      },
      {
        id: "dr-2",
        description: "End with a Celebrate block",
        kind: "use-block",
        requiredBlockType: "marty_celebrate",
      },
      {
        id: "dr-3",
        description: "Run your program",
        kind: "run-program",
      },
    ],
    hints: [
      "Mix different movement blocks for variety.",
      "Use Wiggle, Circle Dance, and Lean for expression.",
      "Always end with a Celebrate for the big finish!",
    ],
    badge: {
      id: "badge-choreographer",
      name: "Choreographer",
      description: "Created an impressive dance routine!",
      icon: "🎭",
    },
  },
];
