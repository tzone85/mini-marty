# Security

Mini Marty has no backend, no auth, and no PII. Risk surface is the browser sandbox plus a single third-party script (Pyodide from CDN).

## Content Security Policy

`proxy.ts` (Next.js middleware exported as `proxy`) issues a fresh nonce per request and sets:

| Directive | Value |
|---|---|
| `default-src` | `'self'` |
| `script-src` | `'self' 'nonce-<id>' 'wasm-unsafe-eval' cdn.jsdelivr.net va.vercel-scripts.com` |
| `style-src` | `'self' 'unsafe-inline'` (Tailwind utility classes) |
| `connect-src` | `'self' cdn.jsdelivr.net *.ingest.sentry.io vitals.vercel-insights.com` |
| `worker-src` | `'self' blob:` (Pyodide workers) |
| `frame-ancestors` | `'none'` |

The nonce is propagated to App Router by mirroring it onto the request as the `x-nonce` header. Next.js automatically attaches that nonce to every inline `<script>` it injects (hydration shim, RSC payload, route prefetch); without it, those scripts are blocked and the app fails to hydrate. Application code never reads `x-nonce` directly.

Companion headers: `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Permissions-Policy` disables camera / mic / geolocation.

## Python execution

User code runs in Pyodide, which is loaded on the main thread via an injected `<script>` tag (no Web Worker). The host page never `eval`s user input. The `martypy` bridge exposes only whitelisted methods on `VirtualMarty`; there is no `fetch`, no DOM access.

## Secrets

Only public flags are read from `process.env`. Anything beginning with `NEXT_PUBLIC_` is intentionally exposed; everything else stays server-side. The repo has no `.env` checked in.

## Audit checklist before release

- [ ] `npm audit --production` clean
- [ ] CSP nonce verified live (`curl -I` the deployed URL)
- [ ] No `console.log` in production bundle (`npm run build` then grep)
- [ ] No third-party domains added to `connect-src` without review
