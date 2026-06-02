import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeProvider } from "@/lib/theme-context";

describe("ThemeToggle", () => {
  it("announces current state via aria-label", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    const btn = screen.getByRole("button");
    expect(btn).toHaveAccessibleName(/switch to dark|switch to light/i);
  });
  it("toggles aria-pressed on click", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    const btn = screen.getByRole("button");
    const initial = btn.getAttribute("aria-pressed");
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-pressed")).not.toBe(initial);
  });
});
