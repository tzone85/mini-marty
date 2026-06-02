import { describe, expect, it } from "vitest";
import { readFlags } from "./flags";

describe("flags", () => {
  it("defaults all off when env empty", () => {
    expect(readFlags({})).toEqual({
      analyticsEnabled: false,
      sentryEnabled: false,
      pwaEnabled: false,
    });
  });
  it("reads NEXT_PUBLIC_* flags", () => {
    expect(
      readFlags({
        NEXT_PUBLIC_ANALYTICS: "vercel",
        NEXT_PUBLIC_SENTRY_DSN: "https://x",
        NEXT_PUBLIC_PWA: "1",
      }),
    ).toEqual({
      analyticsEnabled: true,
      sentryEnabled: true,
      pwaEnabled: true,
    });
  });
});
