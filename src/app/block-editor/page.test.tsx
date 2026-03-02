import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BlockEditorPage from "./page";

vi.mock("next/dynamic", () => ({
  default: () => {
    const MockComponent = () => (
      <div data-testid="blockly-workspace-mock">Blockly Mock</div>
    );
    MockComponent.displayName = "DynamicBlocklyWorkspace";
    return MockComponent;
  },
}));

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

  it("renders the Blockly workspace area", () => {
    render(<BlockEditorPage />);
    expect(screen.getByTestId("blockly-workspace-mock")).toBeInTheDocument();
  });
});
