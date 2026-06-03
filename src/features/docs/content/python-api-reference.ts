import type { DocSection } from "../types";

export const PYTHON_API_SECTION: DocSection = {
  id: "python-api",
  title: "Python API Reference",
  description:
    "Complete reference for the martypy Python module used to control Virtual Marty.",
  subsections: [
    {
      id: "getting-started-python",
      title: "Getting Started",
      entries: [
        {
          title: "Creating a Marty Instance",
          description: "How to import and initialize the Marty class.",
          content: [
            "Import the Marty class from the martypy module, then create an instance connected to the virtual robot.",
            'The Marty("virtual") constructor creates a connection to the in-browser Virtual Marty.',
          ],
          examples: [
            {
              title: "Basic setup",
              language: "python",
              code: 'from martypy import Marty\n\nmy_marty = Marty("virtual")',
              description: "Import and create a Marty instance.",
            },
          ],
        },
      ],
    },
    {
      id: "movement-api",
      title: "Movement Functions",
      entries: [
        {
          title: "walk(steps)",
          description: "Walk forward for N steps.",
          content: [
            "Makes Marty walk forward. Each step is one complete walking cycle.",
          ],
          parameters: [
            {
              name: "steps",
              type: "int",
              description: "Number of steps to walk.",
              defaultValue: "2",
            },
          ],
          examples: [
            {
              title: "Walk forward",
              language: "python",
              code: "my_marty.walk(4)",
            },
          ],
        },
        {
          title: "dance()",
          description: "Perform a dance routine.",
          content: [
            "Makes Marty perform a fun dance sequence with coordinated movements.",
          ],
          examples: [
            {
              title: "Dance",
              language: "python",
              code: "my_marty.dance()",
            },
          ],
        },
        {
          title: "kick(side)",
          description: "Kick with left or right leg.",
          content: ["Performs a kicking motion with the specified leg."],
          parameters: [
            {
              name: "side",
              type: "str",
              description: '"left" or "right".',
              defaultValue: '"left"',
            },
          ],
          examples: [
            {
              title: "Kick",
              language: "python",
              code: 'my_marty.kick("left")',
            },
          ],
        },
        {
          title: "slide(direction, steps)",
          description: "Slide in a direction for N steps.",
          content: ["Makes Marty slide sideways without turning."],
          parameters: [
            {
              name: "direction",
              type: "str",
              description: '"left" or "right".',
              defaultValue: '"left"',
            },
            {
              name: "steps",
              type: "int",
              description: "Number of slide steps.",
              defaultValue: "1",
            },
          ],
          examples: [
            {
              title: "Slide left",
              language: "python",
              code: 'my_marty.slide("left", 2)',
            },
          ],
        },
        {
          title: "lean(direction, duration)",
          description: "Lean in a direction for N milliseconds.",
          content: [
            "Tilts Marty's body in the chosen direction and holds the pose.",
          ],
          parameters: [
            {
              name: "direction",
              type: "str",
              description: '"left", "right", "forward", or "back".',
              defaultValue: '"left"',
            },
            {
              name: "duration",
              type: "int",
              description: "How long to hold the lean in milliseconds.",
              defaultValue: "500",
            },
          ],
        },
        {
          title: "wiggle()",
          description: "Wiggle Marty's body.",
          content: ["Makes Marty wiggle side to side in a playful motion."],
        },
        {
          title: "circle_dance(direction, steps)",
          description: "Perform a circular dance.",
          content: ["Marty dances while rotating in a circle."],
          parameters: [
            {
              name: "direction",
              type: "str",
              description: '"left" or "right".',
              defaultValue: '"left"',
            },
            {
              name: "steps",
              type: "int",
              description: "Number of rotation steps.",
              defaultValue: "1",
            },
          ],
        },
        {
          title: "celebrate()",
          description: "Celebrate with arms up and wiggle.",
          content: ["Marty raises its arms and performs a celebratory wiggle."],
        },
      ],
    },
    {
      id: "pose-api",
      title: "Pose Functions",
      entries: [
        {
          title: "get_ready()",
          description: "Move to ready/neutral pose.",
          content: [
            "Resets Marty to a balanced, neutral stance. Recommended at the start of every program.",
          ],
          examples: [
            {
              title: "Get ready",
              language: "python",
              code: "my_marty.get_ready()",
            },
          ],
        },
        {
          title: "stand_straight()",
          description: "Stand up straight.",
          content: [
            "Moves Marty to a fully upright position with arms at its sides.",
          ],
        },
        {
          title: "eyes(expression)",
          description: "Set eye expression.",
          content: [
            "Changes Marty's eye expression. Available expressions: normal, wide, angry, excited.",
          ],
          parameters: [
            {
              name: "expression",
              type: "str",
              description: '"normal", "wide", "angry", or "excited".',
              defaultValue: '"normal"',
            },
          ],
          examples: [
            {
              title: "Set eyes",
              language: "python",
              code: 'my_marty.eyes("excited")',
            },
          ],
        },
        {
          title: "arms(left_angle, right_angle, duration)",
          description: "Set arm positions.",
          content: [
            "Moves both arms to specified angles. Values range from approximately -100 to 100.",
          ],
          parameters: [
            {
              name: "left_angle",
              type: "int",
              description: "Left arm angle.",
              defaultValue: "0",
            },
            {
              name: "right_angle",
              type: "int",
              description: "Right arm angle.",
              defaultValue: "0",
            },
            {
              name: "duration",
              type: "int",
              description: "Movement duration in milliseconds.",
              defaultValue: "500",
            },
          ],
        },
        {
          title: "move_joint(joint, angle, duration)",
          description: "Move a specific joint to an angle.",
          content: ["Provides fine-grained control over individual joints."],
          parameters: [
            {
              name: "joint",
              type: "str",
              description:
                'Joint name, e.g. "left_hip", "right_hip", "left_knee", etc.',
              defaultValue: '"left_hip"',
            },
            {
              name: "angle",
              type: "int",
              description: "Target angle for the joint.",
              defaultValue: "0",
            },
            {
              name: "duration",
              type: "int",
              description: "Movement duration in milliseconds.",
              defaultValue: "500",
            },
          ],
        },
      ],
    },
    {
      id: "sensor-api",
      title: "Sensor Functions",
      entries: [
        {
          title: "foot_on_ground(side)",
          description: "Check if foot is touching the ground.",
          content: [
            "Returns True if the specified foot is currently on the ground.",
          ],
          parameters: [
            {
              name: "side",
              type: "str",
              description: '"left" or "right".',
              defaultValue: '"left"',
            },
          ],
          returns: "bool",
        },
        {
          title: "get_distance_sensor()",
          description: "Get distance sensor reading.",
          content: [
            "Returns the current distance reading from the front-facing sensor in centimeters.",
          ],
          returns: "float",
        },
        {
          title: "get_accelerometer(axis)",
          description: "Get accelerometer reading for axis.",
          content: [
            "Returns the accelerometer reading for the specified axis.",
          ],
          parameters: [
            {
              name: "axis",
              type: "str",
              description: '"x", "y", or "z".',
              defaultValue: '"x"',
            },
          ],
          returns: "float",
        },
        {
          title: "is_moving()",
          description: "Check if Marty is currently moving.",
          content: ["Returns True if Marty is in the middle of an action."],
          returns: "bool",
        },
      ],
    },
    {
      id: "control-api",
      title: "Control Functions",
      entries: [
        {
          title: "stop()",
          description: "Stop all current actions.",
          content: ["Immediately stops any action Marty is performing."],
        },
        {
          title: "play_sound(sound_name)",
          description: "Play a sound effect.",
          content: ["Plays one of Marty's built-in sound effects."],
          parameters: [
            {
              name: "sound_name",
              type: "str",
              description: '"excited", "disbelief", or "confused".',
              defaultValue: '"excited"',
            },
          ],
        },
      ],
    },
  ],
};
