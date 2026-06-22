import type { ZodType } from "zod";

export interface SafeStorage<T> {
  get(): T | null;
  set(value: T): void;
  clear(): void;
}

export function createSafeStorage<T>(
  key: string,
  schema: ZodType<T>,
): SafeStorage<T> {
  return {
    get(): T | null {
      if (typeof window === "undefined") return null;
      const raw = window.localStorage.getItem(key);
      if (!raw) return null;
      try {
        const parsed = schema.safeParse(JSON.parse(raw));
        return parsed.success ? parsed.data : null;
      } catch {
        return null;
      }
    },
    set(value: T): void {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Quota exceeded, private-browsing restrictions, or storage
        // disabled: persisting is best-effort, never a hard failure.
        // (Callers may run inside a React state updater where a throw
        // would break the render.)
      }
    },
    clear(): void {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Same rationale as set(): storage access can throw.
      }
    },
  };
}
