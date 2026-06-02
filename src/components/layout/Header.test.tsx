import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";
import { ThemeProvider } from "@/lib/theme-context";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("Header", () => {
  it("has primary nav with accessible label", () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>,
    );
    expect(
      screen.getByRole("navigation", { name: /primary/i }),
    ).toBeInTheDocument();
  });
  it("marks current page with aria-current", () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>,
    );
    const homeLinks = screen.getAllByRole("link", { name: /home/i });
    const current = homeLinks.find(
      (l) => l.getAttribute("aria-current") === "page",
    );
    expect(current).toBeDefined();
  });
});
