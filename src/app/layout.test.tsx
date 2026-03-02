import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RootLayout from "./layout";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("RootLayout", () => {
  it("renders children within the app shell", () => {
    render(
      <RootLayout>
        <p>Test content</p>
      </RootLayout>,
      { container: document.documentElement },
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("includes the header with navigation", () => {
    render(
      <RootLayout>
        <p>Test content</p>
      </RootLayout>,
      { container: document.documentElement },
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
