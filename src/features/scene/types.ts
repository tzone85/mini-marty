export interface JointAngles {
  readonly leftHip: number;
  readonly leftKnee: number;
  readonly leftFoot: number;
  readonly rightHip: number;
  readonly rightKnee: number;
  readonly rightFoot: number;
  readonly leftArm: number;
  readonly rightArm: number;
  readonly twist: number;
}

export interface EyeState {
  readonly left: { readonly x: number; readonly y: number; readonly scale: number };
  readonly right: { readonly x: number; readonly y: number; readonly scale: number };
}

export interface MartyPose {
  readonly joints: JointAngles;
  readonly eyes: EyeState;
  readonly bodyY: number;
  readonly bodyTilt: number;
}

export const DEFAULT_JOINT_ANGLES: JointAngles = {
  leftHip: 0,
  leftKnee: 0,
  leftFoot: 0,
  rightHip: 0,
  rightKnee: 0,
  rightFoot: 0,
  leftArm: 0,
  rightArm: 0,
  twist: 0,
};

export const DEFAULT_EYE_STATE: EyeState = {
  left: { x: 0, y: 0, scale: 1 },
  right: { x: 0, y: 0, scale: 1 },
};

export const DEFAULT_POSE: MartyPose = {
  joints: DEFAULT_JOINT_ANGLES,
  eyes: DEFAULT_EYE_STATE,
  bodyY: 0,
  bodyTilt: 0,
};

export type JointName = keyof JointAngles;

export interface SceneConfig {
  readonly backgroundColor: string;
  readonly showGrid: boolean;
  readonly showAxes: boolean;
  readonly cameraPosition: readonly [number, number, number];
}

export const DEFAULT_SCENE_CONFIG: SceneConfig = {
  backgroundColor: "#f0f0f0",
  showGrid: true,
  showAxes: false,
  cameraPosition: [3, 3, 5],
};
