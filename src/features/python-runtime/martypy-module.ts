import type {
  Direction,
  Leg,
  EyePosition,
  FootSide,
} from "@/features/marty/types";
import { VirtualMarty } from "@/features/marty/virtual-marty";

export function createMartyBridge(marty: VirtualMarty): object {
  return {
    walk: (steps = 2, speed = 50) => marty.walk(steps, speed),
    dance: () => marty.dance(),
    kick: (leg: Leg = "right") => marty.kick(leg),
    slide: (direction: Direction = "left", steps = 1) =>
      marty.slide(direction, steps),
    lean: (direction: Direction = "left", amount = 30) =>
      marty.lean(direction, amount),
    wiggle: () => marty.wiggle(),
    circle_dance: () => marty.circle_dance(),
    celebrate: () => marty.celebrate(),
    get_ready: () => marty.get_ready(),
    stand_straight: () => marty.stand_straight(),
    eyes: (position: EyePosition = "normal") => marty.eyes(position),
    arms: (left = 0, right = 0) => marty.arms(left, right),
    move_joint: (id: number, angle: number, time: number) =>
      marty.move_joint(id, angle, time),
    stop: () => marty.stop(),
    is_moving: () => marty.is_moving(),
    is_paused: () => marty.is_paused(),
    resume: () => marty.resume(),
    hold_position: () => marty.hold_position(),
    foot_on_ground: (foot: FootSide = "left") => marty.foot_on_ground(foot),
    get_distance_sensor: () => marty.get_distance_sensor(),
    get_accelerometer: () => marty.get_accelerometer(),
    play_sound: (name: string) => marty.play_sound(name),
  };
}

export const MARTYPY_MODULE_CODE = `
import pyodide_js
from pyodide.ffi import to_js
import asyncio

class Marty:
    def __init__(self, connection_type="virtual"):
        if connection_type != "virtual":
            raise ValueError("Only 'virtual' connection type is supported in Mini Marty")
        self._bridge = pyodide_js._marty_bridge
        self._connected = True

    async def walk(self, steps=2, speed=50):
        await self._bridge.walk(steps, speed)

    async def dance(self):
        await self._bridge.dance()

    async def kick(self, leg="right"):
        await self._bridge.kick(leg)

    async def slide(self, direction="left", steps=1):
        await self._bridge.slide(direction, steps)

    async def lean(self, direction="left", amount=30):
        await self._bridge.lean(direction, amount)

    async def wiggle(self):
        await self._bridge.wiggle()

    async def circle_dance(self):
        await self._bridge.circle_dance()

    async def celebrate(self):
        await self._bridge.celebrate()

    async def get_ready(self):
        await self._bridge.get_ready()

    async def stand_straight(self):
        await self._bridge.stand_straight()

    async def eyes(self, position="normal"):
        await self._bridge.eyes(position)

    async def arms(self, left=0, right=0):
        await self._bridge.arms(left, right)

    async def move_joint(self, joint_id, angle, time_ms):
        await self._bridge.move_joint(joint_id, angle, time_ms)

    async def stop(self):
        await self._bridge.stop()

    def is_moving(self):
        return self._bridge.is_moving()

    def is_paused(self):
        return self._bridge.is_paused()

    async def resume(self):
        await self._bridge.resume()

    async def hold_position(self):
        await self._bridge.hold_position()

    def foot_on_ground(self, foot="left"):
        return self._bridge.foot_on_ground(foot)

    def get_distance_sensor(self):
        return self._bridge.get_distance_sensor()

    def get_accelerometer(self):
        result = self._bridge.get_accelerometer()
        return {"x": result.x, "y": result.y, "z": result.z}

    async def play_sound(self, name):
        await self._bridge.play_sound(name)
`;

export const EXECUTION_WRAPPER_CODE = `
import asyncio
import sys
from martypy import Marty

async def __run_user_code():
{user_code}

asyncio.ensure_future(__run_user_code())
`;

export function wrapUserCode(code: string): string {
  const indented = code
    .split("\n")
    .map((line) => `    ${line}`)
    .join("\n");

  return EXECUTION_WRAPPER_CODE.replace("{user_code}", indented);
}
