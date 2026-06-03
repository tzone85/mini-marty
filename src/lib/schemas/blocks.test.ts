import { describe, expect, it } from "vitest";
import { BlocksStateSchema } from "./blocks";

describe("BlocksStateSchema", () => {
  it("accepts a versioned XML payload", () => {
    expect(() =>
      BlocksStateSchema.parse({ version: 1, xml: "<xml/>" }),
    ).not.toThrow();
  });

  it("rejects payloads without a v1 marker", () => {
    expect(() => BlocksStateSchema.parse({ version: 2, xml: "" })).toThrow();
  });
});
