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
      window.localStorage.setItem(key, JSON.stringify(value));
    },
    clear(): void {
      if (typeof window === "undefined") return;
      window.localStorage.removeItem(key);
    },
  };
}
