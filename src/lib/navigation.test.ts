import { describe, it, expect } from "vitest";
import { NAV_ITEMS, getNavItemByPath } from "./navigation";

describe("NAV_ITEMS", () => {
  it("contains all expected routes", () => {
    const paths = NAV_ITEMS.map((item) => item.path);
    expect(paths).toEqual([
      "/",
      "/block-editor",
      "/python-editor",
      "/tutorials",
      "/challenges",
    ]);
  });

  it("each item has a label and path", () => {
    for (const item of NAV_ITEMS) {
      expect(item.label).toBeTruthy();
      expect(item.path).toBeTruthy();
    }
  });

  it("has correct labels", () => {
    const labels = NAV_ITEMS.map((item) => item.label);
    expect(labels).toEqual([
      "Home",
      "Block Editor",
      "Python Editor",
      "Tutorials",
      "Challenges",
    ]);
  });
});

describe("getNavItemByPath", () => {
  it("returns the matching nav item", () => {
    const item = getNavItemByPath("/tutorials");
    expect(item?.label).toBe("Tutorials");
  });

  it("returns undefined for unknown path", () => {
    const item = getNavItemByPath("/unknown");
    expect(item).toBeUndefined();
  });
});
