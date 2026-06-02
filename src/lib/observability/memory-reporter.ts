import type { ErrorReporter, LogContext } from "./types";

export interface MemoryEntry {
  readonly error: unknown;
  readonly context: LogContext;
}

export class MemoryErrorReporter implements ErrorReporter {
  private _entries: MemoryEntry[] = [];

  get entries(): readonly MemoryEntry[] {
    return this._entries;
  }

  report(error: unknown, context: LogContext = {}): void {
    this._entries = [...this._entries, { error, context }];
  }

  clear(): void {
    this._entries = [];
  }
}
