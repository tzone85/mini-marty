# Attribution & IP audit

> Run on 2026-06-03. Re-run whenever a non-trivial dependency on Robotical's
> work is added or any Marty/Robotical brand asset enters the tree.

## TL;DR

Mini Marty is a **fan-made educational re-implementation** inspired by
[**Marty the Robot**](https://robotical.io) (Robotical Ltd, Edinburgh) and
their official web coding app at [**codemarty.com**](https://codemarty.com).
This repository ships **no** Robotical-owned code, artwork, 3D models, audio,
logos, or trademarked imagery.

Mini Marty is not affiliated with, endorsed by, or sponsored by Robotical Ltd.
"Marty" and "Marty the Robot" are trademarks of Robotical Ltd, used here
descriptively to identify the platform that inspired this educational project.

For the full hands-on experience with real hardware, please visit
[codemarty.com](https://codemarty.com) and [robotical.io](https://robotical.io).

## What was checked

| Surface | Method | Result |
|---|---|---|
| Code copies | `git`-tracked files scanned for any text matching Robotical source patterns; no Robotical source repos cloned or vendored | None |
| Brand assets (PNG/SVG/ICO) | `find public src -type f \( -name "*.png" -o -name "*.svg" \)` | None present; favicon and icons are project-generated |
| 3D models (GLB/GLTF/FBX/OBJ) | `find public src -type f -name "*.glb" …` | None; the in-app Marty model is composed of three.js primitives in `src/features/scene/components/MartyModel.tsx` |
| Audio assets | `find public src -type f -name "*.mp3" -o -name "*.wav"` | None |
| Trademark text | `grep -i robotical\|copyright.*marty` over `src/` | No copyright strings; the name "Marty" is used descriptively only |
| Color scheme | Robotical brand cyan is `rgb(55, 171, 200)` / `#37ABC8`. Block category colors here are Scratch 3.0 defaults (`#4C97FF`, `#CF63CF`, `#5CB1D6`, `#FFBF00`, `#FFAB19`). The Marty model uses `#4a90d9`, a generic mid-blue, not the Robotical brand cyan | No brand-color match |
| API surface | `martypy-module.ts` exposes `walk / dance / kick / slide / lean / wiggle / circle_dance / celebrate / get_ready / stand_straight / eyes / arms / move_joint / stop / is_moving / is_paused / resume / hold_position / foot_on_ground / get_distance_sensor / get_accelerometer / play_sound` against a `VirtualMarty` stub. This mirrors the public surface of [`robotical/martypy`](https://github.com/robotical/martypy) (Apache-2.0) | Compatible re-implementation, not a copy — attribute as below |

## How we comply

1. **Trademark**: this README, the in-app *Help & Documentation* page, and the
   NOTICE file all carry the "Marty is a trademark of Robotical Ltd; this
   project is not affiliated" disclaimer.
2. **API attribution**: `martypy` is Apache-2.0; we re-implement its public
   surface for offline / educational use without copying the source. The
   `NOTICE` file credits Robotical Ltd as the originator of the `martypy`
   API.
3. **Visual distinction**: no Robotical artwork, no brand-color match, no
   logo. The Marty model is a procedural Three.js primitive composition.
4. **Drive traffic to the real product**: README, the *About* sidebar entry,
   and the in-app *Help* page link to [codemarty.com](https://codemarty.com)
   and [robotical.io](https://robotical.io) as the official ways to use Marty
   with real hardware.

## What would change this audit

- Adding a Robotical-distributed GLB / GLTF / FBX / OBJ / sound file.
- Copying source from `github.com/robotical/*` instead of re-implementing.
- Adopting Robotical's exact brand colors (`#37ABC8`) or logo.
- Charging for, advertising on, or otherwise commercialising this project
  while leaning on the Marty name. If commercialising, contact Robotical
  Ltd for permission first — descriptive trademark use is acceptable in a
  non-commercial educational context but the line shifts for paid offerings.

If any of those happen, re-run this audit and update this file before
shipping.
