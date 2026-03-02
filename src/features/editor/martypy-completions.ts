export interface MartyCompletion {
  readonly label: string;
  readonly insertText: string;
  readonly detail: string;
}

export const MARTYPY_COMPLETIONS: readonly MartyCompletion[] = [
  // Movement
  {
    label: "walk",
    insertText: "my_marty.walk(${1:2})",
    detail: "Walk forward for N steps",
  },
  {
    label: "dance",
    insertText: "my_marty.dance()",
    detail: "Perform a dance routine",
  },
  {
    label: "kick",
    insertText: 'my_marty.kick(${1:"left"})',
    detail: "Kick with left or right leg",
  },
  {
    label: "slide",
    insertText: 'my_marty.slide(${1:"left"}, ${2:1})',
    detail: "Slide in a direction for N steps",
  },
  {
    label: "lean",
    insertText: 'my_marty.lean(${1:"left"}, ${2:500})',
    detail: "Lean in a direction for N milliseconds",
  },
  {
    label: "wiggle",
    insertText: "my_marty.wiggle()",
    detail: "Wiggle Marty's body",
  },
  {
    label: "circle_dance",
    insertText: 'my_marty.circle_dance(${1:"left"}, ${2:1})',
    detail: "Perform a circular dance",
  },
  {
    label: "celebrate",
    insertText: "my_marty.celebrate()",
    detail: "Celebrate with arms up and wiggle",
  },

  // Poses
  {
    label: "get_ready",
    insertText: "my_marty.get_ready()",
    detail: "Move to ready/neutral pose",
  },
  {
    label: "stand_straight",
    insertText: "my_marty.stand_straight()",
    detail: "Stand up straight",
  },

  // Joint control
  {
    label: "eyes",
    insertText: 'my_marty.eyes(${1:"normal"})',
    detail: "Set eye expression: normal, wide, angry, excited",
  },
  {
    label: "arms",
    insertText: "my_marty.arms(${1:0}, ${2:0}, ${3:500})",
    detail: "Set arm positions (left angle, right angle, duration)",
  },
  {
    label: "move_joint",
    insertText: 'my_marty.move_joint(${1:"left_hip"}, ${2:0}, ${3:500})',
    detail: "Move a specific joint to an angle",
  },

  // Sensors
  {
    label: "foot_on_ground",
    insertText: 'my_marty.foot_on_ground(${1:"left"})',
    detail: "Check if foot is touching the ground",
  },
  {
    label: "get_distance_sensor",
    insertText: "my_marty.get_distance_sensor()",
    detail: "Get distance sensor reading",
  },
  {
    label: "get_accelerometer",
    insertText: 'my_marty.get_accelerometer(${1:"x"})',
    detail: "Get accelerometer reading for axis (x, y, z)",
  },

  // Control
  {
    label: "stop",
    insertText: "my_marty.stop()",
    detail: "Stop all current actions",
  },
  {
    label: "is_moving",
    insertText: "my_marty.is_moving()",
    detail: "Check if Marty is currently moving",
  },

  // Sound
  {
    label: "play_sound",
    insertText: 'my_marty.play_sound(${1:"excited"})',
    detail: "Play a sound effect",
  },
] as const;

export const STARTER_TEMPLATE = `# Mini Marty - Python Editor
# Write Python code to control your virtual Marty robot!

from martypy import Marty

# Create a virtual Marty instance
my_marty = Marty("virtual")

# Try some commands:
my_marty.get_ready()
my_marty.walk(2)
my_marty.dance()
`;
