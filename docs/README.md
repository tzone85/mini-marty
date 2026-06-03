# Mini Marty — Documentation Index

Mini Marty is a browser-only virtual robot programming environment. Learners write Python or drag Blockly blocks; a `VirtualMarty` instance enqueues commands; an `AnimationPlayer` drives a React Three Fiber scene.

## Architecture pages

- [Overview](./architecture/overview.md) — layered diagram and module responsibilities
- [Virtual Marty](./architecture/virtual-marty.md) — `VirtualMarty`, `CommandQueue`, `Clock` DI
- [Python runtime](./architecture/python-runtime.md) — Pyodide loader, `martypy` shim, executor
- [Scene](./architecture/scene.md) — animation sequences, player, R3F integration
- [Security](./architecture/security.md) — CSP, sandboxing, secret handling
- [Testing](./architecture/testing.md) — pyramid, coverage gate, E2E
- [Deployment](./architecture/deployment.md) — Vercel pipeline, env flags

## Operations

- [Runbook](./runbook.md) — incident response, debugging, common failures
- [Contributing](./contributing.md) — local setup, branch model, code review

## Diagrams

Hand-authored SVGs in [`diagrams/`](./diagrams). Light/dark via `prefers-color-scheme`. No Mermaid.

## Obsidian vault

The `obsidian/` directory is symlinked into the user's vault as `Mini Marty (docs)`. Front-matter, wikilinks, and embedded SVGs let knowledge cross-flow between repo and vault.
