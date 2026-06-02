# Deployment

Mini Marty is a static + middleware Next.js app deployed to Vercel.

![Deployment flow](../diagrams/deployment.svg)

## Pipeline

1. Push to a branch -> Vercel preview deploy.
2. Merge to `main` -> production deploy.
3. GitHub Actions (`.github/workflows/ci.yml`) runs lint, typecheck, unit tests with coverage gate, build, Playwright, and a non-blocking Lighthouse audit on every PR.

## Vercel config

`vercel.json` sets the Node version, build command, and security headers consistent with `middleware.ts`. CSP is set at the middleware level; Vercel's edge does not need to know.

## Feature flags

`src/lib/flags.ts` reads from `process.env` at module evaluation. Public flags:

| Flag | Purpose |
|---|---|
| `NEXT_PUBLIC_SENTRY_ENABLED` | Toggle Sentry reporter; default off |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | Toggle Vercel Analytics; default off |

Off by default, opt-in via Vercel env UI. No flag toggles destructive behaviour.

## Rollback

Vercel's UI exposes one-click rollback to any prior production deploy. There is no database, so rollback is safe.

## Smoke check post-deploy

- Home page renders, 3D scene visible
- `/python-editor` loads Pyodide and prints `hello from marty`
- `/block-editor` shows toolbox and workspace
- DevTools console shows no CSP violations
