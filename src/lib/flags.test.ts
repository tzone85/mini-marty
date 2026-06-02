import { describe, expect, it } from "vitest";
import { readFlags } from "./flags";

describe("flags", () => {
  it("defaults all off when env empty", () => {
    expect(readFlags({})).toEqual({
      analyticsEnabled: false,
      sentryEnabled: false,
    });
  });
  it("reads NEXT_PUBLIC_* flags", () => {
    expect(
      readFlags({
        NEXT_PUBLIC_ANALYTICS: "vercel",
        NEXT_PUBLIC_SENTRY_DSN: "https://x",
      }),
    ).toEqual({
      analyticsEnabled: true,
      sentryEnabled: true,
    });
  });
});
