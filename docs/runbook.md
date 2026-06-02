# Runbook

Operational guide for diagnosing failures in production and local dev.

## Symptom: blank white screen on load

1. Check the browser DevTools console for CSP violations -- the most common cause is a `connect-src` or `script-src` directive in `proxy.ts` that does not yet allow a newly added origin.
2. Confirm `next/dynamic` is loading the canvas. `data-testid="scene-container"` should be present; if `data-testid="scene-placeholder"` stays forever, the dynamic import is failing.
3. Look at `ErrorBoundary` output: it renders "Something went wrong". If you see it, check `MemoryErrorReporter.entries` (dev) or Sentry (prod).

## Symptom: Pyodide fails to load

- Verify the `connect-src` CSP directive permits `cdn.jsdelivr.net`.
- Check the network tab for the Pyodide bundle (around 6 MB). Slow networks can time out; `PyodideStatus` should render "error" with retry.
- The loader caches a single instance inside `PyodideLoader`. Hard reload (Cmd+Shift+R) to reset, or call `resetForTesting()` from `pyodide-service.ts` in a test harness.

## Symptom: blocks run but Marty does not move

1. Open the Python editor, paste the same code into it, and run manually. If it works there, the issue is in the Blockly-to-Python emission path inside `BlocklyWorkspace`; otherwise it is in the runtime.
2. Confirm `CommandQueue.size()` increases -- subscribe via `VirtualMarty.on("commandStart", ...)`.
3. Confirm `AnimationPlayer` is mounted (the canvas exists).

## Symptom: tests pass locally but fail in CI

- Line endings: this repo is authored on Windows-friendly settings; CI runs on Linux. If a snapshot or fixture diverges on `\r\n`, normalise to `\n` and add `.gitattributes` if it recurs.
- Playwright browsers: CI runs `npx playwright install --with-deps chromium`. Locally, if you skipped this, run it once.

## Symptom: high LCP or CLS in Vercel Analytics

1. Check `Web Vitals` dashboard for the spike.
2. Inspect the affected route in Lighthouse CI artifact from the latest run.
3. Most likely culprit: a non-`next/dynamic` import pulled into the home route. Compare the route's chunk size before and after.

## Common commands

```bash
npm run dev              # local dev server on 3000
npm run build && npm start  # production build smoke test
npm run lint -- --fix    # auto-fix style
npm run test -- --ui     # Vitest UI for debugging
npm run test:e2e -- --headed --debug  # step through Playwright
```
