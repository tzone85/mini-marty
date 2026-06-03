import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { ObservabilityProvider } from "@/lib/observability/provider";
import { ConsoleLogger } from "@/lib/observability/console-logger";
import { MemoryErrorReporter } from "@/lib/observability/memory-reporter";

type StateListener = (state: string, err?: string) => void;

const listeners: StateListener[] = [];
let currentState: string = "idle";
let currentInstance: unknown = null;

const fakeInstance = {
  runPythonAsync: vi.fn(),
  registerJsModule: vi.fn(),
  setStdout: vi.fn(),
  setStderr: vi.fn(),
  globals: { get: () => null },
};

vi.mock("../pyodide-service", () => ({
  loadPyodide: vi.fn(async () => {
    currentInstance = fakeInstance;
    currentState = "ready";
    for (const l of listeners) l("ready");
    return fakeInstance;
  }),
  onStateChange: (l: StateListener) => {
    listeners.push(l);
    return () => {
      const idx = listeners.indexOf(l);
      if (idx >= 0) listeners.splice(idx, 1);
    };
  },
  getLoadingState: () => currentState,
  getInstance: () => currentInstance,
}));

import { usePyodide } from "./usePyodide";

let lastReporter: MemoryErrorReporter;
function wrapper({ children }: { children: ReactNode }) {
  return (
    <ObservabilityProvider logger={new ConsoleLogger()} reporter={lastReporter}>
      {children}
    </ObservabilityProvider>
  );
}

describe("usePyodide", () => {
  beforeEach(() => {
    listeners.length = 0;
    currentState = "idle";
    currentInstance = null;
    lastReporter = new MemoryErrorReporter();
    vi.clearAllMocks();
  });

  it("starts in the initial state from the service", () => {
    const { result } = renderHook(() => usePyodide(), { wrapper });
    expect(result.current.state).toBe("idle");
    expect(result.current.instance).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("transitions to ready when initialize() resolves", async () => {
    const { result } = renderHook(() => usePyodide(), { wrapper });
    await act(async () => {
      await result.current.initialize();
    });
    await waitFor(() => expect(result.current.state).toBe("ready"));
    expect(result.current.instance).toBe(fakeInstance);
  });

  it("surfaces load errors via the error field and reports them", async () => {
    const svc = await import("../pyodide-service");
    vi.mocked(svc.loadPyodide).mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(() => usePyodide(), { wrapper });
    await act(async () => {
      await result.current.initialize();
    });
    expect(result.current.error).toBe("boom");
    expect(lastReporter.entries.length).toBe(1);
    expect(lastReporter.entries[0].context).toMatchObject({
      source: "system",
    });
  });

  it("unsubscribes from state changes on unmount", () => {
    const { unmount } = renderHook(() => usePyodide(), { wrapper });
    expect(listeners.length).toBe(1);
    unmount();
    expect(listeners.length).toBe(0);
  });
});
