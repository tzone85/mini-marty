import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { HelpMenu } from "./HelpMenu";

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

describe("HelpMenu", () => {
  it("renders the help link", () => {
    render(<HelpMenu />);
    expect(screen.getByTestId("help-menu-link")).toBeInTheDocument();
  });

  it("links to /docs", () => {
    render(<HelpMenu />);
    const link = screen.getByTestId("help-menu-link");
    expect(link).toHaveAttribute("href", "/docs");
  });

  it("displays a question mark", () => {
    render(<HelpMenu />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("has an accessible label", () => {
    render(<HelpMenu />);
    expect(screen.getByLabelText("Help & Documentation")).toBeInTheDocument();
  });
});
