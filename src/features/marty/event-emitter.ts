import type { MartyEventMap, MartyEventType } from "./types";

type Listener<T extends MartyEventType> = (event: MartyEventMap[T]) => void;

export class MartyEventEmitter {
  private readonly listeners: {
    [K in MartyEventType]?: Array<Listener<K>>;
  } = {};

  on<T extends MartyEventType>(type: T, listener: Listener<T>): void {
    const list = (this.listeners[type] ?? []) as Array<Listener<T>>;
    this.listeners[type] = [...list, listener] as typeof this.listeners[T];
  }

  off<T extends MartyEventType>(type: T, listener: Listener<T>): void {
    const list = this.listeners[type] as Array<Listener<T>> | undefined;
    if (!list) return;
    this.listeners[type] = list.filter(
      (l) => l !== listener,
    ) as typeof this.listeners[T];
  }

  emit<T extends MartyEventType>(type: T, event: MartyEventMap[T]): void {
    const list = this.listeners[type] as Array<Listener<T>> | undefined;
    if (!list) return;
    for (const listener of list) {
      listener(event);
    }
  }

  removeAllListeners(): void {
    for (const key of Object.keys(this.listeners) as MartyEventType[]) {
      delete this.listeners[key];
    }
  }
}
