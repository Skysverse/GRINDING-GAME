# Emberfall — The Last Light

An offline, single-player fantasy action RPG for Windows 10/11 (64-bit). Built for short expeditions and long-term character growth, with original procedural artwork, animated combat, and synthesized audio. No accounts, purchases, or online services.

## Play

Download **Emberfall-1.0.0-Windows.exe** from [GitHub Releases](https://github.com/Skysverse/GRINDING-GAME/releases/latest). Double-click it; no installer or administrator access is needed. Allow a few seconds for the portable launcher to unpack. The executable is unsigned.

Choose **Warden**, **Arcanist**, or **Ranger**, then begin an expedition. Attacks target the nearest enemy automatically. The Warden fights at close range; ranged classes can kite enemies.

| Control | Action |
| --- | --- |
| WASD / Arrow keys | Move |
| Space | Dash; briefly become invulnerable |
| Q | Cast your class spell |
| E | Drink a healing potion |
| Escape | Pause / resume |
| F11 | Fullscreen in the desktop app |

Collect experience motes and pick stackable blessings: orbiting familiars, chain lightning, burning strikes, lifesteal, extra projectiles, regeneration, and more. Defeat enough enemies and survive 25 seconds to advance a normal wave. Every fifth wave features a boss with projectile rings, marked ground blasts, and a telegraphed charge. A boss wave ends when the boss falls. Waves continue indefinitely and grow harder.

Gold and loot are retained when you fall or return to camp. Between runs:

- Equip weapons, armor, and charms with five rarity levels.
- Salvage spare gear into shards; enhance equipped items.
- Invest gold into permanent sanctuary upgrades.
- Complete repeatable cumulative quests for extra rewards.
- Unlock Cinderstone Ruins at completed wave 5 and Astral Hollow at completed wave 10. Harder regions reward stronger loot.
- Ascend at best wave 15, then 20, 25, and so on. Each ascension adds 10% permanent damage, resetting gold and sanctuary ranks while retaining gear, shards, quests, and region unlocks.

## Saves

Progress saves automatically to the Electron user-data directory (`%APPDATA%\Emberfall` on Windows), not beside the portable executable. Use **Export save** to back up or transfer your adventure. **Import save** validates the file and asks before replacing your current progress. Expedition-only blessings and current run positions do not persist after closing; earned gold, loot, and permanent progression do.

## Develop

Node.js 22+ and npm are recommended. Use the existing checkout; no additional worktree is needed.

```sh
npm ci
npm start
```

For browser development, run `npm run dev` and open the local server on port 5173. The game uses native canvas and JavaScript modules; no frontend bundler is required. All assets are local and no network requests are needed by the game.

```sh
npm test             # progression, economy, loot, save validation
npm run test:ui      # integration tests using /usr/bin/chromium and Python 3
npm run dist:win     # Windows x64 portable executable in dist/
```

The UI test exercises actual combat, movement, class abilities, boss attack patterns, leveling choices, equipment, quest rewards, save reload, and compact layouts. Screenshots are written to ignored `test-results/`. A test-only simulation hook is enabled exclusively with the `?test=1` URL query; normal desktop launches do not enable it.

Cross-building the portable Windows executable works on Linux with electron-builder's official Electron, 7-Zip, and NSIS downloads. The build intentionally disables Windows executable resource editing/code signing so Wine and signing credentials are not required. Run the Windows artifact on a Windows machine for platform-specific verification; Linux browser checks do not establish native Windows compatibility.

## Project layout

- `src/core.js`: persistent progression, loot generation, validated saves, economy.
- `src/game.js`: simulation, controls, canvas rendering, UI and synthesized sound.
- `src/style.css`: responsive desktop interface.
- `electron.cjs`: sandboxed desktop window with no renderer Node.js access.
- `tests/`: economy and browser integration tests.

Source code and original art are MIT licensed. Bundled Electron/Chromium components retain their respective notices inside the packaged app.

## Publish a release

Pushing a version tag such as `v1.0.0` starts the Windows release workflow. GitHub Actions installs locked dependencies, runs progression tests, builds the executable on Windows, and publishes the portable `.exe` and SHA-256 checksum as release assets. The workflow uses GitHub’s built-in job token with repository contents permission; no personal access token is needed. The tag must match `package.json`.
