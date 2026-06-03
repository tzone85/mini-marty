import type { PyodideInstance } from "./pyodide-service";
import type { ConsoleEntry, PythonExecutionResult } from "./types";
import { VirtualMarty } from "@/features/marty/virtual-marty";
import {
  createMartyBridge,
  MARTYPY_MODULE_CODE,
  wrapUserCode,
  EXECUTION_WRAPPER_PRELUDE_LINES,
} from "./martypy-module";

/**
 * Stateful generator for monotonic console-entry ids. One instance per
 * `executePythonCode` invocation keeps ids deterministic and avoids
 * module-level mutable state.
 */
class EntryFactory {
  private counter = 0;
  create(type: ConsoleEntry["type"], text: string): ConsoleEntry {
    this.counter += 1;
    return {
      id: `entry-${this.counter}`,
      type,
      text,
      timestamp: Date.now(),
    };
  }
}

export function formatPythonError(error: string): string {
  const lines = error.split("\n");
  const formatted: string[] = [];

  for (const line of lines) {
    const lineMatch = line.match(/line (\d+)/);
    if (lineMatch) {
      const adjustedLine = Math.max(
        1,
        parseInt(lineMatch[1], 10) - EXECUTION_WRAPPER_PRELUDE_LINES,
      );
      formatted.push(line.replace(/line \d+/, `line ${adjustedLine}`));
    } else {
      formatted.push(line);
    }
  }

  return formatted.join("\n");
}

export interface ExecutorCallbacks {
  readonly onStdout: (entry: ConsoleEntry) => void;
  readonly onStderr: (entry: ConsoleEntry) => void;
}

export async function registerMartyModule(
  pyodide: PyodideInstance,
  marty: VirtualMarty,
): Promise<void> {
  const bridge = createMartyBridge(marty);
  const jsModule = { _marty_bridge: bridge };
  pyodide.registerJsModule("pyodide_js", jsModule);

  await pyodide.runPythonAsync(MARTYPY_MODULE_CODE);
}

export async function executePythonCode(
  pyodide: PyodideInstance,
  code: string,
  callbacks: ExecutorCallbacks,
): Promise<PythonExecutionResult> {
  const entries = new EntryFactory();

  pyodide.setStdout({
    batched: (text: string) => {
      callbacks.onStdout(entries.create("stdout", text));
    },
  });

  pyodide.setStderr({
    batched: (text: string) => {
      callbacks.onStderr(entries.create("stderr", text));
    },
  });

  try {
    const strippedCode = code
      .split("\n")
      .filter((line) => !line.match(/^\s*from\s+martypy\s+import/))
      .filter((line) => !line.match(/^\s*import\s+martypy/))
      .join("\n");

    const wrappedCode = wrapUserCode(strippedCode);
    await pyodide.runPythonAsync(wrappedCode);

    return { success: true, error: null };
  } catch (err) {
    const rawMessage = err instanceof Error ? err.message : String(err);
    const formattedError = formatPythonError(rawMessage);
    callbacks.onStderr(entries.create("stderr", formattedError));

    return { success: false, error: formattedError };
  }
}
