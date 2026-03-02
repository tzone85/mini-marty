export interface SidebarItem {
  readonly id: string;
  readonly label: string;
}

const BLOCK_EDITOR_ITEMS: readonly SidebarItem[] = [
  { id: "motion", label: "Motion" },
  { id: "sound", label: "Sound" },
  { id: "sensing", label: "Sensing" },
  { id: "events", label: "Events" },
  { id: "control", label: "Control" },
  { id: "variables", label: "Variables" },
  { id: "operators", label: "Operators" },
];

const PYTHON_EDITOR_ITEMS: readonly SidebarItem[] = [
  { id: "snippets", label: "Snippets" },
  { id: "api-reference", label: "API Reference" },
  { id: "examples", label: "Examples" },
];

const TUTORIALS_ITEMS: readonly SidebarItem[] = [
  { id: "getting-started", label: "Getting Started" },
  { id: "movement", label: "Movement" },
  { id: "advanced", label: "Advanced" },
];

const CHALLENGES_ITEMS: readonly SidebarItem[] = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

const SIDEBAR_MAP: Readonly<Record<string, readonly SidebarItem[]>> = {
  "/block-editor": BLOCK_EDITOR_ITEMS,
  "/python-editor": PYTHON_EDITOR_ITEMS,
  "/tutorials": TUTORIALS_ITEMS,
  "/challenges": CHALLENGES_ITEMS,
};

export function getSidebarItems(pathname: string): readonly SidebarItem[] {
  return SIDEBAR_MAP[pathname] ?? [];
}
