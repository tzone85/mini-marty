import type { DocSection } from "../types";

export const FAQ_SECTION: DocSection = {
  id: "faq",
  title: "FAQ & Troubleshooting",
  description:
    "Answers to frequently asked questions and solutions to common issues.",
  subsections: [
    {
      id: "general-faq",
      title: "General Questions",
      entries: [
        {
          title: "What browsers are supported?",
          description: "Browser compatibility information.",
          content: [
            "Mini Marty works best in modern browsers: Google Chrome (recommended), Mozilla Firefox, and Microsoft Edge.",
            "Safari is supported but may have slightly reduced performance for the 3D viewer.",
            "Internet Explorer is not supported.",
          ],
        },
        {
          title: "Do I need to install anything?",
          description: "Installation requirements.",
          content: [
            "No installation is required. Mini Marty runs entirely in your web browser.",
            "The Python Editor uses Pyodide, which downloads automatically on first use. This is cached by the browser for faster subsequent loads.",
          ],
        },
        {
          title: "Is an internet connection required?",
          description: "Connectivity requirements.",
          content: [
            "An internet connection is needed for the initial load and to download the Python runtime (Pyodide).",
            "Once loaded, the Block Editor can work offline. The Python Editor requires the Pyodide runtime to be cached.",
          ],
        },
        {
          title: "What age group is this for?",
          description: "Target audience information.",
          content: [
            "The Block Editor is designed for learners aged 7 and up. The Python Editor is recommended for ages 10 and up.",
            "See the Parent & Teacher Guide for detailed age recommendations and suggested learning progressions.",
          ],
        },
      ],
    },
    {
      id: "block-editor-faq",
      title: "Block Editor Issues",
      entries: [
        {
          title: "My blocks won't connect",
          description: "Troubleshooting block connection issues.",
          content: [
            "Check the block shapes: blocks with a notch on top can connect below other blocks. Blocks with a flat top (like event blocks) start a new chain.",
            "Sensing blocks (with rounded edges) are value blocks and must connect to an input slot, not snap below other blocks.",
            "Try zooming in to better see the connection points.",
          ],
        },
        {
          title: "The program runs but nothing happens",
          description: "Troubleshooting silent execution.",
          content: [
            'Make sure your blocks are connected to a "when program starts" event block. Disconnected blocks will not execute.',
            "Check the console for error messages.",
            'Try adding a "get ready" block before your motion blocks to ensure Marty is in the correct starting position.',
          ],
        },
        {
          title: "The program seems stuck",
          description: "Dealing with infinite loops.",
          content: [
            'If you used a "forever" block, the program will run until you click Stop.',
            "Click the Stop button (or press Escape) to halt execution.",
            'Add a "wait" block inside forever loops to prevent the program from running too fast.',
          ],
        },
      ],
    },
    {
      id: "python-editor-faq",
      title: "Python Editor Issues",
      entries: [
        {
          title: "Python runtime is not loading",
          description: "Troubleshooting Pyodide loading issues.",
          content: [
            "The Python runtime (Pyodide) requires an internet connection for the first load. Check your connection.",
            "If the status shows an error, click the Retry button to attempt loading again.",
            "Try refreshing the page. Clearing your browser cache may help if the download was corrupted.",
            "Pyodide is approximately 10 MB and may take a few seconds on slower connections.",
          ],
        },
        {
          title: "I get an 'ImportError' for martypy",
          description: "Troubleshooting import errors.",
          content: [
            "Make sure your code starts with: from martypy import Marty",
            "The martypy module is automatically available \u2014 you do not need to install it.",
            "Check for typos in the import statement. It must be exactly 'martypy' (lowercase).",
          ],
          examples: [
            {
              title: "Correct import",
              language: "python",
              code: 'from martypy import Marty\n\nmy_marty = Marty("virtual")',
            },
          ],
        },
        {
          title: "My code has a syntax error",
          description: "Understanding Python syntax errors.",
          content: [
            "Check the error message in the console \u2014 it shows the line number where the error was found.",
            "Common causes: missing colons after if/for/while/def, incorrect indentation, unmatched parentheses or quotes.",
            "Python uses indentation (spaces) to define code blocks. Use consistent indentation (4 spaces recommended).",
          ],
        },
        {
          title: "print() output is not showing",
          description: "Troubleshooting console output.",
          content: [
            'Make sure you are using print() with parentheses: print("hello") not print "hello".',
            "Check the console panel below the editor for output.",
            "If the program crashes before reaching your print statement, fix the earlier error first.",
          ],
        },
      ],
    },
    {
      id: "3d-viewer-faq",
      title: "3D Viewer Issues",
      entries: [
        {
          title: "The 3D scene is not loading",
          description: "Troubleshooting 3D viewer issues.",
          content: [
            "The 3D viewer requires WebGL support. Check that your browser has WebGL enabled.",
            "Try updating your browser to the latest version.",
            "On some devices, hardware acceleration must be enabled in browser settings.",
            "If you see a blank area, try refreshing the page.",
          ],
        },
        {
          title: "Marty moves but looks jerky",
          description: "Performance optimization tips.",
          content: [
            "Close other browser tabs to free up memory and GPU resources.",
            "Ensure hardware acceleration is enabled in your browser settings.",
            "On low-powered devices, the 3D rendering may be slower. This does not affect program execution.",
          ],
        },
      ],
    },
  ],
};
