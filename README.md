# Emberfall: The Open Wilds

A fresh, third-person **3D open-world fantasy RPG** for Windows 10/11 x64. This first playable 3D version replaces the arena/expedition format with a continuous, explorable landscape, permanent character progression, class-specific questlines, earned weapons, and world bosses.

[Download the latest Windows release](https://github.com/Skysverse/GRINDING-GAME/releases/latest).

## Choose your calling

Choose a class when creating a character. That choice stays with the character; create a new character to try a different path.

| Class | Questline | Weapons | Abilities |
| --- | --- | --- | --- |
| Warrior | The Iron Oath: quarrying, stoneborn hunts, beacon defense, and guardian challenges | Wayfarer’s Sword → Ironbark Longsword → Stonewarden’s Edge → Dawnbringer | Sword cleaves, Sundering strike, Iron Aegis, Kingbreaker |
| Mage | The Starbound Path: moonflowers, seer hunts, the ruined library, and astral rituals | Apprentice’s Staff → Moonwell Staff → Staff of the First Star → Astral Sovereign | Arcane bolts, Starburst, Riftstep, Astral Convergence |
| Ranger | The Verdant Way: gathering, wolf hunts, a scout escort, and guardian hunts | Ashwood Bow → Briarstring → Warden’s Whisper → Evergreen Requiem | Aimed arrows, Thorn volley, Windwalk, Arrowstorm |

Each class has eight one-time chapters, for 24 class-specific quest entries. Speak to your class mentor under the Hearthglen banners to learn your objective and claim rewards. Chapters 2, 4, and 8 award weapons; chapter 3 unlocks R, and chapter 6 unlocks F. Q is available from the beginning. Equip earned weapons in the Gear menu.

## An open world

Walk between Hearthglen village, Whisperwood, Cinderstone Ruins, and the Astral Reach without loading screens or wave timers. Roads connect the regions, with a lake, forest camps, landmarks, quest objects, and guardian circles along the way. The map shows your class destination and supports personal waypoints.

Three world bosses wait at challenge stones: **Thornhelm, the Stonewarden**, **Ignar, the Ash King**, and **Vael, the Starless**. Hold E at a stone to challenge its boss. Watch for projectile rings, ground warnings, and telegraphed charges. Leaving the arena resets a guardian. You can challenge defeated bosses again for experience and gold; chapter rewards remain one-time. Ordinary camp enemies return after roughly 100 seconds.

Death returns you to Hearthglen and costs 10% of your gold. Class, experience, weapons, and story progress remain. Rest at the village shrine to heal and refill flasks. Character experience and levels persist between sessions.

## Controls

| Input | Action |
| --- | --- |
| WASD / arrows | Move relative to the camera |
| Right mouse drag | Orbit the camera |
| Mouse wheel | Zoom camera |
| Left click | Aim at the ground cursor and attack once |
| J | Attack in the direction the character faces |
| Space | Jump |
| Shift | Dodge with brief invulnerability |
| Q / R / F | Use an available class move |
| T | Healing flask |
| E | Speak to mentor / rest at shrine |
| Hold E | Gather, inspect, perform rituals, or challenge a boss |
| Tab | Class quest journal |
| I | Weapons and moves |
| M | World map and waypoints |
| Escape | Pause / close menu |
| F11 | Fullscreen in the Windows app |

Basic attacks require a click or keypress; holding an attack input does not keep firing. A Warrior must get close, while Mage and Ranger use projectiles. Menus pause combat.

## Saves and the reset

Version 2.0 is a new game design and starts with a new character selection. It uses the local-storage key `emberfall-open-world-v1`, separate from the old 2D game's `emberfall-save-v1`. Older releases and saves remain available; they are not converted into 3D characters or erased.

Open Wilds progress saves locally in Electron’s `%APPDATA%\Emberfall` user-data directory. Your class, location, experience, quest progress, gathered objects, boss victories, and weapons persist. Health and flasks refresh when reopening. The Pause menu can export or import an Open Wilds save. Export a backup before replacing a character or moving computers. New Character asks before replacing your current character.

## Scope and requirements

This is a playable foundation with original stylized low-poly art, procedural terrain, animated characters, a finite connected world approximately 460 units across, three classes, 24 quest entries, 12 class weapons, and three bosses. It is not a large commercial RPG: there are no building interiors, multiplayer, voiced dialogue, or an unlimited quest generator.

The game runs offline. A working **WebGL 2 graphics driver** is required; hardware acceleration is recommended. The portable `.exe` does not require installation or administrator privileges, but needs a few seconds to unpack. It is unsigned. Native Windows gameplay still needs manual verification; automated build and gameplay checks are described below.

## Development

Use the existing checkout; no extra worktree is needed. Node.js 24 and npm are recommended.

```sh
npm ci
npm start
```

`npm ci` prepares local Three.js module files through the postinstall script. All runtime assets are included in the game; there are no CDN requests. To run in a browser:

```sh
npm run dev
```

The development server listens on port 5173. Add `?low=1` for software WebGL testing without shadow maps. Development test hooks are enabled exclusively with `?test=1`; the desktop game does not enable them.

```sh
npm test          # class progression, weapons, quests, saves, world data, combat rules
npm run test:ui  # real WebGL 2 browser gameplay; needs Python 3 and /usr/bin/chromium
npm run dist:win # portable Windows executable in dist/
```

The browser suite exercises class selection, world movement/jumping/dodging, camera orbit/zoom, deliberate melee and ranged attacks, gathering, quest claims, earned weapons, journal/map/gear menus, save reload, boss activation and attack patterns, class skills, escort/defense objectives, and death/respawn. Software WebGL checks do not establish performance on every graphics card.

The Windows release workflow runs on a version tag matching `package.json`. It installs locked dependencies, runs progression tests, builds the portable executable, and publishes the `.exe` plus SHA-256 checksum using GitHub’s built-in job token.

## Source

- `src/data.js`: classes, class-specific quests/weapons, boss/camp data, and terrain functions.
- `src/core.js`: persistent character progression, save validation, and combat rules.
- `src/world.js`: 3D terrain, instanced vegetation, village, ruins, landmarks, and lighting.
- `src/models.js`: original animated low-poly characters and props.
- `src/engine.js`: third-person camera, traversal, manual combat, bosses, and world interactions.
- `src/game.js`: class selection, mentor dialogue, journal, equipment, map, saves, and HUD.
- `scripts/vendor.cjs`: copies the pinned Three.js runtime and its license into packaged assets.

Original source and art are MIT licensed. Three.js, Electron, and Chromium retain their respective notices.
