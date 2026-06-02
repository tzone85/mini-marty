# Testing

The pyramid is enforced at the coverage gate. Anything below 80% fails CI.

## Layers

| Layer | Tool | Scope |
|---|---|---|
| Unit | Vitest + Testing Library | Pure functions, hooks, components |
| Integration | Vitest (jsdom) | Component + provider trees |
| E2E | Playwright (Chromium) | Critical user journeys |

## Coverage gate

Configured in `vitest.config.ts`. Lines / Statements / Functions / Branches each must clear 80%. Vendor and animation-heavy code that depends on `WebGL` is excluded with comments explaining why.

## E2E journeys

- `e2e/home.spec.ts` — landing renders, quick actions navigate
- `e2e/python-editor.spec.ts` — Pyodide boot, run code, console output
- `e2e/block-editor.spec.ts` — block program compiles and runs
- `e2e/tutorials.spec.ts` and `e2e/challenges.spec.ts` — content shape
- `e2e/dark-mode.spec.ts` — theme persistence
- `e2e/keyboard-nav.spec.ts` — tab order, focus rings
- `e2e/a11y.spec.ts` — `@axe-core/playwright` scan on each route

## Running locally

```bash
npm test                  # unit + integration
npm run test:coverage     # with gate
npm run test:e2e          # Playwright
npx playwright install chromium  # one-time
```

## What we do not test

- Three.js render output (covered by visual smoke in dev, not by unit)
- Pyodide internals (vendored, pinned by SHA)
