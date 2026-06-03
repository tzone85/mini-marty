# Contributing

## Setup

```bash
git clone <repo>
cd marty
npm ci
npm run dev
```

Node 20+ required. `npm ci` is strict; if it fails, regenerate `package-lock.json` against the same Node version your colleagues use.

## Branch model

- `main` is always deployable.
- Feature branches: `feature/<short-name>` cut from `main`.
- Bug fixes: `fix/<short-name>`.
- PRs target `main`; one approval required; CI must be green.

## Code style

- Prettier + ESLint are enforced in CI.
- Files cap at 800 lines; extract before you exceed.
- Immutability: never mutate inputs; return new objects.
- No `console.log` in committed code.
- Documentation cites symbols (`VirtualMarty.walk`), not line numbers.

## Commits

Conventional commits:

```
<type>: <description>
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`.

## Pull request checklist

- [ ] Tests added or updated; coverage stays at or above 80%
- [ ] Lint, typecheck, build, unit, and E2E pass locally
- [ ] Docs updated if a public surface changed
- [ ] No secrets, no `.env` files, no large binary blobs
- [ ] PR description names the feature and links the relevant Jira ticket if any

## Where things live

| Concern | Path |
|---|---|
| Routes | `src/app/<route>/page.tsx` |
| Shared UI | `src/components/` |
| Feature code | `src/features/<feature>/` |
| Cross-cutting libs | `src/lib/` |
| Tests next to source | `*.test.ts(x)` |
| E2E | `e2e/*.spec.ts` |
| Docs | `docs/` (this folder) |
