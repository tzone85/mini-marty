import type { Logger, LogContext } from "./types";

export class ConsoleLogger implements Logger {
  info(message: string, context: LogContext = {}): void {
    console.info(`[info] ${message}`, context);
  }
  warn(message: string, context: LogContext = {}): void {
    console.warn(`[warn] ${message}`, context);
  }
  error(message: string, context: LogContext = {}): void {
    console.error(`[error] ${message}`, context);
  }
}
