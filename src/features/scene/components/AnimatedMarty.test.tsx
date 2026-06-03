import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock useFrame since it requires R3F Canvas context
vi.mock("@react-three/fiber", () => ({
  useFrame: vi.fn(),
}));

vi.mock("./MartyModel", () => ({
  MartyModel: React.forwardRef(function MockMartyModel(
    _props: Record<string, unknown>,
    ref: React.Ref<unknown>,
  ) {
    React.useImperativeHandle(ref, () => ({
      applyPose: vi.fn(),
      getRootRef: () => null,
    }));
    return <div data-testid="marty-model">Marty</div>;
  }),
}));

import { AnimatedMarty } from "./AnimatedMarty";

describe("AnimatedMarty", () => {
  it("renders MartyModel", () => {
    render(<AnimatedMarty marty={null} />);
    expect(screen.getByTestId("marty-model")).toBeInTheDocument();
  });

  it("renders without marty instance", () => {
    render(<AnimatedMarty marty={null} />);
    expect(screen.getByTestId("marty-model")).toBeInTheDocument();
  });
});
