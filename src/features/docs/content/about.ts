import type { DocSection } from "../types";

export const ABOUT_SECTION: DocSection = {
  id: "about",
  title: "About & Credits",
  description:
    "Mini Marty is a fan-made educational re-implementation inspired by Marty the Robot by Robotical Ltd. This page credits the work that made Mini Marty possible and points you to the official Marty experience.",
  subsections: [
    {
      id: "inspired-by",
      title: "Inspired by Marty the Robot®",
      entries: [
        {
          title: "About the real Marty",
          description:
            "Marty the Robot is a humanoid robot built by Robotical Ltd in Edinburgh, designed for learning to code through real-world walking, dancing, and sensing.",
          content: [
            "Marty the Robot is a real, walking humanoid coding robot designed for STEM and coding education in schools and homes. Each limb is individually powered, so learners can walk Marty, dance Marty, kick a ball, wiggle eyebrows — and watch real code drive real movement.",
            "Robotical Ltd has built Marty and the official Marty web coding app at codemarty.com. The official app supports a learning progression from unplugged play through block-based coding (Blocks Jr, Blocks) to Python and machine learning, against real hardware.",
            "Mini Marty exists so that people without the hardware can practise the same code on a virtual Marty in the browser. If you enjoy Mini Marty, please support the real product so Robotical can keep building Marty and reaching more learners.",
          ],
        },
        {
          title: "Visit the official Marty experience",
          description:
            "These are the official Robotical Ltd properties — visit them for the real Marty.",
          content: [
            "Official Marty web coding app: https://codemarty.com",
            "Robotical company site (purchase, classroom packs, knowledge base): https://robotical.io",
            "Robotical knowledge base (Marty V2 user guides): https://userguides.robotical.io/martyv2",
            "Official Python SDK (Apache-2.0): https://github.com/robotical/martypy",
          ],
        },
      ],
    },
    {
      id: "not-affiliated",
      title: "Not affiliated with Robotical Ltd",
      entries: [
        {
          title: "Trademark and affiliation notice",
          description:
            "Mini Marty is a community project, not a Robotical product.",
          content: [
            "Mini Marty is not affiliated with, endorsed by, or sponsored by Robotical Ltd.",
            "“Marty” and “Marty the Robot” are trademarks of Robotical Ltd, used here descriptively to identify the platform that inspired this educational project.",
            "Mini Marty ships no Robotical-owned source code, 3D models, artwork, audio, logos, or other brand assets. The virtual Marty in this app is built from generic three.js primitives; the block colour palette follows the Scratch 3.0 defaults; the Python API surface follows the public method names of the Apache-2.0-licensed martypy SDK so that code written here is portable to a real Marty.",
            "See the project NOTICE file and docs/ATTRIBUTION.md for the full IP audit.",
          ],
        },
      ],
    },
    {
      id: "open-source-credits",
      title: "Open-source projects we depend on",
      entries: [
        {
          title: "Libraries that made Mini Marty possible",
          description:
            "Mini Marty stands on a stack of excellent open-source projects.",
          content: [
            "robotical/martypy (Apache-2.0) — the public Python API surface re-implemented here for offline use.",
            "Google Blockly (Apache-2.0) — the visual programming engine behind the Block Editor.",
            "Scratch 3.0 block palette — the colour conventions for Motion (blue), Sound (magenta), Sensing (cyan), Events (yellow), and Control (orange).",
            "Pyodide (Mozilla Public License 2.0) — Python running inside the browser.",
            "three.js and React Three Fiber — the 3D scene.",
            "Monaco Editor — the code editing surface in the Python Editor.",
            "Next.js, React, TypeScript, Tailwind CSS, Vitest, Playwright — the application foundation.",
          ],
        },
      ],
    },
    {
      id: "license",
      title: "License",
      entries: [
        {
          title: "Apache License 2.0",
          description:
            "Mini Marty is licensed under the Apache License, Version 2.0.",
          content: [
            "The Mini Marty source code (this repository) is licensed under the Apache License, Version 2.0. See the LICENSE file at the root of the repository for the full text.",
            "Mini Marty is provided “as is”, without warranty of any kind, and is intended for educational use.",
          ],
        },
      ],
    },
  ],
};
