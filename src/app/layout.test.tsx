import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import RootLayout from "./layout";

describe("RootLayout", () => {
  it("renders children", () => {
    render(
      <RootLayout>
        <p>Test content</p>
      </RootLayout>,
      { container: document.documentElement },
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });
});
