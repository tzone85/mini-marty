import type { ErrorReporter, LogContext } from "./types";

export interface SentryClient {
  captureException(error: unknown, hint?: { extra?: LogContext }): void;
}

export class SentryErrorReporter implements ErrorReporter {
  constructor(private readonly client: SentryClient | null) {}

  report(error: unknown, context: LogContext = {}): void {
    if (!this.client) return;
    this.client.captureException(error, { extra: context });
  }
}
