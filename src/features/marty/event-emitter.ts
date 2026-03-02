import type { MartyEventMap } from "./types";

type Listener<T> = (data: T) => void;

export class MartyEventEmitter {
  private readonly listeners = new Map<
    keyof MartyEventMap,
    Set<Listener<MartyEventMap[keyof MartyEventMap]>>
  >();

  on<K extends keyof MartyEventMap>(
    event: K,
    listener: Listener<MartyEventMap[K]>,
  ): void {
    const existing = this.listeners.get(event);
    if (existing) {
      existing.add(listener as Listener<MartyEventMap[keyof MartyEventMap]>);
    } else {
      this.listeners.set(
        event,
        new Set([listener as Listener<MartyEventMap[keyof MartyEventMap]>]),
      );
    }
  }

  off<K extends keyof MartyEventMap>(
    event: K,
    listener: Listener<MartyEventMap[K]>,
  ): void {
    const existing = this.listeners.get(event);
    if (existing) {
      existing.delete(listener as Listener<MartyEventMap[keyof MartyEventMap]>);
    }
  }

  emit<K extends keyof MartyEventMap>(event: K, data: MartyEventMap[K]): void {
    const existing = this.listeners.get(event);
    if (existing) {
      for (const listener of existing) {
        listener(data);
      }
    }
  }

  removeAllListeners(event?: keyof MartyEventMap): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}
