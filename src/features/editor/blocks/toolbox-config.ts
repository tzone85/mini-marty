import { MARTY_BLOCKS } from "./marty-blocks";

export interface ToolboxCategory {
  readonly name: string;
  readonly colour: string;
  readonly blockTypes: readonly string[];
}

export const TOOLBOX_CATEGORIES: readonly ToolboxCategory[] = (() => {
  const categoryMap = new Map<string, { colour: string; types: string[] }>();

  for (const block of MARTY_BLOCKS) {
    const existing = categoryMap.get(block.category);
    if (existing) {
      existing.types.push(block.type);
    } else {
      categoryMap.set(block.category, {
        colour: block.colour,
        types: [block.type],
      });
    }
  }

  return Array.from(categoryMap.entries()).map(([name, data]) => ({
    name,
    colour: data.colour,
    blockTypes: data.types,
  }));
})();

interface ToolboxBlockEntry {
  kind: "block";
  type: string;
}

interface ToolboxCategoryEntry {
  kind: "category";
  name: string;
  colour: string;
  contents: ToolboxBlockEntry[];
}

interface ToolboxConfig {
  kind: "categoryToolbox";
  contents: ToolboxCategoryEntry[];
}

export function getToolboxConfig(): ToolboxConfig {
  return {
    kind: "categoryToolbox",
    contents: TOOLBOX_CATEGORIES.map((cat) => ({
      kind: "category" as const,
      name: cat.name,
      colour: cat.colour,
      contents: cat.blockTypes.map((type) => ({
        kind: "block" as const,
        type,
      })),
    })),
  };
}
