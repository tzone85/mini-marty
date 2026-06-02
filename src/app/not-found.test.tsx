import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

describe("NotFound", () => {
  it("renders a heading and a link back home", () => {
    render(<NotFound />);
    expect(
      screen.getByRole("heading", { name: /page not found/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back home/i })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
