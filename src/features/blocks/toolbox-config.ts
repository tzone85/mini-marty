import { MARTY_BLOCKS, type BlockCategory } from "./marty-blocks";

interface ToolboxBlock {
  readonly kind: "block";
  readonly type: string;
}

interface ToolboxCategory {
  readonly kind: "category";
  readonly name: string;
  readonly colour: string;
  readonly contents?: readonly ToolboxBlock[];
  readonly custom?: string;
}

interface ToolboxConfig {
  readonly kind: "categoryToolbox";
  readonly contents: readonly ToolboxCategory[];
}

const CATEGORY_COLOURS: Readonly<Record<BlockCategory, string>> = {
  Motion: "#4C97FF",
  Sound: "#CF63CF",
  Sensing: "#5CB1D6",
  Events: "#FFBF00",
  Control: "#FFAB19",
};

function blocksForCategory(category: BlockCategory): readonly ToolboxBlock[] {
  return MARTY_BLOCKS.filter((b) => b.category === category).map((b) => ({
    kind: "block" as const,
    type: b.type,
  }));
}

export const TOOLBOX_CONFIG: ToolboxConfig = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Motion",
      colour: CATEGORY_COLOURS.Motion,
      contents: blocksForCategory("Motion"),
    },
    {
      kind: "category",
      name: "Sound",
      colour: CATEGORY_COLOURS.Sound,
      contents: blocksForCategory("Sound"),
    },
    {
      kind: "category",
      name: "Sensing",
      colour: CATEGORY_COLOURS.Sensing,
      contents: blocksForCategory("Sensing"),
    },
    {
      kind: "category",
      name: "Events",
      colour: CATEGORY_COLOURS.Events,
      contents: blocksForCategory("Events"),
    },
    {
      kind: "category",
      name: "Control",
      colour: CATEGORY_COLOURS.Control,
      contents: blocksForCategory("Control"),
    },
    {
      kind: "category",
      name: "Variables",
      colour: "#FF8C1A",
      custom: "VARIABLE",
    },
    {
      kind: "category",
      name: "Operators",
      colour: "#59C059",
      custom: "PROCEDURE",
    },
  ],
};
