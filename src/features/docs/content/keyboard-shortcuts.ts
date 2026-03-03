import type { DocSection } from "../types";

export const KEYBOARD_SHORTCUTS_SECTION: DocSection = {
  id: "keyboard-shortcuts",
  title: "Keyboard Shortcuts",
  description: "Keyboard shortcuts available throughout Mini Marty.",
  subsections: [
    {
      id: "block-editor-shortcuts",
      title: "Block Editor",
      entries: [
        {
          title: "Workspace Navigation",
          description: "Shortcuts for navigating the block workspace.",
          content: [
            "Ctrl/Cmd + Z: Undo the last action.",
            "Ctrl/Cmd + Shift + Z: Redo the last undone action.",
            "Delete / Backspace: Delete the selected block.",
            "Ctrl/Cmd + A: Select all blocks in the workspace.",
            "Ctrl/Cmd + C: Copy selected blocks.",
            "Ctrl/Cmd + V: Paste copied blocks.",
          ],
        },
        {
          title: "Execution Controls",
          description: "Shortcuts for running and stopping programs.",
          content: [
            "Ctrl/Cmd + Enter: Run the program.",
            "Escape: Stop the running program.",
            "F10: Step through the program one block at a time.",
          ],
        },
      ],
    },
    {
      id: "python-editor-shortcuts",
      title: "Python Editor",
      entries: [
        {
          title: "Code Editing",
          description: "Shortcuts for writing and editing Python code.",
          content: [
            "Ctrl/Cmd + Z: Undo.",
            "Ctrl/Cmd + Shift + Z: Redo.",
            "Ctrl/Cmd + /: Toggle line comment.",
            "Tab: Indent selected lines.",
            "Shift + Tab: Unindent selected lines.",
            "Ctrl/Cmd + D: Duplicate the current line.",
            "Alt + Up/Down: Move the current line up or down.",
            "Ctrl/Cmd + F: Find in editor.",
            "Ctrl/Cmd + H: Find and replace.",
          ],
        },
        {
          title: "Code Intelligence",
          description: "Shortcuts for autocomplete and help.",
          content: [
            "Ctrl + Space: Trigger autocomplete suggestions.",
            "Ctrl/Cmd + Shift + Space: Show parameter hints.",
            "F2: Rename symbol.",
          ],
        },
        {
          title: "Execution Controls",
          description: "Shortcuts for running Python programs.",
          content: [
            "Ctrl/Cmd + Enter: Run the program.",
            "Escape: Stop the running program.",
          ],
        },
      ],
    },
    {
      id: "general-shortcuts",
      title: "General",
      entries: [
        {
          title: "Application Shortcuts",
          description: "Shortcuts available across the application.",
          content: [
            "Ctrl/Cmd + Shift + D: Toggle dark/light theme.",
            "?: Open this help documentation (from any page).",
          ],
        },
      ],
    },
  ],
};
