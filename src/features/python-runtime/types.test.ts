import { describe, it, expect } from "vitest";
import type {
  PyodideLoadingState,
  PyodideStatus,
  ConsoleEntry,
  PythonExecutionResult,
  ExecutionState,
} from "./types";

describe("Python runtime types", () => {
  describe("PyodideLoadingState", () => {
    it("supports idle state", () => {
      const state: PyodideLoadingState = "idle";
      expect(state).toBe("idle");
    });

    it("supports loading state", () => {
      const state: PyodideLoadingState = "loading";
      expect(state).toBe("loading");
    });

    it("supports ready state", () => {
      const state: PyodideLoadingState = "ready";
      expect(state).toBe("ready");
    });

    it("supports error state", () => {
      const state: PyodideLoadingState = "error";
      expect(state).toBe("error");
    });
  });

  describe("PyodideStatus", () => {
    it("creates status with state and no error", () => {
      const status: PyodideStatus = { state: "ready", error: null };
      expect(status.state).toBe("ready");
      expect(status.error).toBeNull();
    });

    it("creates status with error", () => {
      const status: PyodideStatus = {
        state: "error",
        error: "Failed to load",
      };
      expect(status.state).toBe("error");
      expect(status.error).toBe("Failed to load");
    });
  });

  describe("ConsoleEntry", () => {
    it("creates stdout entry", () => {
      const entry: ConsoleEntry = {
        id: "entry-1",
        type: "stdout",
        text: "Hello, world!",
        timestamp: 1000,
      };
      expect(entry.type).toBe("stdout");
      expect(entry.text).toBe("Hello, world!");
    });

    it("creates stderr entry", () => {
      const entry: ConsoleEntry = {
        id: "entry-2",
        type: "stderr",
        text: "Error: something went wrong",
        timestamp: 1000,
      };
      expect(entry.type).toBe("stderr");
    });

    it("creates info entry", () => {
      const entry: ConsoleEntry = {
        id: "entry-3",
        type: "info",
        text: "Execution started",
        timestamp: 1000,
      };
      expect(entry.type).toBe("info");
    });
  });

  describe("PythonExecutionResult", () => {
    it("creates successful result", () => {
      const result: PythonExecutionResult = { success: true, error: null };
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
    });

    it("creates failed result with error", () => {
      const result: PythonExecutionResult = {
        success: false,
        error: "SyntaxError at line 5",
      };
      expect(result.success).toBe(false);
      expect(result.error).toBe("SyntaxError at line 5");
    });
  });

  describe("ExecutionState", () => {
    it("creates initial execution state", () => {
      const state: ExecutionState = {
        isRunning: false,
        consoleEntries: [],
        lastError: null,
      };
      expect(state.isRunning).toBe(false);
      expect(state.consoleEntries).toHaveLength(0);
      expect(state.lastError).toBeNull();
    });

    it("creates running execution state with entries", () => {
      const entry: ConsoleEntry = {
        id: "entry-1",
        type: "stdout",
        text: "output",
        timestamp: 1000,
      };
      const state: ExecutionState = {
        isRunning: true,
        consoleEntries: [entry],
        lastError: null,
      };
      expect(state.isRunning).toBe(true);
      expect(state.consoleEntries).toHaveLength(1);
    });
  });
});
