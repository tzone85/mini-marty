import type {
  MartyCommand,
  ExecutionMode,
  QueuedCommand,
  CommandStartEvent,
  CommandCompleteEvent,
} from "./types";
import { type Clock, RealClock } from "./clock";

type CommandStartListener = (event: CommandStartEvent) => void;
type CommandCompleteListener = (event: CommandCompleteEvent) => void;

let nextId = 0;
function generateId(): string {
  nextId += 1;
  return `cmd-${nextId}`;
}

export class CommandQueue {
  private queue: QueuedCommand[] = [];
  private tail: Promise<void> = Promise.resolve();
  private startListeners: CommandStartListener[] = [];
  private completeListeners: CommandCompleteListener[] = [];

  constructor(private readonly clock: Clock = new RealClock()) {}

  enqueue(command: MartyCommand, mode: ExecutionMode): Promise<void> {
    const queued: QueuedCommand = {
      id: generateId(),
      command,
      status: "pending",
      blocking: mode === "blocking",
      createdAt: this.clock.now(),
    };
    this.queue = [...this.queue, queued];

    if (mode === "non-blocking") {
      void this.runOne(queued);
      return Promise.resolve();
    }

    this.tail = this.tail.then(() => this.runOne(queued));
    return this.tail;
  }

  private runOne(queued: QueuedCommand): Promise<void> {
    return new Promise((resolve) => {
      if (!this.queue.find((q) => q.id === queued.id)) {
        resolve();
        return;
      }
      this.emitStart(queued);
      this.clock.setTimeout(() => {
        this.queue = this.queue.filter((q) => q.id !== queued.id);
        this.emitComplete(queued);
        resolve();
      }, queued.command.duration);
    });
  }

  size(): number {
    return this.queue.length;
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

  private emitStart(queued: QueuedCommand): void {
    const event: CommandStartEvent = {
      type: "commandStart",
      commandId: queued.id,
      command: queued.command,
    };
    for (const l of this.startListeners) l(event);
  }

  private emitComplete(queued: QueuedCommand): void {
    const event: CommandCompleteEvent = {
      type: "commandComplete",
      commandId: queued.id,
      command: queued.command,
    };
    for (const l of this.completeListeners) l(event);
  }
}
