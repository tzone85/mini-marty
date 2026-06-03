import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  loadPyodide,
  onStateChange,
  getLoadingState,
  getInstance,
  resetForTesting,
} from "./pyodide-service";
import type { PyodideInstance } from "./pyodide-service";

function createMockPyodide(): PyodideInstance {
  return {
    runPythonAsync: vi.fn().mockResolvedValue(undefined),
    registerJsModule: vi.fn(),
    setStdout: vi.fn(),
    setStderr: vi.fn(),
    globals: { get: vi.fn() },
  };
}

function setupScriptMock(): void {
  const origCreateElement = document.createElement.bind(document);
  vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
    const el = origCreateElement(tag);
    if (tag === "script") {
      setTimeout(() => {
        if (el.onload) {
          (el.onload as () => void)();
        }
      }, 0);
    }
    return el;
  });
}

describe("pyodide-service", () => {
  beforeEach(() => {
    resetForTesting();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    const scripts = document.querySelectorAll("script[src*='pyodide']");
    scripts.forEach((s) => s.remove());
  });

  describe("getLoadingState", () => {
    it("returns idle initially", () => {
      expect(getLoadingState()).toBe("idle");
    });
  });

  describe("getInstance", () => {
    it("returns null initially", () => {
      expect(getInstance()).toBeNull();
    });
  });

  describe("onStateChange", () => {
    it("registers and invokes a listener", async () => {
      const listener = vi.fn();
      onStateChange(listener);

      setupScriptMock();

      const mockPyodide = createMockPyodide();
      Object.defineProperty(window, "loadPyodide", {
        value: vi.fn().mockResolvedValue(mockPyodide),
        writable: true,
        configurable: true,
      });

      await loadPyodide();

      expect(listener).toHaveBeenCalledWith("loading", undefined);
      expect(listener).toHaveBeenCalledWith("ready", undefined);
    });

    it("returns an unsubscribe function", () => {
      const listener = vi.fn();
      const unsubscribe = onStateChange(listener);

      unsubscribe();

      expect(typeof unsubscribe).toBe("function");
    });
  });

  describe("loadPyodide", () => {
    it("loads and returns a Pyodide instance", async () => {
      setupScriptMock();

      const mockPyodide = createMockPyodide();
      Object.defineProperty(window, "loadPyodide", {
        value: vi.fn().mockResolvedValue(mockPyodide),
        writable: true,
        configurable: true,
      });

      const result = await loadPyodide();

      expect(result).toBe(mockPyodide);
      expect(getLoadingState()).toBe("ready");
      expect(getInstance()).toBe(mockPyodide);
    });

    it("returns cached instance on second call", async () => {
      setupScriptMock();

      const mockPyodide = createMockPyodide();
      const mockLoader = vi.fn().mockResolvedValue(mockPyodide);
      Object.defineProperty(window, "loadPyodide", {
        value: mockLoader,
        writable: true,
        configurable: true,
      });

      const first = await loadPyodide();
      const second = await loadPyodide();

      expect(first).toBe(second);
      expect(mockLoader).toHaveBeenCalledTimes(1);
    });

    it("deduplicates concurrent loads", async () => {
      setupScriptMock();

      const mockPyodide = createMockPyodide();
      Object.defineProperty(window, "loadPyodide", {
        value: vi.fn().mockResolvedValue(mockPyodide),
        writable: true,
        configurable: true,
      });

      const [first, second] = await Promise.all([loadPyodide(), loadPyodide()]);

      expect(first).toBe(second);
    });

    it("notifies error state on failure", async () => {
      setupScriptMock();

      const listener = vi.fn();
      onStateChange(listener);

      Object.defineProperty(window, "loadPyodide", {
        value: undefined,
        writable: true,
        configurable: true,
      });

      await expect(loadPyodide()).rejects.toThrow(
        "Pyodide initialization failed",
      );
      expect(listener).toHaveBeenCalledWith(
        "error",
        "loadPyodide function not found on window",
      );
    });

    it("allows retry after failure", async () => {
      setupScriptMock();

      Object.defineProperty(window, "loadPyodide", {
        value: undefined,
        writable: true,
        configurable: true,
      });

      await expect(loadPyodide()).rejects.toThrow();

      const mockPyodide = createMockPyodide();
      Object.defineProperty(window, "loadPyodide", {
        value: vi.fn().mockResolvedValue(mockPyodide),
        writable: true,
        configurable: true,
      });

      const result = await loadPyodide();
      expect(result).toBe(mockPyodide);
    });

    it("notifies loading state immediately", async () => {
      setupScriptMock();

      const listener = vi.fn();
      onStateChange(listener);

      const mockPyodide = createMockPyodide();
      Object.defineProperty(window, "loadPyodide", {
        value: vi.fn().mockResolvedValue(mockPyodide),
        writable: true,
        configurable: true,
      });

      await loadPyodide();

      const calls = (listener.mock.calls as [string, string?][]).map(
        (call) => call[0],
      );
      expect(calls[0]).toBe("loading");
    });
  });

  describe("resetForTesting", () => {
    it("resets all internal state", async () => {
      setupScriptMock();

      const mockPyodide = createMockPyodide();
      Object.defineProperty(window, "loadPyodide", {
        value: vi.fn().mockResolvedValue(mockPyodide),
        writable: true,
        configurable: true,
      });

      await loadPyodide();
      expect(getInstance()).toBe(mockPyodide);

      resetForTesting();

      expect(getInstance()).toBeNull();
      expect(getLoadingState()).toBe("idle");
    });
  });
});
