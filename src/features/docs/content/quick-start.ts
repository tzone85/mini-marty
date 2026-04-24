import type { DocSection } from "../types";

export const QUICK_START_SECTION: DocSection = {
  id: "quick-start",
  title: "Quick Start Guide",
  description:
    "Get up and running with Mini Marty in minutes. Learn the basics of both block-based and Python programming.",
  subsections: [
    {
      id: "welcome",
      title: "Welcome to Mini Marty",
      entries: [
        {
          title: "What is Mini Marty?",
          description:
            "Mini Marty is a visual programming environment that lets you control a virtual Marty robot.",
          content: [
            "Mini Marty provides two ways to program your robot: a drag-and-drop Block Editor for beginners and a Python Editor for more advanced users.",
            "The virtual 3D Marty responds to your commands in real time, so you can see your programs come to life instantly.",
            "No physical robot or special hardware is required \u2014 everything runs in your web browser.",
          ],
        },
      ],
    },
    {
      id: "block-coding",
      title: "Getting Started with Blocks",
      entries: [
        {
          title: "Your First Block Program",
          description: "Create a simple program using drag-and-drop blocks.",
          content: [
            "Navigate to the Block Editor from the top menu bar.",
            'Drag a "when program starts" block from the Events category into the workspace.',
            'Connect a "get ready" block from the Motion category below it.',
            'Add a "walk 2 steps" block underneath.',
            "Click the green Run button to watch Marty walk!",
          ],
          examples: [
            {
              title: "First program",
              language: "blocks",
              code: "when program starts\n  get ready\n  walk 2 steps\n  dance",
              description:
                "A simple block program that makes Marty get ready, walk, and dance.",
            },
          ],
        },
        {
          title: "Using the Block Editor",
          description: "Learn the key features of the block workspace.",
          content: [
            "Blocks are organized into categories: Motion, Sound, Sensing, Events, and Control.",
            "Connect blocks by snapping them together vertically. The notch shapes show which blocks can connect.",
            "Use the Run button to execute your program. Pause, Step, and Stop buttons help you debug.",
            "The execution speed can be adjusted using the speed dropdown (slow, normal, fast).",
            "Watch the console panel below for output messages and any errors.",
          ],
        },
      ],
    },
    {
      id: "python-coding",
      title: "Getting Started with Python",
      entries: [
        {
          title: "Your First Python Program",
          description: "Write a simple Python script to control Marty.",
          content: [
            "Navigate to the Python Editor from the top menu bar.",
            "Wait for the Python runtime (Pyodide) to finish loading \u2014 the status indicator will turn green.",
            "Type your code in the editor. The starter template shows the basic structure.",
            "Click Run to execute your code and watch Marty respond in the 3D viewer.",
          ],
          examples: [
            {
              title: "Hello Marty",
              language: "python",
              code: 'from martypy import Marty\n\nmy_marty = Marty("virtual")\nmy_marty.get_ready()\nmy_marty.walk(2)\nmy_marty.dance()\nprint("Marty is dancing!")',
              description:
                "A basic Python program that creates a Marty instance and makes it walk and dance.",
            },
          ],
        },
        {
          title: "Python Editor Features",
          description: "Key features of the Monaco-based Python editor.",
          content: [
            "Autocomplete: Type 'my_marty.' to see available commands with descriptions.",
            "Syntax highlighting: Python keywords, strings, and numbers are color-coded.",
            "Error reporting: Syntax and runtime errors appear in the console with line numbers.",
            "The console panel shows print() output and error messages.",
          ],
        },
      ],
    },
  ],
};
