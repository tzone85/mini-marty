import { describe, expect, it } from "vitest";
import { getSidebarSections } from "./sidebar-config";

describe("getSidebarSections", () => {
  it("returns sections for known paths", () => {
    expect(getSidebarSections("/").length).toBeGreaterThan(0);
    expect(getSidebarSections("/block-editor").length).toBeGreaterThan(0);
    expect(getSidebarSections("/python-editor").length).toBeGreaterThan(0);
    expect(getSidebarSections("/tutorials").length).toBeGreaterThan(0);
    expect(getSidebarSections("/challenges").length).toBeGreaterThan(0);
  });
  it("returns sensible default for unknown paths", () => {
    const result = getSidebarSections("/nope");
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });
});
