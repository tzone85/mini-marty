import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MartyModel } from "./MartyModel";
import type { MartyModelHandle } from "./MartyModel";
import { DEFAULT_POSE } from "../types";

// Mock R3F intrinsic elements so they render as HTML divs in JSDOM.
// R3F elements like <mesh>, <group>, <boxGeometry>, etc. need to become
// regular HTML elements for testing-library to work with them.
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="r3f-canvas">{children}</div>
  ),
  useFrame: vi.fn(),
}));

// Create a test wrapper that renders MartyModel with access to its ref
function renderMartyModel(props: { initialPose?: typeof DEFAULT_POSE } = {}) {
  const ref = React.createRef<MartyModelHandle>();
  const result = render(<MartyModel ref={ref} {...props} />);
  return { ref, ...result };
}

describe("MartyModel", () => {
  it("renders without crashing", () => {
    renderMartyModel();
    // The R3F elements render in JSDOM; as long as no error thrown, it works
  });

  it("exports MartyModel as a named export", () => {
    expect(MartyModel).toBeDefined();
    expect(typeof MartyModel).toBe("object"); // forwardRef returns an object
  });

  it("exposes applyPose via ref handle", () => {
    const { ref } = renderMartyModel();
    expect(ref.current).not.toBeNull();
    expect(ref.current?.applyPose).toBeTypeOf("function");
  });

  it("exposes getRootRef via ref handle", () => {
    const { ref } = renderMartyModel();
    expect(ref.current?.getRootRef).toBeTypeOf("function");
  });

  it("applyPose does not throw with default pose", () => {
    const { ref } = renderMartyModel();
    expect(() => ref.current?.applyPose(DEFAULT_POSE)).not.toThrow();
  });

  it("applyPose does not throw with custom pose", () => {
    const { ref } = renderMartyModel();
    const customPose = {
      ...DEFAULT_POSE,
      bodyY: 0.5,
      bodyTilt: 0.1,
      joints: {
        ...DEFAULT_POSE.joints,
        leftHip: 0.3,
        rightArm: -0.5,
        twist: 0.2,
      },
      eyes: {
        left: { x: 0.01, y: 0.02, scale: 1.2 },
        right: { x: -0.01, y: 0.02, scale: 0.8 },
      },
    };
    expect(() => ref.current?.applyPose(customPose)).not.toThrow();
  });

  it("getRootRef returns the root element", () => {
    const { ref } = renderMartyModel();
    // In JSDOM, R3F <group> elements render as DOM elements
    // In a real R3F Canvas, this would be a Three.js Group
    const root = ref.current?.getRootRef();
    expect(root).toBeDefined();
  });

  it("accepts initialPose prop", () => {
    const customPose = {
      ...DEFAULT_POSE,
      bodyY: 1.0,
    };
    expect(() => renderMartyModel({ initialPose: customPose })).not.toThrow();
  });
});
