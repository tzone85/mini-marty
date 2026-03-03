export interface SidebarItem {
  readonly label: string;
}

export interface SidebarSection {
  readonly title: string;
  readonly items: readonly SidebarItem[];
}

const HOME_SECTIONS: readonly SidebarSection[] = [
  {
    title: "Quick Start",
    items: [
      { label: "Block Coding" },
      { label: "Python Coding" },
      { label: "Tutorials" },
    ],
  },
  {
    title: "Recent",
    items: [{ label: "No recent projects" }],
  },
];

const BLOCK_EDITOR_SECTIONS: readonly SidebarSection[] = [
  {
    title: "Block Categories",
    items: [
      { label: "Motion" },
      { label: "Sound" },
      { label: "Sensing" },
      { label: "Events" },
      { label: "Control" },
      { label: "Variables" },
      { label: "Operators" },
    ],
  },
];

const PYTHON_EDITOR_SECTIONS: readonly SidebarSection[] = [
  {
    title: "Code Snippets",
    items: [
      { label: "Walk" },
      { label: "Dance" },
      { label: "Kick" },
      { label: "Sensors" },
    ],
  },
  {
    title: "Documentation",
    items: [{ label: "API Reference" }, { label: "Examples" }],
  },
];

const TUTORIALS_SECTIONS: readonly SidebarSection[] = [
  {
    title: "Tutorial Topics",
    items: [
      { label: "Getting Started" },
      { label: "Movement" },
      { label: "Sensors" },
      { label: "Loops" },
      { label: "Python Basics" },
    ],
  },
];

const CHALLENGES_SECTIONS: readonly SidebarSection[] = [
  {
    title: "Difficulty",
    items: [
      { label: "Beginner" },
      { label: "Intermediate" },
      { label: "Advanced" },
    ],
  },
];

const DOCS_SECTIONS: readonly SidebarSection[] = [
  {
    title: "Documentation",
    items: [
      { label: "Quick Start Guide" },
      { label: "Block Reference" },
      { label: "Python API" },
      { label: "Parent & Teacher" },
      { label: "Keyboard Shortcuts" },
      { label: "FAQ & Troubleshooting" },
    ],
  },
];

const SECTION_MAP: Readonly<Record<string, readonly SidebarSection[]>> = {
  "/": HOME_SECTIONS,
  "/block-editor": BLOCK_EDITOR_SECTIONS,
  "/python-editor": PYTHON_EDITOR_SECTIONS,
  "/tutorials": TUTORIALS_SECTIONS,
  "/challenges": CHALLENGES_SECTIONS,
  "/docs": DOCS_SECTIONS,
};

export function getSidebarSections(
  pathname: string,
): readonly SidebarSection[] {
  return SECTION_MAP[pathname] ?? HOME_SECTIONS;
}
