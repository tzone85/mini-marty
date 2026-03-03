import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/theme-context", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/layout/AppShell", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-shell">{children}</div>
  ),
}));

import RootLayout from "./layout";

describe("RootLayout", () => {
  it("renders children inside AppShell", () => {
    render(
      <RootLayout>
        <p>Test content</p>
      </RootLayout>,
      { container: document.documentElement },
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
    expect(screen.getByTestId("app-shell")).toBeInTheDocument();
  });
});
