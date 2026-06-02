import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { MemoryErrorReporter } from "./memory-reporter";
import { ConsoleLogger } from "./console-logger";
import { ObservabilityProvider, useObservability } from "./provider";

describe("ObservabilityProvider", () => {
  it("supplies injected logger + reporter via useObservability", () => {
    const logger = new ConsoleLogger();
    const reporter = new MemoryErrorReporter();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ObservabilityProvider logger={logger} reporter={reporter}>
        {children}
      </ObservabilityProvider>
    );
    const { result } = renderHook(() => useObservability(), { wrapper });
    expect(result.current.logger).toBe(logger);
    expect(result.current.reporter).toBe(reporter);
  });

  it("throws if used outside provider", () => {
    expect(() => renderHook(() => useObservability())).toThrow(/Observability/);
  });
});
