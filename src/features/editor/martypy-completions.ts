export interface MartypyCompletion {
  readonly label: string;
  readonly insertText: string;
  readonly documentation: string;
}

export const MARTYPY_COMPLETIONS: readonly MartypyCompletion[] = [
  {
    label: "walk",
    insertText: "my_marty.walk(${1:2})",
    documentation: "Walk forward for the specified number of steps.",
  },
  {
    label: "dance",
    insertText: "my_marty.dance()",
    documentation: "Perform a dance routine.",
  },
  {
    label: "kick",
    insertText: 'my_marty.kick("${1:left}")',
    documentation: 'Kick with the specified leg ("left" or "right").',
  },
  {
    label: "slide",
    insertText: 'my_marty.slide("${1:left}")',
    documentation: "Slide in the specified direction.",
  },
  {
    label: "lean",
    insertText: 'my_marty.lean("${1:left}")',
    documentation: "Lean in the specified direction.",
  },
  {
    label: "wiggle",
    insertText: "my_marty.wiggle()",
    documentation: "Wiggle with rapid small movements.",
  },
  {
    label: "circle_dance",
    insertText: "my_marty.circle_dance()",
    documentation: "Perform a rotational dance.",
  },
  {
    label: "celebrate",
    insertText: "my_marty.celebrate()",
    documentation: "Celebrate with arms up and wiggle.",
  },
  {
    label: "get_ready",
    insertText: "my_marty.get_ready()",
    documentation: "Move to the ready position.",
  },
  {
    label: "stand_straight",
    insertText: "my_marty.stand_straight()",
    documentation: "Stand in neutral upright position.",
  },
  {
    label: "eyes",
    insertText: "my_marty.eyes(${1:0})",
    documentation: "Set eye position. 0=center, negative=left, positive=right.",
  },
  {
    label: "arms",
    insertText: "my_marty.arms(${1:0}, ${2:0})",
    documentation: "Set arm positions (left, right). Range: -100 to 100.",
  },
  {
    label: "stop",
    insertText: "my_marty.stop()",
    documentation: "Stop all current movements.",
  },
  {
    label: "is_moving",
    insertText: "my_marty.is_moving()",
    documentation: "Check if Marty is currently moving. Returns True/False.",
  },
  {
    label: "foot_on_ground",
    insertText: 'my_marty.foot_on_ground("${1:left}")',
    documentation: "Check if foot is on the ground. Returns True/False.",
  },
  {
    label: "get_distance_sensor",
    insertText: "my_marty.get_distance_sensor()",
    documentation: "Get distance sensor reading in cm.",
  },
  {
    label: "get_accelerometer",
    insertText: 'my_marty.get_accelerometer("${1:x}")',
    documentation:
      'Get accelerometer reading for the specified axis ("x", "y", or "z").',
  },
  {
    label: "play_sound",
    insertText: 'my_marty.play_sound("${1:excited}")',
    documentation: "Play a sound effect.",
  },
];

export const STARTER_TEMPLATE = `from martypy import Marty

# Create a virtual Marty connection
my_marty = Marty("virtual")

# Make Marty walk 2 steps
my_marty.walk(2)

# Make Marty dance
my_marty.dance()
`;
