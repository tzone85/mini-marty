import type { PyodideLoadingState } from "./types";
import {
  PyodideLoader,
  browserScriptInjector,
  browserGlobalLoaderReader,
} from "./pyodide-loader";
import { PyodideEventBus, type PyodideStateListener } from "./pyodide-events";

export interface PyodideInstance {
  readonly runPythonAsync: (code: string) => Promise<unknown>;
  readonly registerJsModule: (name: string, module: object) => void;
  readonly setStdout: (options: { batched: (text: string) => void }) => void;
  readonly setStderr: (options: { batched: (text: string) => void }) => void;
  readonly globals: { get: (name: string) => unknown };
}

const events = new PyodideEventBus();
const loader = new PyodideLoader({
  injectScript: browserScriptInjector(),
  readGlobalLoader: browserGlobalLoaderReader(),
  events,
});

export function onStateChange(listener: PyodideStateListener): () => void {
  return events.onStateChange(listener);
}

export function getLoadingState(): PyodideLoadingState {
  if (loader.getInstance()) return "ready";
  if (loader.isLoading()) return "loading";
  return "idle";
}

export function getInstance(): PyodideInstance | null {
  return loader.getInstance();
}

export async function loadPyodide(): Promise<PyodideInstance> {
  return loader.load();
}

export function resetForTesting(): void {
  loader.reset();
}
