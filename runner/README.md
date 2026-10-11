# Moonlight Dash — Witch's Candy Factory

An original side-scrolling action runner built entirely with Rive RML and Luau.
Its pace, side-on camera, articulated runner, layered silhouettes, double jump,
airborne threats, suspended rails, bridge-surface flips, chained blade attacks,
and a short dodge window follow the language of
fast illustrated action runners. The setting, character, enemies, assets, and
game rules are original to Witch's Candy Factory.

The Sugar Moon is dying. Mira, the factory's last courier, has ninety seconds to
carry its final Moon Spark over the haunted rooftops and return it to the
furnace before the thirteenth bell. Three chapters give the run a clear arc:
the Last Spark rooftop delivery (0–30 seconds), the Cursed Factory (30–60),
and a final battle against the Hungry Cauldron (60–90). Each chapter replaces
the environment and music: watercolor rooftops give way to a teal-and-copper
factory interior, then a black-and-crimson furnace core. The boss is an enchanted
copper vessel with molten sugar, a hovering lid, articulated chain hooks, a
runic guard, and an exposed furnace core.

The boss has twelve health points and must be defeated before the ninety-second
deadline. Phase one fires sugar bolts; the guard phase starts at 70 seconds,
and core enrage starts at 80. Light cuts cannot damage the guard or core: chain
three cuts and let the heavy crescent connect. Its power persists after the
animation ends, it pierces enemy bolts, and starting another combo does not
erase it. The final cut deals two core damage. Armor seals at the phase health
thresholds (8 and 6 HP), visibly signaling the next shift rather than letting
the opening volley skip the battle.

Jump the electric-cyan rolling shockwave, flip below the cyan-white upper sweep,
and time a dodge as
the Sugar Press reaches Mira. The press falls through the bridge, so its actual
position determines which surface is threatened. Enrage adds a second wave,
shortens spell cycles from two seconds to 1.65 seconds, and speeds up sugar
bolts. Ordinary route obstacles clear for every player when the arena opens,
keeping those readable boss combinations at the center of the fight.

The composition uses a roughly 120 px-tall runner on a 1280×720 stage, a narrow
bridge at screen Y=560, and a quiet ink-wash valley. The fitted coat, short hat,
and tapered scarf keep the silhouette readable; the broom appears only during
a dash. Ground poses align the lowest transformed boot sole with the collision
surface. Collision sizes follow the smaller character and hazards.

## Play

From the repository root, double-click `Start-Runner-Demo.cmd`, or run:

```powershell
& "$env:USERPROFILE\.rive\bin\rive.exe" runner --fit=contain --viewport=1280x720
```

Controls:

- `Space`, `W`, or `Up`: jump; hold for a higher arc, tap for a short hop, and press again in the air for a double jump.
- `S` or `Down`: flip between the top and underside of the bridge. This avoids hazards on the opposite face.
- `J` or `Z`: sugar-blade attack. Time repeated presses near the end of a strike to chain a three-step combo; the ranged crescent can destroy threats.
- `K`, `X`, `Shift`, or `Right`: evasive broom dash with a short invulnerability window and visible cooldown.
- Mouse/touch controls use the four visible bottom buttons only: `SPACE JUMP`, `S FLIP`, `J ATTACK`, and `K DODGE`. Clicking the playfield itself does not trigger an action.
- Click the upper-right HUD area or press `P`: pause/resume.
- Click/tap the title or result screen: start/restart.

Collect candy for score and a Sweet Streak. Avoid cursed sugar spikes,
pumpkin bombs, marshmallow specters, and underside bells. Three hits end the
night shift. Shielded candy knights reward a full three-cut chain. Artillery
shots can be dodged or cut down. A last-moment dash earns a Perfect Dodge,
briefly fractures time, ducks the music for impact, and awards bonus score. The three attacks now have
distinct horizontal, rising, and heavy-finisher silhouettes. Dodging avoids
danger; attacks are what destroy it. Original synthesized Rive audio cues accompany jumping,
blade cuts, impacts, Perfect Dodge, and the final boss entrance. Three original
looping cues adapt across the rooftop run, factory sprint, and boss chase; pause
also pauses the active music instance rather than restarting it.

Candy pickups, attack hits, and Perfect Dodge now charge the Sugar meter. A
full meter automatically starts Sugar Rush: movement accelerates, the score
multiplier becomes ×2, speed lines intensify, and a gold aura tracks Mira until
the meter drains. Taking damage immediately ends the active rush and removes
part of the stored charge.

Movement inputs include landing jump buffering and a short ledge-grace window.
Committed attacks can cancel into dodge, a late dodge can cancel into attack,
and attacks can cancel into a bridge flip. Perfect Dodge immediately refreshes
the blade so the defensive action flows into a counterattack.

## Challenge and scoring

The difficulty escalates by chapter: running speed rises after the rebel candy
line, hazards respawn closer together, artillery fires faster, and the final
phase rotates through all three boss patterns. The HUD shows a live Trial Rank
(`S`–`C`) and a signed `GUILD PACE` score delta, so every run has an immediate
competitive target even offline.

Victory score includes remaining hearts, Perfect Dodges, highest streak, clear
time, and a large no-hit bonus. A late boss kill therefore scores differently
from a clean, aggressive clear. Failure can come from losing all three hearts
or from letting the thirteenth bell ring while the boss still has health.

## Source

- `scene.rml`: editable Rive scene and bindings.
- `runner.luau`: physics, spawning, collision, scoring, input, and animation values.
- `assets/art/twilight-valley-v2.png`: current generated ink-wash valley plate.
- `assets/art/watercolor-atmosphere-v1.png`: transparent watercolor grain and edge-wash unification layer.
- `assets/art/GENERATION.md`: asset provenance and the complete generation prompt.
- `assets/art/moonlit-factory.png`: previous background, retained as an earlier asset.
- `assets/audio/*.wav`: original generated action cues and three adaptive music loops.
- `../tools/build-runner-scene.mjs`: deterministic scene generator.
- `../tools/generate-runner-audio.mjs`: deterministic original SFX and music generator.
- `../tools/runner-scenery.mjs`: moon, low parallax silhouettes, and bridge artwork.
- `../tools/runner-contract.json`: view-model contract shared by scene and runtime.
- `../tools/test-runner.mjs`: headless gameplay replay tests.

## Validate

```powershell
& "$env:USERPROFILE\.rive\bin\rive.exe" runner --verify
& "$env:USERPROFILE\.rive\bin\rive.exe" inspect runner --summary
node tools/test-runner.mjs
```

Regenerate `scene.rml` with `node tools/build-runner-scene.mjs` after editing
the scene generator, scenery module, or view-model contract. Rive CLI watches
the regenerated scene and reloads an already-open preview automatically.

The replay suite covers single cuts being blocked, heavy projectiles damaging
the guard after their animation ends, the enraged double wave, and a boss-only
clear with real damage enabled. CLI `action=9` is the recording assistant
(player damage disabled, but Boss HP must still be removed by attacks);
`action=11` is a passive timing probe; `action=12` tests the boss with normal
damage and automatic inputs. None of these are used by the normal title-screen
start. Run replay checks in a local Rive environment that permits scripting;
some isolated execution environments reject script loading despite a clean
compile.
