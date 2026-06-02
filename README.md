# Mini Marty

[![CI](https://github.com/tzone85/mini-marty/actions/workflows/ci.yml/badge.svg)](https://github.com/tzone85/mini-marty/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#license)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftzone85%2Fmini-marty)

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

## License

MIT
