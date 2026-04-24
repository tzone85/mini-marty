import type { AnimationSequence } from "./types";
import type { MartyPose, JointAngles, EyeState } from "../types";
import { DEFAULT_POSE } from "../types";

interface PoseOverrides {
  readonly joints?: Partial<JointAngles>;
  readonly eyes?: {
    readonly left?: Partial<EyeState["left"]>;
    readonly right?: Partial<EyeState["right"]>;
  };
  readonly bodyY?: number;
  readonly bodyTilt?: number;
}

function pose(overrides: PoseOverrides): MartyPose {
  return {
    ...DEFAULT_POSE,
    ...overrides,
    joints: { ...DEFAULT_POSE.joints, ...overrides.joints },
    eyes: {
      left: { ...DEFAULT_POSE.eyes.left, ...overrides.eyes?.left },
      right: { ...DEFAULT_POSE.eyes.right, ...overrides.eyes?.right },
    },
  };
}

export const WALK_SEQUENCE: AnimationSequence = {
  loop: true,
  durationMs: 1000,
  keyframes: [
    {
      time: 0,
      pose: pose({
        joints: {
          leftHip: 0.3,
          rightHip: -0.3,
          leftArm: -0.2,
          rightArm: 0.2,
          leftKnee: -0.1,
          rightKnee: 0.1,
        },
      }),
    },
    {
      time: 0.25,
      pose: pose({
        joints: { leftHip: 0, rightHip: 0, leftArm: 0, rightArm: 0 },
        bodyY: 0.02,
      }),
    },
    {
      time: 0.5,
      pose: pose({
        joints: {
          leftHip: -0.3,
          rightHip: 0.3,
          leftArm: 0.2,
          rightArm: -0.2,
          leftKnee: 0.1,
          rightKnee: -0.1,
        },
      }),
    },
    {
      time: 0.75,
      pose: pose({
        joints: { leftHip: 0, rightHip: 0, leftArm: 0, rightArm: 0 },
        bodyY: 0.02,
      }),
    },
  ],
};

export const DANCE_SEQUENCE: AnimationSequence = {
  loop: true,
  durationMs: 2000,
  keyframes: [
    {
      time: 0,
      pose: pose({
        joints: { leftArm: 0.8, rightArm: -0.8, twist: 0.2 },
        bodyY: -0.05,
      }),
    },
    {
      time: 0.25,
      pose: pose({
        joints: { leftArm: -0.5, rightArm: 0.5, twist: -0.2 },
        bodyY: 0.05,
      }),
    },
    {
      time: 0.5,
      pose: pose({
        joints: { leftArm: 0.8, rightArm: -0.8, twist: 0.3 },
        bodyY: -0.05,
      }),
    },
    {
      time: 0.75,
      pose: pose({
        joints: { leftArm: -0.5, rightArm: 0.5, twist: -0.3 },
        bodyY: 0.05,
      }),
    },
  ],
};

export const KICK_SEQUENCE: AnimationSequence = {
  loop: false,
  durationMs: 1000,
  keyframes: [
    { time: 0, pose: DEFAULT_POSE },
    {
      time: 0.3,
      pose: pose({
        joints: { rightHip: -0.3, rightKnee: 0.4 },
        bodyTilt: -0.05,
      }),
    },
    {
      time: 0.5,
      pose: pose({
        joints: { rightHip: 0.8, rightKnee: -0.2, rightFoot: -0.3 },
        bodyTilt: -0.1,
      }),
    },
    {
      time: 0.8,
      pose: pose({ joints: { rightHip: 0.3, rightKnee: 0 }, bodyTilt: -0.05 }),
    },
    { time: 1, pose: DEFAULT_POSE },
  ],
};

export const SLIDE_SEQUENCE: AnimationSequence = {
  loop: false,
  durationMs: 1000,
  keyframes: [
    { time: 0, pose: DEFAULT_POSE },
    {
      time: 0.3,
      pose: pose({ bodyTilt: 0.15, joints: { leftHip: 0.1, rightHip: -0.1 } }),
    },
    {
      time: 0.7,
      pose: pose({ bodyTilt: 0.15, joints: { leftHip: 0.1, rightHip: -0.1 } }),
    },
    { time: 1, pose: DEFAULT_POSE },
  ],
};

export const LEAN_SEQUENCE: AnimationSequence = {
  loop: false,
  durationMs: 500,
  keyframes: [
    { time: 0, pose: DEFAULT_POSE },
    { time: 0.4, pose: pose({ bodyTilt: 0.25 }) },
    { time: 0.7, pose: pose({ bodyTilt: 0.25 }) },
    { time: 1, pose: DEFAULT_POSE },
  ],
};

export const WIGGLE_SEQUENCE: AnimationSequence = {
  loop: true,
  durationMs: 500,
  keyframes: [
    { time: 0, pose: pose({ joints: { twist: 0.15 } }) },
    { time: 0.25, pose: pose({ joints: { twist: -0.15 } }) },
    { time: 0.5, pose: pose({ joints: { twist: 0.15 } }) },
    { time: 0.75, pose: pose({ joints: { twist: -0.15 } }) },
  ],
};

export const CIRCLE_DANCE_SEQUENCE: AnimationSequence = {
  loop: true,
  durationMs: 3000,
  keyframes: [
    {
      time: 0,
      pose: pose({
        joints: { twist: 0, leftArm: 0.6, rightArm: 0.6 },
        bodyY: 0.03,
      }),
    },
    {
      time: 0.25,
      pose: pose({
        joints: { twist: Math.PI / 2, leftArm: 0.3, rightArm: 0.3 },
        bodyY: -0.02,
      }),
    },
    {
      time: 0.5,
      pose: pose({
        joints: { twist: Math.PI, leftArm: 0.6, rightArm: 0.6 },
        bodyY: 0.03,
      }),
    },
    {
      time: 0.75,
      pose: pose({
        joints: { twist: Math.PI * 1.5, leftArm: 0.3, rightArm: 0.3 },
        bodyY: -0.02,
      }),
    },
  ],
};

export const CELEBRATE_SEQUENCE: AnimationSequence = {
  loop: true,
  durationMs: 2000,
  keyframes: [
    {
      time: 0,
      pose: pose({
        joints: { leftArm: -1.2, rightArm: -1.2, twist: 0.1 },
        bodyY: 0.05,
      }),
    },
    {
      time: 0.2,
      pose: pose({
        joints: { leftArm: -1.0, rightArm: -1.0, twist: -0.1 },
        bodyY: -0.02,
      }),
    },
    {
      time: 0.4,
      pose: pose({
        joints: { leftArm: -1.2, rightArm: -1.2, twist: 0.1 },
        bodyY: 0.05,
      }),
    },
    {
      time: 0.6,
      pose: pose({
        joints: { leftArm: -1.0, rightArm: -1.0, twist: -0.1 },
        bodyY: -0.02,
      }),
    },
    {
      time: 0.8,
      pose: pose({
        joints: { leftArm: -1.2, rightArm: -1.2, twist: 0 },
        bodyY: 0.05,
      }),
    },
    {
      time: 1,
      pose: pose({ joints: { leftArm: -1.2, rightArm: -1.2 }, bodyY: 0 }),
    },
  ],
};

export const GET_READY_SEQUENCE: AnimationSequence = {
  loop: false,
  durationMs: 500,
  keyframes: [
    { time: 0, pose: DEFAULT_POSE },
    {
      time: 0.5,
      pose: pose({ joints: { leftKnee: 0.1, rightKnee: 0.1 }, bodyY: -0.02 }),
    },
    {
      time: 1,
      pose: pose({ joints: { leftKnee: 0.1, rightKnee: 0.1 }, bodyY: -0.02 }),
    },
  ],
};

export const STAND_STRAIGHT_SEQUENCE: AnimationSequence = {
  loop: false,
  durationMs: 500,
  keyframes: [
    {
      time: 0,
      pose: pose({ joints: { leftKnee: 0.1, rightKnee: 0.1 }, bodyY: -0.02 }),
    },
    { time: 1, pose: DEFAULT_POSE },
  ],
};

export const EYES_SEQUENCE: AnimationSequence = {
  loop: false,
  durationMs: 300,
  keyframes: [
    { time: 0, pose: DEFAULT_POSE },
    { time: 1, pose: DEFAULT_POSE },
  ],
};

export const ARMS_SEQUENCE: AnimationSequence = {
  loop: false,
  durationMs: 500,
  keyframes: [
    { time: 0, pose: DEFAULT_POSE },
    { time: 1, pose: DEFAULT_POSE },
  ],
};

export const IDLE_SEQUENCE: AnimationSequence = {
  loop: true,
  durationMs: 3000,
  keyframes: [
    { time: 0, pose: DEFAULT_POSE },
    { time: 0.5, pose: pose({ bodyY: 0.01 }) },
    { time: 1, pose: DEFAULT_POSE },
  ],
};

export function getSequenceForAction(
  action: string,
  params: Readonly<Record<string, unknown>> = {},
): AnimationSequence {
  switch (action) {
    case "walk":
      return WALK_SEQUENCE;
    case "dance":
      return DANCE_SEQUENCE;
    case "kick":
      return getKickSequence(params);
    case "slide":
      return getSlideSequence(params);
    case "lean":
      return getLeanSequence(params);
    case "wiggle":
      return WIGGLE_SEQUENCE;
    case "circle_dance":
      return CIRCLE_DANCE_SEQUENCE;
    case "celebrate":
      return CELEBRATE_SEQUENCE;
    case "get_ready":
      return GET_READY_SEQUENCE;
    case "stand_straight":
      return STAND_STRAIGHT_SEQUENCE;
    case "eyes":
      return getEyesSequence(params);
    case "arms":
      return getArmsSequence(params);
    default:
      return IDLE_SEQUENCE;
  }
}

function getKickSequence(
  params: Readonly<Record<string, unknown>>,
): AnimationSequence {
  const leg = params.leg === "left" ? "left" : "right";
  if (leg === "left") {
    return {
      ...KICK_SEQUENCE,
      keyframes: KICK_SEQUENCE.keyframes.map((kf) => ({
        ...kf,
        pose: {
          ...kf.pose,
          joints: {
            ...kf.pose.joints,
            leftHip: kf.pose.joints.rightHip,
            leftKnee: kf.pose.joints.rightKnee,
            leftFoot: kf.pose.joints.rightFoot,
            rightHip: 0,
            rightKnee: 0,
            rightFoot: 0,
          },
          bodyTilt: -kf.pose.bodyTilt,
        },
      })),
    };
  }
  return KICK_SEQUENCE;
}

function getSlideSequence(
  params: Readonly<Record<string, unknown>>,
): AnimationSequence {
  const direction = params.direction === "right" ? -1 : 1;
  return {
    ...SLIDE_SEQUENCE,
    keyframes: SLIDE_SEQUENCE.keyframes.map((kf) => ({
      ...kf,
      pose: {
        ...kf.pose,
        bodyTilt: kf.pose.bodyTilt * direction,
      },
    })),
  };
}

function getLeanSequence(
  params: Readonly<Record<string, unknown>>,
): AnimationSequence {
  const direction = params.direction === "right" ? -1 : 1;
  const amount = typeof params.amount === "number" ? params.amount / 30 : 1;
  return {
    ...LEAN_SEQUENCE,
    keyframes: LEAN_SEQUENCE.keyframes.map((kf) => ({
      ...kf,
      pose: {
        ...kf.pose,
        bodyTilt: kf.pose.bodyTilt * direction * amount,
      },
    })),
  };
}

function getEyesSequence(
  params: Readonly<Record<string, unknown>>,
): AnimationSequence {
  const position = (params.position as string) ?? "normal";
  const eyeConfig = getEyeConfig(position);
  return {
    ...EYES_SEQUENCE,
    keyframes: [
      { time: 0, pose: DEFAULT_POSE },
      {
        time: 1,
        pose: pose({
          eyes: { left: eyeConfig, right: eyeConfig },
        }),
      },
    ],
  };
}

function getEyeConfig(position: string): {
  x: number;
  y: number;
  scale: number;
} {
  switch (position) {
    case "wide":
      return { x: 0, y: 0, scale: 1.3 };
    case "angry":
      return { x: 0, y: -0.02, scale: 0.7 };
    case "excited":
      return { x: 0, y: 0.02, scale: 1.2 };
    case "squint":
      return { x: 0, y: 0, scale: 0.5 };
    default:
      return { x: 0, y: 0, scale: 1 };
  }
}

function getArmsSequence(
  params: Readonly<Record<string, unknown>>,
): AnimationSequence {
  const left =
    typeof params.left === "number" ? (params.left * Math.PI) / 180 : 0;
  const right =
    typeof params.right === "number" ? (params.right * Math.PI) / 180 : 0;
  return {
    ...ARMS_SEQUENCE,
    keyframes: [
      { time: 0, pose: DEFAULT_POSE },
      { time: 1, pose: pose({ joints: { leftArm: left, rightArm: right } }) },
    ],
  };
}
