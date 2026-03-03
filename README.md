# Mini Marty

A virtual programming environment for learning to code with Marty the Robot — no physical robot needed!

Mini Marty lets you write Python code or use visual block-based programming to control a 3D virtual Marty robot. Built for kids and parents to learn programming together.

## Features

- **3D Virtual Robot** — A fully-animated Marty robot rendered in your browser using Three.js
- **Python Editor** — Write Python code with syntax highlighting (Monaco Editor) and run it with Pyodide (Python in the browser)
- **Block Editor** — Drag-and-drop visual programming with Blockly
- **Tutorials** — 5 progressive lessons from "Hello Marty" to "Python Power"
- **Challenges** — 9 programming puzzles across Beginner, Intermediate, and Advanced tiers
- **Dark Mode** — Toggle between light and dark themes
- **No Server Required** — Everything runs in the browser

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | TypeScript type checking |
| `npm test` | Run unit tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:e2e` | Run Playwright E2E tests |

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **3D Rendering:** React Three Fiber + Three.js + Drei
- **Block Editor:** Blockly
- **Code Editor:** Monaco Editor
- **Python Runtime:** Pyodide (Python 3 in WebAssembly)
- **Styling:** Tailwind CSS v4
- **Unit Testing:** Vitest + React Testing Library
- **E2E Testing:** Playwright
- **Linting:** ESLint + Prettier

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home — 3D scene + quick actions
│   ├── block-editor/      # Blockly visual programming
│   ├── python-editor/     # Monaco + Pyodide + 3D viewport
│   ├── tutorials/         # Step-by-step lessons
│   └── challenges/        # Programming puzzles
├── components/
│   ├── layout/            # AppShell, Header, Sidebar
│   └── ui/                # ThemeToggle, shared UI
├── features/
│   ├── marty/             # Virtual Marty engine
│   ├── scene/             # 3D rendering & animation
│   ├── blocks/            # Blockly integration
│   ├── editor/            # Python code editor
│   ├── python-runtime/    # Pyodide integration
│   ├── tutorials/         # Tutorial content data
│   └── challenges/        # Challenge content data
└── lib/                   # Shared utilities
```

## How It Works

### Virtual Marty Engine

The `VirtualMarty` class simulates a physical robot. When you call `marty.walk(2)`, it creates a command, enqueues it, and emits events that drive the 3D animation system at 60fps.

### Python Runtime

Python runs entirely in the browser via Pyodide (CPython compiled to WebAssembly). A custom `martypy` module bridges Python to the JavaScript `VirtualMarty` class.

## Marty Commands

| Command | Description |
|---------|-------------|
| `walk(steps)` | Walk forward |
| `dance()` | Dance routine |
| `kick("left"/"right")` | Kick with leg |
| `slide("left"/"right")` | Slide sideways |
| `lean("left"/"right")` | Lean direction |
| `wiggle()` | Wiggle body |
| `circle_dance()` | Circular dance |
| `celebrate()` | Celebration |
| `get_ready()` | Ready position |
| `stand_straight()` | Stand upright |
| `eyes(expression)` | Set eye expression |
| `arms(left, right)` | Set arm angles |
| `foot_on_ground(side)` | Check foot sensor |
| `get_distance_sensor()` | Distance in cm |
| `get_accelerometer()` | Tilt data {x,y,z} |
| `stop()` | Stop all actions |

## Training Guide

See [TRAINING.md](./TRAINING.md) for a comprehensive parent-child learning guide with 6 structured sessions.
