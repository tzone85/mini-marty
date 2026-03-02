import type {
  MartyCommand,
  ExecutionMode,
  QueuedCommand,
  CommandStartEvent,
  CommandCompleteEvent,
} from "./types";

type CommandStartListener = (event: CommandStartEvent) => void;
type CommandCompleteListener = (event: CommandCompleteEvent) => void;

let nextId = 0;

function generateId(): string {
  nextId += 1;
  return `cmd-${nextId}`;
}

export class CommandQueue {
  private queue: QueuedCommand[] = [];
  private processing = false;
  private startListeners: CommandStartListener[] = [];
  private completeListeners: CommandCompleteListener[] = [];

  enqueue(command: MartyCommand, mode: ExecutionMode): Promise<void> {
    const id = generateId();
    const queued: QueuedCommand = {
      id,
      command,
      status: "pending",
      blocking: mode === "blocking",
      createdAt: Date.now(),
    };
    this.queue = [...this.queue, queued];

    if (mode === "non-blocking") {
      this.emitStart(queued);
      this.scheduleComplete(queued);
      return Promise.resolve();
    }

    const promise = new Promise<void>((resolve) => {
      this.processQueue(resolve);
    });

    return promise;
  }

  size(): number {
    return this.queue.length;
  }

  isProcessing(): boolean {
    return this.processing;
  }

  clear(): void {
    this.queue = [];
  }

  onCommandStart(listener: CommandStartListener): void {
    this.startListeners = [...this.startListeners, listener];
  }

  onCommandComplete(listener: CommandCompleteListener): void {
    this.completeListeners = [...this.completeListeners, listener];
  }

  private processQueue(resolve: () => void): void {
    if (this.processing) {
      const checkInterval = setInterval(() => {
        if (!this.processing) {
          clearInterval(checkInterval);
          this.processQueue(resolve);
        }
      }, 10);
      return;
    }

    const current = this.queue[0];
    if (!current) {
      resolve();
      return;
    }

    this.processing = true;
    this.emitStart(current);

    setTimeout(() => {
      this.queue = this.queue.filter((q) => q.id !== current.id);
      this.processing = false;
      this.emitComplete(current);
      resolve();
    }, current.command.duration);
  }

  private scheduleComplete(queued: QueuedCommand): void {
    setTimeout(() => {
      this.queue = this.queue.filter((q) => q.id !== queued.id);
      this.emitComplete(queued);
    }, queued.command.duration);
  }

  private emitStart(queued: QueuedCommand): void {
    const event: CommandStartEvent = {
      type: "commandStart",
      commandId: queued.id,
      command: queued.command,
    };
    for (const listener of this.startListeners) {
      listener(event);
    }
  }

  private emitComplete(queued: QueuedCommand): void {
    const event: CommandCompleteEvent = {
      type: "commandComplete",
      commandId: queued.id,
      command: queued.command,
    };
    for (const listener of this.completeListeners) {
      listener(event);
    }
  }
}
