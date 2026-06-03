/**
 * One-time migration helpers for moving raw localStorage values
 * into JSON-encoded shapes consumed by `createSafeStorage`.
 *
 * Each helper is idempotent: if the old key is absent it returns
 * immediately; once the new key is written and the old key removed,
 * subsequent calls become no-ops.
 */

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * Wraps a raw string value at `oldKey` into the JSON-encoded form
 * expected at `newKey`.
 *
 * If a value already exists at `newKey` the old key is removed and the
 * new value is left untouched (new shape wins).
 */
export function migrateRawString(
  storage: StorageLike,
  oldKey: string,
  newKey: string,
  wrap: (raw: string) => unknown,
): void {
  const raw = storage.getItem(oldKey);
  if (raw === null) return;

  // Don't overwrite an existing migrated value.
  if (storage.getItem(newKey) === null) {
    try {
      storage.setItem(newKey, JSON.stringify(wrap(raw)));
    } catch {
      // If wrap throws or storage rejects, drop the migration; the user
      // will simply lose the cached value, which is acceptable.
    }
  }

  if (oldKey !== newKey) {
    storage.removeItem(oldKey);
  }
}

/**
 * In-place upgrade for keys that share name between old and new shapes
 * (e.g. theme).
 *
 * If the value at `key` is already valid JSON for `looksValid`, leave
 * it alone. Otherwise re-encode the raw string via `wrap` and write it
 * back.
 */
export function migrateInPlaceIfRaw(
  storage: StorageLike,
  key: string,
  looksValid: (parsed: unknown) => boolean,
  wrap: (raw: string) => unknown,
): void {
  const raw = storage.getItem(key);
  if (raw === null) return;
  try {
    const parsed = JSON.parse(raw);
    if (looksValid(parsed)) return;
  } catch {
    // Not JSON — treat as raw legacy value below.
  }
  try {
    storage.setItem(key, JSON.stringify(wrap(raw)));
  } catch {
    // ignore
  }
}
