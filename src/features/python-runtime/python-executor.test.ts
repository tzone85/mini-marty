import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  formatPythonError,
  registerMartyModule,
  executePythonCode,
  resetEntryCounter,
} from "./python-executor";
import type { ExecutorCallbacks } from "./python-executor";
import type { PyodideInstance } from "./pyodide-service";
import { VirtualMarty } from "@/features/marty/virtual-marty";

function createMockPyodide(): PyodideInstance {
  return {
    runPythonAsync: vi.fn().mockResolvedValue(undefined),
    registerJsModule: vi.fn(),
    setStdout: vi.fn(),
    setStderr: vi.fn(),
    globals: { get: vi.fn() },
  };
}

function createMockCallbacks(): ExecutorCallbacks {
  return {
    onStdout: vi.fn(),
    onStderr: vi.fn(),
  };
}

describe("python-executor", () => {
  beforeEach(() => {
    resetEntryCounter();
  });

  describe("formatPythonError", () => {
    it("adjusts line numbers by subtracting wrapper offset", () => {
      const error = 'File "<exec>", line 10\n    SyntaxError: invalid syntax';
      const formatted = formatPythonError(error);
      expect(formatted).toContain("line 5");
    });

    it("handles errors without line numbers", () => {
      const error = "NameError: name 'foo' is not defined";
      const formatted = formatPythonError(error);
      expect(formatted).toBe(error);
    });

    it("does not produce negative line numbers", () => {
      const error = 'File "<exec>", line 2\n    error';
      const formatted = formatPythonError(error);
      expect(formatted).toContain("line 1");
    });

    it("handles multiline errors with multiple line references", () => {
      const error = 'File "<exec>", line 8\n  File "<exec>", line 12\nError';
      const formatted = formatPythonError(error);
      expect(formatted).toContain("line 3");
      expect(formatted).toContain("line 7");
    });

    it("preserves non-line-number content", () => {
      const error = "TypeError: expected str, got int";
      const formatted = formatPythonError(error);
      expect(formatted).toBe("TypeError: expected str, got int");
    });
  });

  describe("registerMartyModule", () => {
    it("registers js module in Pyodide", async () => {
      const pyodide = createMockPyodide();
      const marty = new VirtualMarty();

      await registerMartyModule(pyodide, marty);

      expect(pyodide.registerJsModule).toHaveBeenCalledWith(
        "pyodide_js",
        expect.objectContaining({ _marty_bridge: expect.any(Object) }),
      );
    });

    it("runs the martypy module code", async () => {
      const pyodide = createMockPyodide();
      const marty = new VirtualMarty();

      await registerMartyModule(pyodide, marty);

      expect(pyodide.runPythonAsync).toHaveBeenCalledWith(
        expect.stringContaining("class Marty:"),
      );
    });
  });

  describe("executePythonCode", () => {
    it("sets stdout and stderr handlers", async () => {
      const pyodide = createMockPyodide();
      const callbacks = createMockCallbacks();

      await executePythonCode(pyodide, "pass", callbacks);

      expect(pyodide.setStdout).toHaveBeenCalledWith({
        batched: expect.any(Function),
      });
      expect(pyodide.setStderr).toHaveBeenCalledWith({
        batched: expect.any(Function),
      });
    });

    it("returns success on successful execution", async () => {
      const pyodide = createMockPyodide();
      const callbacks = createMockCallbacks();

      const result = await executePythonCode(pyodide, "pass", callbacks);

      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
    });

    it("strips martypy import lines from user code", async () => {
      const pyodide = createMockPyodide();
      const callbacks = createMockCallbacks();

      await executePythonCode(
        pyodide,
        "from martypy import Marty\nmy_marty = Marty('virtual')",
        callbacks,
      );

      const executedCode = (pyodide.runPythonAsync as ReturnType<typeof vi.fn>)
        .mock.calls[0][0] as string;
      const userCodeSection = executedCode.split("__run_user_code():")[1];
      expect(userCodeSection).not.toContain("from martypy import Marty");
    });

    it("preserves non-import code", async () => {
      const pyodide = createMockPyodide();
      const callbacks = createMockCallbacks();

      await executePythonCode(
        pyodide,
        'from martypy import Marty\nprint("hello")',
        callbacks,
      );

      const executedCode = (pyodide.runPythonAsync as ReturnType<typeof vi.fn>)
        .mock.calls[0][0] as string;
      expect(executedCode).toContain('print("hello")');
    });

    it("returns failure on Python error", async () => {
      const pyodide = createMockPyodide();
      (pyodide.runPythonAsync as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error("SyntaxError: invalid syntax"),
      );
      const callbacks = createMockCallbacks();

      const result = await executePythonCode(
        pyodide,
        "invalid python!!!",
        callbacks,
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("SyntaxError");
    });

    it("sends error to stderr callback", async () => {
      const pyodide = createMockPyodide();
      (pyodide.runPythonAsync as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error("NameError: name 'x' is not defined"),
      );
      const callbacks = createMockCallbacks();

      await executePythonCode(pyodide, "print(x)", callbacks);

      expect(callbacks.onStderr).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "stderr",
          text: expect.stringContaining("NameError"),
        }),
      );
    });

    it("captures stdout via batched handler", async () => {
      const pyodide = createMockPyodide();
      let capturedStdout: ((text: string) => void) | null = null;
      (pyodide.setStdout as ReturnType<typeof vi.fn>).mockImplementation(
        (opts: { batched: (text: string) => void }) => {
          capturedStdout = opts.batched;
        },
      );

      const callbacks = createMockCallbacks();
      const execPromise = executePythonCode(pyodide, "pass", callbacks);

      if (capturedStdout) {
        (capturedStdout as (text: string) => void)("Hello from Python");
      }

      await execPromise;

      expect(callbacks.onStdout).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "stdout",
          text: "Hello from Python",
        }),
      );
    });

    it("handles non-Error thrown values", async () => {
      const pyodide = createMockPyodide();
      (pyodide.runPythonAsync as ReturnType<typeof vi.fn>).mockRejectedValue(
        "raw string error",
      );
      const callbacks = createMockCallbacks();

      const result = await executePythonCode(pyodide, "pass", callbacks);

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it("also strips 'import martypy' lines", async () => {
      const pyodide = createMockPyodide();
      const callbacks = createMockCallbacks();

      await executePythonCode(
        pyodide,
        'import martypy\nprint("test")',
        callbacks,
      );

      const executedCode = (pyodide.runPythonAsync as ReturnType<typeof vi.fn>)
        .mock.calls[0][0] as string;
      const userSection = executedCode.split("__run_user_code():")[1];
      expect(userSection).not.toContain("import martypy");
    });
  });
});
