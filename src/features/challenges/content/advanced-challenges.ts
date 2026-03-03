import type { Challenge } from "../types";

export const advancedChallenges: readonly Challenge[] = [
  {
    id: "sensor-detective",
    title: "Sensor Detective",
    description:
      "Use Marty's sensors with if/else logic to make a program that reacts to the environment.",
    difficulty: "advanced",
    objectives: [
      {
        id: "sd-1",
        description: "Use an If/Else block",
        kind: "use-block",
        requiredBlockType: "marty_if_else",
      },
      {
        id: "sd-2",
        description: "Use a sensor block",
        kind: "use-sensor",
      },
      {
        id: "sd-3",
        description: "Use at least 5 blocks total",
        kind: "use-block-count",
        requiredCount: 5,
      },
      {
        id: "sd-4",
        description: "Run your program",
        kind: "run-program",
      },
    ],
    hints: [
      "Combine If/Else with a sensor like Foot on Ground.",
      "Put different actions in the if and else branches.",
      "Wrap it in a loop to check the sensor repeatedly.",
    ],
    badge: {
      id: "badge-sensor-detective",
      name: "Sensor Detective",
      description: "Built a smart program that uses sensors!",
      icon: "🔍",
    },
  },
  {
    id: "ultimate-routine",
    title: "Ultimate Routine",
    description:
      "Combine loops, sensors, and at least 8 blocks to create the ultimate Marty program.",
    difficulty: "advanced",
    objectives: [
      {
        id: "ur-1",
        description: "Use at least 8 blocks",
        kind: "use-block-count",
        requiredCount: 8,
      },
      {
        id: "ur-2",
        description: "Use a Repeat block",
        kind: "use-loop",
      },
      {
        id: "ur-3",
        description: "Use a sensor block",
        kind: "use-sensor",
      },
      {
        id: "ur-4",
        description: "Run your program",
        kind: "run-program",
      },
    ],
    hints: [
      "Start with a When Start block as the entry point.",
      "Use a loop with an If/Else inside for reactive behavior.",
      "Add multiple movement blocks for a rich routine.",
    ],
    badge: {
      id: "badge-ultimate",
      name: "Marty Master",
      description: "Created the ultimate Marty program!",
      icon: "🏆",
    },
  },
];
