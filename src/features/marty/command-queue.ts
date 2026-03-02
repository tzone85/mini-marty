import type { MartyCommand, CommandResult, CommandOptions } from "./types";

type ProcessCallback = (command: MartyCommand) => void;
type CompleteCallback = (result: CommandResult) => void;

interface QueueEntry {
  readonly command: MartyCommand;
  readonly options: CommandOptions;
  readonly resolve: (result: CommandResult) => void;
}

export class CommandQueue {
  private readonly queue: QueueEntry[] = [];
  private processing = false;
  private processCallback: ProcessCallback | null = null;
  private completeCallback: CompleteCallback | null = null;

  get size(): number {
    return this.queue.length;
  }

  get isProcessing(): boolean {
    return this.processing;
  }

  onProcess(callback: ProcessCallback): void {
    this.processCallback = callback;
  }

  onComplete(callback: CompleteCallback): void {
    this.completeCallback = callback;
  }

  enqueue(
    command: MartyCommand,
    options: CommandOptions,
  ): Promise<CommandResult> {
    if (options.mode === "non-blocking") {
      const entry = { command, options, resolve: () => {} };
      this.queue.push(entry);
      this.processNext();
      return Promise.resolve({
        commandId: command.id,
        success: true,
      });
    }

    return new Promise<CommandResult>((resolve) => {
      this.queue.push({ command, options, resolve });
      this.processNext();
    });
  }

  peek(): MartyCommand | undefined {
    return this.queue[0]?.command;
  }

  clear(): void {
    this.queue.length = 0;
  }

  private processNext(): void {
    if (this.processing || this.queue.length === 0) return;

    const entry = this.queue.shift();
    if (!entry) return;

    this.processing = true;
    this.processCallback?.(entry.command);

    setTimeout(() => {
      const result: CommandResult = {
        commandId: entry.command.id,
        success: true,
      };
      this.processing = false;
      this.completeCallback?.(result);
      entry.resolve(result);
      this.processNext();
    }, entry.command.duration);
  }
}
