---
aliases: [Mini Marty ADRs]
tags: [project/mini-marty, type/decision]
---

# Decisions

Compact ADRs. One row, one decision. Newest at the top.

## ADR-003 — SVG over Mermaid for diagrams

**Date:** 2026-06-02
**Status:** Accepted

**Context:** Diagrams need to render in GitHub, in Obsidian, and inside the deployed site without runtime JS. Mermaid runs JS in the renderer; not every viewer ships it; CSP forbids inline scripts on the deployed site.

**Decision:** Hand-author SVGs with `prefers-color-scheme` styling. Live in `docs/diagrams/`.

**Consequences:** Higher authoring cost; lower runtime risk; consistent appearance across viewers; no script-src exposure.

## ADR-002 — Pyodide for in-browser Python

**Date:** 2026-06-02
**Status:** Accepted

**Context:** Learners write Python; we have no backend; latency must be low; cost must be zero.

**Decision:** Load Pyodide from `cdn.jsdelivr.net`. Inject a `martypy`-shaped module that bridges to `VirtualMarty`.

**Consequences:** ~6 MB cold load; no server bills; offline-capable after first load; `connect-src` must whitelist the CDN.

## ADR-001 — Vercel as host

**Date:** 2026-06-02
**Status:** Accepted

**Context:** Need static + middleware hosting with PR previews, no infra ops.

**Decision:** Deploy to Vercel. `vercel.json` and `middleware.ts` carry CSP and routing config.

**Consequences:** Single vendor; cheap; preview deploys per PR; one-click rollback; Vercel Analytics available behind a flag.
