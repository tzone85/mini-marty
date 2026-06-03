---
aliases: [Mini Marty Sessions]
tags: [project/mini-marty, type/log]
---

# Sessions

Running log of working sessions. Append new entries at the top.

## Template

```markdown
## YYYY-MM-DD — <short title>

**Goal:** one line.

**Did:**
- bullet

**Learned:**
- bullet

**Next:**
- bullet
```

## 2026-06-02 — Production readiness phases 1-3

**Goal:** Lift the prototype to a deployable, tested, documented state.

**Did:**
- Phase 1: introduced observability, analytics, and theme ports through providers; added error boundary and not-found routes; built sitemap, robots, manifest, CSP middleware.
- Phase 2: split `VirtualMarty` from Pyodide concerns; introduced `Clock` DI; raised coverage to 94% lines.
- Phase 3: code-split heavy editors; Web Vitals reporting; Lighthouse CI; repo docs; SVG diagrams; this vault.

**Learned:**
- web-vitals v5 drops `onFID`; use `onINP` instead.
- `next/dynamic` with `ssr: false` is the cleanest way to keep the home route lean while still using the canvas client-side.

**Next:**
- Verify CI green after first push; smoke-test Vercel preview URL.

## Older sessions

See git log for pre-2026-06-02 history.
