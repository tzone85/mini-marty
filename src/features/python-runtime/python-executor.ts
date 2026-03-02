import type { PyodideInstance } from "./pyodide-service";
import type { ConsoleEntry, PythonExecutionResult } from "./types";
import { VirtualMarty } from "@/features/marty/virtual-marty";
import {
  createMartyBridge,
  MARTYPY_MODULE_CODE,
  wrapUserCode,
} from "./martypy-module";

let entryCounter = 0;

function createEntry(type: ConsoleEntry["type"], text: string): ConsoleEntry {
  entryCounter += 1;
  return {
    id: `entry-${entryCounter}`,
    type,
    text,
    timestamp: Date.now(),
  };
}

export function formatPythonError(error: string): string {
  const lines = error.split("\n");
  const formatted: string[] = [];

  for (const line of lines) {
    const lineMatch = line.match(/line (\d+)/);
    if (lineMatch) {
      const adjustedLine = Math.max(1, parseInt(lineMatch[1], 10) - 5);
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
  pyodide.setStdout({
    batched: (text: string) => {
      callbacks.onStdout(createEntry("stdout", text));
    },
  });

  pyodide.setStderr({
    batched: (text: string) => {
      callbacks.onStderr(createEntry("stderr", text));
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
    callbacks.onStderr(createEntry("stderr", formattedError));

    return { success: false, error: formattedError };
  }
}

export function resetEntryCounter(): void {
  entryCounter = 0;
}
