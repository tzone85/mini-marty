import { describe, expect, it, vi } from "vitest";
import { VercelAnalytics } from "./vercel-analytics";

describe("VercelAnalytics", () => {
  it("forwards to injected track fn", () => {
    const track = vi.fn();
    const a = new VercelAnalytics(track);
    a.track("tutorial_complete", { id: "hello" });
    expect(track).toHaveBeenCalledWith("tutorial_complete", { id: "hello" });
  });
});
