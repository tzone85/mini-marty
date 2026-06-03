# Mini Marty

[![CI](https://github.com/tzone85/mini-marty/actions/workflows/ci.yml/badge.svg)](https://github.com/tzone85/mini-marty/actions/workflows/ci.yml)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftzone85%2Fmini-marty)

> **Fan-made educational re-implementation inspired by [Marty the Robot®](https://robotical.io)
> by [Robotical Ltd](https://robotical.io). For the full hands-on experience
> with real hardware, please visit the official web app at
> [**codemarty.com**](https://codemarty.com).**
>
> Mini Marty is **not affiliated with, endorsed by, or sponsored by Robotical Ltd**.
> "Marty" and "Marty the Robot" are trademarks of Robotical Ltd, used here
> descriptively to identify the platform that inspired this educational
> project. See [`docs/ATTRIBUTION.md`](./docs/ATTRIBUTION.md) for the full
> IP audit.

## Why I built this

This project was inspired by my son. When he started showing a liking for coding, I went looking for the best way to engage him and meet him at his level on the journey. Marty the Robot — and the official web app at [codemarty.com](https://codemarty.com) — was the closest thing I found to "real code, real motion, instant feedback". Mini Marty is my attempt to recreate that loop in a browser, for nights and weekends when the real robot isn't to hand and for other parents starting the same conversation with their own kids.

If you're on the same journey, please support the real Marty — it's better than this and your child will thank you.

## What it is

A virtual programming environment for learning to code with Marty the Robot. No physical robot needed.

Write Python or drag Blockly blocks; a `VirtualMarty` instance enqueues commands; a React Three Fiber scene animates them at 60 fps.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run format:check` | Prettier check |
| `npm run typecheck` | TypeScript |
| `npm test` | Vitest unit + integration |
| `npm run test:coverage` | Coverage with 80% gate |
| `npm run test:e2e` | Playwright |

## Tech stack

Next.js 16 (App Router) + TypeScript + Tailwind. Three.js / React Three Fiber for 3D. Pyodide for Python in the browser. Blockly for blocks. Monaco for code editing. Vitest + Playwright for tests. Vercel for hosting.

## Marty commands

| Command | Effect |
|---|---|
| `walk(steps)` | Walk forward |
| `dance()` | Dance routine |
| `kick("left"\|"right")` | Kick with leg |
| `slide("left"\|"right")` | Slide sideways |
| `lean("left"\|"right")` | Lean |
| `wiggle()` | Wiggle body |
| `circle_dance()` | Circular dance |
| `celebrate()` | Celebrate |
| `get_ready()` / `stand_straight()` | Pose |
| `eyes(expression)` | Set eye expression |
| `arms(left, right)` | Set arm angles |
| `foot_on_ground(side)` | Read foot sensor |
| `get_distance_sensor()` | Distance in cm |
| `get_accelerometer()` | `{x, y, z}` tilt |
| `stop()` | Stop all motion |

## Documentation

- [`docs/`](./docs) — architecture, runbook, contributing
- [`docs/architecture/overview.md`](./docs/architecture/overview.md) — layered diagram
- [`docs/runbook.md`](./docs/runbook.md) — incident response
- [`docs/contributing.md`](./docs/contributing.md) — branch model, code review
- [`TRAINING.md`](./TRAINING.md) — parent-child learning guide

## Acknowledgements

- **[Robotical Ltd](https://robotical.io)** — for designing and building Marty the Robot, the educational platform that inspired this project. If you enjoy Mini Marty, please support the real thing at [codemarty.com](https://codemarty.com) or [robotical.io](https://robotical.io).
- **[`robotical/martypy`](https://github.com/robotical/martypy)** (Apache-2.0) — the Python API surface re-implemented here (`walk`, `dance`, `kick`, `slide`, `lean`, `wiggle`, etc.) follows the public method names of Robotical's official `martypy` SDK so that Python written here is portable to the real robot.
- **[Blockly](https://developers.google.com/blockly)** (Apache-2.0) and **[Scratch 3.0 block color palette](https://en.scratch-wiki.info/wiki/Scratch_Blocks)** — for the visual programming foundation.
- **[Pyodide](https://pyodide.org)** (Mozilla Public License 2.0) — for running Python in the browser.
- **[Three.js](https://threejs.org)** / **[React Three Fiber](https://r3f.docs.pmnd.rs)** — for the 3D scene.

See [`docs/ATTRIBUTION.md`](./docs/ATTRIBUTION.md) for the full attribution and IP audit, and [`NOTICE`](./NOTICE) for required redistribution notices.

## License

Apache License 2.0 — see [`LICENSE`](./LICENSE).
