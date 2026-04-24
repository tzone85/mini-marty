import type { Tutorial } from "../types";

export const sensorsAndDecisionsTutorial: Tutorial = {
  id: "sensors-and-decisions",
  title: "Sensors & Decisions",
  description:
    "Use Marty's sensors with if/else blocks to make programs that react to the world.",
  category: "sensors",
  difficulty: "intermediate",
  estimatedMinutes: 12,
  steps: [
    {
      id: "sd-1",
      title: "What Are Sensors?",
      instructions:
        "Marty has sensors that detect things — like whether a foot is on the ground " +
        "or if Marty is moving. Let's use them to make smart programs! " +
        'Click "Done" to continue.',
      validation: { kind: "manual" },
    },
    {
      id: "sd-2",
      title: "Meet the If/Else Block",
      instructions:
        'Find the "If / Else" block in the Control category and drag it into the workspace. ' +
        "This block checks a condition and does different things based on the result.",
      hint: 'The If/Else block is in the "Control" category.',
      validation: { kind: "block-type", requiredBlockType: "marty_if_else" },
    },
    {
      id: "sd-3",
      title: "Add a Sensor Condition",
      instructions:
        'Now find the "Foot on Ground" block in the Sensing category. ' +
        "Drag it into the condition slot of the If/Else block.",
      hint: "The hexagon-shaped slot in the If block accepts condition blocks.",
      validation: {
        kind: "block-type",
        requiredBlockType: "marty_foot_on_ground",
      },
    },
    {
      id: "sd-4",
      title: "Add Actions for Each Case",
      instructions:
        'Add a Walk block in the "if true" section and a Wiggle block in the "else" section. ' +
        "If the foot is on the ground, Marty walks. Otherwise, Marty wiggles!",
      hint: 'Put different blocks inside the "if" and "else" slots.',
      validation: { kind: "block-count", requiredBlockCount: 4 },
    },
    {
      id: "sd-5",
      title: "Run and Observe",
      instructions:
        "Press Run and watch what Marty does. " +
        "The sensor check determines which action happens. " +
        "This is called conditional logic — programs making decisions!",
      validation: { kind: "run-program" },
    },
    {
      id: "sd-6",
      title: "Combine with a Loop",
      instructions:
        "Wrap your If/Else inside a Repeat block. " +
        "Now Marty checks the sensor multiple times and reacts each time!",
      hint: "Put the entire If/Else block inside a Repeat block.",
      validation: { kind: "block-type", requiredBlockType: "marty_repeat" },
    },
    {
      id: "sd-7",
      title: "You're Thinking Like a Programmer",
      instructions:
        "Run your program one more time. You've combined sensors, decisions, and loops — " +
        "three fundamental programming concepts. Well done!",
      validation: { kind: "run-program" },
    },
  ],
};
