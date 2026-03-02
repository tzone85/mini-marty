import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BlockEditorPage from "./page";

describe("BlockEditorPage", () => {
  it("renders heading", () => {
    render(<BlockEditorPage />);
    expect(
      screen.getByRole("heading", { name: /block editor/i }),
    ).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<BlockEditorPage />);
    expect(screen.getByText(/drag-and-drop blocks/i)).toBeInTheDocument();
  });
});
