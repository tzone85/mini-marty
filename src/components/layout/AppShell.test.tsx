import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppShell } from "./AppShell";
import { ThemeProvider } from "@/lib/theme-context";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("AppShell", () => {
  it("renders SkipLink, header, sidebar, and main landmark with id", () => {
    render(
      <ThemeProvider>
        <AppShell>
          <div>content</div>
        </AppShell>
      </ThemeProvider>,
    );
    expect(
      screen.getByRole("link", { name: /skip to main content/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("complementary")).toBeInTheDocument();
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main");
  });
});
