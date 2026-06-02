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
