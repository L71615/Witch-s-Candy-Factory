# Witch's Candy Factory — Moonlight Dash

An original 90-second side-scrolling action runner made for the Rive Halloween
Challenge. Mira, the factory's last courier, must carry the final Moon Spark
across haunted rooftops, survive the cursed candy factory, and defeat the
Hungry Cauldron before the thirteenth bell.

The complete game is authored with **Rive CLI, RML, and Luau**. It includes an
articulated character, double jump, bridge-surface flipping, three-step blade
combos, invulnerable dash windows, score ranks, adaptive music, three distinct
environments, and a three-phase boss battle.

## Chapters

- **0–30 seconds — The Last Spark:** watercolor moonlit rooftops.
- **30–60 seconds — The Cursed Factory:** teal glass, copper boilers, gears,
  steam, guards, and denser hazards.
- **60–90 seconds — The Hungry Cauldron:** a black-and-crimson furnace chamber
  with electric-cyan attacks, shield phases, an exposed core, and enrage.

## Play locally

Install the Rive CLI, then double-click `Start-Runner-Demo.cmd`, or run:

```powershell
rive runner --fit=contain --viewport=1280x720
```

Controls: `Space/W/Up` jump, `S/Down` flip surface, `J/Z` attack,
`K/X/Shift/Right` dodge, and `P/Escape` pause. The four controls are also
available as visible pointer/touch buttons.

See [runner/README.md](runner/README.md) for the full gameplay, architecture,
asset provenance, validation, and scoring documentation.

## Validate

```powershell
rive runner --verify
rive inspect runner --summary
node tools/test-runner.mjs
```

## Challenge entry

- Feature used: **Rive CLI** (RML scene generation and Luau gameplay runtime).
- Rive/editor link: added after the authenticated `rive push runner` step.
- Gameplay video: uploaded directly with the Contra challenge entry.

All game rules, vector artwork, synthesized audio, scripts, and generated scene
structure in this repository were created for this project.
