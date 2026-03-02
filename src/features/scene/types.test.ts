import { describe, it, expect } from "vitest";
import {
  DEFAULT_JOINT_ANGLES,
  DEFAULT_EYE_STATE,
  DEFAULT_POSE,
  DEFAULT_SCENE_CONFIG,
} from "./types";
import type {
  JointAngles,
  EyeState,
  MartyPose,
  SceneConfig,
  JointName,
} from "./types";

describe("scene types", () => {
  describe("DEFAULT_JOINT_ANGLES", () => {
    it("has all joint angles set to zero", () => {
      const jointNames: JointName[] = [
        "leftHip",
        "leftKnee",
        "leftFoot",
        "rightHip",
        "rightKnee",
        "rightFoot",
        "leftArm",
        "rightArm",
        "twist",
      ];

      for (const name of jointNames) {
        expect(DEFAULT_JOINT_ANGLES[name]).toBe(0);
      }
    });

    it("has exactly 9 joints", () => {
      expect(Object.keys(DEFAULT_JOINT_ANGLES)).toHaveLength(9);
    });
  });

  describe("DEFAULT_EYE_STATE", () => {
    it("has left eye at neutral position", () => {
      expect(DEFAULT_EYE_STATE.left).toEqual({ x: 0, y: 0, scale: 1 });
    });

    it("has right eye at neutral position", () => {
      expect(DEFAULT_EYE_STATE.right).toEqual({ x: 0, y: 0, scale: 1 });
    });
  });

  describe("DEFAULT_POSE", () => {
    it("contains default joint angles", () => {
      expect(DEFAULT_POSE.joints).toEqual(DEFAULT_JOINT_ANGLES);
    });

    it("contains default eye state", () => {
      expect(DEFAULT_POSE.eyes).toEqual(DEFAULT_EYE_STATE);
    });

    it("has zero bodyY offset", () => {
      expect(DEFAULT_POSE.bodyY).toBe(0);
    });

    it("has zero bodyTilt", () => {
      expect(DEFAULT_POSE.bodyTilt).toBe(0);
    });
  });

  describe("DEFAULT_SCENE_CONFIG", () => {
    it("has a background color", () => {
      expect(DEFAULT_SCENE_CONFIG.backgroundColor).toBe("#f0f0f0");
    });

    it("shows grid by default", () => {
      expect(DEFAULT_SCENE_CONFIG.showGrid).toBe(true);
    });

    it("hides axes by default", () => {
      expect(DEFAULT_SCENE_CONFIG.showAxes).toBe(false);
    });

    it("has a camera position as a 3-element tuple", () => {
      expect(DEFAULT_SCENE_CONFIG.cameraPosition).toHaveLength(3);
      expect(DEFAULT_SCENE_CONFIG.cameraPosition[0]).toBeTypeOf("number");
      expect(DEFAULT_SCENE_CONFIG.cameraPosition[1]).toBeTypeOf("number");
      expect(DEFAULT_SCENE_CONFIG.cameraPosition[2]).toBeTypeOf("number");
    });
  });

  describe("type safety", () => {
    it("JointAngles can be created with numeric values", () => {
      const angles: JointAngles = {
        leftHip: 0.5,
        leftKnee: -0.3,
        leftFoot: 0.1,
        rightHip: -0.5,
        rightKnee: 0.3,
        rightFoot: -0.1,
        leftArm: 0.7,
        rightArm: -0.7,
        twist: 0.2,
      };
      expect(angles.leftHip).toBe(0.5);
    });

    it("MartyPose can be spread to create new poses", () => {
      const customPose: MartyPose = {
        ...DEFAULT_POSE,
        bodyY: 0.5,
        joints: { ...DEFAULT_POSE.joints, leftHip: 0.3 },
      };
      expect(customPose.bodyY).toBe(0.5);
      expect(customPose.joints.leftHip).toBe(0.3);
      expect(customPose.joints.rightHip).toBe(0);
    });

    it("SceneConfig can be partially overridden", () => {
      const config: SceneConfig = {
        ...DEFAULT_SCENE_CONFIG,
        showGrid: false,
      };
      expect(config.showGrid).toBe(false);
      expect(config.backgroundColor).toBe("#f0f0f0");
    });
  });
});
