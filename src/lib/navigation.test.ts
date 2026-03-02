import { describe, it, expect } from "vitest";
import { NAV_ITEMS, getActiveNavItem } from "./navigation";

describe("NAV_ITEMS", () => {
  it("has entries for all main pages", () => {
    const paths = NAV_ITEMS.map((item) => item.path);
    expect(paths).toContain("/");
    expect(paths).toContain("/block-editor");
    expect(paths).toContain("/python-editor");
    expect(paths).toContain("/tutorials");
    expect(paths).toContain("/challenges");
  });

  it("each item has a label and path", () => {
    for (const item of NAV_ITEMS) {
      expect(item.label).toBeTruthy();
      expect(item.path).toBeTruthy();
    }
  });

  it("has exactly 5 navigation items", () => {
    expect(NAV_ITEMS).toHaveLength(5);
  });
});

describe("getActiveNavItem", () => {
  it("returns home item for root path", () => {
    const active = getActiveNavItem("/");
    expect(active?.path).toBe("/");
  });

  it("returns block editor item for /block-editor", () => {
    const active = getActiveNavItem("/block-editor");
    expect(active?.path).toBe("/block-editor");
  });

  it("returns python editor item for /python-editor", () => {
    const active = getActiveNavItem("/python-editor");
    expect(active?.path).toBe("/python-editor");
  });

  it("returns tutorials item for /tutorials", () => {
    const active = getActiveNavItem("/tutorials");
    expect(active?.path).toBe("/tutorials");
  });

  it("returns challenges item for /challenges", () => {
    const active = getActiveNavItem("/challenges");
    expect(active?.path).toBe("/challenges");
  });

  it("returns undefined for unknown path", () => {
    const active = getActiveNavItem("/unknown");
    expect(active).toBeUndefined();
  });
});
