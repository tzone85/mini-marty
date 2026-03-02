export interface MartyBlockDefinition {
  readonly type: string;
  readonly category: string;
  readonly message0: string;
  readonly args0?: readonly BlockArg[];
  readonly colour: string;
  readonly tooltip: string;
  readonly previousStatement?: null;
  readonly nextStatement?: null;
  readonly output?: string | null;
  readonly message1?: string;
  readonly args1?: readonly BlockArg[];
}

export type BlockArg =
  | {
      readonly type: "field_number";
      readonly name: string;
      readonly value: number;
    }
  | {
      readonly type: "field_dropdown";
      readonly name: string;
      readonly options: readonly (readonly [string, string])[];
    }
  | {
      readonly type: "input_value";
      readonly name: string;
      readonly check?: string;
    }
  | { readonly type: "input_statement"; readonly name: string }
  | { readonly type: "input_dummy" };

// Marty-themed colours per category
const MOTION_COLOUR = "#4C97FF";
const SOUND_COLOUR = "#CF63CF";
const SENSING_COLOUR = "#5CB1D6";
const EVENTS_COLOUR = "#FFBF00";
const CONTROL_COLOUR = "#FFAB19";

export const MARTY_BLOCKS: readonly MartyBlockDefinition[] = [
  // ── Motion ────────────────────────────────────────
  {
    type: "marty_walk",
    category: "Motion",
    message0: "walk %1 steps",
    args0: [{ type: "field_number", name: "STEPS", value: 2 }],
    colour: MOTION_COLOUR,
    tooltip: "Make Marty walk forward",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_turn",
    category: "Motion",
    message0: "turn %1",
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
    tooltip: "Turn Marty left or right",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_slide",
    category: "Motion",
    message0: "slide %1 %2 steps",
    args0: [
      {
        type: "field_dropdown",
        name: "DIRECTION",
        options: [
          ["left", "left"],
          ["right", "right"],
        ],
      },
      { type: "field_number", name: "STEPS", value: 1 },
    ],
    colour: MOTION_COLOUR,
    tooltip: "Slide Marty sideways",
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
    tooltip: "Make Marty kick",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_dance",
    category: "Motion",
    message0: "dance",
    colour: MOTION_COLOUR,
    tooltip: "Make Marty dance",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_circle_dance",
    category: "Motion",
    message0: "circle dance %1 %2 times",
    args0: [
      {
        type: "field_dropdown",
        name: "DIRECTION",
        options: [
          ["left", "left"],
          ["right", "right"],
        ],
      },
      { type: "field_number", name: "TIMES", value: 1 },
    ],
    colour: MOTION_COLOUR,
    tooltip: "Perform a circular dance",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_wiggle",
    category: "Motion",
    message0: "wiggle",
    colour: MOTION_COLOUR,
    tooltip: "Make Marty wiggle",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_lean",
    category: "Motion",
    message0: "lean %1 for %2 ms",
    args0: [
      {
        type: "field_dropdown",
        name: "DIRECTION",
        options: [
          ["left", "left"],
          ["right", "right"],
          ["forward", "forward"],
          ["backward", "backward"],
        ],
      },
      { type: "field_number", name: "DURATION", value: 500 },
    ],
    colour: MOTION_COLOUR,
    tooltip: "Make Marty lean in a direction",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_celebrate",
    category: "Motion",
    message0: "celebrate",
    colour: MOTION_COLOUR,
    tooltip: "Make Marty celebrate",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_get_ready",
    category: "Motion",
    message0: "get ready",
    colour: MOTION_COLOUR,
    tooltip: "Move Marty to ready pose",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_stand_straight",
    category: "Motion",
    message0: "stand straight",
    colour: MOTION_COLOUR,
    tooltip: "Stand Marty up straight",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_eyes",
    category: "Motion",
    message0: "set eyes %1",
    args0: [
      {
        type: "field_dropdown",
        name: "EXPRESSION",
        options: [
          ["normal", "normal"],
          ["wide", "wide"],
          ["angry", "angry"],
          ["excited", "excited"],
        ],
      },
    ],
    colour: MOTION_COLOUR,
    tooltip: "Set Marty's eye expression",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_arms",
    category: "Motion",
    message0: "set arms left %1 right %2 for %3 ms",
    args0: [
      { type: "field_number", name: "LEFT_ANGLE", value: 0 },
      { type: "field_number", name: "RIGHT_ANGLE", value: 0 },
      { type: "field_number", name: "DURATION", value: 500 },
    ],
    colour: MOTION_COLOUR,
    tooltip: "Set arm positions",
    previousStatement: null,
    nextStatement: null,
  },

  // ── Sound ─────────────────────────────────────────
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
    tooltip: "Play a sound effect",
    previousStatement: null,
    nextStatement: null,
  },

  // ── Sensing ───────────────────────────────────────
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
    tooltip: "Check if foot is on the ground",
    output: "Boolean",
  },
  {
    type: "marty_get_distance",
    category: "Sensing",
    message0: "distance sensor",
    colour: SENSING_COLOUR,
    tooltip: "Get distance sensor reading",
    output: "Number",
  },
  {
    type: "marty_is_moving",
    category: "Sensing",
    message0: "is moving?",
    colour: SENSING_COLOUR,
    tooltip: "Check if Marty is moving",
    output: "Boolean",
  },

  // ── Events ────────────────────────────────────────
  {
    type: "marty_when_start",
    category: "Events",
    message0: "when program starts",
    colour: EVENTS_COLOUR,
    tooltip: "Run when the program starts",
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
    tooltip: "Run when a key is pressed",
    nextStatement: null,
  },

  // ── Control ───────────────────────────────────────
  {
    type: "marty_wait",
    category: "Control",
    message0: "wait %1 seconds",
    args0: [{ type: "field_number", name: "SECONDS", value: 1 }],
    colour: CONTROL_COLOUR,
    tooltip: "Wait for a number of seconds",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_repeat",
    category: "Control",
    message0: "repeat %1 times",
    args0: [{ type: "field_number", name: "TIMES", value: 3 }],
    message1: "do %1",
    args1: [{ type: "input_statement", name: "DO" }],
    colour: CONTROL_COLOUR,
    tooltip: "Repeat blocks a number of times",
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "marty_if_else",
    category: "Control",
    message0: "if %1",
    args0: [{ type: "input_value", name: "CONDITION", check: "Boolean" }],
    message1: "then %1 else %2",
    args1: [
      { type: "input_statement", name: "THEN" },
      { type: "input_statement", name: "ELSE" },
    ],
    colour: CONTROL_COLOUR,
    tooltip: "If-else conditional",
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
    tooltip: "Repeat blocks forever",
    previousStatement: null,
    nextStatement: null,
  },
] as const;
