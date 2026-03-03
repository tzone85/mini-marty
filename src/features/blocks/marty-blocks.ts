export type BlockCategory =
  | "Motion"
  | "Sound"
  | "Sensing"
  | "Events"
  | "Control";

export interface MartyBlockDefinition {
  readonly type: string;
  readonly category: BlockCategory;
  readonly message0: string;
  readonly args0?: readonly Record<string, unknown>[];
  readonly message1?: string;
  readonly args1?: readonly Record<string, unknown>[];
  readonly colour: string;
  readonly tooltip: string;
  readonly previousStatement?: null;
  readonly nextStatement?: null;
  readonly output?: string | null;
  readonly inputsInline?: boolean;
}

const MOTION_COLOUR = "#4C97FF";
const SOUND_COLOUR = "#CF63CF";
const SENSING_COLOUR = "#5CB1D6";
const EVENTS_COLOUR = "#FFBF00";
const CONTROL_COLOUR = "#FFAB19";

export const MARTY_BLOCKS: readonly MartyBlockDefinition[] = [
  // Motion blocks
  {
    type: "marty_walk",
    category: "Motion",
    message0: "walk %1 steps",
    args0: [{ type: "field_number", name: "STEPS", value: 2, min: 1 }],
    colour: MOTION_COLOUR,
    tooltip: "Make Marty walk forward.",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_turn",
    category: "Motion",
    message0: "turn %1 degrees",
    args0: [{ type: "field_number", name: "DEGREES", value: 90 }],
    colour: MOTION_COLOUR,
    tooltip: "Turn Marty by the specified angle.",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_slide",
    category: "Motion",
    message0: "slide %1",
    args0: [
      {
        type: "field_dropdown",
        name: "DIRECTION",
        options: [
          ["left", "left"],
          ["right", "right"],
        ],
      },
    ],
    colour: MOTION_COLOUR,
    tooltip: "Slide Marty sideways.",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_kick",
    category: "Motion",
    message0: "kick %1",
    args0: [
      {
        type: "field_dropdown",
        name: "LEG",
        options: [
          ["left", "left"],
          ["right", "right"],
        ],
      },
    ],
    colour: MOTION_COLOUR,
    tooltip: "Kick with the specified leg.",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_dance",
    category: "Motion",
    message0: "dance",
    colour: MOTION_COLOUR,
    tooltip: "Make Marty perform a dance.",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_circle_dance",
    category: "Motion",
    message0: "circle dance",
    colour: MOTION_COLOUR,
    tooltip: "Make Marty perform a rotational dance.",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_wiggle",
    category: "Motion",
    message0: "wiggle",
    colour: MOTION_COLOUR,
    tooltip: "Make Marty wiggle.",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_lean",
    category: "Motion",
    message0: "lean %1",
    args0: [
      {
        type: "field_dropdown",
        name: "DIRECTION",
        options: [
          ["left", "left"],
          ["right", "right"],
          ["forward", "forward"],
          ["back", "back"],
        ],
      },
    ],
    colour: MOTION_COLOUR,
    tooltip: "Make Marty lean in a direction.",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_celebrate",
    category: "Motion",
    message0: "celebrate",
    colour: MOTION_COLOUR,
    tooltip: "Make Marty celebrate!",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_get_ready",
    category: "Motion",
    message0: "get ready",
    colour: MOTION_COLOUR,
    tooltip: "Move Marty to the ready position.",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_stand_straight",
    category: "Motion",
    message0: "stand straight",
    colour: MOTION_COLOUR,
    tooltip: "Stand Marty upright.",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_eyes",
    category: "Motion",
    message0: "eyes %1",
    args0: [
      {
        type: "field_number",
        name: "POSITION",
        value: 0,
        min: -100,
        max: 100,
      },
    ],
    colour: MOTION_COLOUR,
    tooltip: "Set eye position. 0=center, negative=left, positive=right.",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_arms",
    category: "Motion",
    message0: "arms left %1 right %2",
    args0: [
      {
        type: "field_number",
        name: "LEFT",
        value: 0,
        min: -100,
        max: 100,
      },
      {
        type: "field_number",
        name: "RIGHT",
        value: 0,
        min: -100,
        max: 100,
      },
    ],
    colour: MOTION_COLOUR,
    tooltip: "Set arm positions (-100 to 100).",
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
  },

  // Sound blocks
  {
    type: "marty_play_sound",
    category: "Sound",
    message0: "play sound %1",
    args0: [
      {
        type: "field_dropdown",
        name: "SOUND",
        options: [
          ["excited", "excited"],
          ["disbelief", "disbelief"],
          ["confused", "confused"],
        ],
      },
    ],
    colour: SOUND_COLOUR,
    tooltip: "Play a sound effect.",
    previousStatement: null,
    nextStatement: null,
  },

  // Sensing blocks
  {
    type: "marty_foot_on_ground",
    category: "Sensing",
    message0: "%1 foot on ground?",
    args0: [
      {
        type: "field_dropdown",
        name: "FOOT",
        options: [
          ["left", "left"],
          ["right", "right"],
        ],
      },
    ],
    colour: SENSING_COLOUR,
    tooltip: "Check if the specified foot is on the ground.",
    output: "Boolean",
  },
  {
    type: "marty_get_distance",
    category: "Sensing",
    message0: "distance sensor",
    colour: SENSING_COLOUR,
    tooltip: "Get the distance sensor reading in cm.",
    output: "Number",
  },
  {
    type: "marty_is_moving",
    category: "Sensing",
    message0: "is moving?",
    colour: SENSING_COLOUR,
    tooltip: "Check if Marty is currently moving.",
    output: "Boolean",
  },

  // Event blocks
  {
    type: "marty_when_start",
    category: "Events",
    message0: "when program starts",
    colour: EVENTS_COLOUR,
    tooltip: "Run blocks when the program starts.",
    nextStatement: null,
  },
  {
    type: "marty_when_key_pressed",
    category: "Events",
    message0: "when %1 key pressed",
    args0: [
      {
        type: "field_dropdown",
        name: "KEY",
        options: [
          ["space", "space"],
          ["up arrow", "up"],
          ["down arrow", "down"],
          ["left arrow", "left"],
          ["right arrow", "right"],
        ],
      },
    ],
    colour: EVENTS_COLOUR,
    tooltip: "Run blocks when a key is pressed.",
    nextStatement: null,
  },

  // Control blocks
  {
    type: "marty_wait",
    category: "Control",
    message0: "wait %1 seconds",
    args0: [{ type: "field_number", name: "SECONDS", value: 1, min: 0 }],
    colour: CONTROL_COLOUR,
    tooltip: "Wait for the specified number of seconds.",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_repeat",
    category: "Control",
    message0: "repeat %1 times",
    args0: [{ type: "field_number", name: "TIMES", value: 3, min: 1 }],
    message1: "do %1",
    args1: [{ type: "input_statement", name: "DO" }],
    colour: CONTROL_COLOUR,
    tooltip: "Repeat the enclosed blocks.",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_if_else",
    category: "Control",
    message0: "if %1",
    args0: [{ type: "input_value", name: "CONDITION", check: "Boolean" }],
    message1: "do %1",
    args1: [{ type: "input_statement", name: "DO" }],
    colour: CONTROL_COLOUR,
    tooltip: "If condition is true, run the enclosed blocks.",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_forever",
    category: "Control",
    message0: "forever",
    message1: "do %1",
    args1: [{ type: "input_statement", name: "DO" }],
    colour: CONTROL_COLOUR,
    tooltip: "Repeat the enclosed blocks forever.",
    previousStatement: null,
    nextStatement: null,
  },
];
