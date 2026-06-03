---
aliases: [Mini Marty Diagrams]
tags: [project/mini-marty, type/diagrams]
---

# Diagrams

All diagrams are hand-authored SVGs in [`docs/diagrams/`](../diagrams). Light/dark via `prefers-color-scheme`. No embedded JS, no external font references.

## Architecture

![[../diagrams/architecture.svg]]

## Module dependencies

![[../diagrams/module-dependencies.svg]]

## Sequence — blocks execution

![[../diagrams/sequence-blocks.svg]]

## Sequence — Python execution

![[../diagrams/sequence-python.svg]]

## State — command lifecycle

![[../diagrams/state-command.svg]]

## Deployment

![[../diagrams/deployment.svg]]

## Authoring rules

- `viewBox="0 0 1000 600"`
- `<title>` and `<desc>` for a11y
- system-ui font family
- 1.5px strokes, 8-12px rounded corners
- arrow marker reused via `marker-end="url(#arrow)"`
- dark mode swap inside `<style>` via `@media (prefers-color-scheme: dark)`
