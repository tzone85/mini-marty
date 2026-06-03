import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AttributionFooter } from "./AttributionFooter";

describe("AttributionFooter", () => {
  it("links to codemarty.com", () => {
    render(<AttributionFooter />);
    const link = screen.getByRole("link", { name: /codemarty\.com/i });
    expect(link).toHaveAttribute("href", "https://codemarty.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("links to robotical.io", () => {
    render(<AttributionFooter />);
    const link = screen.getByRole("link", { name: /robotical\.io/i });
    expect(link).toHaveAttribute("href", "https://robotical.io");
  });

  it("includes the trademark + not-affiliated notice", () => {
    render(<AttributionFooter />);
    expect(screen.getByTestId("attribution-footer")).toHaveTextContent(
      /Marty.*trademark of Robotical Ltd/i,
    );
    expect(screen.getByTestId("attribution-footer")).toHaveTextContent(
      /Not affiliated/i,
    );
  });
});
