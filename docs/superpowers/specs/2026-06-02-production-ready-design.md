---
title: Mini Marty — Production Readiness Design
date: 2026-06-02
status: draft
owner: Thando Mini
tags: [spec, production, accessibility, performance, security, testing]
---

# Mini Marty — Production Readiness Design

## 1. Goal

Take the working Mini Marty prototype (3D virtual robot + Blockly + Python-in-browser + tutorials/challenges) to production-grade on Vercel. Targets:

| Axis | Target |
|------|--------|
| Test coverage | ≥ 80% statements/lines/functions/branches |
| Lighthouse (Perf/A11y/BP/SEO) | ≥ 90 on every public page |
| Accessibility | WCAG 2.2 AA on every interactive surface |
| Bundle (initial JS, gzipped) | ≤ 200 kB for first paint |
| Cold-load Python ready | ≤ 6 s on cable broadband |
| Error visibility | All client errors flow to Sentry with sourcemaps |
| Security | CSP without `'unsafe-inline'` for scripts, no inline `<script>` for vendor code |

## 2. Out of scope

- Multiplayer / cloud-saved programs (local-storage only for v1)
- Real Marty hardware Bluetooth bridge (`martypy` JS module stays in-browser only)
- Login / accounts
- i18n (English-only v1)

## 3. Architecture — current → target

The existing layout (`src/app`, `src/components/layout`, `src/features/<domain>`, `src/lib`) is sound and SOLID-aligned. The hardening keeps the topology and inserts cross-cutting layers.

See `docs/diagrams/architecture.svg` for the layered view.

### 3.1 New cross-cutting modules

| Module | Path | Purpose |
|--------|------|---------|
| Observability port | `src/lib/observability/` | `Logger` and `ErrorReporter` interfaces with `console` (dev) and `sentry` (prod) adapters — dependency inversion so features depend on interfaces, not vendors |
| Analytics port | `src/lib/analytics/` | `Analytics` interface with `noop` and `vercel` adapters; events: `code_run`, `tutorial_complete`, `challenge_complete` |
| Error boundary | `src/components/system/ErrorBoundary.tsx` | React class component; reports to `ErrorReporter`; renders fallback UI |
| Web Vitals | `src/lib/observability/web-vitals.ts` | `reportWebVitals` hook, forwards CLS/INP/LCP to analytics |
| Feature flags | `src/lib/flags.ts` | Simple env-driven booleans (no SaaS) |
| CSP/security headers | `vercel.ts` + `src/middleware.ts` | Strict CSP with nonces for Pyodide/Monaco workers |
| PWA manifest | `src/app/manifest.ts`, `public/icons/` | Installable on tablets — kids friendly |
| Sitemap/robots | `src/app/sitemap.ts`, `src/app/robots.ts` | SEO |

### 3.2 Refactors to existing modules

| Module | Change | Reason |
|--------|--------|--------|
| `pyodide-service.ts` | Move CDN script tag → typed dynamic `import()` via vendored loader; pass `loaderUrl` from config; remove module-level singletons → injectable container so tests don't need `resetForTesting()` | CSP without `'unsafe-inline'`; testability; SRP — currently mixes loading, singleton lifecycle, listener bus |
| `command-queue.ts` | Replace `setInterval` busy-wait in `processQueue` with promise-chained queue (await-then-next); inject `nowFn` and `scheduleFn` (defaults `Date.now` / `setTimeout`) | Removes flaky-test risk; cleaner concurrency |
| `AppShell.tsx` | Add `<a class="sr-only focus:not-sr-only" href="#main">Skip to content</a>`; `<main id="main" tabIndex={-1}>`; landmarks; keyboard-trap-safe sidebar | WCAG SC 2.4.1 (Bypass Blocks), 1.3.1 |
| `Header.tsx`, `Sidebar.tsx` | `nav aria-label`; current page `aria-current="page"`; focus rings; ESC closes mobile sidebar | WCAG 4.1.2 |
| `ThemeToggle.tsx` | `aria-pressed`, accessible label that announces state | WCAG 4.1.3 |
| `python-editor`, `block-editor` pages | Wrap heavy components in `next/dynamic` with `ssr: false` and skeletons; route-level loading UI | Initial JS budget |
| `MartyScene.tsx` | Pause render loop when tab hidden (`document.visibilityState`); reduce DPR on mobile | Battery on tablets |

## 4. Components & responsibilities (SOLID lens)

### 4.1 SRP — single responsibility per file
- `virtual-marty.ts` exposes the robot API only; queue, emitter, sensor model are separate files (already true — keep it that way).
- `pyodide-service.ts` will be split: `pyodide-loader.ts` (script load + ready promise), `pyodide-registry.ts` (instance access), `pyodide-events.ts` (state listeners).

### 4.2 OCP — open for extension, closed for modification
- `MartyCommand` discriminated union: adding a new command type does not touch existing handlers — handlers are switch-exhaustive and the compiler enforces additions.
- Animation `definitions` table — new animations are data, not code edits.

### 4.3 LSP — substitution
- `ErrorReporter` interface: `ConsoleErrorReporter` (dev), `SentryErrorReporter` (prod), `MemoryErrorReporter` (tests). All honour the same contract.

### 4.4 ISP — narrow interfaces
- `Logger` exposes only `info/warn/error`. `Analytics` exposes only `track(event, props?)`. No god-objects.

### 4.5 DIP — depend on abstractions
- Pages use `useObservability()` hook; the provider is wired once in `app/layout.tsx`. Vendor choice (Sentry, Vercel) is replaceable without touching features.

## 5. Data flow

### 5.1 Block program → 3D motion
See `docs/diagrams/sequence-blocks.svg`.

1. User drops blocks → `BlocklyWorkspace` emits `change`.
2. Save → JSON serialised to `localStorage` (key `mini-marty:blocks:v1`).
3. Run → blocks compiled to async-Python string → handed to `python-executor`.
4. Executor runs via Pyodide; `martypy` JS module proxies calls to the shared `VirtualMarty` instance.
5. `VirtualMarty` enqueues commands; emits events; `useMartyAnimation` interpolates joints at 60 fps.

### 5.2 Python program → 3D motion
Same as 5.1 but step 1 is `Monaco onChange`.

### 5.3 Error path
Any exception thrown in user code → caught by `python-executor` → formatted (user-friendly Python traceback + line marker) → `ConsoleOutput` shows red message → `ErrorReporter.report(error, { source: "user-code" })` filters out user-code errors before sending to Sentry (don't pollute prod telemetry with kids' bugs).

## 6. Error handling rules

- **System errors** (Pyodide load failure, WebGL unavailable, Blockly init failure): caught by feature-level boundary, fall back to instructional message ("Your browser does not support WebGL — try Chrome on a different device"), report to Sentry.
- **User errors** (Python syntax, runtime, illegal Marty command): caught by `python-executor`, displayed in console panel, **not** reported to Sentry.
- **Unknown errors**: top-level `ErrorBoundary` catches; reports; offers "Reload" button.
- All `try/catch` blocks log structured context: `{ feature, operation, ...inputs }` — no silent swallowing.

## 7. Testing strategy

### 7.1 Unit (Vitest + RTL)

| Module | Coverage targets |
|--------|------------------|
| `virtual-marty` | every command method enqueues correct shape; events fire; sensor accessors immutable |
| `command-queue` | blocking serialises; non-blocking parallelises; `clear` cancels promises; injected `scheduleFn` exercised |
| `event-emitter` | on/off/emit/removeAllListeners; type narrowing |
| `pyodide-loader` | script injection idempotent; double-load yields one promise; error path resets state |
| `python-executor` | wraps user code in async fn; surfaces stderr; sandbox isolation between runs |
| `martypy-module` | every Python-facing method maps to a `VirtualMarty` method |
| `animation/player` | interpolation math at boundaries; finishes within `duration` |
| `theme-context` | persists choice; respects `prefers-color-scheme` on first visit |
| `sidebar-config`, `navigation` | shape contracts |

### 7.2 Integration

- Block-to-Python compiler produces runnable code for every toolbox block.
- Python-editor flow: load → run → observe command events → console output matches expected.
- Theme toggle round-trip across pages.

### 7.3 E2E (Playwright)

| Journey | Assertion |
|---------|-----------|
| First visit, home | Heading visible, 3D canvas mounts, no a11y violations (axe) |
| Block editor flow | Drag block, save, reload, blocks restored |
| Python editor flow | "Run" button enabled after Pyodide ready, run sample, see "Marty walking" in console |
| Tutorial flow | Open tutorial, copy snippet, run, success state |
| Challenge flow | Open challenge, hint reveals stepwise, complete check |
| Keyboard-only | Tab through entire home page, focus visible, skip-link works |
| Dark mode | Toggle persists across navigation |
| Offline (PWA) | After first load, second visit works offline for static routes |

### 7.4 Performance budget tests
- Playwright with `@playwright/test` + `lighthouse` CLI in CI; fails build if perf < 85 (loose) on PR; informational only at first.

### 7.5 Coverage gate
- CI fails if line coverage < 80% across `src/` excluding `*.test.*`, `types.ts`, `*.stories.tsx`.

## 8. Security

| Threat | Mitigation |
|--------|-----------|
| XSS via user Python output | `ConsoleOutput` renders as text, never `dangerouslySetInnerHTML`. Verified by ESLint rule `react/no-danger`. |
| Pyodide CDN tampering | Subresource Integrity (SRI) hash on the loader; verify at runtime |
| CSP bypass | Strict CSP: `script-src 'self' https://cdn.jsdelivr.net 'wasm-unsafe-eval' 'nonce-{N}'`; no `unsafe-inline`; no `unsafe-eval` (Pyodide needs `wasm-unsafe-eval` only) |
| Local-storage tampering | Validate persisted JSON with Zod schemas before use |
| Click-jacking | `X-Frame-Options: DENY`, `frame-ancestors 'none'` |
| Mixed content | All assets HTTPS, enforced by CSP |
| Dependency vulns | `npm audit --omit=dev` in CI; Renovate or weekly Dependabot |

## 9. Performance

- **Code-split** Pyodide loader, Monaco, Blockly, Three.js — load only on the route that needs them.
- **`next/dynamic`** with `ssr: false` for client-only components.
- **Preconnect** to `cdn.jsdelivr.net` from `app/layout.tsx`.
- **Image optimisation** via `next/image` for any future assets; current home is 3D only.
- **Web Workers** — Pyodide already runs heavy work off main thread; the queue's `setTimeout`s use `requestAnimationFrame` for animation tick.
- **Cache** Pyodide bytes via Service Worker (PWA) — second load is fast.

## 10. Accessibility (WCAG 2.2 AA)

- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<aside>`.
- Skip-to-content link as first focusable element.
- Focus ring visible on all interactive elements (`:focus-visible`).
- All icons paired with `aria-label` or visually-hidden text.
- Colour contrast checked in light + dark modes (axe + manual sample).
- 3D canvas labelled with `role="img" aria-label="Virtual Marty robot"`; key actions duplicated outside canvas.
- Keyboard: Blockly has its own a11y mode — enable it; Monaco supports keyboard natively; ensure no custom traps.
- Reduced motion: respect `prefers-reduced-motion` in animation player — skip transitions, snap to end pose.

## 11. Documentation

### 11.1 Repo (`docs/`)
- `docs/README.md` — landing page, links into the rest.
- `docs/architecture/overview.md` — narrative + embedded SVGs (see §11.3).
- `docs/architecture/virtual-marty.md` — command lifecycle, event flow.
- `docs/architecture/python-runtime.md` — Pyodide bootstrap, `martypy` bridge.
- `docs/architecture/scene.md` — Three.js scene graph, animation player.
- `docs/architecture/security.md` — CSP, SRI, sandbox model.
- `docs/architecture/testing.md` — pyramid, fixtures, conventions.
- `docs/architecture/deployment.md` — Vercel config, env vars, preview deploys.
- `docs/runbook.md` — on-call basics, common failures, log queries.
- `docs/contributing.md` — TDD workflow, commit style, PR template.
- `docs/superpowers/specs/` — this spec + future specs.
- `docs/superpowers/plans/` — implementation plans.

### 11.2 Obsidian
- Repo-side: `docs/obsidian/` with Obsidian-flavoured markdown (front-matter, wikilinks, tags `#project/mini-marty`).
- Vault-side: symlink `Mini Marty -> /Users/mncedimini/Sites/misc/marty/docs/obsidian` (matches existing pattern: see vault entries like `PawPortion (docs)`, `Hexagonia (repo)`).
- Pages: `Home.md`, `Architecture.md`, `Sessions.md`, `Decisions.md`, `Diagrams.md`, `Glossary.md` — cross-linked via `[[wikilinks]]`.

### 11.3 Diagrams (SVG only, no Mermaid)
Hand-authored SVGs in `docs/diagrams/`. One per concept:

1. `architecture.svg` — layered: UI → Features → Engine → Runtime → Vendors.
2. `sequence-blocks.svg` — block-run sequence (user → blockly → compiler → executor → pyodide → virtual-marty → animation → scene).
3. `sequence-python.svg` — analogous for Python editor.
4. `state-command.svg` — Command lifecycle: pending → running → completed/error.
5. `module-dependencies.svg` — feature folder dependency graph.
6. `deployment.svg` — git → Vercel build → preview → prod.

Diagrams are referenced from both repo docs and Obsidian (Obsidian renders SVG natively).

## 12. Deployment (Vercel)

- `vercel.ts` config (per current Vercel guidance) replacing any `vercel.json`.
- `framework: 'nextjs'`, Node 24 default.
- Headers: CSP (nonce-based), HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` minimal.
- `crons`: none for v1.
- Env: `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_APP_VERSION` (from git sha), `NEXT_PUBLIC_ANALYTICS` (`vercel` | `noop`).
- Preview deployments on every PR; Production on `main`.

## 13. Phased rollout

Each phase ends with green CI. No phase commits direct to `main`.

### Phase 1 — Foundation (cross-cutting)
- Observability ports + adapters (Console + Sentry).
- Analytics ports + adapters (Noop + Vercel).
- ErrorBoundary, route-level error.tsx, not-found.tsx.
- CSP + security headers via `vercel.ts` + middleware (nonces).
- `manifest.ts`, icons, robots, sitemap, OG metadata.
- A11y primitives in AppShell, Header, Sidebar, ThemeToggle.
- Pyodide loader refactor (split + SRI + CSP-safe).
- `command-queue` `setInterval` → promise-chained.

### Phase 2 — Coverage to 80%
- TDD: write failing tests per §7.1, implement minimal patches, refactor.
- Add Playwright a11y assertions (axe-core/playwright).
- Coverage gate added to CI.

### Phase 3 — Polish & docs
- Code-split Pyodide/Monaco/Blockly/Three via `next/dynamic`.
- Web Vitals reporting.
- PWA: service worker (next-pwa or app-router native).
- Lighthouse budget in CI.
- All docs in §11 written.
- All SVG diagrams in §11.3 authored.
- Obsidian vault symlinked.

## 14. Risks & open questions

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| Pyodide + strict CSP friction | Med | `wasm-unsafe-eval` is documented support; SRI on the loader; e2e CSP test |
| Blockly a11y mode quirks | Med | Run axe over block editor; document any known violations |
| Lighthouse perf with Three.js | Med | Lazy-mount canvas only on routes that need it; pause on hidden |
| Sentry source-maps in Next 16 | Low | Use `@sentry/nextjs` wizard; verify on a preview deploy first |

## 15. Acceptance criteria

- [ ] CI green: lint, format:check, typecheck, unit (≥80% cov), e2e (incl. axe + keyboard), build.
- [ ] Lighthouse ≥ 90 (perf, a11y, BP, SEO) on `/`, `/block-editor`, `/python-editor`, `/tutorials`, `/challenges`.
- [ ] CSP active, no inline `<script>` (other than nonced framework ones), zero CSP errors in browser console.
- [ ] Sentry receives a forced error from `/?__sentry_test=1`.
- [ ] Vercel preview deploy succeeds on a PR.
- [ ] Obsidian vault symlink resolves; pages render.
- [ ] All six SVG diagrams present and referenced.
- [ ] `docs/` complete per §11.1.
