import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "./Sidebar";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("Sidebar", () => {
  it("has aria-label and focus rings on interactive items", () => {
    render(<Sidebar />);
    const aside = screen.getByRole("complementary");
    expect(aside).toHaveAttribute(
      "aria-label",
      expect.stringMatching(/secondary|context/i),
    );
  });
});
