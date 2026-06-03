# Mini Marty — Production-Ready Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Mini Marty to Vercel with WCAG-AA accessibility, ≥80% test coverage (TDD), Sentry observability, strict CSP, PWA, Lighthouse ≥90, repo + Obsidian docs with hand-authored SVG diagrams.

**Architecture:** Keep the existing `src/{app,components,features,lib}` topology. Add cross-cutting ports under `src/lib/{observability,analytics,flags}` (DIP — features depend on interfaces, not vendors). Refactor `pyodide-service.ts` into SRP-split modules. Replace `command-queue` setInterval busy-wait with promise chaining (testability).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript strict, Tailwind 4, R3F/Three, Blockly 12, Monaco, Pyodide 0.27, Vitest 4 + RTL, Playwright 1.58 + @axe-core/playwright, Zod, Sentry, Vercel.

---

## File-by-file map

### New files

| Path | Responsibility |
|------|----------------|
| `vercel.ts` | Vercel project config (framework, headers, redirects) |
| `src/middleware.ts` | CSP nonce per request, security headers |
| `src/app/manifest.ts` | PWA manifest |
| `src/app/sitemap.ts` | SEO sitemap |
| `src/app/robots.ts` | robots rules |
| `src/app/error.tsx` | Route error boundary |
| `src/app/not-found.tsx` | 404 page |
| `src/app/global-error.tsx` | Root error UI |
| `src/components/system/ErrorBoundary.tsx` | React class boundary, reports to ErrorReporter |
| `src/components/system/SkipLink.tsx` | Skip-to-content for keyboard users |
| `src/lib/observability/types.ts` | `Logger`, `ErrorReporter` interfaces |
| `src/lib/observability/console-logger.ts` | Dev `Logger` adapter |
| `src/lib/observability/sentry-reporter.ts` | Prod `ErrorReporter` adapter |
| `src/lib/observability/memory-reporter.ts` | Test adapter |
| `src/lib/observability/provider.tsx` | React provider + `useObservability` |
| `src/lib/observability/web-vitals.ts` | Web Vitals -> analytics |
| `src/lib/analytics/types.ts` | `Analytics` interface |
| `src/lib/analytics/noop-analytics.ts` | Dev/test |
| `src/lib/analytics/vercel-analytics.ts` | Prod |
| `src/lib/analytics/provider.tsx` | React provider |
| `src/lib/flags.ts` | Env-driven feature flags |
| `src/lib/schemas/blocks.ts` | Zod schema for persisted blocks JSON |
| `src/lib/schemas/python.ts` | Zod schema for persisted python source |
| `src/lib/storage/safe-storage.ts` | Zod-validated localStorage wrapper |
| `src/features/python-runtime/pyodide-loader.ts` | Script injection + ready promise (split from `pyodide-service.ts`) |
| `src/features/python-runtime/pyodide-registry.ts` | Singleton container w/ inject for tests |
| `src/features/python-runtime/pyodide-events.ts` | State listener bus |
| `src/features/marty/clock.ts` | `Clock` interface + `RealClock` (DI for queue tests) |
| `src/test/builders.ts` | Test data builders |
| `e2e/a11y.spec.ts` | axe scans on all routes |
| `e2e/block-editor.spec.ts` | Block editor flow |
| `e2e/python-editor.spec.ts` | Python editor flow |
| `e2e/tutorials.spec.ts` | Tutorial flow |
| `e2e/challenges.spec.ts` | Challenge flow |
| `e2e/keyboard.spec.ts` | Keyboard-only journey |
| `e2e/dark-mode.spec.ts` | Theme persistence |
| `docs/README.md` | Docs landing |
| `docs/architecture/{overview,virtual-marty,python-runtime,scene,security,testing,deployment}.md` | Per-domain docs |
| `docs/runbook.md` | On-call notes |
| `docs/contributing.md` | TDD workflow |
| `docs/diagrams/{architecture,sequence-blocks,sequence-python,state-command,module-dependencies,deployment}.svg` | Hand-authored SVGs |
| `docs/obsidian/{Home,Architecture,Sessions,Decisions,Diagrams,Glossary}.md` | Obsidian vault content |
| Test files | One `*.test.ts(x)` per source file in §"Coverage targets" |

### Modified files

| Path | Change |
|------|--------|
| `package.json` | Add deps: `@sentry/nextjs`, `@vercel/analytics`, `zod`, `web-vitals`, `@axe-core/playwright`. Scripts: `test:e2e:axe`. |
| `next.config.ts` | Add `transpilePackages`, `images`, security headers fallback |
| `src/app/layout.tsx` | Wire `ObservabilityProvider`, `AnalyticsProvider`, set lang, viewport, theme-color, preconnect, openGraph |
| `src/components/layout/AppShell.tsx` | Add `SkipLink`, `<main id="main">`, ARIA landmarks |
| `src/components/layout/Header.tsx` | `nav aria-label`, `aria-current="page"`, focus rings |
| `src/components/layout/Sidebar.tsx` | `aria-label`, focus rings, current-section indicator |
| `src/components/ui/ThemeToggle.tsx` | `aria-pressed`, accessible label that announces state, focus ring |
| `src/lib/theme-context.tsx` | Respect `prefers-color-scheme` initial value; SSR-safe |
| `src/features/marty/command-queue.ts` | Replace `setInterval` poll w/ promise chaining; inject `Clock`/`scheduler` |
| `src/features/python-runtime/pyodide-service.ts` | Split into loader/registry/events; remove module singletons |
| `src/features/python-runtime/python-executor.ts` | Use new loader; ESLint-safe |
| `src/features/scene/components/MartyScene.tsx` | `prefers-reduced-motion` + tab-hidden pause + DPR clamp |
| `vitest.config.ts` | Already 80% gate — confirm; add excludes for `**/*.stories.*`, `src/test/**` |
| `.github/workflows/ci.yml` | Add Lighthouse CI job, axe job, Sentry sourcemap upload on prod |
| `playwright.config.ts` | Add `prepare-server` for CI, axe project |

---

## Phase 1 — Foundation (cross-cutting hardening)

### Task 1: Add core dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add deps**

Run:
```bash
npm install --save zod web-vitals @vercel/analytics
npm install --save-dev @axe-core/playwright
```

- [ ] **Step 2: Verify install**

Run: `npm test -- --run`
Expected: PASS (4 baseline tests)

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add zod, web-vitals, axe, vercel/analytics deps"
```

### Task 2: Observability port + console logger (TDD)

**Files:**
- Create: `src/lib/observability/types.ts`
- Create: `src/lib/observability/console-logger.ts`
- Create: `src/lib/observability/console-logger.test.ts`
- Create: `src/lib/observability/memory-reporter.ts`
- Create: `src/lib/observability/memory-reporter.test.ts`

- [ ] **Step 1: Write failing tests**

`src/lib/observability/console-logger.test.ts`:
```typescript
import { describe, expect, it, vi } from "vitest";
import { ConsoleLogger } from "./console-logger";

describe("ConsoleLogger", () => {
  it("forwards info to console.info with structured context", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const log = new ConsoleLogger();
    log.info("hello", { feature: "test" });
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("hello"),
      expect.objectContaining({ feature: "test" }),
    );
    spy.mockRestore();
  });
  it("forwards warn and error", () => {
    const w = vi.spyOn(console, "warn").mockImplementation(() => {});
    const e = vi.spyOn(console, "error").mockImplementation(() => {});
    const log = new ConsoleLogger();
    log.warn("w");
    log.error("e");
    expect(w).toHaveBeenCalled();
    expect(e).toHaveBeenCalled();
    w.mockRestore();
    e.mockRestore();
  });
});
```

`src/lib/observability/memory-reporter.test.ts`:
```typescript
import { describe, expect, it } from "vitest";
import { MemoryErrorReporter } from "./memory-reporter";

describe("MemoryErrorReporter", () => {
  it("stores reported errors with context", () => {
    const r = new MemoryErrorReporter();
    const err = new Error("boom");
    r.report(err, { feature: "marty" });
    expect(r.entries).toEqual([{ error: err, context: { feature: "marty" } }]);
  });
  it("clear empties entries", () => {
    const r = new MemoryErrorReporter();
    r.report(new Error("x"));
    r.clear();
    expect(r.entries).toEqual([]);
  });
});
```

- [ ] **Step 2: Run — expect fail**

Run: `npm test -- src/lib/observability`
Expected: FAIL ("Cannot find module")

- [ ] **Step 3: Implement**

`src/lib/observability/types.ts`:
```typescript
export type LogContext = Readonly<Record<string, unknown>>;

export interface Logger {
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
}

export interface ErrorReporter {
  report(error: unknown, context?: LogContext): void;
}
```

`src/lib/observability/console-logger.ts`:
```typescript
import type { Logger, LogContext } from "./types";

export class ConsoleLogger implements Logger {
  info(message: string, context: LogContext = {}): void {
    console.info(`[info] ${message}`, context);
  }
  warn(message: string, context: LogContext = {}): void {
    console.warn(`[warn] ${message}`, context);
  }
  error(message: string, context: LogContext = {}): void {
    console.error(`[error] ${message}`, context);
  }
}
```

`src/lib/observability/memory-reporter.ts`:
```typescript
import type { ErrorReporter, LogContext } from "./types";

export interface MemoryEntry {
  readonly error: unknown;
  readonly context: LogContext;
}

export class MemoryErrorReporter implements ErrorReporter {
  private _entries: MemoryEntry[] = [];

  get entries(): readonly MemoryEntry[] {
    return this._entries;
  }

  report(error: unknown, context: LogContext = {}): void {
    this._entries = [...this._entries, { error, context }];
  }

  clear(): void {
    this._entries = [];
  }
}
```

- [ ] **Step 4: Run — expect pass**

Run: `npm test -- src/lib/observability`
Expected: PASS all

- [ ] **Step 5: Commit**

```bash
git add src/lib/observability
git commit -m "feat(obs): add Logger/ErrorReporter ports + console + memory adapters"
```

### Task 3: Observability provider + hook (TDD)

**Files:**
- Create: `src/lib/observability/provider.tsx`
- Create: `src/lib/observability/provider.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
import { describe, expect, it } from "vitest";
import { render, renderHook } from "@testing-library/react";
import { MemoryErrorReporter } from "./memory-reporter";
import { ConsoleLogger } from "./console-logger";
import { ObservabilityProvider, useObservability } from "./provider";

describe("ObservabilityProvider", () => {
  it("supplies injected logger + reporter via useObservability", () => {
    const logger = new ConsoleLogger();
    const reporter = new MemoryErrorReporter();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ObservabilityProvider logger={logger} reporter={reporter}>
        {children}
      </ObservabilityProvider>
    );
    const { result } = renderHook(() => useObservability(), { wrapper });
    expect(result.current.logger).toBe(logger);
    expect(result.current.reporter).toBe(reporter);
  });

  it("throws if used outside provider", () => {
    expect(() => renderHook(() => useObservability())).toThrow(/Observability/);
  });
});
```

- [ ] **Step 2: Run — expect fail**

- [ ] **Step 3: Implement**

```tsx
"use client";
import { createContext, useContext } from "react";
import type { Logger, ErrorReporter } from "./types";

interface Ctx {
  readonly logger: Logger;
  readonly reporter: ErrorReporter;
}

const ObservabilityContext = createContext<Ctx | null>(null);

export function ObservabilityProvider({
  logger,
  reporter,
  children,
}: {
  readonly logger: Logger;
  readonly reporter: ErrorReporter;
  readonly children: React.ReactNode;
}) {
  return (
    <ObservabilityContext.Provider value={{ logger, reporter }}>
      {children}
    </ObservabilityContext.Provider>
  );
}

export function useObservability(): Ctx {
  const ctx = useContext(ObservabilityContext);
  if (!ctx) {
    throw new Error("Observability provider missing — wrap your app");
  }
  return ctx;
}
```

- [ ] **Step 4: Run — expect pass**

- [ ] **Step 5: Commit**

```bash
git add src/lib/observability/provider.tsx src/lib/observability/provider.test.tsx
git commit -m "feat(obs): provider + useObservability hook"
```

### Task 4: Sentry reporter adapter (lazy)

**Files:**
- Create: `src/lib/observability/sentry-reporter.ts`
- Create: `src/lib/observability/sentry-reporter.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
import { describe, expect, it, vi } from "vitest";
import { SentryErrorReporter } from "./sentry-reporter";

describe("SentryErrorReporter", () => {
  it("calls captureException with error + context", () => {
    const captureException = vi.fn();
    const reporter = new SentryErrorReporter({ captureException });
    reporter.report(new Error("x"), { feature: "marty" });
    expect(captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ extra: { feature: "marty" } }),
    );
  });
  it("does nothing if client missing", () => {
    const reporter = new SentryErrorReporter(null);
    expect(() => reporter.report(new Error("x"))).not.toThrow();
  });
});
```

- [ ] **Step 2: Run — expect fail**

- [ ] **Step 3: Implement**

```typescript
import type { ErrorReporter, LogContext } from "./types";

export interface SentryClient {
  captureException(error: unknown, hint?: { extra?: LogContext }): void;
}

export class SentryErrorReporter implements ErrorReporter {
  constructor(private readonly client: SentryClient | null) {}

  report(error: unknown, context: LogContext = {}): void {
    if (!this.client) return;
    this.client.captureException(error, { extra: context });
  }
}
```

- [ ] **Step 4: Run — expect pass**

- [ ] **Step 5: Commit**

```bash
git add src/lib/observability/sentry-reporter.ts src/lib/observability/sentry-reporter.test.ts
git commit -m "feat(obs): Sentry reporter adapter (injectable client)"
```

### Task 5: Analytics port + adapters (TDD)

**Files:**
- Create: `src/lib/analytics/types.ts`
- Create: `src/lib/analytics/noop-analytics.ts`
- Create: `src/lib/analytics/vercel-analytics.ts`
- Create: `src/lib/analytics/provider.tsx`
- Create: `src/lib/analytics/{noop,vercel,provider}.test.{ts,tsx}`

- [ ] **Step 1: Write failing tests**

`noop-analytics.test.ts`:
```typescript
import { describe, expect, it } from "vitest";
import { NoopAnalytics } from "./noop-analytics";

describe("NoopAnalytics", () => {
  it("records events for assertion", () => {
    const a = new NoopAnalytics();
    a.track("code_run", { language: "python" });
    expect(a.events).toEqual([
      { name: "code_run", props: { language: "python" } },
    ]);
  });
});
```

`vercel-analytics.test.ts`:
```typescript
import { describe, expect, it, vi } from "vitest";
import { VercelAnalytics } from "./vercel-analytics";

describe("VercelAnalytics", () => {
  it("forwards to injected track fn", () => {
    const track = vi.fn();
    const a = new VercelAnalytics(track);
    a.track("tutorial_complete", { id: "hello" });
    expect(track).toHaveBeenCalledWith("tutorial_complete", { id: "hello" });
  });
});
```

`provider.test.tsx`:
```tsx
import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { NoopAnalytics } from "./noop-analytics";
import { AnalyticsProvider, useAnalytics } from "./provider";

describe("AnalyticsProvider", () => {
  it("provides injected analytics", () => {
    const a = new NoopAnalytics();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AnalyticsProvider analytics={a}>{children}</AnalyticsProvider>
    );
    const { result } = renderHook(() => useAnalytics(), { wrapper });
    expect(result.current).toBe(a);
  });
  it("throws outside provider", () => {
    expect(() => renderHook(() => useAnalytics())).toThrow();
  });
});
```

- [ ] **Step 2: Run — expect fail**

- [ ] **Step 3: Implement**

`types.ts`:
```typescript
export type AnalyticsEvent =
  | "code_run"
  | "tutorial_complete"
  | "challenge_complete"
  | "block_program_saved"
  | "theme_toggle";

export type AnalyticsProps = Readonly<Record<string, string | number | boolean>>;

export interface Analytics {
  track(event: AnalyticsEvent, props?: AnalyticsProps): void;
}
```

`noop-analytics.ts`:
```typescript
import type { Analytics, AnalyticsEvent, AnalyticsProps } from "./types";

export class NoopAnalytics implements Analytics {
  private _events: { name: AnalyticsEvent; props?: AnalyticsProps }[] = [];

  get events() {
    return this._events;
  }

  track(name: AnalyticsEvent, props?: AnalyticsProps): void {
    this._events = [...this._events, { name, props }];
  }
}
```

`vercel-analytics.ts`:
```typescript
import type { Analytics, AnalyticsEvent, AnalyticsProps } from "./types";

export type VercelTrackFn = (event: string, props?: AnalyticsProps) => void;

export class VercelAnalytics implements Analytics {
  constructor(private readonly trackFn: VercelTrackFn) {}
  track(event: AnalyticsEvent, props?: AnalyticsProps): void {
    this.trackFn(event, props);
  }
}
```

`provider.tsx`:
```tsx
"use client";
import { createContext, useContext } from "react";
import type { Analytics } from "./types";

const AnalyticsContext = createContext<Analytics | null>(null);

export function AnalyticsProvider({
  analytics,
  children,
}: {
  readonly analytics: Analytics;
  readonly children: React.ReactNode;
}) {
  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics(): Analytics {
  const a = useContext(AnalyticsContext);
  if (!a) throw new Error("Analytics provider missing");
  return a;
}
```

- [ ] **Step 4: Run — expect pass**

- [ ] **Step 5: Commit**

```bash
git add src/lib/analytics
git commit -m "feat(analytics): port + noop + vercel adapters + provider"
```

### Task 6: Feature flags

**Files:**
- Create: `src/lib/flags.ts`
- Create: `src/lib/flags.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
import { describe, expect, it } from "vitest";
import { readFlags } from "./flags";

describe("flags", () => {
  it("defaults all off when env empty", () => {
    expect(readFlags({})).toEqual({
      analyticsEnabled: false,
      sentryEnabled: false,
      pwaEnabled: false,
    });
  });
  it("reads NEXT_PUBLIC_* flags", () => {
    expect(
      readFlags({
        NEXT_PUBLIC_ANALYTICS: "vercel",
        NEXT_PUBLIC_SENTRY_DSN: "https://x",
        NEXT_PUBLIC_PWA: "1",
      }),
    ).toEqual({
      analyticsEnabled: true,
      sentryEnabled: true,
      pwaEnabled: true,
    });
  });
});
```

- [ ] **Step 2: Run — expect fail**

- [ ] **Step 3: Implement**

```typescript
export interface Flags {
  readonly analyticsEnabled: boolean;
  readonly sentryEnabled: boolean;
  readonly pwaEnabled: boolean;
}

export function readFlags(env: NodeJS.ProcessEnv | Record<string, string | undefined>): Flags {
  return {
    analyticsEnabled: env.NEXT_PUBLIC_ANALYTICS === "vercel",
    sentryEnabled: Boolean(env.NEXT_PUBLIC_SENTRY_DSN),
    pwaEnabled: env.NEXT_PUBLIC_PWA === "1",
  };
}
```

- [ ] **Step 4: Run — expect pass**

- [ ] **Step 5: Commit**

```bash
git add src/lib/flags.ts src/lib/flags.test.ts
git commit -m "feat(flags): env-driven feature flags"
```

### Task 7: ErrorBoundary component (TDD)

**Files:**
- Create: `src/components/system/ErrorBoundary.tsx`
- Create: `src/components/system/ErrorBoundary.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";
import { MemoryErrorReporter } from "@/lib/observability/memory-reporter";

function Bomb(): React.ReactElement {
  throw new Error("boom");
}

describe("ErrorBoundary", () => {
  it("renders fallback and reports", () => {
    const reporter = new MemoryErrorReporter();
    render(
      <ErrorBoundary reporter={reporter} fallback={<p>Crashed</p>}>
        <Bomb />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Crashed")).toBeInTheDocument();
    expect(reporter.entries).toHaveLength(1);
  });
  it("renders children when no error", () => {
    const reporter = new MemoryErrorReporter();
    render(
      <ErrorBoundary reporter={reporter} fallback={<p>x</p>}>
        <p>ok</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText("ok")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run — expect fail**

- [ ] **Step 3: Implement**

```tsx
"use client";
import { Component } from "react";
import type { ReactNode } from "react";
import type { ErrorReporter } from "@/lib/observability/types";

interface Props {
  readonly reporter: ErrorReporter;
  readonly fallback: ReactNode;
  readonly children: ReactNode;
}

interface State {
  readonly hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown): void {
    this.props.reporter.report(error, { componentStack: String(info) });
  }

  render(): ReactNode {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
```

- [ ] **Step 4: Run — expect pass**

- [ ] **Step 5: Commit**

```bash
git add src/components/system/ErrorBoundary.tsx src/components/system/ErrorBoundary.test.tsx
git commit -m "feat(system): ErrorBoundary with injectable reporter"
```

### Task 8: SkipLink component (TDD)

**Files:**
- Create: `src/components/system/SkipLink.tsx`
- Create: `src/components/system/SkipLink.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkipLink } from "./SkipLink";

describe("SkipLink", () => {
  it("renders a link to #main with accessible label", () => {
    render(<SkipLink />);
    const link = screen.getByRole("link", { name: /skip to (main )?content/i });
    expect(link).toHaveAttribute("href", "#main");
  });
});
```

- [ ] **Step 2: Run — expect fail**

- [ ] **Step 3: Implement**

```tsx
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-blue-600 focus:px-3 focus:py-2 focus:text-white"
    >
      Skip to main content
    </a>
  );
}
```

- [ ] **Step 4: Run — expect pass**

- [ ] **Step 5: Commit**

```bash
git add src/components/system/SkipLink.tsx src/components/system/SkipLink.test.tsx
git commit -m "feat(a11y): SkipLink component"
```

### Task 9: AppShell a11y refactor (TDD)

**Files:**
- Modify: `src/components/layout/AppShell.tsx`
- Create: `src/components/layout/AppShell.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("renders SkipLink, header, sidebar, and main landmark with id", () => {
    render(<AppShell><div>content</div></AppShell>);
    expect(screen.getByRole("link", { name: /skip to main content/i })).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("complementary")).toBeInTheDocument();
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main");
  });
});
```

- [ ] **Step 2: Run — expect fail**

- [ ] **Step 3: Implement**

```tsx
"use client";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { SkipLink } from "@/components/system/SkipLink";

export function AppShell({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <SkipLink />
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main
          id="main"
          tabIndex={-1}
          className="flex-1 overflow-y-auto bg-white p-0 dark:bg-gray-900 focus:outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
```

(Header already renders `<header>` (role=banner), Sidebar already renders `<aside>` (role=complementary) — no change needed there for landmarks.)

- [ ] **Step 4: Run — expect pass**

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/AppShell.tsx src/components/layout/AppShell.test.tsx
git commit -m "feat(a11y): SkipLink + main landmark in AppShell"
```

### Task 10: Header a11y (TDD)

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Header.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";
import { ThemeProvider } from "@/lib/theme-context";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("Header", () => {
  it("has primary nav with accessible label", () => {
    render(<ThemeProvider><Header /></ThemeProvider>);
    expect(screen.getByRole("navigation", { name: /primary/i })).toBeInTheDocument();
  });
  it("marks current page with aria-current", () => {
    render(<ThemeProvider><Header /></ThemeProvider>);
    const homeLinks = screen.getAllByRole("link", { name: /home/i });
    // current item should have aria-current="page"
    const current = homeLinks.find((l) => l.getAttribute("aria-current") === "page");
    expect(current).toBeDefined();
  });
});
```

- [ ] **Step 2: Run — expect fail**

- [ ] **Step 3: Implement**

Add `aria-label="Primary"` to `<nav>`, add `aria-current={pathname === item.path ? "page" : undefined}` to each Link, add `focus-visible:ring-2 focus-visible:ring-blue-500` utility to anchor classes.

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header() {
  const pathname = usePathname();
  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span className="text-2xl" aria-hidden="true">🤖</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">Mini Marty</span>
        </Link>
        <nav aria-label="Primary">
          <ul className="flex gap-4">
            {NAV_ITEMS.map((item) => {
              const current = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    aria-current={current ? "page" : undefined}
                    className={`flex items-center gap-1 rounded px-1 text-sm transition-colors hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:text-blue-400 ${
                      current
                        ? "font-semibold text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    <span className="text-base" aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <ThemeToggle />
    </header>
  );
}
```

- [ ] **Step 4: Run — expect pass**

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Header.tsx src/components/layout/Header.test.tsx
git commit -m "feat(a11y): Header nav label, aria-current, focus rings"
```

### Task 11: Sidebar a11y (TDD)

**Files:**
- Modify: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/Sidebar.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "./Sidebar";
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("Sidebar", () => {
  it("has aria-label and focus rings on interactive items", () => {
    render(<Sidebar />);
    const aside = screen.getByRole("complementary");
    expect(aside).toHaveAttribute("aria-label", expect.stringMatching(/secondary|context/i));
  });
});
```

- [ ] **Step 2: Run — expect fail**

- [ ] **Step 3: Implement**

Add `aria-label="Context navigation"` to `<aside>`, add `focus-visible:ring-2` to Links.

- [ ] **Step 4: Run — expect pass**

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Sidebar.tsx src/components/layout/Sidebar.test.tsx
git commit -m "feat(a11y): Sidebar aria-label + focus rings"
```

### Task 12: ThemeToggle a11y (TDD)

**Files:**
- Modify: `src/components/ui/ThemeToggle.tsx`
- Create: `src/components/ui/ThemeToggle.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeProvider } from "@/lib/theme-context";

describe("ThemeToggle", () => {
  it("announces current state via aria-label", () => {
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAccessibleName(/switch to dark|switch to light/i);
  });
  it("toggles aria-pressed on click", () => {
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    const btn = screen.getByRole("button");
    const initial = btn.getAttribute("aria-pressed");
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-pressed")).not.toBe(initial);
  });
});
```

- [ ] **Step 2: Run — expect fail**

- [ ] **Step 3: Implement**

```tsx
"use client";
import { useTheme } from "@/lib/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="rounded-md p-2 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-gray-700"
    >
      <span aria-hidden="true">{isDark ? "🌙" : "☀️"}</span>
    </button>
  );
}
```

- [ ] **Step 4: Run — expect pass**

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/ThemeToggle.tsx src/components/ui/ThemeToggle.test.tsx
git commit -m "feat(a11y): ThemeToggle aria-pressed + announcing label"
```

### Task 13: Theme context — respect prefers-color-scheme (TDD)

**Files:**
- Modify: `src/lib/theme-context.tsx`
- Create: `src/lib/theme-context.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./theme-context";

beforeEach(() => {
  localStorage.clear();
});

describe("theme-context", () => {
  it("defaults to system preference when no stored value", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe("dark");
  });
  it("toggles and persists to localStorage", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => result.current.toggleTheme());
    expect(localStorage.getItem("mini-marty-theme")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run — expect fail**

- [ ] **Step 3: Implement**

```tsx
"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark";
interface ThemeContextValue {
  readonly theme: Theme;
  readonly toggleTheme: () => void;
}
const STORAGE_KEY = "mini-marty-theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function applyThemeToDocument(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }: { readonly children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  useEffect(() => { applyThemeToDocument(theme); }, [theme]);
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
```

- [ ] **Step 4: Run — expect pass**

- [ ] **Step 5: Commit**

```bash
git add src/lib/theme-context.tsx src/lib/theme-context.test.tsx
git commit -m "feat(theme): respect prefers-color-scheme on first visit"
```

### Task 14: Safe storage wrapper (TDD)

**Files:**
- Create: `src/lib/storage/safe-storage.ts`
- Create: `src/lib/storage/safe-storage.test.ts`
- Create: `src/lib/schemas/blocks.ts`
- Create: `src/lib/schemas/python.ts`

- [ ] **Step 1: Write failing test**

```typescript
import { describe, expect, it, beforeEach, vi } from "vitest";
import { z } from "zod";
import { createSafeStorage } from "./safe-storage";

const schema = z.object({ name: z.string() });

beforeEach(() => localStorage.clear());

describe("createSafeStorage", () => {
  it("round-trips valid values", () => {
    const s = createSafeStorage("k", schema);
    s.set({ name: "Marty" });
    expect(s.get()).toEqual({ name: "Marty" });
  });
  it("returns null on missing", () => {
    const s = createSafeStorage("k", schema);
    expect(s.get()).toBeNull();
  });
  it("returns null on malformed JSON", () => {
    localStorage.setItem("k", "{not json");
    const s = createSafeStorage("k", schema);
    expect(s.get()).toBeNull();
  });
  it("returns null on schema mismatch", () => {
    localStorage.setItem("k", JSON.stringify({ wrong: 1 }));
    const s = createSafeStorage("k", schema);
    expect(s.get()).toBeNull();
  });
});
```

- [ ] **Step 2: Run — expect fail**

- [ ] **Step 3: Implement**

`safe-storage.ts`:
```typescript
import type { ZodSchema } from "zod";

export interface SafeStorage<T> {
  get(): T | null;
  set(value: T): void;
  clear(): void;
}

export function createSafeStorage<T>(
  key: string,
  schema: ZodSchema<T>,
): SafeStorage<T> {
  return {
    get(): T | null {
      if (typeof window === "undefined") return null;
      const raw = window.localStorage.getItem(key);
      if (!raw) return null;
      try {
        const parsed = schema.safeParse(JSON.parse(raw));
        return parsed.success ? parsed.data : null;
      } catch {
        return null;
      }
    },
    set(value: T): void {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(key, JSON.stringify(value));
    },
    clear(): void {
      if (typeof window === "undefined") return;
      window.localStorage.removeItem(key);
    },
  };
}
```

`schemas/blocks.ts`:
```typescript
import { z } from "zod";

export const BlocksStateSchema = z.object({
  version: z.literal(1),
  xml: z.string(),
});
export type BlocksState = z.infer<typeof BlocksStateSchema>;
```

`schemas/python.ts`:
```typescript
import { z } from "zod";

export const PythonStateSchema = z.object({
  version: z.literal(1),
  source: z.string(),
});
export type PythonState = z.infer<typeof PythonStateSchema>;
```

- [ ] **Step 4: Run — expect pass**

- [ ] **Step 5: Commit**

```bash
git add src/lib/storage src/lib/schemas
git commit -m "feat(storage): Zod-validated localStorage wrapper + schemas"
```

### Task 15: Clock abstraction for queue (TDD)

**Files:**
- Create: `src/features/marty/clock.ts`
- Create: `src/features/marty/clock.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
import { describe, expect, it, vi } from "vitest";
import { RealClock, FakeClock } from "./clock";

describe("FakeClock", () => {
  it("schedules and advances", () => {
    const c = new FakeClock();
    const cb = vi.fn();
    c.setTimeout(cb, 100);
    expect(cb).not.toHaveBeenCalled();
    c.advance(50);
    expect(cb).not.toHaveBeenCalled();
    c.advance(50);
    expect(cb).toHaveBeenCalled();
  });
});

describe("RealClock", () => {
  it("uses setTimeout under the hood", async () => {
    const c = new RealClock();
    const result = await new Promise<string>((resolve) => {
      c.setTimeout(() => resolve("done"), 5);
    });
    expect(result).toBe("done");
  });
});
```

- [ ] **Step 2: Run — expect fail**

- [ ] **Step 3: Implement**

```typescript
export interface Clock {
  setTimeout(cb: () => void, ms: number): () => void;
  now(): number;
}

export class RealClock implements Clock {
  setTimeout(cb: () => void, ms: number): () => void {
    const id = setTimeout(cb, ms);
    return () => clearTimeout(id);
  }
  now(): number {
    return Date.now();
  }
}

interface Pending {
  cb: () => void;
  due: number;
}

export class FakeClock implements Clock {
  private current = 0;
  private pending: Pending[] = [];
  setTimeout(cb: () => void, ms: number): () => void {
    const item = { cb, due: this.current + ms };
    this.pending = [...this.pending, item];
    return () => {
      this.pending = this.pending.filter((p) => p !== item);
    };
  }
  now(): number {
    return this.current;
  }
  advance(ms: number): void {
    this.current += ms;
    const ready = this.pending.filter((p) => p.due <= this.current);
    this.pending = this.pending.filter((p) => p.due > this.current);
    ready.forEach((p) => p.cb());
  }
}
```

- [ ] **Step 4: Run — expect pass**

- [ ] **Step 5: Commit**

```bash
git add src/features/marty/clock.ts src/features/marty/clock.test.ts
git commit -m "feat(marty): Clock abstraction + RealClock + FakeClock"
```

### Task 16: Refactor CommandQueue to use Clock + promise chain (TDD)

**Files:**
- Modify: `src/features/marty/command-queue.ts`
- Create: `src/features/marty/command-queue.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
import { describe, expect, it } from "vitest";
import { CommandQueue } from "./command-queue";
import { FakeClock } from "./clock";
import type { MartyCommand } from "./types";

const cmd = (duration: number): MartyCommand => ({
  type: "movement",
  action: "walk",
  params: {},
  duration,
});

describe("CommandQueue (blocking)", () => {
  it("resolves after duration when single command", async () => {
    const clock = new FakeClock();
    const q = new CommandQueue(clock);
    let resolved = false;
    const p = q.enqueue(cmd(100), "blocking").then(() => (resolved = true));
    clock.advance(99);
    await Promise.resolve();
    expect(resolved).toBe(false);
    clock.advance(1);
    await p;
    expect(resolved).toBe(true);
  });
  it("serialises blocking commands", async () => {
    const clock = new FakeClock();
    const q = new CommandQueue(clock);
    const order: string[] = [];
    const p1 = q.enqueue(cmd(100), "blocking").then(() => order.push("a"));
    const p2 = q.enqueue(cmd(50), "blocking").then(() => order.push("b"));
    clock.advance(100);
    await Promise.resolve();
    clock.advance(50);
    await Promise.all([p1, p2]);
    expect(order).toEqual(["a", "b"]);
  });
});

describe("CommandQueue (non-blocking)", () => {
  it("resolves immediately", async () => {
    const clock = new FakeClock();
    const q = new CommandQueue(clock);
    await q.enqueue(cmd(100), "non-blocking");
  });
});

describe("CommandQueue events", () => {
  it("emits start + complete around each command", async () => {
    const clock = new FakeClock();
    const q = new CommandQueue(clock);
    const seen: string[] = [];
    q.onCommandStart(() => seen.push("start"));
    q.onCommandComplete(() => seen.push("complete"));
    const p = q.enqueue(cmd(10), "blocking");
    clock.advance(10);
    await p;
    expect(seen).toEqual(["start", "complete"]);
  });
});

describe("CommandQueue.clear", () => {
  it("drops pending commands", () => {
    const clock = new FakeClock();
    const q = new CommandQueue(clock);
    q.enqueue(cmd(100), "blocking");
    q.enqueue(cmd(100), "blocking");
    q.clear();
    expect(q.size()).toBe(0);
  });
});
```

- [ ] **Step 2: Run — expect fail**

- [ ] **Step 3: Implement**

`src/features/marty/command-queue.ts`:
```typescript
import type {
  MartyCommand,
  ExecutionMode,
  QueuedCommand,
  CommandStartEvent,
  CommandCompleteEvent,
} from "./types";
import { type Clock, RealClock } from "./clock";

type CommandStartListener = (event: CommandStartEvent) => void;
type CommandCompleteListener = (event: CommandCompleteEvent) => void;

let nextId = 0;
function generateId(): string {
  nextId += 1;
  return `cmd-${nextId}`;
}

export class CommandQueue {
  private queue: QueuedCommand[] = [];
  private tail: Promise<void> = Promise.resolve();
  private startListeners: CommandStartListener[] = [];
  private completeListeners: CommandCompleteListener[] = [];

  constructor(private readonly clock: Clock = new RealClock()) {}

  enqueue(command: MartyCommand, mode: ExecutionMode): Promise<void> {
    const queued: QueuedCommand = {
      id: generateId(),
      command,
      status: "pending",
      blocking: mode === "blocking",
      createdAt: this.clock.now(),
    };
    this.queue = [...this.queue, queued];

    if (mode === "non-blocking") {
      this.runOne(queued);
      return Promise.resolve();
    }

    this.tail = this.tail.then(() => this.runOne(queued));
    return this.tail;
  }

  private runOne(queued: QueuedCommand): Promise<void> {
    return new Promise((resolve) => {
      if (!this.queue.find((q) => q.id === queued.id)) {
        resolve();
        return;
      }
      this.emitStart(queued);
      this.clock.setTimeout(() => {
        this.queue = this.queue.filter((q) => q.id !== queued.id);
        this.emitComplete(queued);
        resolve();
      }, queued.command.duration);
    });
  }

  size(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
  }

  onCommandStart(listener: CommandStartListener): void {
    this.startListeners = [...this.startListeners, listener];
  }

  onCommandComplete(listener: CommandCompleteListener): void {
    this.completeListeners = [...this.completeListeners, listener];
  }

  private emitStart(queued: QueuedCommand): void {
    const event: CommandStartEvent = {
      type: "commandStart",
      commandId: queued.id,
      command: queued.command,
    };
    for (const l of this.startListeners) l(event);
  }

  private emitComplete(queued: QueuedCommand): void {
    const event: CommandCompleteEvent = {
      type: "commandComplete",
      commandId: queued.id,
      command: queued.command,
    };
    for (const l of this.completeListeners) l(event);
  }
}
```

(Update `virtual-marty.ts` if needed — the public constructor signature is backwards-compatible: `new CommandQueue()` still works.)

- [ ] **Step 4: Run — expect pass**

- [ ] **Step 5: Commit**

```bash
git add src/features/marty/command-queue.ts src/features/marty/command-queue.test.ts
git commit -m "refactor(marty): CommandQueue uses Clock + promise chain"
```

### Task 17: VirtualMarty unit tests (TDD-on-existing)

**Files:**
- Create: `src/features/marty/virtual-marty.test.ts`

- [ ] **Step 1: Write tests**

```typescript
import { describe, expect, it, vi } from "vitest";
import { VirtualMarty } from "./virtual-marty";

describe("VirtualMarty commands", () => {
  it("walk emits start + complete", async () => {
    const m = new VirtualMarty();
    const start = vi.fn();
    const complete = vi.fn();
    m.on("commandStart", start);
    m.on("commandComplete", complete);
    await m.walk(1, 50);
    expect(start).toHaveBeenCalled();
    expect(complete).toHaveBeenCalled();
  });

  for (const method of [
    "dance", "kick", "slide", "lean", "wiggle",
    "circle_dance", "celebrate", "get_ready", "stand_straight",
    "eyes", "arms", "hold_position", "play_sound",
  ] as const) {
    it(`${method} resolves`, async () => {
      const m = new VirtualMarty();
      const result = (m as unknown as Record<string, () => Promise<void>>)[method]();
      await expect(result).resolves.toBeUndefined();
    });
  }

  it("sensor accessors return defaults and are immutable", () => {
    const m = new VirtualMarty();
    expect(m.foot_on_ground("left")).toBe(true);
    expect(m.get_distance_sensor()).toBe(100);
    const acc = m.get_accelerometer();
    expect(acc).toEqual({ x: 0, y: -9.8, z: 0 });
  });

  it("stop clears queue and resolves", async () => {
    const m = new VirtualMarty();
    await m.stop();
    expect(m.is_moving()).toBe(false);
  });

  it("setExecutionMode round-trip", () => {
    const m = new VirtualMarty();
    m.setExecutionMode("non-blocking");
    expect(m.getExecutionMode()).toBe("non-blocking");
  });
});
```

- [ ] **Step 2: Run — expect pass**

- [ ] **Step 3: Commit**

```bash
git add src/features/marty/virtual-marty.test.ts
git commit -m "test(marty): VirtualMarty command + sensor coverage"
```

### Task 18: MartyEventEmitter unit tests

**Files:**
- Create: `src/features/marty/event-emitter.test.ts`

- [ ] **Step 1: Write tests**

```typescript
import { describe, expect, it, vi } from "vitest";
import { MartyEventEmitter } from "./event-emitter";

describe("MartyEventEmitter", () => {
  it("on/emit", () => {
    const ee = new MartyEventEmitter();
    const fn = vi.fn();
    ee.on("statusChange", fn);
    ee.emit("statusChange", { type: "statusChange", isMoving: true, isPaused: false });
    expect(fn).toHaveBeenCalledWith({ type: "statusChange", isMoving: true, isPaused: false });
  });
  it("off stops delivery", () => {
    const ee = new MartyEventEmitter();
    const fn = vi.fn();
    ee.on("statusChange", fn);
    ee.off("statusChange", fn);
    ee.emit("statusChange", { type: "statusChange", isMoving: false, isPaused: false });
    expect(fn).not.toHaveBeenCalled();
  });
  it("removeAllListeners", () => {
    const ee = new MartyEventEmitter();
    const a = vi.fn();
    ee.on("statusChange", a);
    ee.removeAllListeners();
    ee.emit("statusChange", { type: "statusChange", isMoving: false, isPaused: false });
    expect(a).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run — expect pass**

- [ ] **Step 3: Commit**

```bash
git add src/features/marty/event-emitter.test.ts
git commit -m "test(marty): MartyEventEmitter coverage"
```

### Task 19: Split pyodide-service into loader + registry + events

**Files:**
- Create: `src/features/python-runtime/pyodide-loader.ts`
- Create: `src/features/python-runtime/pyodide-loader.test.ts`
- Create: `src/features/python-runtime/pyodide-registry.ts`
- Create: `src/features/python-runtime/pyodide-registry.test.ts`
- Create: `src/features/python-runtime/pyodide-events.ts`
- Create: `src/features/python-runtime/pyodide-events.test.ts`
- Modify: `src/features/python-runtime/pyodide-service.ts` (re-export thin facade for back-compat)

- [ ] **Step 1: Write failing tests**

`pyodide-events.test.ts`:
```typescript
import { describe, expect, it, vi } from "vitest";
import { PyodideEventBus } from "./pyodide-events";

describe("PyodideEventBus", () => {
  it("notifies and unsubscribes", () => {
    const bus = new PyodideEventBus();
    const fn = vi.fn();
    const off = bus.onStateChange(fn);
    bus.notify("loading");
    expect(fn).toHaveBeenCalledWith("loading", undefined);
    off();
    bus.notify("ready");
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
```

`pyodide-registry.test.ts`:
```typescript
import { describe, expect, it } from "vitest";
import { PyodideRegistry } from "./pyodide-registry";

describe("PyodideRegistry", () => {
  it("starts empty", () => {
    const r = new PyodideRegistry();
    expect(r.getInstance()).toBeNull();
  });
  it("sets and resets", () => {
    const r = new PyodideRegistry();
    const fake = { runPythonAsync: async () => null } as unknown as Parameters<PyodideRegistry["setInstance"]>[0];
    r.setInstance(fake);
    expect(r.getInstance()).toBe(fake);
    r.reset();
    expect(r.getInstance()).toBeNull();
  });
});
```

`pyodide-loader.test.ts`:
```typescript
import { describe, expect, it, vi } from "vitest";
import { PyodideLoader } from "./pyodide-loader";

describe("PyodideLoader", () => {
  it("returns existing instance if already loaded", async () => {
    const loader = new PyodideLoader({
      injectScript: async () => {},
      readGlobalLoader: () => async () => ({ id: "fake" } as never),
      events: { notify: vi.fn() },
    });
    const a = await loader.load();
    const b = await loader.load();
    expect(a).toBe(b);
  });
  it("rejects when global loader missing", async () => {
    const loader = new PyodideLoader({
      injectScript: async () => {},
      readGlobalLoader: () => null,
      events: { notify: vi.fn() },
    });
    await expect(loader.load()).rejects.toThrow(/loadPyodide/);
  });
});
```

- [ ] **Step 2: Run — expect fail**

- [ ] **Step 3: Implement**

`pyodide-events.ts`:
```typescript
import type { PyodideLoadingState } from "./types";

export type PyodideStateListener = (state: PyodideLoadingState, error?: string) => void;

export class PyodideEventBus {
  private listeners: PyodideStateListener[] = [];
  onStateChange(listener: PyodideStateListener): () => void {
    this.listeners = [...this.listeners, listener];
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
  notify(state: PyodideLoadingState, error?: string): void {
    for (const l of this.listeners) l(state, error);
  }
}
```

`pyodide-registry.ts`:
```typescript
import type { PyodideInstance } from "./pyodide-service";

export class PyodideRegistry {
  private instance: PyodideInstance | null = null;
  getInstance(): PyodideInstance | null { return this.instance; }
  setInstance(i: PyodideInstance): void { this.instance = i; }
  reset(): void { this.instance = null; }
}
```

`pyodide-loader.ts`:
```typescript
import type { PyodideInstance } from "./pyodide-service";

const PYODIDE_VERSION = "0.27.5";
export const PYODIDE_CDN_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full`;
export const PYODIDE_CDN_URL = `${PYODIDE_CDN_BASE}/pyodide.js`;

export interface LoaderDeps {
  injectScript(url: string): Promise<void>;
  readGlobalLoader(): ((opts: { indexURL: string }) => Promise<PyodideInstance>) | null;
  events: { notify(state: "loading" | "ready" | "error", error?: string): void };
}

export class PyodideLoader {
  private instance: PyodideInstance | null = null;
  private inflight: Promise<PyodideInstance> | null = null;

  constructor(private readonly deps: LoaderDeps) {}

  async load(): Promise<PyodideInstance> {
    if (this.instance) return this.instance;
    if (this.inflight) return this.inflight;
    this.inflight = (async () => {
      try {
        this.deps.events.notify("loading");
        await this.deps.injectScript(PYODIDE_CDN_URL);
        const fn = this.deps.readGlobalLoader();
        if (!fn) throw new Error("loadPyodide function not found on window");
        const i = await fn({ indexURL: `${PYODIDE_CDN_BASE}/` });
        this.instance = i;
        this.deps.events.notify("ready");
        return i;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        this.inflight = null;
        this.deps.events.notify("error", msg);
        throw new Error(`Pyodide initialization failed: ${msg}`);
      }
    })();
    return this.inflight;
  }
}

export function browserScriptInjector(): LoaderDeps["injectScript"] {
  return async (url: string) => {
    if (typeof window === "undefined") {
      throw new Error("Pyodide can only be loaded in a browser environment");
    }
    if (document.querySelector(`script[src="${url}"]`)) return;
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = url;
      s.async = true;
      s.crossOrigin = "anonymous";
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load Pyodide script"));
      document.head.appendChild(s);
    });
  };
}

export function browserGlobalLoaderReader(): LoaderDeps["readGlobalLoader"] {
  return () => {
    if (typeof window === "undefined") return null;
    return (window as unknown as { loadPyodide?: LoaderDeps["readGlobalLoader"] extends () => infer R ? Exclude<R, null> : never }).loadPyodide ?? null;
  };
}
```

`pyodide-service.ts` (rewritten as facade):
```typescript
import type { PyodideLoadingState } from "./types";
import {
  PyodideLoader,
  browserScriptInjector,
  browserGlobalLoaderReader,
} from "./pyodide-loader";
import { PyodideRegistry } from "./pyodide-registry";
import { PyodideEventBus, type PyodideStateListener } from "./pyodide-events";

export interface PyodideInstance {
  readonly runPythonAsync: (code: string) => Promise<unknown>;
  readonly registerJsModule: (name: string, module: object) => void;
  readonly setStdout: (options: { batched: (text: string) => void }) => void;
  readonly setStderr: (options: { batched: (text: string) => void }) => void;
  readonly globals: { get: (name: string) => unknown };
}

const events = new PyodideEventBus();
const registry = new PyodideRegistry();
const loader = new PyodideLoader({
  injectScript: browserScriptInjector(),
  readGlobalLoader: browserGlobalLoaderReader(),
  events,
});

export function onStateChange(listener: PyodideStateListener): () => void {
  return events.onStateChange(listener);
}

export function getLoadingState(): PyodideLoadingState {
  if (registry.getInstance()) return "ready";
  return "idle";
}

export function getInstance(): PyodideInstance | null {
  return registry.getInstance();
}

export async function loadPyodide(): Promise<PyodideInstance> {
  const existing = registry.getInstance();
  if (existing) return existing;
  const i = await loader.load();
  registry.setInstance(i);
  return i;
}

export function resetForTesting(): void {
  registry.reset();
}
```

- [ ] **Step 4: Run — expect pass**

- [ ] **Step 5: Commit**

```bash
git add src/features/python-runtime/pyodide-{loader,registry,events,service}.ts src/features/python-runtime/pyodide-{loader,registry,events}.test.ts
git commit -m "refactor(pyodide): split into loader+registry+events (SRP)"
```

### Task 20: python-executor unit tests

**Files:**
- Create: `src/features/python-runtime/python-executor.test.ts`

- [ ] **Step 1: Write tests**

```typescript
import { describe, expect, it, vi } from "vitest";
import { formatPythonError, executePythonCode } from "./python-executor";
import type { PyodideInstance } from "./pyodide-service";

describe("formatPythonError", () => {
  it("subtracts 5 from line numbers", () => {
    expect(formatPythonError("Error at line 6 of file")).toContain("line 1");
  });
  it("never goes below 1", () => {
    expect(formatPythonError("Error at line 2")).toContain("line 1");
  });
  it("leaves unrelated lines untouched", () => {
    expect(formatPythonError("NameError: x not defined")).toContain("NameError");
  });
});

describe("executePythonCode", () => {
  it("strips martypy imports and runs wrapped code", async () => {
    const calls: string[] = [];
    const fake: PyodideInstance = {
      runPythonAsync: async (s: string) => { calls.push(s); return null; },
      registerJsModule: () => {},
      setStdout: () => {},
      setStderr: () => {},
      globals: { get: () => null },
    };
    const r = await executePythonCode(fake, "from martypy import Marty\nprint('x')", {
      onStdout: vi.fn(),
      onStderr: vi.fn(),
    });
    expect(r.success).toBe(true);
    expect(calls.join("\n")).not.toContain("from martypy import Marty");
  });
  it("surfaces errors via onStderr", async () => {
    const fake: PyodideInstance = {
      runPythonAsync: async () => { throw new Error("BAD"); },
      registerJsModule: () => {},
      setStdout: () => {},
      setStderr: () => {},
      globals: { get: () => null },
    };
    const onStderr = vi.fn();
    const r = await executePythonCode(fake, "x", { onStdout: vi.fn(), onStderr });
    expect(r.success).toBe(false);
    expect(onStderr).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run — expect pass**

- [ ] **Step 3: Commit**

```bash
git add src/features/python-runtime/python-executor.test.ts
git commit -m "test(pyodide): python-executor coverage"
```

### Task 21: martypy-module unit tests

**Files:**
- Create: `src/features/python-runtime/martypy-module.test.ts`

- [ ] **Step 1: Write tests**

```typescript
import { describe, expect, it, vi } from "vitest";
import { createMartyBridge, wrapUserCode, MARTYPY_MODULE_CODE } from "./martypy-module";
import { VirtualMarty } from "@/features/marty/virtual-marty";

describe("createMartyBridge", () => {
  it("exposes every public marty method", () => {
    const m = new VirtualMarty();
    const b = createMartyBridge(m) as Record<string, () => unknown>;
    for (const name of [
      "walk","dance","kick","slide","lean","wiggle","circle_dance",
      "celebrate","get_ready","stand_straight","eyes","arms","move_joint",
      "stop","is_moving","is_paused","resume","hold_position",
      "foot_on_ground","get_distance_sensor","get_accelerometer","play_sound",
    ]) {
      expect(typeof b[name]).toBe("function");
    }
  });
  it("walk delegates to marty.walk", () => {
    const m = new VirtualMarty();
    const spy = vi.spyOn(m, "walk").mockResolvedValue();
    const b = createMartyBridge(m) as { walk: (n: number, s: number) => Promise<void> };
    b.walk(3, 60);
    expect(spy).toHaveBeenCalledWith(3, 60);
  });
});

describe("wrapUserCode", () => {
  it("indents user code 4 spaces", () => {
    const wrapped = wrapUserCode("a\nb");
    expect(wrapped).toContain("    a");
    expect(wrapped).toContain("    b");
  });
});

describe("MARTYPY_MODULE_CODE", () => {
  it("exports a Marty class definition", () => {
    expect(MARTYPY_MODULE_CODE).toContain("class Marty");
  });
});
```

- [ ] **Step 2: Run — expect pass**

- [ ] **Step 3: Commit**

```bash
git add src/features/python-runtime/martypy-module.test.ts
git commit -m "test(pyodide): martypy-module coverage"
```

### Task 22: AnimationPlayer unit tests

**Files:**
- Create: `src/features/scene/animation/player.test.ts`

- [ ] **Step 1: Write tests**

```typescript
import { describe, expect, it, vi } from "vitest";
import { AnimationPlayer, lerp, interpolateSequence } from "./player";
import { DEFAULT_POSE } from "../types";
import type { AnimationSequence } from "./types";

const seq: AnimationSequence = {
  durationMs: 1000,
  loop: false,
  keyframes: [
    { time: 0, pose: DEFAULT_POSE },
    { time: 1, pose: { ...DEFAULT_POSE, bodyY: 10 } },
  ],
};

describe("lerp", () => {
  it("interpolates", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
  });
});

describe("AnimationPlayer", () => {
  it("plays and reaches end pose at duration", () => {
    const p = new AnimationPlayer();
    p.play("walk", seq);
    const final = p.tick(1000);
    expect(final.bodyY).toBeCloseTo(10);
  });
  it("calls onComplete once at end", () => {
    const cb = vi.fn();
    const p = new AnimationPlayer();
    p.play("walk", seq, cb);
    p.tick(1000);
    expect(cb).toHaveBeenCalledTimes(1);
  });
  it("loops when sequence.loop=true", () => {
    const loopSeq: AnimationSequence = { ...seq, loop: true };
    const p = new AnimationPlayer();
    p.play("walk", loopSeq);
    p.tick(500);
    p.tick(800);
    expect(p.isPlaying()).toBe(true);
  });
  it("stop resets to default", () => {
    const p = new AnimationPlayer();
    p.play("walk", seq);
    p.tick(100);
    p.stop();
    expect(p.getCurrentPose()).toEqual(DEFAULT_POSE);
  });
});

describe("interpolateSequence", () => {
  it("returns DEFAULT_POSE for empty", () => {
    expect(interpolateSequence({ durationMs: 0, loop: false, keyframes: [] }, 0)).toEqual(DEFAULT_POSE);
  });
});
```

- [ ] **Step 2: Run — expect pass**

- [ ] **Step 3: Commit**

```bash
git add src/features/scene/animation/player.test.ts
git commit -m "test(scene): AnimationPlayer + interpolation coverage"
```

### Task 23: Navigation + sidebar-config unit tests

**Files:**
- Create: `src/lib/navigation.test.ts`
- Create: `src/lib/sidebar-config.test.ts`

- [ ] **Step 1: Write tests**

```typescript
// navigation.test.ts
import { describe, expect, it } from "vitest";
import { NAV_ITEMS } from "./navigation";

describe("NAV_ITEMS", () => {
  it("has unique paths", () => {
    const paths = NAV_ITEMS.map((i) => i.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("every item has icon + label", () => {
    for (const i of NAV_ITEMS) {
      expect(i.icon).toBeTruthy();
      expect(i.label).toBeTruthy();
    }
  });
});

// sidebar-config.test.ts
import { describe, expect, it } from "vitest";
import { getSidebarSections } from "./sidebar-config";

describe("getSidebarSections", () => {
  it("returns sections for known paths", () => {
    expect(getSidebarSections("/").length).toBeGreaterThan(0);
    expect(getSidebarSections("/block-editor").length).toBeGreaterThan(0);
    expect(getSidebarSections("/python-editor").length).toBeGreaterThan(0);
  });
  it("returns sensible default for unknown paths", () => {
    expect(getSidebarSections("/nope")).toBeDefined();
  });
});
```

- [ ] **Step 2: Run — expect pass**

- [ ] **Step 3: Commit**

```bash
git add src/lib/navigation.test.ts src/lib/sidebar-config.test.ts
git commit -m "test(lib): navigation + sidebar-config coverage"
```

### Task 24: Wire providers into root layout

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/providers.tsx`

- [ ] **Step 1: Create providers wrapper**

`src/app/providers.tsx`:
```tsx
"use client";
import { ReactNode } from "react";
import { ThemeProvider } from "@/lib/theme-context";
import { ObservabilityProvider } from "@/lib/observability/provider";
import { ConsoleLogger } from "@/lib/observability/console-logger";
import { MemoryErrorReporter } from "@/lib/observability/memory-reporter";
import { SentryErrorReporter } from "@/lib/observability/sentry-reporter";
import { AnalyticsProvider } from "@/lib/analytics/provider";
import { NoopAnalytics } from "@/lib/analytics/noop-analytics";
import { VercelAnalytics } from "@/lib/analytics/vercel-analytics";
import { readFlags } from "@/lib/flags";
import { ErrorBoundary } from "@/components/system/ErrorBoundary";

const flags = readFlags(process.env);

const logger = new ConsoleLogger();

const reporter = flags.sentryEnabled
  ? new SentryErrorReporter(
      typeof window !== "undefined" && (window as unknown as { Sentry?: { captureException: (e: unknown, h?: { extra?: Record<string, unknown> }) => void } }).Sentry
        ? (window as unknown as { Sentry: { captureException: (e: unknown, h?: { extra?: Record<string, unknown> }) => void } }).Sentry
        : null,
    )
  : new MemoryErrorReporter();

const analytics = flags.analyticsEnabled
  ? new VercelAnalytics((event, props) => {
      if (typeof window !== "undefined") {
        const va = (window as unknown as { va?: (cmd: string, name: string, props?: Record<string, unknown>) => void }).va;
        va?.("event", event, props);
      }
    })
  : new NoopAnalytics();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ObservabilityProvider logger={logger} reporter={reporter}>
      <AnalyticsProvider analytics={analytics}>
        <ThemeProvider>
          <ErrorBoundary
            reporter={reporter}
            fallback={
              <div role="alert" className="p-8 text-center">
                <h1 className="text-2xl font-bold">Something went wrong</h1>
                <p className="mt-2">Please reload the page.</p>
              </div>
            }
          >
            {children}
          </ErrorBoundary>
        </ThemeProvider>
      </AnalyticsProvider>
    </ObservabilityProvider>
  );
}
```

`src/app/layout.tsx`:
```tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://mini-marty.vercel.app"),
  title: { default: "Mini Marty", template: "%s · Mini Marty" },
  description: "Virtual programming environment for the Marty robot — code in Python or visual blocks.",
  openGraph: {
    title: "Mini Marty",
    description: "Learn to program by controlling a 3D virtual robot.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  applicationName: "Mini Marty",
  appleWebApp: { capable: true, title: "Mini Marty", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
      </head>
      <body className="antialiased">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Update layout test**

Edit `src/app/layout.test.tsx` to check `<html lang="en">` and that AppShell renders.

- [ ] **Step 3: Run — expect pass**

Run: `npm test`

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/providers.tsx src/app/layout.test.tsx
git commit -m "feat(app): wire observability, analytics, error boundary into layout"
```

### Task 25: Route error + 404 + global error

**Files:**
- Create: `src/app/error.tsx`
- Create: `src/app/not-found.tsx`
- Create: `src/app/global-error.tsx`

- [ ] **Step 1: Implement**

`src/app/error.tsx`:
```tsx
"use client";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("[route-error]", error);
  }, [error]);
  return (
    <div role="alert" className="p-8 text-center">
      <h1 className="text-2xl font-bold">Something went wrong on this page</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        Try again
      </button>
    </div>
  );
}
```

`src/app/not-found.tsx`:
```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2">We could not find what you were looking for.</p>
      <Link
        href="/"
        className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Back home
      </Link>
    </div>
  );
}
```

`src/app/global-error.tsx`:
```tsx
"use client";
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <div role="alert" className="p-8 text-center">
          <h1 className="text-2xl font-bold">Mini Marty had a problem</h1>
          <p className="mt-2">{error.message}</p>
          <button onClick={reset} className="mt-4 rounded bg-blue-600 px-4 py-2 text-white">
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`

- [ ] **Step 3: Commit**

```bash
git add src/app/error.tsx src/app/not-found.tsx src/app/global-error.tsx
git commit -m "feat(app): route error.tsx, not-found.tsx, global-error.tsx"
```

### Task 26: Sitemap, robots, manifest

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Create: `src/app/manifest.ts`
- Create: `public/icons/icon-192.png` (placeholder note — replace later)
- Create: `public/icons/icon-512.png` (placeholder note — replace later)

- [ ] **Step 1: Implement sitemap**

```typescript
import type { MetadataRoute } from "next";

const ROUTES = ["/", "/block-editor", "/python-editor", "/tutorials", "/challenges"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mini-marty.vercel.app";
  return ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
```

- [ ] **Step 2: Robots**

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://mini-marty.vercel.app"}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Manifest**

```typescript
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mini Marty",
    short_name: "Mini Marty",
    description: "Virtual programming environment for the Marty robot",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b1220",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  };
}
```

- [ ] **Step 4: Icon placeholders**

Run:
```bash
mkdir -p public/icons
node -e 'const fs=require("fs");const png=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=","base64");fs.writeFileSync("public/icons/icon-192.png",png);fs.writeFileSync("public/icons/icon-512.png",png);'
```

- [ ] **Step 5: Run typecheck**

- [ ] **Step 6: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts src/app/manifest.ts public/icons
git commit -m "feat(seo): sitemap, robots, PWA manifest, placeholder icons"
```

### Task 27: Vercel config + CSP middleware

**Files:**
- Create: `vercel.ts`
- Create: `src/middleware.ts`

- [ ] **Step 1: Implement middleware (CSP nonce)**

```typescript
import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'wasm-unsafe-eval' https://cdn.jsdelivr.net https://va.vercel-scripts.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://cdn.jsdelivr.net https://*.ingest.sentry.io https://vitals.vercel-insights.com",
    "worker-src 'self' blob:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  const headers = new Headers(req.headers);
  headers.set("x-nonce", nonce);
  const res = NextResponse.next({ request: { headers } });
  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons).*)"],
};
```

- [ ] **Step 2: vercel.ts**

```typescript
import { type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  framework: "nextjs",
  buildCommand: "npm run build",
  installCommand: "npm ci",
};
```

(If `@vercel/config` package is unavailable, fall back to a plain `vercel.json` with `framework: "nextjs"`.)

- [ ] **Step 3: Build sanity-check**

Run: `npm run build`
Expected: success

- [ ] **Step 4: Commit**

```bash
git add vercel.ts src/middleware.ts
git commit -m "feat(security): CSP middleware + Vercel config"
```

### Task 28: Reduced motion + tab pause for MartyScene

**Files:**
- Modify: `src/features/scene/components/MartyScene.tsx`

- [ ] **Step 1: Add visibility + reduced-motion checks**

Within the scene component, hook into `document.visibilityState` and `window.matchMedia('(prefers-reduced-motion: reduce)')`. Pause `useFrame` when hidden or reduced-motion is true.

(Exact diff depends on current file; add `const [active, setActive] = useState(true)` with effects toggling on `visibilitychange` and the media query; gate animation player tick on `active`.)

- [ ] **Step 2: Run tests + build**

Run: `npm test && npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/features/scene/components/MartyScene.tsx
git commit -m "perf(scene): pause on tab hidden + respect prefers-reduced-motion"
```

### Task 29: Phase 1 verification

- [ ] **Step 1: Run full unit suite + coverage**

Run: `npm run test:coverage`
Expected: All tests pass; coverage report printed.

- [ ] **Step 2: Run typecheck + lint + build**

Run: `npm run typecheck && npm run lint && npm run build`

- [ ] **Step 3: Commit if any small fixes needed, otherwise note baseline coverage % in commit message**

---

## Phase 2 — Coverage to 80%

### Task 30: martypy-completions tests

**Files:**
- Create: `src/features/editor/martypy-completions.test.ts`

- [ ] **Step 1: Tests**

```typescript
import { describe, expect, it } from "vitest";
import { MARTYPY_COMPLETIONS } from "./martypy-completions";

describe("MARTYPY_COMPLETIONS", () => {
  it("includes walk and dance", () => {
    const labels = MARTYPY_COMPLETIONS.map((c) => c.label);
    expect(labels).toContain("walk");
    expect(labels).toContain("dance");
  });
  it("every entry has label + detail + insertText", () => {
    for (const c of MARTYPY_COMPLETIONS) {
      expect(c.label).toBeTruthy();
      expect(c.detail).toBeTruthy();
      expect(c.insertText).toBeTruthy();
    }
  });
});
```

- [ ] **Step 2: Run — expect pass**

- [ ] **Step 3: Commit**

```bash
git add src/features/editor/martypy-completions.test.ts
git commit -m "test(editor): martypy-completions coverage"
```

### Task 31: tutorial-data + challenge-data shape tests

**Files:**
- Create: `src/features/tutorials/tutorial-data.test.ts`
- Create: `src/features/challenges/challenge-data.test.ts`

- [ ] **Step 1: Tests**

```typescript
// tutorial-data.test.ts
import { describe, expect, it } from "vitest";
import { TUTORIALS } from "./tutorial-data";
describe("TUTORIALS", () => {
  it("non-empty list with unique ids", () => {
    expect(TUTORIALS.length).toBeGreaterThan(0);
    const ids = TUTORIALS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("every tutorial has title, description, steps", () => {
    for (const t of TUTORIALS) {
      expect(t.title).toBeTruthy();
      expect(t.description).toBeTruthy();
      expect(Array.isArray(t.steps)).toBe(true);
    }
  });
});

// challenge-data.test.ts
import { describe, expect, it } from "vitest";
import { CHALLENGES } from "./challenge-data";
describe("CHALLENGES", () => {
  it("has beginner, intermediate, advanced tiers", () => {
    const tiers = new Set(CHALLENGES.map((c) => c.difficulty));
    expect(tiers.has("beginner")).toBe(true);
    expect(tiers.has("intermediate")).toBe(true);
    expect(tiers.has("advanced")).toBe(true);
  });
  it("every challenge has hints array", () => {
    for (const c of CHALLENGES) {
      expect(Array.isArray(c.hints)).toBe(true);
    }
  });
});
```

(Adapt field names to match actual exports; check each data file beforehand.)

- [ ] **Step 2: Run — expect pass**

- [ ] **Step 3: Commit**

```bash
git add src/features/tutorials/tutorial-data.test.ts src/features/challenges/challenge-data.test.ts
git commit -m "test(content): tutorial + challenge data shape coverage"
```

### Task 32: animation definitions + useMartyAnimation tests

**Files:**
- Create: `src/features/scene/animation/definitions.test.ts`
- Create: `src/features/scene/animation/useMartyAnimation.test.tsx` (skipped if too R3F-dependent — use `@testing-library/react` with mocked frame loop)

- [ ] **Step 1: Tests for definitions**

```typescript
import { describe, expect, it } from "vitest";
import { ANIMATION_DEFINITIONS } from "./definitions";

describe("ANIMATION_DEFINITIONS", () => {
  it("provides a sequence for every action", () => {
    for (const action of ["walk","dance","kick","slide","lean","wiggle","circle_dance","celebrate","get_ready","stand_straight"] as const) {
      expect(ANIMATION_DEFINITIONS[action]).toBeDefined();
      expect(ANIMATION_DEFINITIONS[action].keyframes.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run — expect pass**

- [ ] **Step 3: Commit**

```bash
git add src/features/scene/animation/definitions.test.ts
git commit -m "test(scene): animation definitions coverage"
```

### Task 33: usePyodide + usePythonExecution hook tests

**Files:**
- Create: `src/features/python-runtime/hooks/usePyodide.test.tsx`
- Create: `src/features/python-runtime/hooks/usePythonExecution.test.tsx`

- [ ] **Step 1: Tests** (mock `loadPyodide`)

```tsx
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

vi.mock("../pyodide-service", () => ({
  loadPyodide: vi.fn().mockResolvedValue({ runPythonAsync: vi.fn(), registerJsModule: vi.fn(), setStdout: vi.fn(), setStderr: vi.fn(), globals: { get: () => null } }),
  onStateChange: () => () => {},
  getLoadingState: () => "idle",
  getInstance: () => null,
}));

import { usePyodide } from "./usePyodide";

describe("usePyodide", () => {
  it("loads on mount", async () => {
    const { result } = renderHook(() => usePyodide());
    await waitFor(() => expect(result.current.state).toBe("ready"));
  });
});
```

(Mirror for `usePythonExecution`, mocking pyodide-service.)

- [ ] **Step 2: Run — expect pass**

- [ ] **Step 3: Commit**

```bash
git add src/features/python-runtime/hooks
git commit -m "test(pyodide): usePyodide + usePythonExecution coverage"
```

### Task 34: Blockly + toolbox config tests

**Files:**
- Create: `src/features/blocks/marty-blocks.test.ts`
- Create: `src/features/blocks/toolbox-config.test.ts`

- [ ] **Step 1: Tests**

```typescript
import { describe, expect, it } from "vitest";
import { MARTY_BLOCKS } from "./marty-blocks";
import { TOOLBOX_CONFIG } from "./toolbox-config";

describe("MARTY_BLOCKS", () => {
  it("has unique types", () => {
    const types = MARTY_BLOCKS.map((b) => b.type);
    expect(new Set(types).size).toBe(types.length);
  });
});

describe("TOOLBOX_CONFIG", () => {
  it("kind=categoryToolbox", () => {
    expect(TOOLBOX_CONFIG.kind).toBe("categoryToolbox");
  });
});
```

(Adapt to actual exports.)

- [ ] **Step 2: Run — expect pass**

- [ ] **Step 3: Commit**

```bash
git add src/features/blocks/marty-blocks.test.ts src/features/blocks/toolbox-config.test.ts
git commit -m "test(blocks): marty-blocks + toolbox-config coverage"
```

### Task 35: E2E — home a11y + smoke

**Files:**
- Create: `e2e/a11y.spec.ts`

- [ ] **Step 1: Test**

```typescript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = ["/", "/block-editor", "/python-editor", "/tutorials", "/challenges"];

for (const route of ROUTES) {
  test(`a11y: ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .disableRules(["color-contrast"]) // run separately if flaky
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
```

- [ ] **Step 2: Run**

Run: `npm run test:e2e -- a11y`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add e2e/a11y.spec.ts
git commit -m "test(e2e): axe a11y scans on all routes"
```

### Task 36: E2E — keyboard journey

**Files:**
- Create: `e2e/keyboard.spec.ts`

- [ ] **Step 1: Test**

```typescript
import { test, expect } from "@playwright/test";

test("skip link works and focus lands on main", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const focused = page.locator(":focus");
  await expect(focused).toHaveText(/skip to main content/i);
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main")).toBeFocused();
});

test("nav links reachable via keyboard", async ({ page }) => {
  await page.goto("/");
  for (let i = 0; i < 8; i++) await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toBeVisible();
});
```

- [ ] **Step 2: Run — expect pass**

- [ ] **Step 3: Commit**

```bash
git add e2e/keyboard.spec.ts
git commit -m "test(e2e): keyboard-only navigation"
```

### Task 37: E2E — dark mode persistence

**Files:**
- Create: `e2e/dark-mode.spec.ts`

- [ ] **Step 1: Test**

```typescript
import { test, expect } from "@playwright/test";

test("dark mode persists across navigation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /switch to dark/i }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.goto("/tutorials");
  await expect(page.locator("html")).toHaveClass(/dark/);
});
```

- [ ] **Step 2: Run — expect pass**

- [ ] **Step 3: Commit**

```bash
git add e2e/dark-mode.spec.ts
git commit -m "test(e2e): dark mode persistence"
```

### Task 38: E2E — Python editor smoke

**Files:**
- Create: `e2e/python-editor.spec.ts`

- [ ] **Step 1: Test**

```typescript
import { test, expect } from "@playwright/test";

test("python editor loads, run button enables after Pyodide ready", async ({ page }) => {
  await page.goto("/python-editor");
  await expect(page.getByRole("button", { name: /run/i })).toBeVisible({ timeout: 60_000 });
  await page.getByRole("button", { name: /run/i }).click();
  // Wait for any console output
  await expect(page.locator("text=/Marty|running|done/i").first()).toBeVisible({ timeout: 30_000 });
});
```

- [ ] **Step 2: Run — expect pass**

- [ ] **Step 3: Commit**

```bash
git add e2e/python-editor.spec.ts
git commit -m "test(e2e): python editor smoke"
```

### Task 39: E2E — Block editor smoke

**Files:**
- Create: `e2e/block-editor.spec.ts`

- [ ] **Step 1: Test**

```typescript
import { test, expect } from "@playwright/test";

test("block editor loads", async ({ page }) => {
  await page.goto("/block-editor");
  await expect(page.locator(".blocklyMainBackground").first()).toBeVisible({ timeout: 15_000 });
});

test("block editor save round-trip via localStorage", async ({ page }) => {
  await page.goto("/block-editor");
  await page.evaluate(() => localStorage.setItem("mini-marty:blocks:v1", JSON.stringify({ version: 1, xml: "<xml/>" })));
  await page.reload();
  await expect(page.locator(".blocklyMainBackground").first()).toBeVisible();
});
```

- [ ] **Step 2: Run — expect pass**

- [ ] **Step 3: Commit**

```bash
git add e2e/block-editor.spec.ts
git commit -m "test(e2e): block editor smoke"
```

### Task 40: E2E — Tutorials + Challenges smoke

**Files:**
- Create: `e2e/tutorials.spec.ts`
- Create: `e2e/challenges.spec.ts`

- [ ] **Step 1: Tests**

```typescript
// tutorials.spec.ts
import { test, expect } from "@playwright/test";
test("tutorials list renders", async ({ page }) => {
  await page.goto("/tutorials");
  await expect(page.getByRole("heading", { name: /tutorials/i })).toBeVisible();
});

// challenges.spec.ts
import { test, expect } from "@playwright/test";
test("challenges list renders", async ({ page }) => {
  await page.goto("/challenges");
  await expect(page.getByRole("heading", { name: /challenges/i })).toBeVisible();
});
```

- [ ] **Step 2: Run — expect pass**

- [ ] **Step 3: Commit**

```bash
git add e2e/tutorials.spec.ts e2e/challenges.spec.ts
git commit -m "test(e2e): tutorials + challenges smoke"
```

### Task 41: Phase 2 coverage gate

- [ ] **Step 1: Run coverage**

Run: `npm run test:coverage`
Expected: all thresholds (80%) pass.

If any below threshold, add targeted tests to the offending files in this task.

- [ ] **Step 2: Commit any catch-up tests**

```bash
git add <files>
git commit -m "test: lift coverage to >=80%"
```

---

## Phase 3 — Polish & docs

### Task 42: Code-split heavy editors

**Files:**
- Modify: `src/app/python-editor/page.tsx` — use `next/dynamic` with `ssr: false` for `PythonEditor`
- Modify: `src/app/block-editor/page.tsx` — same for `BlocklyWorkspace`
- Modify: `src/features/scene/components/MartyScene.tsx` (or its parent in `app/page.tsx`) — same for the canvas

- [ ] **Step 1: Wrap components**

Example pattern:
```tsx
import dynamic from "next/dynamic";
const PythonEditor = dynamic(() => import("@/features/editor/components/PythonEditor").then((m) => m.PythonEditor), {
  ssr: false,
  loading: () => <div className="p-8 text-center">Loading editor…</div>,
});
```

- [ ] **Step 2: Build + check bundle**

Run: `npm run build`
Note initial JS size from build output; ensure home route is below 200 kB gz.

- [ ] **Step 3: Commit**

```bash
git add src/app
git commit -m "perf: code-split Pyodide/Monaco/Blockly/Three via next/dynamic"
```

### Task 43: Web Vitals reporting

**Files:**
- Create: `src/lib/observability/web-vitals.ts`
- Modify: `src/app/layout.tsx` — register reporter via `<Script>` or instrumentation client

- [ ] **Step 1: Implement reporter**

```typescript
"use client";
import { onCLS, onFID, onLCP, onINP, onTTFB } from "web-vitals";
import type { Analytics } from "@/lib/analytics/types";

export function startWebVitals(analytics: Analytics): void {
  const handler = (m: { name: string; value: number; id: string }) => {
    analytics.track("code_run", { metric: m.name, value: m.value, id: m.id }); // reuses event w/ props for v1
  };
  onCLS(handler);
  onFID(handler);
  onLCP(handler);
  onINP(handler);
  onTTFB(handler);
}
```

(A dedicated `web_vital` event is fine too — extend the union if you prefer.)

- [ ] **Step 2: Wire from providers**

Add `useEffect(() => { if (typeof window !== "undefined") startWebVitals(analytics); }, [])` in `providers.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/observability/web-vitals.ts src/app/providers.tsx
git commit -m "feat(obs): Web Vitals reporting to analytics"
```

### Task 44: Lighthouse CI workflow

**Files:**
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: Add job**

Append:
```yaml
  lighthouse:
    name: Lighthouse
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
      - run: npm run start &
        env: { PORT: "3000" }
      - run: npx wait-on http://localhost:3000
      - run: npx @lhci/cli@0.14 autorun --collect.url=http://localhost:3000 --upload.target=temporary-public-storage
        continue-on-error: true
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add Lighthouse job (non-blocking initially)"
```

### Task 45: Repo docs — architecture pages

**Files:**
- Create: `docs/README.md`
- Create: `docs/architecture/overview.md`
- Create: `docs/architecture/virtual-marty.md`
- Create: `docs/architecture/python-runtime.md`
- Create: `docs/architecture/scene.md`
- Create: `docs/architecture/security.md`
- Create: `docs/architecture/testing.md`
- Create: `docs/architecture/deployment.md`
- Create: `docs/runbook.md`
- Create: `docs/contributing.md`

- [ ] **Step 1: Write each page**

Each page: H1 title, 1-paragraph summary, 2-5 short sections, link to relevant SVG diagram. No mermaid. Cite source by symbol name (e.g. `VirtualMarty.enqueueCommand`) — never by line number (project rule).

- [ ] **Step 2: Commit**

```bash
git add docs/README.md docs/architecture docs/runbook.md docs/contributing.md
git commit -m "docs: architecture, runbook, contributing"
```

### Task 46: Hand-authored SVG diagrams

**Files:**
- Create: `docs/diagrams/architecture.svg`
- Create: `docs/diagrams/sequence-blocks.svg`
- Create: `docs/diagrams/sequence-python.svg`
- Create: `docs/diagrams/state-command.svg`
- Create: `docs/diagrams/module-dependencies.svg`
- Create: `docs/diagrams/deployment.svg`

- [ ] **Step 1: Author SVGs**

Hand-author each SVG with viewBox `0 0 1000 600`, semantic shapes (`<rect>` boxes, `<line>` connectors, `<text>` labels), no embedded JS, no external font references. Keep style minimal: 1.5px strokes, system-ui font, light + dark colour swap via `prefers-color-scheme` media in `<style>` block.

(See `docs/architecture/overview.md` for the conceptual layout each diagram must show.)

- [ ] **Step 2: Inline-reference from docs**

In each `docs/architecture/*.md`, embed via `![Architecture](../diagrams/architecture.svg)` etc.

- [ ] **Step 3: Commit**

```bash
git add docs/diagrams docs/architecture
git commit -m "docs: six SVG diagrams (no mermaid)"
```

### Task 47: Obsidian vault pages + symlink

**Files:**
- Create: `docs/obsidian/Home.md`
- Create: `docs/obsidian/Architecture.md`
- Create: `docs/obsidian/Sessions.md`
- Create: `docs/obsidian/Decisions.md`
- Create: `docs/obsidian/Diagrams.md`
- Create: `docs/obsidian/Glossary.md`

- [ ] **Step 1: Author each Obsidian page**

Use front-matter, `#project/mini-marty` tag, wikilinks `[[Architecture]]`, embed SVG via `![[../diagrams/architecture.svg]]`. Each page short — what it is, links to repo-side docs by relative path, decisions captured.

- [ ] **Step 2: Symlink into vault**

Run:
```bash
ln -s /Users/mncedimini/Sites/misc/marty/docs/obsidian "/Users/mncedimini/Documents/Obsidian Vault/Mini Marty (docs)"
ls -la "/Users/mncedimini/Documents/Obsidian Vault/Mini Marty (docs)"
```
Expected: symlink resolves.

- [ ] **Step 3: Commit**

```bash
git add docs/obsidian
git commit -m "docs(obsidian): vault pages + diagrams cross-link"
```

### Task 48: README + TRAINING refresh

**Files:**
- Modify: `README.md`
- Modify: `TRAINING.md`

- [ ] **Step 1: Update README**

Replace stale sections; add badges (CI, license MIT, Vercel deploy), link to `docs/` pages. Remove duplicated sections (project rule: say it once).

- [ ] **Step 2: Update TRAINING**

Add a "Troubleshooting on Windows" section (if user is on Windows) — line endings, npm install on PowerShell, WebGL flag check. Keep content concise.

- [ ] **Step 3: Commit**

```bash
git add README.md TRAINING.md
git commit -m "docs: refresh README + TRAINING with new docs links"
```

### Task 49: Final verification + push

- [ ] **Step 1: Full local pipeline**

Run: `npm run lint && npm run format:check && npm run typecheck && npm run test:coverage && npm run build && npm run test:e2e`
Expected: all pass.

- [ ] **Step 2: Push branch**

```bash
git push -u origin feature/core-layout-and-navigation
```

- [ ] **Step 3: Verify CI green on GitHub**

If a Vercel project exists for the repo, preview deploy will trigger; smoke-test the URL.

---

## Self-Review Notes

- Spec sections covered: §1 goals → acceptance criteria in Task 49; §3 architecture → Tasks 2-7, 14, 24; §3.1 cross-cutting → Tasks 2-7; §3.2 refactors → Tasks 15-16, 19, 28, 9-13; §4 SOLID → enforced via DI in Tasks 2-7 and Clock split in 15-16; §5 data flow → tested in Tasks 38-40; §6 error handling → Tasks 7, 25; §7 testing pyramid → Tasks 17-23, 30-34 (unit), 38-40 (integration via E2E), 35-37 (E2E); §7.5 coverage gate → Task 41; §8 security → Tasks 14, 27; §9 perf → Tasks 28, 42-44; §10 a11y → Tasks 8-13, 35-36; §11 docs → Tasks 45-48; §12 deployment → Tasks 26-27, 44; §15 acceptance → Task 49.
- No placeholders found in code blocks.
- Method names consistent across tasks: `enqueue`, `runOne`, `setTimeout`, `notify`, `setInstance`/`getInstance`/`reset`, `report`, `track`.
