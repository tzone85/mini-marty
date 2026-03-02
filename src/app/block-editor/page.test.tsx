import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BlockEditorPage from "./page";

describe("Block Editor page", () => {
  it("renders the heading", () => {
    render(<BlockEditorPage />);
    expect(
      screen.getByRole("heading", { name: /block editor/i }),
    ).toBeInTheDocument();
  });

  it("renders a description", () => {
    render(<BlockEditorPage />);
    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument();
  });
});
