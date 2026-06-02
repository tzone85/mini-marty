import type { PyodideLoadingState } from "./types";

export type PyodideStateListener = (
  state: PyodideLoadingState,
  error?: string,
) => void;

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
