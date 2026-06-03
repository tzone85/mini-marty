import type { Logger, ErrorReporter, LogContext } from "./types";

class NoopLogger implements Logger {
  info(_msg: string, _ctx: LogContext = {}): void {}
  warn(_msg: string, _ctx: LogContext = {}): void {}
  error(_msg: string, _ctx: LogContext = {}): void {}
}

class NoopReporter implements ErrorReporter {
  report(_err: unknown, _ctx: LogContext = {}): void {}
}

export const noopLogger: Logger = new NoopLogger();
export const noopReporter: ErrorReporter = new NoopReporter();
