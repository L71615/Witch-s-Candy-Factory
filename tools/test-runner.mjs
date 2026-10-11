import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const rive = path.join(process.env.USERPROFILE, '.rive', 'bin', 'rive.exe');
const output = path.join(root, 'runner', 'build', 'runner-test.json');

function run(args) {
  const result = spawnSync(rive, ['runner', ...args, `--data-dump=${output}`], {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.status !== 0) throw new Error(result.stdout + result.stderr);
  if ((result.stdout + result.stderr).includes("doesn't have a generator function")) {
    throw new Error('Rive did not load the gameplay script. Run this replay in the normal local runtime, outside execution isolation.');
  }
  const properties = JSON.parse(readFileSync(output, 'utf8')).viewModel.properties;
  return Object.fromEntries(properties.map(property => [property.name, property.value]));
}

const ready = run(['--advance=2']);
assert.equal(ready.phase, 0, 'runner opens on the title screen');
assert.equal(ready.menuOpacity, 1, 'title screen is visible');
assert.equal(ready.score, 0, 'world is frozen before the run begins');

const moving = run(['--pointer=click@640,360', '--advance=60']);
assert.equal(moving.phase, 1, 'tap starts the run');
assert.ok(moving.score > 0, 'distance awards score');
assert.ok(moving.groundX < 0, 'roof scrolls left');
assert.ok(Math.abs(moving.legFront) > 0.05, 'run cycle articulates the legs');
assert.equal(moving.motionState, 1, 'grounded play publishes the run pose');
assert.equal(moving.musicMode, 1, 'the rooftop cue starts with active play');
assert.equal(moving.sugarMeter, 0, 'sugar energy starts empty before the first pickup');
assert.ok(Math.abs(moving.kneeFront - moving.kneeBack) > 0.1, 'run cycle separates the two knee arcs');
assert.equal(moving.menuOpacity, 0, 'title screen hides during play');

const keyboardJump = run(['--pointer=click@640,360', '--advance=2', '--key=space', '--advance=8']);
assert.ok(keyboardJump.playerY < 500, 'space triggers a real jump through focused Rive input');
assert.equal(keyboardJump.motionState, 2, 'ascending play publishes the tucked rise pose');
assert.ok(keyboardJump.kneeFront > 0.75, 'rise pose visibly tucks the leading knee through the smoothed transition');
assert.ok(keyboardJump.jumpFxOpacity > 0, 'takeoff emits a short magic ring');
assert.ok(Math.abs(keyboardJump.playerPivotY - (keyboardJump.playerY - 52)) < 0.01, 'character pivot tracks the smaller torso above the collision point');

const arrowJump = run(['--pointer=click@640,360', '--advance=2', '--key=up', '--advance=8']);
assert.ok(arrowJump.playerY < 500, 'the GLFW up-arrow code triggers jump');

const heldJump = run(['--pointer=click@640,360', '--advance=2', '--key=space:down', '--advance=12', '--key=space:up']);
const tappedJump = run(['--pointer=click@640,360', '--advance=2', '--key=space', '--advance=12']);
assert.ok(heldJump.playerY < tappedJump.playerY - 45, 'holding jump creates a clearly higher arc than tapping');

const doubleJump = run(['--pointer=click@640,360', '--advance=2', '--key=space', '--advance=4', '--key=space', '--advance=4']);
const thirdJump = run(['--pointer=click@640,360', '--advance=2', '--key=space', '--advance=4', '--key=space', '--key=space', '--advance=4']);
assert.ok(doubleJump.playerY < keyboardJump.playerY, 'second jump adds upward velocity');
assert.equal(doubleJump.jumpCount, 2, 'second air input spends the remaining jump');
assert.ok(doubleJump.playerRotation > 0.5, 'double jump begins a compact somersault');
assert.equal(thirdJump.jumpCount, 2, 'third air jump is rejected');

const landing = run(['--pointer=click@640,360', '--advance=2', '--key=space', '--advance=38']);
assert.equal(landing.motionState, 4, 'touchdown publishes the landing compression pose');
assert.ok(landing.landingOpacity > 0, 'hard landing emits the impact ring');
assert.ok(landing.bodyScaleY < 1, 'landing compresses the torso instead of snapping to run');

const dashing = run(['--pointer=click@640,360', '--advance=2', '--key=x', '--advance=4']);
assert.equal(dashing.dashOpacity, 1, 'dash produces a visible speed trail');
assert.equal(dashing.motionState, 5, 'dash publishes its dedicated forward pose');
assert.ok(dashing.playerScaleX > 1, 'dash changes the running pose');
assert.ok(Math.abs(dashing.capeRotation - dashing.capeTipRotation) > 0.1, 'dash keeps delayed cape follow-through');
assert.ok(dashing.dashReady < 0.2, 'dash enters cooldown');

const kDashing = run(['--pointer=click@640,360', '--advance=2', '--key=k', '--advance=4']);
assert.equal(kDashing.motionState, 5, 'the displayed K binding triggers dodge');
const arrowDashing = run(['--pointer=click@640,360', '--advance=2', '--key=right', '--advance=4']);
assert.equal(arrowDashing.motionState, 5, 'the GLFW right-arrow code triggers dodge');

const blockedDash = run(['--pointer=click@640,360', '--advance=2', '--key=x', '--advance=30', '--key=x', '--advance=2']);
assert.equal(blockedDash.dashOpacity, 0, 'dash cannot be spammed during cooldown');

const flippingUnder = run(['--pointer=click@640,360', '--advance=2', '--key=s', '--advance=5']);
assert.equal(flippingUnder.motionState, 8, 'surface swap publishes the downward flip pose');
assert.ok(flippingUnder.flipProgress > 0 && flippingUnder.flipProgress < 1, 'surface swap is animated instead of snapping');
assert.ok(flippingUnder.playerRotation > 0.2, 'downward flip rotates the complete articulated rig');
assert.ok(flippingUnder.flipFxOpacity > 0, 'surface swap emits its orbit accent');

const underRunning = run(['--pointer=click@640,360', '--advance=2', '--key=s', '--advance=18']);
assert.equal(underRunning.surfaceSide, -1, 'S moves the runner to the bridge underside');
assert.equal(underRunning.motionState, 9, 'underside traversal has a dedicated run state');
assert.ok(Math.abs(underRunning.playerRotation) < 0.01, 'underside traversal keeps forward-facing rotation');
assert.ok(underRunning.playerScaleY < -0.9, 'underside traversal flips vertically without reversing left and right');
assert.ok(underRunning.playerPivotY > underRunning.surfaceY + 40, 'underside boots attach above a body hanging below the bridge');

const arrowUnder = run(['--pointer=click@640,360', '--advance=2', '--key=down', '--advance=18']);
assert.equal(arrowUnder.surfaceSide, -1, 'the GLFW down-arrow code flips to the underside');

const neutralWorldClick = run(['--pointer=click@640,360', '--advance=2', '--pointer=click@800,360', '--advance=3']);
assert.equal(neutralWorldClick.attackState, 0, 'clicking the unlabelled playfield does not trigger an invisible action');
const clickFlip = run(['--pointer=click@640,360', '--advance=2', '--pointer=click@235,672', '--advance=18']);
assert.equal(clickFlip.surfaceSide, -1, 'the visible FLIP button owns the mouse flip action');
const clickAttack = run(['--pointer=click@640,360', '--advance=2', '--pointer=click@1045,672', '--advance=3']);
assert.equal(clickAttack.attackState, 1, 'the visible ATTACK button owns the mouse attack action');

const returningTop = run(['--pointer=click@640,360', '--advance=2', '--key=s', '--advance=18', '--key=s', '--advance=18']);
assert.equal(returningTop.surfaceSide, 1, 'a second surface swap returns to the bridge top');
assert.equal(returningTop.motionState, 1, 'the runner flows back into the normal run cycle');

const combo = run(['--pointer=click@640,360', '--advance=2', '--key=z', '--advance=10', '--key=z', '--advance=14']);
assert.equal(combo.attackState, 2, 'a late second attack input chains into combo stage two');
assert.equal(combo.motionState, 12, 'combo stage two publishes a distinct attack pose');

const attackToDodge = run(['--pointer=click@640,360', '--advance=2', '--key=z', '--advance=10', '--key=x', '--advance=2']);
assert.equal(attackToDodge.motionState, 5, 'a committed blade cut can cancel into dodge');
assert.equal(attackToDodge.attackState, 0, 'dodge cancel clears the active attack pose');
assert.ok(attackToDodge.cancelOpacity > 0.5, 'action cancel emits a readable transition accent');

const dodgeToAttack = run(['--pointer=click@640,360', '--advance=2', '--key=x', '--advance=8', '--key=z', '--advance=2']);
assert.equal(dodgeToAttack.motionState, 11, 'a late dodge can cancel directly into a blade cut');
assert.equal(dodgeToAttack.attackState, 1, 'dodge cancel starts the requested attack immediately');
assert.ok(dodgeToAttack.cancelOpacity > 0.5, 'reverse cancel uses the same visual language');

const bufferedJump = run(['--pointer=click@640,360', '--advance=2', '--key=space', '--advance=4', '--key=space', '--advance=26', '--key=space', '--advance=10']);
assert.equal(bufferedJump.jumpCount, 1, 'a jump pressed just before landing is buffered into the next takeoff');
assert.equal(bufferedJump.motionState, 2, 'buffered takeoff transitions directly into the rise pose');

// Compare the same encounter with no input, a jump, and a dash. The slim rig
// must keep its playable collision envelope instead of the old oversized one.
const collision = run(['--pointer=click@640,360', '--advance=138']);
assert.equal(collision.lives, 2, 'running into the first spike consumes one heart');
const clearance = run(['--pointer=click@640,360', '--advance=110', '--key=space:down', '--advance=20', '--key=space:up', '--advance=24']);
assert.equal(clearance.lives, 3, 'a well-timed jump clears the same spike without a phantom hit');
assert.ok(clearance.obstacleX < clearance.playerX, 'the cleared spike has passed behind the player');
assert.equal(clearance.playerY, clearance.platformY, 'the jump lands on the upper rail');
const breakthrough = run(['--pointer=click@640,360', '--advance=110', '--key=x', '--advance=28']);
assert.equal(breakthrough.lives, 3, 'a well-timed dodge passes through the spike unharmed');
assert.ok(breakthrough.obstacleX < breakthrough.playerX, 'dodge invulnerability lets the spike pass behind without destroying it');

const perfect = run(['--pointer=click@640,360', '--advance=110', '--key=x', '--advance=18']);
assert.equal(perfect.lives, 3, 'perfect dodge keeps all three hearts');
assert.ok(perfect.perfectOpacity > 0.5, 'a close dodge triggers the freeze-frame overlay');
assert.equal(perfect.comboText, 'PERFECT DODGE  +140', 'perfect dodge publishes explicit scoring feedback');
assert.ok(perfect.sugarMeter > 0.5, 'perfect dodge feeds the sugar energy reward loop');

const sugarRush = run(['--data=action=10', '--advance=30']);
assert.ok(sugarRush.sugarMeter > 0.8, 'active sugar rush visibly drains from a full meter');
assert.ok(sugarRush.sugarRushOpacity > 0.5, 'sugar rush publishes a strong player aura');
assert.equal(sugarRush.comboText, 'SUGAR RUSH  ×2', 'sugar rush clearly communicates its score multiplier');

const undersideClearance = run(['--pointer=click@640,360', '--advance=2', '--key=s', '--advance=125']);
assert.equal(undersideClearance.lives, 3, 'running under the bridge avoids the same top-side spike');
assert.equal(undersideClearance.surfaceSide, -1, 'the runner remains attached to the bridge underside');
assert.ok(undersideClearance.obstacleX < undersideClearance.playerX, 'the top-side spike passes safely overhead');

const attackBreak = run(['--pointer=click@640,360', '--advance=100', '--key=z', '--advance=18']);
assert.equal(attackBreak.lives, 3, 'a timed sugar-blade strike prevents collision damage');
assert.equal(attackBreak.attackHits, 1, 'the blade projectile records a real enemy hit');
assert.ok(attackBreak.obstacleX > 1280, 'an attack destroys and respawns the spike outside the viewport');
assert.ok(attackBreak.score > 300, 'destroying a threat awards a combat score bonus');

// Action 11 is a headless-only no-damage timing route. Action 9 is the visible
// recording auto-player and is tested separately at the full-run boundary.
const ambushChapter = run(['--data=action=11', '--advance=1860']);
assert.equal(ambushChapter.phase, 1, 'timing QA route remains in active play');
assert.equal(ambushChapter.chapter, 2, 'the factory forms the second of three chapters');
assert.equal(ambushChapter.objectiveText, 'MASTER BOTH SURFACES · BREAK THE CANDY GUARD', 'the factory chapter teaches its combat objective');
assert.equal(ambushChapter.difficultyLevel, 2, 'the HUD publishes the current trial difficulty tier');
assert.match(ambushChapter.rankText, /^TRIAL RANK  [SABC]$/, 'the run publishes a live competitive rank');
assert.match(ambushChapter.rivalText, /^GUILD PACE  [+-]\d+$/, 'the run compares score against the guild pace target');

const factorySprint = run(['--data=action=11', '--advance=3000']);
assert.equal(factorySprint.musicMode, 2, 'the factory approach switches to the faster chase cue');

const bossChase = run(['--data=action=11', '--advance=3720']);
assert.equal(bossChase.chapter, 3, 'the final chapter starts after two full thirty-second acts');
assert.ok(bossChase.bossOpacity > 0.95, 'the Sugar Devourer is fully staged for the chase');
assert.equal(bossChase.chaseOpacity, 1, 'boss health and chase treatment are visible');
assert.equal(bossChase.musicMode, 3, 'the final chase switches to the boss cue');

const bossWave = run(['--data=action=11', '--advance=4260']);
assert.equal(bossWave.bossAttackType, 1, 'phase two schedules a bridge shockwave pattern');
assert.ok(bossWave.shockwaveOpacity > 0.4, 'the moving shockwave is visibly active');
assert.equal(bossWave.bossAttackText, 'JUMP THE SHOCKWAVE', 'the HUD teaches the shockwave response');

const bossSweep = run(['--data=action=11', '--advance=4380']);
assert.equal(bossSweep.bossAttackType, 2, 'phase two alternates into an upper sweep');
assert.ok(bossSweep.sweepOpacity > 0.4, 'the upper sweep spans the active play lane');
assert.equal(bossSweep.bossAttackText, 'FLIP BELOW THE SWEEP', 'the HUD teaches the surface-flip response');

const bossMeteor = run(['--data=action=11', '--advance=5060']);
assert.equal(bossMeteor.bossAttackType, 3, 'phase three adds the sugar press attack');
assert.ok(bossMeteor.meteorOpacity > 0.3, 'the sugar press visibly falls toward the runner');
assert.equal(bossMeteor.bossAttackText, 'DODGE THE SUGAR PRESS', 'the HUD teaches the press dodge response');

const bossShield = run(['--data=action=11', '--advance=4320']);
assert.equal(bossShield.bossPhase, 2, 'the boss advances into its shield phase');
assert.ok(bossShield.bossShieldOpacity > 0.4, 'phase two visibly surrounds the boss with a guard');
assert.ok(bossShield.factoryOpacity > 0.7, 'the factory destination has entered the background by phase two');
assert.equal(bossShield.bossPhaseText, 'PHASE II · CHAIN 3 TO BREAK GUARD', 'the HUD explains the phase-two counterplay');

const bossCore = run(['--data=action=11', '--advance=4960']);
assert.equal(bossCore.bossPhase, 3, 'the boss reaches its exposed-core phase');
assert.ok(bossCore.bossCoreOpacity > 0.4, 'phase three exposes a pulsing target');
assert.ok(bossCore.bridgeBreakProgress > 0.5, 'the bridge collapse escalates through the final phase');
assert.equal(bossCore.bossPhaseText, 'PHASE III · CHAIN 3 TO CUT CORE', 'the HUD directs the finishing attack');

const enragedWave = run(['--data=action=11', '--advance=4850']);
assert.ok(enragedWave.shockwaveEchoOpacity > 0.4, 'enrage adds a visible second shockwave');
assert.equal(enragedWave.bossAttackText, 'DOUBLE WAVE · HOLD JUMP', 'the double wave has its own counterplay cue');

const guardedShot = run(['--data=action=11', '--advance=4260', '--key=j', '--advance=48']);
assert.equal(guardedShot.bossHp, 1, 'a single light cut cannot damage the phase-two shield');
const heavyShot = run(['--data=action=11', '--advance=4260', '--key=j', '--advance=10', '--key=j', '--advance=18', '--key=j', '--advance=55']);
assert.ok(heavyShot.bossHp < 1, 'a third-cut projectile retains its damage after the combo animation ends');
assert.equal(heavyShot.attackState, 0, 'the combo animation has finished before its ranged hit is checked');

const bossCombat = run(['--data=action=12', '--advance=1500']);
assert.equal(bossCombat.phase, 4, 'the boss can be defeated with real damage enabled and no forced clear');
assert.equal(bossCombat.bossHp, 0, 'victory requires actual attacks to empty the health bar');
assert.ok(bossCombat.lives > 0, 'the defensive replay survives all boss phases');
assert.ok(bossCombat.runTime >= 82 && bossCombat.runTime < 90, 'a skilled clear sees all phases and beats the bell');

const completedRoute = run(['--data=action=9', '--advance=6000']);
assert.equal(completedRoute.phase, 4, 'surviving the authored minute reaches the completion state');
assert.equal(completedRoute.menuTitle, 'DELIVERY COMPLETE', 'completion has a dedicated victory result');
assert.equal(completedRoute.finishOpacity, 1, 'victory presentation is published');
assert.ok(completedRoute.finalFlashOpacity > 0.5, 'the completion frame carries the final sugar-cut flash');
assert.match(completedRoute.gradeText, /^NIGHT RANK  [SABC]$/, 'completion awards a run grade');
assert.ok(completedRoute.attackHits > 20, 'the recording auto-player visibly attacks throughout the route');
assert.ok(completedRoute.perfectCount > 0, 'the recording auto-player performs real timed dodges');

const timedOutRoute = run(['--data=action=11', '--advance=5405']);
assert.equal(timedOutRoute.phase, 2, 'the thirteenth bell ends a run when the boss still has health');
assert.equal(timedOutRoute.menuTitle, 'THE LAST SPARK FADED', 'boss timeout has a story-specific failure result');
assert.ok(timedOutRoute.bossHp > 0, 'timeout does not pretend the undefeated boss was cleared');

const beforePause = run(['--pointer=click@640,360', '--advance=40']);
const atPause = run(['--pointer=click@640,360', '--advance=40', '--pointer=click@1220,70', '--advance=1']);
const paused = run(['--pointer=click@640,360', '--advance=40', '--pointer=click@1220,70', '--advance=120']);
assert.equal(paused.phase, 3, 'upper-right control pauses the run');
assert.ok(Math.abs(paused.score - atPause.score) < 0.01, 'pause freezes score and simulation');
assert.equal(paused.pauseOpacity, 1, 'pause plate is visible');
const resumed = run(['--pointer=click@640,360', '--advance=40', '--pointer=click@1220,70', '--advance=30', '--pointer=click@640,360', '--advance=20']);
assert.equal(resumed.phase, 1, 'tap resumes from pause');
assert.ok(resumed.score > beforePause.score, 'simulation continues after resume');

const gameOver = run(['--pointer=click@640,360', '--advance=720']);
assert.equal(gameOver.phase, 2, 'three unavoided hits end the run');
assert.equal(gameOver.lives, 0, 'all hearts are consumed');
assert.equal(gameOver.motionState, 7, 'game over publishes the defeated pose');
assert.equal(gameOver.menuTitle, 'NIGHT SHIFT OVER', 'result screen reports the end state');
assert.equal(gameOver.menuOpacity, 1, 'result screen is visible');

const restarted = run(['--pointer=click@640,360', '--advance=720', '--pointer=click@640,360', '--advance=2']);
assert.equal(restarted.phase, 1, 'tap restarts after game over');
assert.equal(restarted.lives, 3, 'restart restores all hearts');
assert.ok(restarted.score < 10, 'restart resets the score');

console.log('PASS runner v18: three thirty-second environments, heavy-cut shield damage, real boss victory, enraged double wave, input and movement regression');
