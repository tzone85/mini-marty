import type { DocSection } from "../types";

export const PARENT_TEACHER_SECTION: DocSection = {
  id: "parent-teacher",
  title: "Parent & Teacher Guide",
  description:
    "A guide for parents and teachers supervising students using Mini Marty.",
  subsections: [
    {
      id: "overview-guide",
      title: "Overview",
      entries: [
        {
          title: "What is Mini Marty?",
          description: "An introduction to the Mini Marty learning platform.",
          content: [
            "Mini Marty is an educational platform that teaches programming concepts through a virtual robot. Students write programs that control a 3D Marty robot displayed in the browser.",
            "The platform supports two programming modes: a Block Editor for beginners (ages 7+) using drag-and-drop blocks similar to Scratch, and a Python Editor for intermediate learners (ages 10+) using real Python code.",
            "No installation or special hardware is required. Mini Marty runs entirely in the web browser.",
          ],
        },
        {
          title: "Learning Objectives",
          description: "What students will learn from using Mini Marty.",
          content: [
            "Sequencing: Understanding that programs execute instructions in order.",
            "Loops: Using repeat and forever blocks to automate repetitive tasks.",
            "Conditionals: Making decisions with if/else based on sensor data.",
            "Events: Responding to user input like key presses.",
            "Decomposition: Breaking complex tasks into smaller steps.",
            "Debugging: Finding and fixing errors in programs.",
          ],
        },
      ],
    },
    {
      id: "age-recommendations",
      title: "Age & Skill Recommendations",
      entries: [
        {
          title: "Block Editor (Ages 7+)",
          description: "Recommended for beginners and younger learners.",
          content: [
            "The Block Editor uses colorful, interlocking blocks that snap together. No typing is required, making it ideal for younger learners.",
            "Start with the Motion blocks (walk, dance, kick) to build excitement, then introduce Events (when program starts) and Control blocks (repeat, forever).",
            "Suggested progression: simple sequences (15 min) \u2192 loops and repeats (20 min) \u2192 events and keyboard control (25 min) \u2192 conditionals with sensors (30 min).",
          ],
        },
        {
          title: "Python Editor (Ages 10+)",
          description:
            "Recommended for students with some programming experience.",
          content: [
            "The Python Editor uses a professional code editor with syntax highlighting and autocomplete. Students write real Python code.",
            "Prerequisite: Students should be comfortable typing and have a basic understanding of sequencing from the Block Editor.",
            "Suggested progression: basic commands (20 min) \u2192 variables and print (25 min) \u2192 loops with for/while (30 min) \u2192 functions and conditionals (35 min).",
          ],
        },
      ],
    },
    {
      id: "classroom-tips",
      title: "Classroom Tips",
      entries: [
        {
          title: "Setting Up a Lesson",
          description: "Practical tips for classroom use.",
          content: [
            "Ensure all students can access Mini Marty in their browser. Chrome, Firefox, and Edge are fully supported.",
            "For the Python Editor, the first load takes a few seconds as the Pyodide runtime downloads. Subsequent loads are faster due to browser caching.",
            "Consider projecting one student's screen to demonstrate concepts before independent work.",
            "Pair programming works well: one student types while the other suggests ideas.",
          ],
        },
        {
          title: "Guided Activities",
          description: "Suggested structured activities for the classroom.",
          content: [
            "Follow the Leader: Students recreate a sequence you demonstrate. Start simple (walk, turn) and add complexity.",
            "Dance Choreography: Students create a dance routine using at least 5 different motion blocks.",
            "Obstacle Course: Students use sensing blocks and conditionals to navigate an imaginary course.",
            "Keyboard Controller: Students use 'when key pressed' events to build an interactive controller for Marty.",
          ],
        },
        {
          title: "Assessment Ideas",
          description: "How to assess student understanding.",
          content: [
            "Code review: Ask students to explain their programs step by step.",
            "Challenges: Set specific goals (e.g., 'make Marty walk in a square') and evaluate solutions.",
            "Debugging exercises: Give students a broken program and ask them to identify and fix the error.",
            "Peer teaching: Have students teach a concept to a classmate using Mini Marty.",
          ],
        },
      ],
    },
    {
      id: "safety-supervision",
      title: "Safety & Supervision",
      entries: [
        {
          title: "Online Safety",
          description: "Information about data privacy and safety.",
          content: [
            "Mini Marty runs entirely in the browser. No student data is sent to external servers.",
            "Programs are stored locally in the browser and are not shared unless explicitly exported.",
            "No account creation or login is required to use the platform.",
            "The Python runtime (Pyodide) executes code in a sandboxed environment within the browser.",
          ],
        },
      ],
    },
  ],
};
