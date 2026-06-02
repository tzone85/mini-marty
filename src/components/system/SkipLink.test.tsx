import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkipLink } from "./SkipLink";

describe("SkipLink", () => {
  it("renders a link to #main with accessible label", () => {
    render(<SkipLink />);
    const link = screen.getByRole("link", {
      name: /skip to (main )?content/i,
    });
    expect(link).toHaveAttribute("href", "#main");
  });
});
