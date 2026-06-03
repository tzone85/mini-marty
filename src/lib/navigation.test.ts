import { describe, expect, it } from "vitest";
import { NAV_ITEMS, getActiveNavItem } from "./navigation";

describe("NAV_ITEMS", () => {
  it("has unique paths", () => {
    const paths = NAV_ITEMS.map((i) => i.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("every item has icon + label", () => {
    for (const i of NAV_ITEMS) {
      expect(i.icon).toBeTruthy();
      expect(i.label).toBeTruthy();
    }
  });
});

describe("getActiveNavItem", () => {
  it("returns the matching nav item", () => {
    expect(getActiveNavItem("/")?.label).toBe("Home");
  });
  it("returns undefined for unknown paths", () => {
    expect(getActiveNavItem("/nope")).toBeUndefined();
  });
});
