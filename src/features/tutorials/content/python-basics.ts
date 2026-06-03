import type { Tutorial } from "../types";

export const pythonBasicsTutorial: Tutorial = {
  id: "python-basics",
  title: "Python Basics",
  description:
    "Take your first steps with Python code — control Marty by writing text commands instead of using blocks.",
  category: "python",
  difficulty: "advanced",
  estimatedMinutes: 15,
  steps: [
    {
      id: "pb-1",
      title: "Welcome to Python",
      instructions:
        "So far you've programmed Marty with blocks. Now let's try Python — " +
        "a real programming language used by professionals! " +
        "Open the Python Editor from the sidebar to get started.",
      hint: 'Click "Python Editor" in the navigation sidebar.',
      validation: { kind: "manual" },
    },
    {
      id: "pb-2",
      title: "Your First Python Command",
      instructions:
        "In the Python Editor, type:\n\n" +
        "```\nmy_marty.walk(2)\n```\n\n" +
        "This tells Marty to walk 2 steps — just like the Walk block, but as text!",
      hint: "Type the command exactly as shown, then press Run.",
      validation: { kind: "manual" },
    },
    {
      id: "pb-3",
      title: "Multiple Commands",
      instructions:
        "Add more lines to make a sequence:\n\n" +
        "```\nmy_marty.walk(2)\nmy_marty.dance()\nmy_marty.celebrate()\n```\n\n" +
        "Each line runs in order, just like connected blocks.",
      hint: "Put each command on its own line.",
      validation: { kind: "manual" },
    },
    {
      id: "pb-4",
      title: "Using Variables",
      instructions:
        "Variables store values you can reuse:\n\n" +
        "```\nsteps = 3\nmy_marty.walk(steps)\nmy_marty.walk(steps)\n```\n\n" +
        "Change `steps` to 5 — both walks update automatically!",
      hint: "Variables are names that hold values. Change the number once, it applies everywhere.",
      validation: { kind: "manual" },
    },
    {
      id: "pb-5",
      title: "Loops in Python",
      instructions:
        "Python has loops too! The `for` loop replaces the Repeat block:\n\n" +
        "```\nfor i in range(3):\n    my_marty.walk(2)\n    my_marty.kick('left')\n```\n\n" +
        "Notice the indentation — Python uses spaces to show what's inside the loop.",
      hint: "The indented lines (4 spaces) are what gets repeated.",
      validation: { kind: "manual" },
    },
    {
      id: "pb-6",
      title: "Blocks vs Python",
      instructions:
        "You now know two ways to program Marty! " +
        "Blocks are great for getting started and visualizing programs. " +
        "Python gives you more power and is used in real-world programming. " +
        "Keep practicing both!",
      validation: { kind: "manual" },
    },
  ],
};
