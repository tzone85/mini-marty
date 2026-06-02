import { describe, expect, it } from "vitest";
import { ThemeSchema } from "./theme";

describe("ThemeSchema", () => {
  it("accepts 'light' and 'dark'", () => {
    expect(ThemeSchema.safeParse("light").success).toBe(true);
    expect(ThemeSchema.safeParse("dark").success).toBe(true);
  });
  it("rejects other values", () => {
    expect(ThemeSchema.safeParse("blue").success).toBe(false);
    expect(ThemeSchema.safeParse(42).success).toBe(false);
    expect(ThemeSchema.safeParse(null).success).toBe(false);
  });
});
