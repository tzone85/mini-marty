import { describe, expect, it } from "vitest";
import { PythonStateSchema } from "./python";

describe("PythonStateSchema", () => {
  it("accepts a versioned python source payload", () => {
    expect(() =>
      PythonStateSchema.parse({ version: 1, source: "print('hi')" }),
    ).not.toThrow();
  });

  it("rejects payloads with missing fields", () => {
    expect(() => PythonStateSchema.parse({ version: 1 })).toThrow();
  });
});
