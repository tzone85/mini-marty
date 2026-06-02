import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Providers } from "./providers";

describe("Providers", () => {
  it("renders children inside the full provider tree", () => {
    render(
      <Providers>
        <p>child content</p>
      </Providers>,
    );
    expect(screen.getByText("child content")).toBeInTheDocument();
  });
});
