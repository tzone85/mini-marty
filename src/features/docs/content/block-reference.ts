import type { DocSection } from "../types";

export const BLOCK_REFERENCE_SECTION: DocSection = {
  id: "block-reference",
  title: "Block Reference",
  description:
    "Complete reference for all available blocks, organized by category.",
  subsections: [
    {
      id: "motion-blocks",
      title: "Motion",
      entries: [
        {
          title: "Walk",
          description: "Make Marty walk forward.",
          content: [
            "Moves Marty forward by the specified number of steps. Each step is one complete walking cycle.",
          ],
          parameters: [
            {
              name: "steps",
              type: "number",
              description: "Number of steps to walk (minimum 1).",
              defaultValue: "2",
            },
          ],
          examples: [
            {
              title: "Walk 4 steps",
              language: "blocks",
              code: "walk 4 steps",
            },
          ],
        },
        {
          title: "Turn",
          description: "Turn Marty by the specified angle.",
          content: [
            "Rotates Marty in place. Positive values turn right, negative values turn left.",
          ],
          parameters: [
            {
              name: "degrees",
              type: "number",
              description: "Angle in degrees to turn.",
              defaultValue: "90",
            },
          ],
          examples: [
            {
              title: "Turn right 90 degrees",
              language: "blocks",
              code: "turn 90 degrees",
            },
          ],
        },
        {
          title: "Slide",
          description: "Slide Marty sideways.",
          content: ["Makes Marty slide to the left or right without turning."],
          parameters: [
            {
              name: "direction",
              type: "dropdown",
              description: 'Direction to slide: "left" or "right".',
              defaultValue: "left",
            },
          ],
        },
        {
          title: "Kick",
          description: "Kick with the specified leg.",
          content: ["Marty performs a kicking motion with the chosen leg."],
          parameters: [
            {
              name: "leg",
              type: "dropdown",
              description: 'Which leg to kick with: "left" or "right".',
              defaultValue: "left",
            },
          ],
        },
        {
          title: "Dance",
          description: "Make Marty perform a dance.",
          content: [
            "Marty performs a short, fun dance routine with coordinated arm and leg movements.",
          ],
        },
        {
          title: "Circle Dance",
          description: "Make Marty perform a rotational dance.",
          content: [
            "Marty dances while rotating in a circle. A more elaborate movement than the basic dance.",
          ],
        },
        {
          title: "Wiggle",
          description: "Make Marty wiggle.",
          content: ["Marty wiggles its body side to side in a playful motion."],
        },
        {
          title: "Lean",
          description: "Make Marty lean in a direction.",
          content: [
            "Tilts Marty's body in the chosen direction and holds the pose briefly.",
          ],
          parameters: [
            {
              name: "direction",
              type: "dropdown",
              description:
                'Direction to lean: "left", "right", "forward", or "back".',
              defaultValue: "left",
            },
          ],
        },
        {
          title: "Celebrate",
          description: "Make Marty celebrate!",
          content: [
            "Marty raises its arms and performs a celebratory wiggle. Great for rewarding successful programs!",
          ],
        },
        {
          title: "Get Ready",
          description: "Move Marty to the ready position.",
          content: [
            "Resets Marty to a neutral, balanced stance. Use this at the start of your programs.",
          ],
        },
        {
          title: "Stand Straight",
          description: "Stand Marty upright.",
          content: [
            "Moves Marty to a fully upright standing position with arms at its sides.",
          ],
        },
        {
          title: "Eyes",
          description: "Set eye position.",
          content: [
            "Adjusts Marty's eye position. A value of 0 centers the eyes. Negative values look left, positive values look right.",
          ],
          parameters: [
            {
              name: "position",
              type: "number",
              description: "Eye position from -100 (left) to 100 (right).",
              defaultValue: "0",
            },
          ],
        },
        {
          title: "Arms",
          description: "Set arm positions.",
          content: [
            "Moves both arms to the specified positions independently. Values range from -100 to 100.",
          ],
          parameters: [
            {
              name: "left",
              type: "number",
              description: "Left arm position (-100 to 100).",
              defaultValue: "0",
            },
            {
              name: "right",
              type: "number",
              description: "Right arm position (-100 to 100).",
              defaultValue: "0",
            },
          ],
        },
      ],
    },
    {
      id: "sound-blocks",
      title: "Sound",
      entries: [
        {
          title: "Play Sound",
          description: "Play a sound effect.",
          content: [
            "Plays one of Marty's built-in sound effects. Available sounds: excited, disbelief, confused.",
          ],
          parameters: [
            {
              name: "sound",
              type: "dropdown",
              description:
                'Sound to play: "excited", "disbelief", or "confused".',
              defaultValue: "excited",
            },
          ],
        },
      ],
    },
    {
      id: "sensing-blocks",
      title: "Sensing",
      entries: [
        {
          title: "Foot on Ground?",
          description: "Check if the specified foot is on the ground.",
          content: [
            "Returns true if the chosen foot is currently touching the ground. Useful for balance checks and conditional logic.",
          ],
          parameters: [
            {
              name: "foot",
              type: "dropdown",
              description: 'Which foot to check: "left" or "right".',
              defaultValue: "left",
            },
          ],
          returns: "Boolean",
        },
        {
          title: "Distance Sensor",
          description: "Get the distance sensor reading in cm.",
          content: [
            "Returns the current distance reading from Marty's front-facing sensor. Useful for obstacle detection.",
          ],
          returns: "Number (centimeters)",
        },
        {
          title: "Is Moving?",
          description: "Check if Marty is currently moving.",
          content: [
            "Returns true if Marty is in the middle of an action. Useful for waiting until a movement finishes.",
          ],
          returns: "Boolean",
        },
      ],
    },
    {
      id: "event-blocks",
      title: "Events",
      entries: [
        {
          title: "When Program Starts",
          description: "Run blocks when the program starts.",
          content: [
            "This is the starting point for your program. Attach blocks below it to define what happens when you click Run.",
            "Every program needs at least one event block to begin execution.",
          ],
        },
        {
          title: "When Key Pressed",
          description: "Run blocks when a key is pressed.",
          content: [
            "Triggers the attached blocks whenever the specified key is pressed. Allows interactive, keyboard-controlled programs.",
          ],
          parameters: [
            {
              name: "key",
              type: "dropdown",
              description:
                'Key to listen for: "space", "up arrow", "down arrow", "left arrow", or "right arrow".',
              defaultValue: "space",
            },
          ],
        },
      ],
    },
    {
      id: "control-blocks",
      title: "Control",
      entries: [
        {
          title: "Wait",
          description: "Wait for the specified number of seconds.",
          content: [
            "Pauses execution for the given duration. Use this to add timing between actions.",
          ],
          parameters: [
            {
              name: "seconds",
              type: "number",
              description: "Number of seconds to wait (minimum 0).",
              defaultValue: "1",
            },
          ],
        },
        {
          title: "Repeat",
          description: "Repeat the enclosed blocks.",
          content: [
            "Runs the blocks inside the loop a specific number of times. Place blocks inside the C-shaped area.",
          ],
          parameters: [
            {
              name: "times",
              type: "number",
              description: "Number of repetitions (minimum 1).",
              defaultValue: "3",
            },
          ],
          examples: [
            {
              title: "Walk in a square",
              language: "blocks",
              code: "repeat 4 times\n  walk 2 steps\n  turn 90 degrees",
              description: "Uses a repeat loop to walk in a square pattern.",
            },
          ],
        },
        {
          title: "If",
          description: "If condition is true, run the enclosed blocks.",
          content: [
            "Checks a condition (from a sensing block) and only runs the enclosed blocks if the condition is true.",
            "Connect a sensing block (like 'foot on ground?' or 'is moving?') to the condition input.",
          ],
          examples: [
            {
              title: "Conditional kick",
              language: "blocks",
              code: "if left foot on ground?\n  kick left",
              description: "Only kicks if the left foot is on the ground.",
            },
          ],
        },
        {
          title: "Forever",
          description: "Repeat the enclosed blocks forever.",
          content: [
            "Runs the enclosed blocks in an infinite loop. Use the Stop button to end execution.",
            "Be careful: without a wait block inside, this can make the program unresponsive.",
          ],
        },
      ],
    },
  ],
};
