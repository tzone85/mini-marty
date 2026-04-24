import type { Challenge } from "../types";

export const beginnerChallenges: readonly Challenge[] = [
  {
    id: "first-walk",
    title: "First Walk",
    description:
      "Make Marty take a walk! Use the Walk block to get Marty moving.",
    difficulty: "beginner",
    objectives: [
      {
        id: "fw-1",
        description: "Use a Walk block",
        kind: "use-block",
        requiredBlockType: "marty_walk",
      },
      {
        id: "fw-2",
        description: "Run your program",
        kind: "run-program",
      },
    ],
    hints: [
      "Drag a Walk Forward block from the Motion category.",
      "Press the green Run button to execute your program.",
    ],
    badge: {
      id: "badge-first-walk",
      name: "First Steps",
      description: "Made Marty walk for the first time!",
      icon: "🚶",
    },
  },
  {
    id: "dance-party",
    title: "Dance Party",
    description:
      "Create a mini dance routine using at least 3 different movement blocks.",
    difficulty: "beginner",
    objectives: [
      {
        id: "dp-1",
        description: "Use at least 3 blocks",
        kind: "use-block-count",
        requiredCount: 3,
      },
      {
        id: "dp-2",
        description: "Use a Dance block",
        kind: "use-block",
        requiredBlockType: "marty_dance",
      },
      {
        id: "dp-3",
        description: "Run your program",
        kind: "run-program",
      },
    ],
    hints: [
      "Combine Walk, Dance, and Wiggle blocks for variety.",
      "Connect blocks together to make a sequence.",
    ],
    badge: {
      id: "badge-dance-party",
      name: "Dance Star",
      description: "Created a dance routine with Marty!",
      icon: "💃",
    },
  },
  {
    id: "kick-master",
    title: "Kick Master",
    description: "Make Marty kick with both feet. Show off those robot skills!",
    difficulty: "beginner",
    objectives: [
      {
        id: "km-1",
        description: "Use a Kick block",
        kind: "use-block",
        requiredBlockType: "marty_kick",
      },
      {
        id: "km-2",
        description: "Run your program",
        kind: "run-program",
      },
    ],
    hints: [
      "Find the Kick block in the Motion category.",
      "Use the dropdown to select left or right foot.",
    ],
    badge: {
      id: "badge-kick-master",
      name: "Kick Master",
      description: "Mastered Marty's kick moves!",
      icon: "⚽",
    },
  },
];
