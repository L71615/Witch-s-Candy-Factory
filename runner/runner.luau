type Runner = {
  numbers: {[string]: Property<number>},
  strings: {[string]: Property<string>},
  phase: number,
  time: number,
  worldTime: number,
  scroll: number,
  y: number,
  vy: number,
  oldY: number,
  grounded: boolean,
  jumps: number,
  speed: number,
  score: number,
  best: number,
  distance: number,
  candyCount: number,
  lives: number,
  dash: number,
  dashCooldown: number,
  invincible: number,
  hitFlash: number,
  hitRecoil: number,
  landing: number,
  airTime: number,
  jumpPulse: number,
  combo: number,
  comboClock: number,
  collectFlash: number,
  collectX: number,
  collectY: number,
  obstacleX: number,
  pumpkinX: number,
  ghostX: number,
  ghostY: number,
  candyX: number,
  candyY: number,
  candyAlive: boolean,
  candy2X: number,
  candy2Y: number,
  candy2Alive: boolean,
  platformX: number,
  surfaceSide: number,
  flip: number,
  flipFrom: number,
  flipTarget: number,
  flipCooldown: number,
  attackTime: number,
  attackDuration: number,
  attackCooldown: number,
  attackComboClock: number,
  attackStage: number,
  attackQueued: boolean,
  projectileActive: boolean,
  projectileX: number,
  projectileY: number,
  projectileSide: number,
  projectileStage: number,
  attackHits: number,
  impactTimer: number,
  impactX: number,
  impactY: number,
  hitStop: number,
  underObstacleX: number,
  perfectTimer: number,
  perfectCooldown: number,
  slowMo: number,
  enemyShotX: number,
  enemyShotY: number,
  enemyShotActive: boolean,
  enemyShotCooldown: number,
  enemyShotWave: number,
  knightX: number,
  knightAlive: boolean,
  bossHp: number,
  bossHit: number,
  victoryTimer: number,
  damageDisabled: boolean,
  autoClearBoss: boolean,
  autoPilot: boolean,
  autoBeat: number,
  autoActionCooldown: number,
  bossAnnounced: boolean,
  jumpSound: AudioSource?,
  slashSound: AudioSource?,
  perfectSound: AudioSource?,
  impactSound: AudioSource?,
  bossSound: AudioSource?,
  rooftopMusic: AudioSource?,
  chaseMusic: AudioSource?,
  bossMusic: AudioSource?,
  musicSound: AudioSound?,
  musicMode: number,
  musicVolume: number,
  musicPaused: boolean,
  sugarMeter: number,
  sugarRush: number,
  sugarBurst: number,
  maxCombo: number,
  perfectCount: number,
  damageTaken: number,
  finishBonus: number,
  finisherTimer: number,
  jumpBuffer: number,
  coyoteTimer: number,
  jumpHeld: boolean,
  jumpHold: number,
  cancelFlash: number,
  pose: {[string]: number},
  lastDt: number,
}

local numberNames = {
  "action", "phase", "score", "lives", "playerX", "playerY", "playerPivotY", "playerRotation",
  "playerScaleX", "playerScaleY", "playerOpacity", "jumpCount", "bodyY",
  "bodyRotation", "bodyScaleX", "bodyScaleY", "headRotation", "hairRotation",
  "broomRotation", "legFront", "legBack", "kneeFront", "kneeBack",
  "armFront", "armBack", "elbowFront", "elbowBack", "capeRotation",
  "capeTipRotation", "scarfRotation", "scarfTipRotation", "hatRotation",
  "shadowX", "shadowY", "shadowScaleX", "shadowOpacity", "motionState",
  "surfaceSide", "surfaceY", "flipProgress", "flipFxX", "flipFxY",
  "flipFxRotation", "flipFxOpacity", "flipFxScale", "landingOpacity",
  "landingScale", "jumpFxOpacity", "jumpFxScale", "farX", "midX",
  "nearX", "groundX", "obstacleX", "obstacleY", "pumpkinX", "pumpkinY",
  "ghostX", "ghostY", "ghostOpacity", "candyX", "candyY", "candyOpacity",
  "candy2X", "candy2Y", "candy2Opacity", "platformX", "platformY",
  "platformOpacity", "underObstacleX", "underObstacleY", "underObstacleOpacity",
  "dashOpacity", "dashReady", "dodgeProgress", "afterX1", "afterX2", "afterY",
  "afterRotation", "afterOpacity1", "afterOpacity2", "attackState",
  "attackProgress", "attackReady", "attackHits", "slashX", "slashY",
  "slashRotation", "slashScale", "slashOpacity", "projectileX", "projectileY",
  "projectileRotation", "projectileOpacity", "impactX", "impactY", "impactScale",
  "impactOpacity", "cameraX", "cameraY", "jumpPulse", "hitOpacity",
  "menuOpacity", "playOpacity", "pauseOpacity", "dustPhase", "dustOpacity", "hintOpacity", "collectOpacity",
  "collectX", "collectY", "progress", "heart1", "heart2", "heart3",
  "chapter", "chapterOpacity", "chapterProgress", "warningX", "warningY",
  "warningOpacity", "warningScale", "perfectOpacity", "perfectScale",
  "slowMoOpacity", "speedLineOpacity", "vignetteOpacity", "foregroundX",
  "enemyShotX", "enemyShotY", "enemyShotOpacity", "enemyShotRotation",
  "knightX", "knightY", "knightOpacity", "knightGuard", "bossX", "bossY",
  "bossOpacity", "bossScale", "bossHp", "bossHitOpacity", "bossEyeOpacity",
  "chaseOpacity", "finishOpacity",
  "bossPhase", "bossShieldOpacity", "bossCoreOpacity", "bossArmRotation",
  "bossMouthScale", "factoryOpacity", "factoryDoorOpen", "factoryGlowOpacity",
  "bridgeBreakProgress", "bridgeBreakOpacity", "bridgeShardRotation",
  "finisherOpacity", "finisherScale", "finalFlashOpacity", "dangerCount",
  "inputBuffer", "coyoteReady", "cancelOpacity",
  "bossAttackType", "bossAttackProgress", "bossTelegraphOpacity",
  "bossTelegraphScale", "shockwaveX", "shockwaveY", "shockwaveOpacity",
  "shockwaveScale", "shockwaveEchoOpacity", "sweepY", "sweepOpacity", "bossImpactOpacity",
  "musicMode", "musicDuck",
  "skyX", "batY1", "batY2", "batY3", "batWingL", "batWingR",
  "sugarMeter", "sugarRushOpacity", "sugarRushScale", "sugarBurstOpacity",
  "difficultyLevel", "trialPace", "meteorX", "meteorY", "meteorOpacity",
  "meteorScale", "meteorTargetOpacity",
  "runTime", "perfectCount", "damageTaken",
}

local stringNames = {
  "scoreText", "distanceText", "candyText", "statusText", "comboText",
  "hint", "menuTitle", "menuSubtitle", "menuButton", "resultText",
  "dashText", "attackText", "chapterText", "objectiveText", "perfectText",
  "bossPhaseText", "gradeText",
  "bossAttackText", "rankText", "rivalText",
}

local TOP_Y = 534
local BOTTOM_Y = 543
local FLIP_DURATION = 0.24
local DASH_DURATION = 0.34
local DASH_COOLDOWN = 1.08
local PROJECTILE_SPEED = 1050
-- The run is deliberately paced as three full thirty-second acts.  Keeping
-- these boundaries named also prevents gameplay, music, and scenery from
-- silently drifting apart when the route is tuned.
local FACTORY_START = 30
local BOSS_START = 60
local BOSS_PHASE_TWO = 70
local BOSS_PHASE_THREE = 80
local RUN_LENGTH = 90
local BOSS_MAX_HP = 12
local JUMP_BUFFER_TIME = 0.14
local COYOTE_TIME = 0.11
local JUMP_HOLD_TIME = 0.17
-- Rive desktop keyboard events use GLFW key codes. Letters share ASCII values,
-- but navigation and modifier keys do not.
local KEY_SPACE = 32
local KEY_J = 74
local KEY_K = 75
local KEY_P = 80
local KEY_S = 83
local KEY_W = 87
local KEY_X = 88
local KEY_Z = 90
local KEY_ESCAPE = 256
local KEY_ENTER = 257
local KEY_RIGHT = 262
local KEY_DOWN = 264
local KEY_UP = 265
local KEY_LEFT_SHIFT = 340
local KEY_RIGHT_SHIFT = 344

local function playSound(source: AudioSource?)
  if source then Audio.play(source) end
end

local function put(self: Runner, name: string, value: number)
  local property = self.numbers[name]
  if property then property.value = value end
end

local function say(self: Runner, name: string, value: string)
  local property = self.strings[name]
  if property then property.value = value end
end

local function wrap(value: number, period: number): number
  return -(value % period)
end

local function resetWorld(self: Runner, play: boolean)
  if self.musicSound then self.musicSound:stop() end
  self.musicSound = nil
  self.musicMode = 0
  self.musicVolume = 0
  self.musicPaused = false
  self.sugarMeter = 0
  self.sugarRush = 0
  self.sugarBurst = 0
  self.phase = if play then 1 else 0
  self.worldTime = 0
  self.scroll = 0
  self.y = 534
  self.oldY = 534
  self.vy = 0
  self.grounded = true
  self.jumps = 0
  self.speed = 360
  self.score = 0
  self.distance = 0
  self.candyCount = 0
  self.lives = 3
  self.dash = 0
  self.dashCooldown = 0
  self.invincible = 0
  self.hitFlash = 0
  self.hitRecoil = 0
  self.landing = 0
  self.airTime = 0
  self.jumpPulse = 0
  self.combo = 0
  self.comboClock = 0
  self.collectFlash = 0
  self.collectX = 260
  self.collectY = 440
  self.obstacleX = 1020
  self.pumpkinX = 1780
  self.ghostX = 1450
  self.ghostY = 400
  self.candyX = 680
  self.candyY = 455
  self.candyAlive = true
  self.candy2X = 980
  self.candy2Y = 360
  self.candy2Alive = true
  self.platformX = 1190
  self.surfaceSide = 1
  self.flip = 0
  self.flipFrom = 1
  self.flipTarget = 1
  self.flipCooldown = 0
  self.attackTime = 0
  self.attackDuration = 0.3
  self.attackCooldown = 0
  self.attackComboClock = 0
  self.attackStage = 0
  self.attackQueued = false
  self.projectileActive = false
  self.projectileX = 300
  self.projectileY = 482
  self.projectileSide = 1
  self.projectileStage = 0
  self.attackHits = 0
  self.impactTimer = 0
  self.impactX = 600
  self.impactY = 482
  self.hitStop = 0
  self.underObstacleX = 1320
  self.perfectTimer = 0
  self.perfectCooldown = 0
  self.slowMo = 0
  self.enemyShotX = 1420
  self.enemyShotY = 470
  self.enemyShotActive = false
  self.enemyShotCooldown = 10.5
  self.enemyShotWave = 0
  self.knightX = 3100
  self.knightAlive = true
  self.bossHp = BOSS_MAX_HP
  self.bossHit = 0
  self.victoryTimer = 0
  self.damageDisabled = false
  self.autoClearBoss = false
  self.autoPilot = false
  self.autoBeat = 0
  self.autoActionCooldown = 0
  self.bossAnnounced = false
  self.maxCombo = 0
  self.perfectCount = 0
  self.damageTaken = 0
  self.finishBonus = 0
  self.finisherTimer = 0
  self.jumpBuffer = 0
  self.coyoteTimer = 0
  self.jumpHeld = false
  self.jumpHold = 0
  self.cancelFlash = 0
  self.pose = {}
  say(self, "menuTitle", "MIDNIGHT DELIVERY")
  say(self, "menuSubtitle", "The Sugar Moon is dying. Carry its last spark to the factory before the thirteenth bell.")
  say(self, "menuButton", "BEGIN THE RUN")
  say(self, "resultText", "One courier. One furnace. One last batch.")
  say(self, "hint", "SPACE jump     S flip     J attack     K dodge     P pause")
  say(self, "attackText", "BLADE READY")
  say(self, "chapterText", "I · THE LAST SPARK")
  say(self, "objectiveText", "CARRY THE MOON SUGAR ACROSS THE ROOFTOPS")
  say(self, "perfectText", "PERFECT DODGE")
  say(self, "bossPhaseText", "PHASE I · SUGAR VOLLEY")
  say(self, "gradeText", "NIGHT RANK  A")
  say(self, "bossAttackText", "READ THE ATTACK")
  say(self, "rankText", "TRIAL RANK  C")
  say(self, "rivalText", "GUILD PACE  +000")
end

local function init(self: Runner, context: Context): boolean
  local vm = context:viewModel()
  if vm == nil then return true end
  for _, name in numberNames do
    local property = vm:getNumber(name)
    if property then self.numbers[name] = property end
  end
  for _, name in stringNames do
    local property = vm:getString(name)
    if property then self.strings[name] = property end
  end
  self.jumpSound = context:audio("jump")
  self.slashSound = context:audio("slash")
  self.perfectSound = context:audio("perfect")
  self.impactSound = context:audio("impact")
  self.bossSound = context:audio("boss")
  self.rooftopMusic = context:audio("music-rooftop")
  self.chaseMusic = context:audio("music-chase")
  self.bossMusic = context:audio("music-boss-loop")
  resetWorld(self, false)
  return true
end

local function begin(self: Runner)
  resetWorld(self, true)
end

local function desiredMusicMode(self: Runner): number
  if self.phase ~= 1 and self.phase ~= 3 then return 0 end
  if self.worldTime >= BOSS_START then return 3 end
  if self.worldTime >= FACTORY_START then return 2 end
  return 1
end

local function musicSource(self: Runner, mode: number): AudioSource?
  if mode == 1 then return self.rooftopMusic end
  if mode == 2 then return self.chaseMusic end
  if mode == 3 then return self.bossMusic end
  return nil
end

local function updateMusic(self: Runner, dt: number)
  local desired = desiredMusicMode(self)
  if desired ~= self.musicMode then
    if self.musicSound then self.musicSound:stop() end
    self.musicSound = nil
    self.musicMode = desired
    self.musicPaused = false
    local source = musicSource(self, desired)
    if source then self.musicSound = Audio.play(source) end
  elseif desired > 0 and self.musicSound and self.musicSound:completed() then
    local source = musicSource(self, desired)
    self.musicSound = if source then Audio.play(source) else nil
  end

  if self.musicSound then
    if self.phase == 3 and not self.musicPaused then
      self.musicSound:pause()
      self.musicPaused = true
    elseif self.phase == 1 and self.musicPaused then
      self.musicSound:resume()
      self.musicPaused = false
    end

    local base = if desired == 1 then 0.48 elseif desired == 2 then 0.56 else 0.62
    local duck = if self.slowMo > 0 then 0.28 elseif self.hitFlash > 0 then 0.42 elseif self.bossHit > 0 then 0.62 else 1
    local target = base * duck
    self.musicVolume += (target - self.musicVolume) * math.min(1, dt * 12)
    self.musicSound.volume = self.musicVolume
  else
    self.musicVolume = 0
  end
end

local function smoothstep(value: number): number
  local p = math.max(0, math.min(1, value))
  return p * p * (3 - 2 * p)
end

local function currentBossAttack(self: Runner): (number, number)
  if self.worldTime < BOSS_PHASE_TWO then return 0, 0 end
  local phaseThree = self.worldTime >= BOSS_PHASE_THREE
  local startTime = if phaseThree then BOSS_PHASE_THREE else BOSS_PHASE_TWO
  local duration = if phaseThree then 1.65 else 2
  local elapsed = math.max(0, self.worldTime - startTime)
  local cycle = math.floor(elapsed / duration)
  local progress = (elapsed - cycle * duration) / duration
  local attackType = if phaseThree then cycle % 3 + 1 elseif cycle % 2 == 0 then 1 else 2
  return attackType, progress
end

local function bossPositionX(self: Runner): number
  return 1460 - math.min(1, math.max(0, (self.worldTime - BOSS_START) / 3.2)) * 390 + math.sin(self.worldTime * 1.7) * 10
end

local function sugarPressY(progress: number): number
  return 78 + math.min(1, math.max(0, (progress - 0.3) / 0.58)) * 602
end

local function flipSurface(self: Runner)
  if self.phase ~= 1 or self.flip > 0 or self.flipCooldown > 0 or self.dash > 0 then return end
  if self.surfaceSide == 1 and (not self.grounded or self.y < 500) then
    -- Down on the suspended upper rail drops toward the main bridge.
    self.grounded = false
    self.vy = math.max(self.vy, 180)
    return
  end
  if self.attackTime > 0 then
    self.attackTime = 0
    self.attackQueued = false
    self.cancelFlash = 0.2
  end
  self.flipFrom = self.surfaceSide
  self.flipTarget = -self.surfaceSide
  self.flip = FLIP_DURATION
  self.flipCooldown = 0.08
  self.grounded = true
  self.vy = 0
  self.jumps = 0
end

local function startAttack(self: Runner)
  self.attackStage = if self.attackComboClock > 0 then self.attackStage % 3 + 1 else 1
  self.attackDuration = if self.attackStage == 3 then 0.36 else 0.29
  self.attackTime = self.attackDuration
  self.attackCooldown = 0.16
  self.attackComboClock = 0.52
  self.attackQueued = false
  -- A heavy crescent keeps its strength and trajectory after the combo ends.
  -- Starting the next chain must not erase its still-travelling finisher.
  if not self.projectileActive or self.projectileStage ~= 3 then
    self.projectileActive = true
    self.projectileX = 306
    self.projectileY = if self.surfaceSide == 1 then self.y - 52 else BOTTOM_Y + 52
    self.projectileSide = self.surfaceSide
    self.projectileStage = self.attackStage
  end
  playSound(self.slashSound)
end

local function attack(self: Runner)
  if self.phase ~= 1 or self.hitRecoil > 0 or self.flip > 0 then return end
  if self.dash > 0 then
    local dodgeProgress = 1 - self.dash / DASH_DURATION
    if dodgeProgress < 0.28 then return end
    self.dash = 0
    self.cancelFlash = 0.2
  end
  if self.attackTime > 0 then
    if self.attackTime < 0.16 then self.attackQueued = true end
    return
  end
  if self.attackCooldown <= 0 then startAttack(self) end
end

local function performJump(self: Runner)
  local firstJump = self.grounded or (self.coyoteTimer > 0 and self.jumps == 0)
  if not firstJump and self.jumps >= 2 then return end
  if firstJump then self.jumps = 0 end
  self.vy = if self.jumps == 0 then -700 else -625
  self.grounded = false
  self.jumps += 1
  self.airTime = 0
  self.landing = 0
  self.jumpPulse = 1
  self.jumpBuffer = 0
  self.coyoteTimer = 0
  self.jumpHeld = true
  self.jumpHold = JUMP_HOLD_TIME
  playSound(self.jumpSound)
end

local function jump(self: Runner)
  if self.surfaceSide == -1 then
    flipSurface(self)
    return
  end
  if self.phase ~= 1 then return end
  if self.grounded or (self.coyoteTimer > 0 and self.jumps == 0) or self.jumps < 2 then
    performJump(self)
  else
    self.jumpBuffer = JUMP_BUFFER_TIME
  end
end

local function dash(self: Runner)
  if self.phase ~= 1 or self.dashCooldown > 0 then return end
  if self.attackTime > 0 then
    local attackProgress = 1 - self.attackTime / self.attackDuration
    if attackProgress < 0.3 then return end
    self.attackTime = 0
    self.attackQueued = false
    self.cancelFlash = 0.2
  end
  self.dash = DASH_DURATION
  self.dashCooldown = DASH_COOLDOWN
end

local function togglePause(self: Runner)
  if self.phase == 1 then
    self.phase = 3
  elseif self.phase == 3 then
    self.phase = 1
  end
end

local function act(self: Runner, action: number)
  if action == 1 then
    if self.phase == 0 or self.phase == 2 or self.phase == 4 then begin(self) end
    jump(self)
  elseif action == 2 then
    if self.phase == 0 or self.phase == 2 or self.phase == 4 then begin(self) end
    dash(self)
  elseif action == 3 then
    if self.phase == 0 or self.phase == 2 or self.phase == 4 then begin(self) end
  elseif action == 4 then
    togglePause(self)
  elseif action == 5 then
    if self.phase == 0 or self.phase == 2 or self.phase == 4 then begin(self) end
    flipSurface(self)
  elseif action == 6 then
    if self.phase == 0 or self.phase == 2 or self.phase == 4 then begin(self) end
    attack(self)
  elseif action == 7 then
    self.jumpHeld = false
    self.jumpHold = 0
    if self.vy < -280 then self.vy *= 0.62 end
  elseif action == 9 then
    -- Recording/demo route: a real auto-player performs the authored moves.
    begin(self)
    self.damageDisabled = true
    self.autoPilot = true
  elseif action == 10 then
    -- Headless gameplay QA: start with the reward state already active.
    begin(self)
    self.damageDisabled = true
    self.autoClearBoss = true
    self.sugarMeter = 1
    self.sugarRush = 5.5
    self.sugarBurst = 0.8
  elseif action == 11 then
    -- Headless rules QA: survive to the bell without damaging the boss.
    begin(self)
    self.damageDisabled = true
  elseif action == 12 then
    -- Combat regression route: full-health boss, real damage, no forced win.
    begin(self)
    self.worldTime = BOSS_START
    self.autoPilot = true
    self.autoBeat = 7
  end
end

local function pointerDown(self: Runner, event: PointerEvent)
  if self.phase == 0 or self.phase == 2 or self.phase == 4 then
    begin(self)
  elseif self.phase == 3 then
    togglePause(self)
  elseif event.position.x > 1180 and event.position.y < 120 then
    togglePause(self)
  elseif event.position.y > 620 then
    local x = event.position.x
    if math.abs(x - 90) <= 65 then
      jump(self)
    elseif math.abs(x - 235) <= 65 then
      flipSurface(self)
    elseif math.abs(x - 1045) <= 65 then
      attack(self)
    elseif math.abs(x - 1190) <= 65 then
      dash(self)
    end
  end
  event:hit()
end

local function _keyboardEvent(self: Runner, event: KeyboardEvent): boolean
  local key = event.key
  local jumpKey = key == KEY_SPACE or key == KEY_UP or key == KEY_W
  if jumpKey and event.phase == "up" then
    self.jumpHeld = false
    self.jumpHold = 0
    if self.vy < -280 then self.vy *= 0.62 end
    return true
  end
  if event.phase ~= "down" then return false end
  if self.phase == 0 or self.phase == 2 or self.phase == 4 then
    if key == KEY_ENTER or jumpKey or key == KEY_DOWN or key == KEY_S or key == KEY_J or key == KEY_Z or key == KEY_K or key == KEY_X or key == KEY_LEFT_SHIFT or key == KEY_RIGHT_SHIFT or key == KEY_RIGHT then
      begin(self)
    end
    return true
  end
  if key == KEY_ENTER then
    return true
  elseif key == KEY_P or key == KEY_ESCAPE then
    togglePause(self)
  elseif jumpKey then
    if self.phase == 0 then begin(self) else jump(self) end
  elseif key == KEY_DOWN or key == KEY_S then
    flipSurface(self)
  elseif key == KEY_J or key == KEY_Z then
    attack(self)
  elseif key == KEY_K or key == KEY_X or key == KEY_LEFT_SHIFT or key == KEY_RIGHT_SHIFT or key == KEY_RIGHT then
    dash(self)
  else
    return false
  end
  return true
end

local function awardScore(self: Runner, amount: number)
  self.score += amount * (if self.sugarRush > 0 then 2 else 1)
end

local function chargeSugar(self: Runner, amount: number)
  if self.sugarRush > 0 then
    self.sugarRush = math.min(6.5, self.sugarRush + amount * 1.8)
    return
  end
  self.sugarMeter = math.min(1, self.sugarMeter + amount)
  if self.sugarMeter >= 1 then
    self.sugarRush = 5.5
    self.sugarBurst = 0.8
    self.dashCooldown = 0
    self.attackCooldown = 0
    self.invincible = math.max(self.invincible, 0.28)
    playSound(self.perfectSound)
  end
end

local function collect(self: Runner, which: number)
  if which == 1 then
    self.candyAlive = false
    self.collectX = self.candyX
    self.collectY = self.candyY
  else
    self.candy2Alive = false
    self.collectX = self.candy2X
    self.collectY = self.candy2Y
  end
  self.candyCount += 1
  if self.comboClock > 0 then self.combo += 1 else self.combo = 1 end
  self.maxCombo = math.max(self.maxCombo, self.combo)
  self.comboClock = 2.25
  self.collectFlash = 0.55
  awardScore(self, 120 + self.combo * 30)
  chargeSugar(self, 0.38)
end

local function gameOver(self: Runner)
  self.phase = 2
  self.best = math.max(self.best, math.floor(self.score))
  say(self, "menuTitle", "NIGHT SHIFT OVER")
  say(self, "menuSubtitle", "The rooftops win this round. The candy still needs you.")
  say(self, "menuButton", "RUN AGAIN")
  say(self, "resultText", string.format("%04d m  •  %02d candies  •  best %06d", math.floor(self.distance), self.candyCount, self.best))
end

local function timeoutFailure(self: Runner)
  self.phase = 2
  self.best = math.max(self.best, math.floor(self.score))
  say(self, "menuTitle", "THE LAST SPARK FADED")
  say(self, "menuSubtitle", "The thirteenth bell rang before Mira broke the Hungry Cauldron.")
  say(self, "menuButton", "CHALLENGE THE NIGHT AGAIN")
  say(self, "resultText", string.format("Boss %02d%%  •  %02d perfect  •  max ×%d  •  %06d", math.ceil(self.bossHp / BOSS_MAX_HP * 100), self.perfectCount, self.maxCombo, math.floor(self.score)))
end

local function finishRun(self: Runner)
  local noHitBonus = if self.damageTaken == 0 then 1200 else 0
  local timeBonus = math.floor(math.max(0, RUN_LENGTH - self.worldTime) * 180)
  self.finishBonus = noHitBonus + self.lives * 250 + self.perfectCount * 140 + self.maxCombo * 90 + timeBonus
  self.score += self.finishBonus
  self.phase = 4
  self.best = math.max(self.best, math.floor(self.score))
  self.victoryTimer = 1
  self.finisherTimer = 1
  local rank = if self.score >= 9000 then "S" elseif self.score >= 6500 then "A" elseif self.score >= 4300 then "B" else "C"
  say(self, "menuTitle", "DELIVERY COMPLETE")
  say(self, "menuSubtitle", "Mira returned the last Moon Spark. The factory wakes before dawn.")
  say(self, "menuButton", "RUN THE NIGHT AGAIN")
  say(self, "resultText", string.format("%04d m  •  bonus +%04d  •  %02d perfect  •  max ×%d", math.floor(self.distance), self.finishBonus, self.perfectCount, self.maxCombo))
  say(self, "gradeText", "NIGHT RANK  " .. rank)
end

local function perfectDodge(self: Runner, x: number, y: number)
  if self.perfectCooldown > 0 then return end
  self.perfectTimer = 0.48
  self.perfectCooldown = 0.8
  self.slowMo = 0.18
  self.invincible = math.max(self.invincible, 0.62)
  self.impactTimer = math.max(self.impactTimer, 0.12)
  self.impactX = x
  self.impactY = y
  awardScore(self, 140)
  self.combo += 1
  self.maxCombo = math.max(self.maxCombo, self.combo)
  self.perfectCount += 1
  self.comboClock = 2.25
  self.attackCooldown = 0
  self.attackComboClock = math.max(self.attackComboClock, 0.52)
  chargeSugar(self, 0.55)
  playSound(self.perfectSound)
end

local function takeHit(self: Runner)
  if self.damageDisabled or self.invincible > 0 or self.dash > 0 or self.phase ~= 1 then return end
  self.lives -= 1
  self.damageTaken += 1
  self.invincible = 1.3
  self.hitFlash = 0.55
  self.hitRecoil = 0.38
  self.combo = 0
  self.comboClock = 0
  self.sugarRush = 0
  self.sugarMeter = math.max(0, self.sugarMeter - 0.4)
  self.sugarBurst = 0
  self.speed = math.max(330, self.speed - 35)
  playSound(self.impactSound)
  if self.lives <= 0 then gameOver(self) end
end

local function actorKinematics(self: Runner): (number, number, number)
  local actorX = 260
  local actorY = if self.surfaceSide == 1 then self.y - 52 else BOTTOM_Y + 52
  local rotation = 0
  if self.flip > 0 then
    local eased = smoothstep(1 - self.flip / FLIP_DURATION)
    local fromY = if self.flipFrom == 1 then TOP_Y - 52 else BOTTOM_Y + 52
    local toY = if self.flipTarget == 1 then TOP_Y - 52 else BOTTOM_Y + 52
    actorX += math.sin(eased * math.pi) * 38
    actorY = fromY + (toY - fromY) * eased
    rotation = math.sin(eased * math.pi) * (if self.flipTarget == -1 then 0.55 else -0.55)
  elseif self.dash > 0 then
    local progress = 1 - self.dash / DASH_DURATION
    actorX += math.sin(progress * math.pi) * 30
  end
  return actorX, actorY, rotation
end

local function playerOverlaps(self: Runner, x: number, centerY: number, halfWidth: number, halfHeight: number): boolean
  local playerX, playerCenterY = actorKinematics(self)
  return math.abs(x - playerX) < halfWidth + 14 and math.abs(centerY - playerCenterY) < halfHeight + 43
end

-- The root turns around the torso. Ground its lowest boot vertex after the
-- articulated pose, including the small sole outline, so running and recoil
-- never push a foot through the roof.
local bootSolePoints = {{-4, 18}, {5, 18}, {19, 24}, {5, 28}, {-5, 26}}

local function bootContactOffset(hipX: number, leg: number, knee: number, rotation: number, scaleX: number, scaleY: number): number
  local legSin = math.sin(leg)
  local legCos = math.cos(leg)
  local ankleSin = math.sin(leg + knee)
  local ankleCos = math.cos(leg + knee)
  local rootSin = math.sin(rotation)
  local rootCos = math.cos(rotation)
  local lowest = -math.huge
  for _, point in bootSolePoints do
    local x = hipX - legSin * 24 + ankleCos * point[1] - ankleSin * point[2]
    local y = -48 + legCos * 24 + ankleSin * point[1] + ankleCos * point[2]
    local rigX = x * 0.9
    local rigY = 52 + y * 0.9
    lowest = math.max(lowest, rootSin * scaleX * rigX + rootCos * scaleY * rigY)
  end
  local outline = 0.6 * 0.9 * math.sqrt((rootSin * scaleX) ^ 2 + (rootCos * scaleY) ^ 2)
  return lowest + outline
end

local function land(self: Runner, surfaceY: number, impactSpeed: number)
  if not self.grounded and impactSpeed > 260 then
    self.landing = 0.2
  end
  self.y = surfaceY
  self.vy = 0
  self.grounded = true
  self.jumps = 0
  self.airTime = 0
end

local function updatePlatforms(self: Runner, dt: number)
  if self.flip > 0 then return end
  if self.surfaceSide == -1 then
    self.y = BOTTOM_Y
    self.vy = 0
    self.grounded = true
    return
  end
  local platformLeft = self.platformX - 125
  local platformRight = self.platformX + 125
  local supported = 260 > platformLeft - 20 and 260 < platformRight + 20 and math.abs(self.y - 418) < 3
  if supported and self.vy >= 0 then
    land(self, 418, self.vy)
  elseif self.grounded and self.y < 500 then
    self.grounded = false
  end
  if not self.grounded then
    self.vy += 1950 * dt
    self.y += self.vy * dt
  end
  if self.vy >= 0 and self.oldY <= 418 and self.y >= 418 and 260 > platformLeft - 22 and 260 < platformRight + 22 then
    land(self, 418, self.vy)
  end
  if self.y >= 534 then
    land(self, 534, self.vy)
  end
end

local function registerAttackHit(self: Runner, x: number, y: number, score: number)
  self.projectileActive = false
  self.attackHits += 1
  self.impactTimer = 0.18
  self.impactX = x
  self.impactY = y
  self.hitStop = 0.045
  awardScore(self, score)
  chargeSugar(self, 0.16)
  playSound(self.impactSound)
end

local function updateAutoPilot(self: Runner, dt: number)
  if not self.autoPilot or self.phase ~= 1 then return end
  self.autoActionCooldown = math.max(0, self.autoActionCooldown - dt)

  -- A short opening choreography makes every core move legible on camera.
  local beats = {2.2, 4.4, 8.4, 10.2, 12.4, 15.2, 18.0}
  if self.autoBeat < #beats and self.worldTime >= beats[self.autoBeat + 1] then
    self.autoBeat += 1
    if self.autoBeat == 1 or self.autoBeat == 7 then
      jump(self)
    elseif self.autoBeat == 2 or self.autoBeat == 4 then
      attack(self)
    elseif self.autoBeat == 3 or self.autoBeat == 5 then
      flipSurface(self)
    elseif self.autoBeat == 6 then
      dash(self)
    end
    self.autoActionCooldown = 0.28
    return
  end
  if self.autoBeat < #beats or self.autoActionCooldown > 0 then return end

  local bossAttackType, bossAttackProgress = currentBossAttack(self)
  if self.worldTime >= BOSS_PHASE_TWO then
    if bossAttackType == 1 and bossAttackProgress >= 0.38 and bossAttackProgress < 0.46 and self.surfaceSide == 1 and self.grounded then
      jump(self)
      self.autoActionCooldown = 0.42
      return
    elseif bossAttackType == 2 and bossAttackProgress >= 0.08 and bossAttackProgress < 0.16 and self.surfaceSide == 1 then
      flipSurface(self)
      self.autoActionCooldown = 0.42
      return
    elseif bossAttackType == 2 and bossAttackProgress >= 0.73 and bossAttackProgress < 0.82 and self.surfaceSide == -1 then
      flipSurface(self)
      self.autoActionCooldown = 0.42
      return
    elseif bossAttackType == 3 and bossAttackProgress >= 0.59 and bossAttackProgress < 0.66 and self.dashCooldown <= 0 then
      dash(self)
      self.autoActionCooldown = 0.42
      return
    end
  end

  if self.worldTime >= BOSS_START then
    if self.surfaceSide == -1 and bossAttackType ~= 2 and self.flip <= 0 then
      flipSurface(self)
      self.autoActionCooldown = 0.25
      return
    end
    -- Defend first, then complete a chain and let the heavy crescent land.
    local bossPhase = if self.worldTime >= BOSS_PHASE_THREE then 3 elseif self.worldTime >= BOSS_PHASE_TWO then 2 else 1
    if self.projectileActive and self.projectileStage == 3 then return end
    if bossPhase >= 2 and self.attackStage < 3 then
      attack(self)
      self.autoActionCooldown = 0.07
    elseif not self.projectileActive and self.attackTime <= 0 and (self.attackStage ~= 3 or self.attackComboClock <= 0) then
      attack(self)
      self.autoActionCooldown = 0.16
    end
    return
  end

  local attackThreat = self.enemyShotActive and self.enemyShotX > 330 and self.enemyShotX < 760
    or self.knightAlive and self.knightX > 330 and self.knightX < 760
    or self.ghostX > 330 and self.ghostX < 650
    or self.pumpkinX > 330 and self.pumpkinX < 610
  if attackThreat and self.attackTime <= 0 then
    attack(self)
    self.autoActionCooldown = 0.2
    return
  end
  if self.surfaceSide == 1 and self.grounded and self.obstacleX > 310 and self.obstacleX < 500 then
    jump(self)
    self.autoActionCooldown = 0.38
    return
  end
  if self.enemyShotActive and self.enemyShotX > 270 and self.enemyShotX < 430 and self.dashCooldown <= 0 then
    dash(self)
    self.autoActionCooldown = 0.4
  end
end

local function step(self: Runner, dt: number)
  self.lastDt = dt
  if self.hitStop > 0 then
    self.hitStop = math.max(0, self.hitStop - dt)
    self.impactTimer = math.max(0, self.impactTimer - dt)
    return
  end

  self.worldTime += dt
  if self.worldTime >= BOSS_START and not self.bossAnnounced then
    self.bossAnnounced = true
    playSound(self.bossSound)
  end
  self.perfectTimer = math.max(0, self.perfectTimer - dt)
  self.perfectCooldown = math.max(0, self.perfectCooldown - dt)
  self.slowMo = math.max(0, self.slowMo - dt)
  self.bossHit = math.max(0, self.bossHit - dt * 3.8)
  self.victoryTimer = math.max(0, self.victoryTimer - dt * 0.7)
  self.jumpBuffer = math.max(0, self.jumpBuffer - dt)
  self.coyoteTimer = math.max(0, self.coyoteTimer - dt)
  self.cancelFlash = math.max(0, self.cancelFlash - dt)
  self.sugarBurst = math.max(0, self.sugarBurst - dt * 1.7)
  if self.sugarRush > 0 then
    self.sugarRush = math.max(0, self.sugarRush - dt)
    self.sugarMeter = math.min(1, self.sugarRush / 5.5)
  end
  self.oldY = self.y
  local speedCap = if self.worldTime >= BOSS_START then 680 elseif self.worldTime >= FACTORY_START then 650 else 610
  local acceleration = if self.worldTime >= FACTORY_START then 9.2 else 4.6
  self.speed = math.min(speedCap, self.speed + dt * acceleration)
  local dodgeProgress = if self.dash > 0 then 1 - self.dash / DASH_DURATION else 0
  local dodgeBurst = if self.dash > 0 then math.sin(math.max(0, math.min(1, dodgeProgress)) * math.pi) else 0
  local timeScale = if self.slowMo > 0 then 0.32 else 1
  local rushBoost = if self.sugarRush > 0 then 0.14 else 0
  local travel = self.speed * dt * timeScale * (1 + dodgeBurst * 0.42 + rushBoost)
  self.scroll += travel
  self.distance += travel / 22
  awardScore(self, travel * 0.09)

  local oldFlip = self.flip
  self.flip = math.max(0, self.flip - dt)
  self.flipCooldown = math.max(0, self.flipCooldown - dt)
  if oldFlip > 0 and self.flip <= 0 then
    self.surfaceSide = self.flipTarget
    self.y = if self.surfaceSide == 1 then TOP_Y else BOTTOM_Y
    self.grounded = true
    self.vy = 0
    self.jumps = 0
  end

  self.dash = math.max(0, self.dash - dt)
  self.dashCooldown = math.max(0, self.dashCooldown - dt)
  self.attackCooldown = math.max(0, self.attackCooldown - dt)
  self.attackComboClock = math.max(0, self.attackComboClock - dt)
  local oldAttack = self.attackTime
  self.attackTime = math.max(0, self.attackTime - dt)
  if oldAttack > 0 and self.attackTime <= 0 and self.attackQueued then
    startAttack(self)
  end
  if self.attackComboClock <= 0 and self.attackTime <= 0 then self.attackStage = 0 end
  if self.projectileActive then
    self.projectileX += PROJECTILE_SPEED * dt
    if self.projectileX > 1360 then self.projectileActive = false end
  end
  self.invincible = math.max(0, self.invincible - dt)
  self.hitFlash = math.max(0, self.hitFlash - dt * 2.6)
  self.hitRecoil = math.max(0, self.hitRecoil - dt)
  self.landing = math.max(0, self.landing - dt)
  self.jumpPulse = math.max(0, self.jumpPulse - dt * 3.8)
  self.comboClock = math.max(0, self.comboClock - dt)
  self.collectFlash = math.max(0, self.collectFlash - dt * 2.2)
  self.impactTimer = math.max(0, self.impactTimer - dt)
  if self.comboClock <= 0 then self.combo = 0 end
  updateAutoPilot(self, dt)

  if not self.grounded and self.jumpHeld and self.jumpHold > 0 and self.vy < 0 then
    self.vy -= 760 * dt
    self.jumpHold = math.max(0, self.jumpHold - dt)
  else
    self.jumpHold = math.max(0, self.jumpHold - dt * 2)
  end

  local wasGrounded = self.grounded
  updatePlatforms(self, dt)
  if wasGrounded and not self.grounded and self.jumps == 0 then
    self.coyoteTimer = COYOTE_TIME
  end
  if self.grounded and self.jumpBuffer > 0 then
    performJump(self)
  end
  if not self.grounded then self.airTime += dt end

  self.obstacleX -= travel
  self.pumpkinX -= travel * 0.98
  self.ghostX -= travel * 0.9
  local dive = if self.ghostX < 930 and self.ghostX > 250 then math.sin(math.min(1, math.max(0, (930 - self.ghostX) / 680)) * math.pi) else 0
  self.ghostY = 382 + math.sin(self.worldTime * 2.6) * 42 + dive * 92
  self.candyX -= travel
  self.candy2X -= travel
  self.platformX -= travel
  self.underObstacleX -= travel * 1.03
  if self.knightAlive then self.knightX -= travel * 0.92 end

  self.enemyShotCooldown = math.max(0, self.enemyShotCooldown - dt)
  if not self.enemyShotActive and self.worldTime > 11 and self.enemyShotCooldown <= 0 then
    self.enemyShotActive = true
    self.enemyShotWave += 1
    self.enemyShotX = if self.worldTime >= BOSS_START then 1060 else 1260
    self.enemyShotY = if self.enemyShotWave % 3 == 0 then 382 elseif self.enemyShotWave % 2 == 0 then 485 else 598
    self.enemyShotCooldown = if self.worldTime >= BOSS_PHASE_THREE then 0.52 elseif self.worldTime >= BOSS_PHASE_TWO then 0.72 elseif self.worldTime >= BOSS_START then 0.95 elseif self.worldTime >= FACTORY_START then 1.65 else 2.45
  end
  if self.enemyShotActive then
    local shotSpeed = if self.worldTime >= BOSS_PHASE_THREE then 1.86 elseif self.worldTime >= BOSS_PHASE_TWO then 1.62 else 1.42
    self.enemyShotX -= travel * shotSpeed
    self.enemyShotY += math.sin(self.worldTime * 9 + self.enemyShotWave) * dt * 22
    if self.enemyShotX < -80 then self.enemyShotActive = false end
  end

  if self.obstacleX < -100 then self.obstacleX = if self.worldTime >= BOSS_START - 4 then 1120 elseif self.worldTime >= FACTORY_START then 1360 else 1720 end
  if self.pumpkinX < -100 then self.pumpkinX = if self.worldTime >= BOSS_START then 1380 elseif self.worldTime >= FACTORY_START then 1660 else 2240 end
  if self.ghostX < -100 then self.ghostX = if self.worldTime >= BOSS_START - 4 then 1250 elseif self.worldTime >= FACTORY_START - 2 then 1540 else 2100 end
  if self.platformX < -180 then self.platformX = 2020 end
  if self.underObstacleX < -100 then self.underObstacleX = if self.worldTime >= BOSS_START - 4 then 1220 elseif self.worldTime >= FACTORY_START + 4 then 1480 else 1860 end
  if self.knightX < -120 then
    self.knightX = if self.worldTime < BOSS_START - 4 then 1940 else 1450
    self.knightAlive = true
  end
  if self.candyX < -60 then
    self.candyX = 1300 + math.random() * 360
    self.candyY = if math.random() > 0.45 then 455 else 350
    self.candyAlive = true
  end
  if self.candy2X < -60 then
    self.candy2X = 1580 + math.random() * 460
    self.candy2Y = 325 + math.random() * 125
    self.candy2Alive = true
  end

  -- Every player gets the same clear arena; the boss owns the final hazards.
  if self.worldTime >= BOSS_START then
    self.obstacleX = 1780
    self.pumpkinX = 1960
    self.ghostX = 1640
    self.underObstacleX = 1880
    self.knightX = 1720
    self.platformX = 2020
  end

  if self.candyAlive and playerOverlaps(self, self.candyX, self.candyY, 10, 10) then collect(self, 1) end
  if self.candy2Alive and playerOverlaps(self, self.candy2X, self.candy2Y, 10, 10) then collect(self, 2) end

  if self.projectileActive then
    local bossX = bossPositionX(self)
    if self.enemyShotActive and math.abs(self.projectileX - self.enemyShotX) < 34 and math.abs(self.projectileY - self.enemyShotY) < 70 then
      local hitX = self.enemyShotX
      local hitY = self.enemyShotY
      self.enemyShotActive = false
      registerAttackHit(self, hitX, hitY, 80)
      if self.projectileStage == 3 then self.projectileActive = true end
    elseif self.projectileSide == 1 and self.knightAlive and math.abs(self.projectileX - self.knightX) < 48 then
      local hitX = self.knightX
      if self.projectileStage == 3 then
        self.knightAlive = false
        self.knightX = 1980
        registerAttackHit(self, hitX, 486, 180)
      else
        registerAttackHit(self, hitX, 486, 35)
      end
    elseif self.worldTime >= BOSS_START and self.bossHp > 0 and math.abs(self.projectileX - (bossX - 92)) < 64 and math.abs(self.projectileY - 445) < 130 then
      local bossPhase = if self.worldTime >= BOSS_PHASE_THREE then 3 elseif self.worldTime >= BOSS_PHASE_TWO then 2 else 1
      if bossPhase >= 2 and self.projectileStage ~= 3 then
        registerAttackHit(self, bossX - 112, 445, 35)
      else
        local damage = if bossPhase == 3 and self.projectileStage == 3 then 2 else 1
        local phaseFloor = if bossPhase == 1 then 8 elseif bossPhase == 2 then 6 else 0
        local actualDamage = math.min(damage, math.max(0, self.bossHp - phaseFloor))
        self.bossHp -= actualDamage
        self.bossHit = if actualDamage > 0 then 1 else 0
        registerAttackHit(self, bossX - 92, 445, if actualDamage > 0 then 240 * actualDamage else 10)
        if self.bossHp <= 0 and self.worldTime >= BOSS_PHASE_THREE then
          awardScore(self, 1400)
          finishRun(self)
        end
      end
    elseif self.projectileSide == 1 and math.abs(self.projectileX - self.obstacleX) < 43 then
      local hitX = self.obstacleX
      self.obstacleX = 1650
      registerAttackHit(self, hitX, 500, 95)
    elseif self.projectileSide == 1 and math.abs(self.projectileX - self.pumpkinX) < 42 then
      local hitX = self.pumpkinX
      self.pumpkinX = 2120
      registerAttackHit(self, hitX, 500, 115)
    elseif math.abs(self.projectileX - self.ghostX) < 38 and math.abs(self.projectileY - self.ghostY) < 72 then
      local hitX = self.ghostX
      local hitY = self.ghostY
      self.ghostX = 1840
      registerAttackHit(self, hitX, hitY, 125)
    elseif self.projectileSide == -1 and math.abs(self.projectileX - self.underObstacleX) < 38 then
      local hitX = self.underObstacleX
      self.underObstacleX = 1850
      registerAttackHit(self, hitX, 604, 110)
    end
  end

  local actorX = actorKinematics(self)
  local hitObstacle = self.surfaceSide == 1 and self.flip <= 0 and math.abs(self.obstacleX - actorX) < 39 and self.y > 492
  local hitPumpkin = self.surfaceSide == 1 and self.flip <= 0 and math.abs(self.pumpkinX - actorX) < 37 and self.y > 494
  local hitUnder = self.surfaceSide == -1 and self.flip <= 0 and math.abs(self.underObstacleX - actorX) < 36
  local hitGhost = playerOverlaps(self, self.ghostX, self.ghostY, 20, 20)
  local hitKnight = self.knightAlive and self.surfaceSide == 1 and self.flip <= 0 and math.abs(self.knightX - actorX) < 45 and self.y > 476
  local hitShot = self.enemyShotActive and playerOverlaps(self, self.enemyShotX, self.enemyShotY, 15, 15)
  if hitObstacle or hitPumpkin or hitUnder or hitGhost or hitKnight or hitShot then
    if self.dash > 0 then
      local dangerX = if hitShot then self.enemyShotX elseif hitKnight then self.knightX elseif hitGhost then self.ghostX elseif hitUnder then self.underObstacleX elseif hitPumpkin then self.pumpkinX else self.obstacleX
      local dangerY = if hitShot then self.enemyShotY elseif hitGhost then self.ghostY elseif hitUnder then 604 else 490
      perfectDodge(self, dangerX, dangerY)
      if hitShot then self.enemyShotActive = false end
    else
      takeHit(self)
      if hitShot then self.enemyShotActive = false end
    end
  end

  local bossAttackType, bossAttackProgress = currentBossAttack(self)
  local hitBossAttack = false
  local bossDangerX = actorX + 24
  local bossDangerY = 490
  if bossAttackType == 1 and bossAttackProgress >= 0.22 and bossAttackProgress <= 0.78 then
    local bossX = bossPositionX(self)
    local waveTravel = (bossAttackProgress - 0.22) / 0.56
    local shockwaveX = bossX - waveTravel * 1080
    local hitPrimaryWave = math.abs(shockwaveX - actorX) < 42
    local hitEchoWave = self.worldTime >= BOSS_PHASE_THREE and math.abs((shockwaveX + 142 * (0.72 + waveTravel * 0.55)) - actorX) < 38
    hitBossAttack = self.surfaceSide == 1 and self.flip <= 0 and self.y > 482 and (hitPrimaryWave or hitEchoWave)
    bossDangerX = shockwaveX
    bossDangerY = 510
  elseif bossAttackType == 2 and bossAttackProgress >= 0.24 and bossAttackProgress <= 0.66 then
    hitBossAttack = self.surfaceSide == 1 and self.flip <= 0 and self.y > 425
    bossDangerY = 458
  elseif bossAttackType == 3 and bossAttackProgress >= 0.3 and bossAttackProgress <= 0.88 then
    local pressY = sugarPressY(bossAttackProgress)
    hitBossAttack = self.flip <= 0 and playerOverlaps(self, 260, pressY, 34, 23)
    bossDangerX = 260
    bossDangerY = pressY
  end
  if hitBossAttack then
    if self.dash > 0 then
      perfectDodge(self, bossDangerX, bossDangerY)
    else
      takeHit(self)
    end
  end

  if self.autoClearBoss and self.worldTime >= RUN_LENGTH - 0.2 then self.bossHp = 0 end
  if self.worldTime >= RUN_LENGTH and self.phase == 1 then
    if self.bossHp <= 0 then finishRun(self) else timeoutFailure(self) end
  end
end

local function smoothPose(self: Runner, name: string, target: number, rate: number): number
  local previous = self.pose[name]
  if previous == nil then
    self.pose[name] = target
    return target
  end
  local alpha = 1 - math.exp(-math.max(1 / 240, self.lastDt) * rate)
  local value = previous + (target - previous) * alpha
  self.pose[name] = value
  return value
end

local function publish(self: Runner)
  local active = self.phase == 1 or self.phase == 3
  local cycle = self.worldTime * (8.8 + self.speed / 120)
  local air = not self.grounded
  local stride = math.sin(cycle)
  local lift = math.cos(cycle)
  local footfall = math.abs(lift)
  local motionState = 0
  local actorX, actorY, kinematicRotation = actorKinematics(self)
  local playerX = actorX
  local playerY = self.y
  local playerRotation = 0
  local playerScaleX = 1
  local playerScaleY = 1
  local bodyY = -38
  local bodyRotation = 0
  local bodyScaleX = 1
  local bodyScaleY = 1
  local headRotation = 0
  local hairRotation = -0.04
  local broomRotation = 0
  local legFront = -0.12
  local legBack = 0.12
  local kneeFront = 0.18
  local kneeBack = 0.18
  local armFront = -0.55
  local armBack = 0.25
  local elbowFront = 0.72
  local elbowBack = 0.68
  local capeRotation = -0.18
  local capeTipRotation = 0.03
  local scarfRotation = -0.12
  local scarfTipRotation = 0.02
  local hatRotation = 0
  local absoluteRootRotation = false

  if self.phase == 0 then
    local breathe = math.sin(self.time * 2.2)
    bodyY = -38 + breathe * 1.2
    bodyScaleY = 1 + breathe * 0.012
    headRotation = -breathe * 0.02
    capeRotation = -0.1 + breathe * 0.025
    scarfRotation = -0.08 + breathe * 0.02
  elseif self.phase == 4 then
    motionState = 14
    local celebrate = math.sin(self.time * 5.5)
    playerY = self.y - 6 - math.abs(celebrate) * 4
    bodyY = -43
    bodyRotation = -0.12
    headRotation = 0.08
    legFront = -0.42
    legBack = 0.5
    kneeFront = 1.1
    kneeBack = 0.92
    armFront = -1.55 + celebrate * 0.08
    armBack = 1.25 - celebrate * 0.08
    elbowFront = 0.28
    elbowBack = 0.34
    capeRotation = -0.35
    capeTipRotation = -0.18
    scarfRotation = -0.4
    scarfTipRotation = -0.2
  elseif self.phase == 2 then
    motionState = 7
    playerRotation = -0.12
    playerScaleY = 0.94
    bodyY = -33
    bodyRotation = -0.28
    headRotation = 0.22
    legFront = 0.35
    legBack = -0.5
    kneeFront = 0.95
    kneeBack = 0.75
    armFront = 0.72
    armBack = -0.62
    elbowFront = 0.42
    elbowBack = 1.05
    capeRotation = 0.12
    capeTipRotation = 0.22
  elseif self.hitRecoil > 0 then
    motionState = 6
    local recoil = self.hitRecoil / 0.38
    playerX = 260 - recoil * 24
    playerRotation = -0.2 * recoil
    bodyY = -39 - recoil * 5
    bodyRotation = -0.38 * recoil
    bodyScaleX = 1.06
    bodyScaleY = 0.94
    headRotation = 0.28 * recoil
    hairRotation = 0.22 * recoil
    legFront = 0.62
    legBack = -0.72
    kneeFront = 0.85
    kneeBack = 0.45
    armFront = 0.8
    armBack = -0.82
    elbowFront = 0.36
    elbowBack = 1.18
    capeRotation = 0.24
    capeTipRotation = 0.3
    scarfRotation = 0.22
    scarfTipRotation = 0.3
  elseif self.flip > 0 then
    motionState = if self.flipTarget == -1 then 8 else 10
    local progress = smoothstep(1 - self.flip / FLIP_DURATION)
    local tuck = math.sin(progress * math.pi)
    playerRotation = kinematicRotation
    absoluteRootRotation = true
    playerScaleX = 1 - tuck * 0.08
    local fromScaleY = if self.flipFrom == 1 then 1 else -1
    local toScaleY = if self.flipTarget == 1 then 1 else -1
    local surfaceMorph = fromScaleY + (toScaleY - fromScaleY) * progress
    if math.abs(surfaceMorph) < 0.18 then surfaceMorph = if progress < 0.5 then 0.18 else -0.18 end
    playerScaleY = (1 + tuck * 0.06) * surfaceMorph
    bodyY = -41
    bodyRotation = -0.18 + progress * 0.36
    headRotation = 0.11 - progress * 0.22
    legFront = -0.72
    legBack = 0.66
    kneeFront = 1.38
    kneeBack = 1.15
    armFront = -1.05
    armBack = 0.82
    elbowFront = 0.42
    elbowBack = 0.92
    capeRotation = -0.35 + progress * 0.42
    capeTipRotation = -0.18 + progress * 0.4
    scarfRotation = -0.46 + progress * 0.35
    scarfTipRotation = -0.24 + progress * 0.42
    hatRotation = math.sin(progress * math.pi) * -0.09
  elseif self.dash > 0 then
    motionState = 5
    local dashWave = math.sin(self.worldTime * 34)
    playerRotation = 0.08
    playerScaleX = 1.08
    playerScaleY = 0.94
    bodyY = -44
    bodyRotation = 0.24
    bodyScaleX = 1.07
    bodyScaleY = 0.92
    headRotation = -0.15
    hairRotation = -0.28 + dashWave * 0.025
    broomRotation = -0.08
    legFront = -1.12
    legBack = -0.78
    kneeFront = 1.18
    kneeBack = 1.35
    armFront = -1.3
    armBack = -1.08
    elbowFront = 0.18
    elbowBack = 0.3
    capeRotation = -0.42 + dashWave * 0.025
    capeTipRotation = -0.2 + dashWave * 0.04
    scarfRotation = -0.4
    scarfTipRotation = -0.18 + dashWave * 0.04
    hatRotation = -0.055
  elseif self.attackTime > 0 then
    motionState = 10 + self.attackStage
    local attackProgress = 1 - self.attackTime / self.attackDuration
    local cut = math.sin(math.min(1, attackProgress) * math.pi)
    if self.attackStage == 1 then
      -- Fast horizontal cut: low stance and a long forward silhouette.
      playerScaleX = 1 + cut * 0.06
      playerScaleY = 1 - cut * 0.035
      bodyY = -40 - cut * 2
      bodyRotation = 0.13 + cut * 0.2
      headRotation = -0.08 * cut
      legFront = 0.25 - cut * 0.5
      legBack = -0.18 + cut * 0.34
      kneeFront = 0.42 + cut * 0.42
      kneeBack = 0.55 + cut * 0.25
      armFront = -1.3 + attackProgress * 1.9
      armBack = 0.55 - cut * 0.42
      elbowFront = 0.18 + (1 - cut) * 0.38
      elbowBack = 0.82
    elseif self.attackStage == 2 then
      -- Rising cut: torso opens upward and both feet briefly leave the run line.
      playerY -= cut * 7
      playerRotation += -0.08 * cut
      playerScaleX = 0.98
      playerScaleY = 1 + cut * 0.06
      bodyY = -43 - cut * 4
      bodyRotation = -0.2 - cut * 0.16
      headRotation = 0.13 * cut
      legFront = -0.72
      legBack = 0.48
      kneeFront = 1.22
      kneeBack = 0.92
      armFront = 0.75 - attackProgress * 2.25
      armBack = -0.52 + cut * 0.35
      elbowFront = 0.24
      elbowBack = 1.02
    else
      -- Heavy finisher: visible anticipation followed by a compressed slam.
      local anticipation = math.max(0, 1 - attackProgress * 4)
      playerScaleX = 1 + cut * 0.1
      playerScaleY = 1 - cut * 0.08
      bodyY = -35 - cut * 7
      bodyRotation = -0.34 * anticipation + cut * 0.48
      headRotation = 0.18 * anticipation - cut * 0.12
      legFront = -0.38 + cut * 0.55
      legBack = 0.46 - cut * 0.58
      kneeFront = 0.95 + cut * 0.42
      kneeBack = 0.82 + cut * 0.36
      armFront = -2.1 + attackProgress * 2.85
      armBack = -1.25 + cut * 1.05
      elbowFront = 0.12
      elbowBack = 0.3
    end
    hairRotation = -0.16 - cut * 0.12
    capeRotation = -0.3 - cut * 0.16
    capeTipRotation = -0.12 - cut * 0.24
    scarfRotation = -0.32 - cut * 0.16
    scarfTipRotation = -0.16 - cut * 0.22
    hatRotation = -0.045 * cut
  elseif self.landing > 0 then
    motionState = 4
    local compression = self.landing / 0.2
    bodyY = -30 + (1 - compression) * -8
    bodyRotation = 0.16 * compression
    bodyScaleX = 1 + compression * 0.13
    bodyScaleY = 1 - compression * 0.18
    headRotation = -0.11 * compression
    legFront = 0.24
    legBack = -0.24
    kneeFront = 1.12 * compression + 0.2
    kneeBack = 1.02 * compression + 0.2
    armFront = -0.18
    armBack = 0.22
    elbowFront = 1.08
    elbowBack = 0.92
    capeRotation = 0.12 * compression
    capeTipRotation = 0.24 * compression
    hatRotation = 0.045 * compression
  elseif air and self.vy < 40 then
    motionState = 2
    local rise = math.min(1, math.max(0, -self.vy / 700))
    bodyY = -42
    bodyRotation = -0.13 + rise * 0.04
    bodyScaleX = 0.96
    bodyScaleY = 1.05
    headRotation = 0.1
    hairRotation = -0.12
    legFront = -0.48
    legBack = 0.42
    kneeFront = 1.24
    kneeBack = 0.78
    armFront = -1.02
    armBack = 0.52
    elbowFront = 0.56
    elbowBack = 0.94
    capeRotation = -0.28
    capeTipRotation = -0.14
    scarfRotation = -0.3
    scarfTipRotation = -0.16
    if self.jumps == 2 then
      local spin = math.min(1, self.airTime / 0.28)
      playerRotation = spin * 6.2831853
      legFront = -0.72
      legBack = 0.66
      kneeFront = 1.38
      kneeBack = 1.12
    end
  elseif air then
    motionState = 3
    local fall = math.min(1, math.max(0, self.vy / 720))
    bodyY = -39 + fall * 2
    bodyRotation = 0.08 + fall * 0.1
    headRotation = -0.08 - fall * 0.04
    hairRotation = -0.18 - fall * 0.08
    legFront = 0.14
    legBack = -0.34
    kneeFront = 0.2 + fall * 0.12
    kneeBack = 0.58
    armFront = -0.24
    armBack = 0.52
    elbowFront = 0.98
    elbowBack = 0.74
    capeRotation = -0.34
    capeTipRotation = -0.16
    scarfRotation = -0.35
    scarfTipRotation = -0.2
  else
    motionState = if self.surfaceSide == -1 then 9 else 1
    bodyY = -38 + footfall * 2.5
    bodyRotation = 0.22 + stride * 0.025
    headRotation = -0.04 - stride * 0.018
    hairRotation = -0.1 + math.sin(cycle - 0.65) * 0.08
    broomRotation = 0.05 + stride * 0.035
    legFront = stride * 0.82
    legBack = -stride * 0.82
    kneeFront = 0.12 + math.max(0, -stride) * 1.02 + math.max(0, lift) * 0.12
    kneeBack = 0.12 + math.max(0, stride) * 1.02 + math.max(0, -lift) * 0.12
    armFront = -stride * 0.62 - 0.48
    armBack = stride * 0.62 - 0.22
    elbowFront = 0.62 + math.max(0, stride) * 0.42
    elbowBack = 0.68 + math.max(0, -stride) * 0.38
    capeRotation = -0.2 + math.sin(cycle * 0.62 - 0.75) * 0.11
    capeTipRotation = -0.03 + math.sin(cycle * 0.62 - 1.55) * 0.17
    scarfRotation = -0.2 + math.sin(cycle * 0.62 - 0.95) * 0.1
    scarfTipRotation = -0.04 + math.sin(cycle * 0.62 - 1.85) * 0.16
    hatRotation = math.sin(cycle * 0.5) * 0.026
    if self.surfaceSide == -1 then
      -- The underside uses a compact hand-over-hand silhouette rather than a
      -- mechanically rotated copy of the rooftop sprint.
      bodyY = -35 + footfall * 1.2
      bodyRotation = -0.12 + stride * 0.05
      headRotation = 0.1 - stride * 0.025
      legFront = stride * 0.48 - 0.28
      legBack = -stride * 0.48 + 0.28
      kneeFront = 0.72 + math.max(0, -stride) * 0.48
      kneeBack = 0.72 + math.max(0, stride) * 0.48
      armFront = -1.15 + stride * 0.5
      armBack = -1.15 - stride * 0.5
      elbowFront = 0.28 + math.max(0, -stride) * 0.34
      elbowBack = 0.28 + math.max(0, stride) * 0.34
      capeRotation = 0.08 + math.sin(cycle * 0.55) * 0.13
      capeTipRotation = 0.2 + math.sin(cycle * 0.55 - 0.8) * 0.17
      scarfRotation = 0.14 + math.sin(cycle * 0.55 - 0.3) * 0.11
      scarfTipRotation = 0.25 + math.sin(cycle * 0.55 - 1.1) * 0.15
    end
  end

  local poseRate = if self.flip > 0 or self.dash > 0 or self.attackTime > 0 then 34 else 25
  bodyY = smoothPose(self, "bodyY", bodyY, poseRate)
  bodyRotation = smoothPose(self, "bodyRotation", bodyRotation, poseRate)
  bodyScaleX = smoothPose(self, "bodyScaleX", bodyScaleX, poseRate)
  bodyScaleY = smoothPose(self, "bodyScaleY", bodyScaleY, poseRate)
  headRotation = smoothPose(self, "headRotation", headRotation, poseRate)
  hairRotation = smoothPose(self, "hairRotation", hairRotation, 19)
  broomRotation = smoothPose(self, "broomRotation", broomRotation, poseRate)
  legFront = smoothPose(self, "legFront", legFront, poseRate)
  legBack = smoothPose(self, "legBack", legBack, poseRate)
  kneeFront = smoothPose(self, "kneeFront", kneeFront, poseRate)
  kneeBack = smoothPose(self, "kneeBack", kneeBack, poseRate)
  armFront = smoothPose(self, "armFront", armFront, poseRate)
  armBack = smoothPose(self, "armBack", armBack, poseRate)
  elbowFront = smoothPose(self, "elbowFront", elbowFront, poseRate)
  elbowBack = smoothPose(self, "elbowBack", elbowBack, poseRate)
  capeRotation = smoothPose(self, "capeRotation", capeRotation, 18)
  capeTipRotation = smoothPose(self, "capeTipRotation", capeTipRotation, 14)
  scarfRotation = smoothPose(self, "scarfRotation", scarfRotation, 18)
  scarfTipRotation = smoothPose(self, "scarfTipRotation", scarfTipRotation, 13)
  hatRotation = smoothPose(self, "hatRotation", hatRotation, 20)

  local surfaceRotation = 0
  if not absoluteRootRotation and self.surfaceSide == -1 then playerScaleY *= -1 end
  local opacity = 1
  if self.invincible > 0 and math.floor(self.time * 15) % 2 == 0 then opacity = 0.28 end
  local dashCharge = 1 - math.min(1, self.dashCooldown / DASH_COOLDOWN)
  local platformUnderPlayer = 260 > self.platformX - 125 and 260 < self.platformX + 125 and self.y <= 418
  local shadowY = if platformUnderPlayer then 419 else 535
  local heightAboveShadow = math.max(0, shadowY - self.y)
  local shadowScale = math.max(0.42, 1 - heightAboveShadow / 330)
  local landingProgress = 1 - math.min(1, self.landing / 0.2)
  local playerPivotY = if self.flip > 0 then actorY else playerY - 52
  if self.grounded and self.flip <= 0 then
    local contactRotation = playerRotation
    local contactScaleY = math.abs(playerScaleY)
    local frontContact = bootContactOffset(7, legFront, kneeFront, contactRotation, playerScaleX, contactScaleY)
    local backContact = bootContactOffset(-7, legBack, kneeBack, contactRotation, playerScaleX, contactScaleY)
    local contact = math.max(frontContact, backContact)
    playerPivotY = if self.surfaceSide == 1 then playerY - contact else playerY + contact
  end

  local flipProgress = if self.flip > 0 then 1 - self.flip / FLIP_DURATION else 0
  local dodgeProgress = if self.dash > 0 then 1 - self.dash / DASH_DURATION else 0
  local attackProgress = if self.attackTime > 0 then 1 - self.attackTime / self.attackDuration else 0
  local slashPulse = if self.attackTime > 0 then math.sin(attackProgress * math.pi) else 0
  local slashRotation = surfaceRotation - 0.85 + attackProgress * 1.7
  if self.attackStage == 2 then
    slashRotation = surfaceRotation + 1.18 - attackProgress * 1.9
  elseif self.attackStage == 3 then
    slashRotation = surfaceRotation - 1.72 + attackProgress * 2.75
  end
  local attackReady = if self.attackTime > 0 then 0 else 1 - math.min(1, self.attackCooldown / 0.16)
  local cameraX = 0
  local cameraY = 26
  if self.perfectTimer > 0 then
    local snap = self.perfectTimer / 0.48
    cameraX = math.sin(self.time * 115) * 5 * snap
    cameraY += math.cos(self.time * 83) * 2 * snap
  elseif self.impactTimer > 0 then
    local shake = self.impactTimer / 0.18
    cameraX = math.sin(self.time * 91) * 4 * shake
    cameraY += math.cos(self.time * 73) * 2.5 * shake
  elseif self.dash > 0 then
    cameraX = -math.sin(dodgeProgress * math.pi) * 3
  end

  local chapter = 1
  local chapterStart = 0
  local chapterLabel = "I · THE LAST SPARK"
  local objective = "CARRY THE MOON SUGAR ACROSS THE ROOFTOPS"
  if self.worldTime >= BOSS_START then
    chapter = 3
    chapterStart = BOSS_START
    chapterLabel = "FINAL · THE HUNGRY CAULDRON"
    objective = "BREAK THE GUARD · CHAIN 3 CUTS INTO THE CORE"
  elseif self.worldTime >= FACTORY_START then
    chapter = 2
    chapterStart = FACTORY_START
    chapterLabel = "II · THE CURSED FACTORY"
    objective = "MASTER BOTH SURFACES · BREAK THE CANDY GUARD"
  end
  local chapterAge = self.worldTime - chapterStart
  -- A quick location stamp: readable, but never long enough to hide a hazard.
  local chapterOpacity = if self.phase == 1 then math.max(0, math.min(1, 1.5 - chapterAge / 0.8)) else 0
  local bossX = bossPositionX(self)
  local bossOpacity = math.min(1, math.max(0, (self.worldTime - (BOSS_START - 0.5)) / 1.4))
  local bossPhase = if self.worldTime < BOSS_START then 0 elseif self.worldTime < BOSS_PHASE_TWO then 1 elseif self.worldTime < BOSS_PHASE_THREE then 2 else 3
  local bossPulse = 0.72 + math.sin(self.time * 7.5) * 0.28
  local factoryOpacity = math.min(1, math.max(0, (self.worldTime - (FACTORY_START - 1.25)) / 2.5))
  local bridgeBreak = math.min(1, math.max(0, (self.worldTime - (BOSS_PHASE_THREE - 1)) / 5.2))
  local bossAttackType, bossAttackProgress = currentBossAttack(self)
  local telegraphEnd = if bossAttackType == 3 then 0.3 elseif bossAttackType == 2 then 0.24 else 0.22
  local bossTelegraph = if bossAttackType > 0 and bossAttackProgress < telegraphEnd then 1 - bossAttackProgress / telegraphEnd else 0
  local shockwaveActive = bossAttackType == 1 and bossAttackProgress >= 0.22 and bossAttackProgress <= 0.78
  local waveTravel = math.min(1, math.max(0, (bossAttackProgress - 0.22) / 0.56))
  local shockwaveX = bossX - waveTravel * 1080
  local sweepActive = bossAttackType == 2 and bossAttackProgress >= 0.24 and bossAttackProgress <= 0.66
  local meteorActive = bossAttackType == 3 and bossAttackProgress >= 0.3 and bossAttackProgress <= 0.88
  local meteorTravel = math.min(1, math.max(0, (bossAttackProgress - 0.3) / 0.58))
  local meteorY = sugarPressY(bossAttackProgress)
  local meteorTargetOpacity = if bossAttackType == 3 and bossAttackProgress < 0.7 then 0.68 + math.sin(self.time * 15) * 0.24 else 0
  local trialTarget = math.max(300, self.worldTime * 110)
  local trialPace = self.score / trialTarget
  local trialRank = if trialPace >= 1.18 then "S" elseif trialPace >= 0.92 then "A" elseif trialPace >= 0.68 then "B" else "C"
  local rivalDelta = math.floor(self.score - trialTarget)

  local warningX = self.obstacleX
  local warningY = 445
  local nearest = 9999
  local function considerDanger(x: number, y: number)
    local ahead = x - actorX
    if ahead > 50 and ahead < nearest then
      nearest = ahead
      warningX = x
      warningY = y
    end
  end
  if self.surfaceSide == 1 then
    considerDanger(self.obstacleX, 454)
    considerDanger(self.pumpkinX, 454)
    considerDanger(self.ghostX, self.ghostY - 58)
    if self.knightAlive then considerDanger(self.knightX, 438) end
  else
    considerDanger(self.underObstacleX, 650)
  end
  if self.enemyShotActive then considerDanger(self.enemyShotX, self.enemyShotY - 42) end
  local warningOpacity = if nearest < 430 then math.min(1, (430 - nearest) / 170 + 0.15) else 0
  local warningPulse = 1 + math.sin(self.time * 12) * 0.12

  put(self, "phase", self.phase)
  put(self, "score", self.score)
  put(self, "lives", self.lives)
  put(self, "playerX", playerX)
  put(self, "playerY", playerY)
  put(self, "playerPivotY", playerPivotY)
  put(self, "playerRotation", playerRotation)
  put(self, "playerScaleX", playerScaleX)
  put(self, "playerScaleY", playerScaleY)
  put(self, "playerOpacity", opacity)
  put(self, "jumpCount", self.jumps)
  put(self, "bodyY", bodyY)
  put(self, "bodyRotation", bodyRotation)
  put(self, "bodyScaleX", bodyScaleX)
  put(self, "bodyScaleY", bodyScaleY)
  put(self, "headRotation", headRotation)
  put(self, "hairRotation", hairRotation)
  put(self, "broomRotation", broomRotation)
  put(self, "legFront", legFront)
  put(self, "legBack", legBack)
  put(self, "kneeFront", kneeFront)
  put(self, "kneeBack", kneeBack)
  put(self, "armFront", armFront)
  put(self, "armBack", armBack)
  put(self, "elbowFront", elbowFront)
  put(self, "elbowBack", elbowBack)
  put(self, "capeRotation", capeRotation)
  put(self, "capeTipRotation", capeTipRotation)
  put(self, "scarfRotation", scarfRotation)
  put(self, "scarfTipRotation", scarfTipRotation)
  put(self, "hatRotation", hatRotation)
  put(self, "shadowX", playerX)
  put(self, "shadowY", shadowY)
  put(self, "shadowScaleX", shadowScale)
  put(self, "shadowOpacity", if self.surfaceSide == 1 and self.flip <= 0 then 0.15 + shadowScale * 0.32 else 0)
  put(self, "motionState", motionState)
  put(self, "surfaceSide", self.surfaceSide)
  put(self, "surfaceY", if self.surfaceSide == 1 then self.y else BOTTOM_Y)
  put(self, "flipProgress", flipProgress)
  put(self, "flipFxX", actorX)
  put(self, "flipFxY", actorY)
  put(self, "flipFxRotation", kinematicRotation)
  put(self, "flipFxOpacity", if self.flip > 0 then math.sin(flipProgress * math.pi) * 0.78 else 0)
  put(self, "flipFxScale", 0.65 + math.sin(flipProgress * math.pi) * 0.5)
  put(self, "landingOpacity", if self.landing > 0 then self.landing / 0.2 else 0)
  put(self, "landingScale", 0.55 + landingProgress * 1.35)
  put(self, "jumpFxOpacity", self.jumpPulse)
  put(self, "jumpFxScale", 0.65 + (1 - self.jumpPulse) * 1.2)
  put(self, "farX", wrap(self.scroll * 0.06, 1280))
  put(self, "midX", wrap(self.scroll * 0.19, 1280))
  put(self, "nearX", wrap(self.scroll * 0.46, 1280))
  put(self, "groundX", wrap(self.scroll, 1280))
  put(self, "obstacleX", self.obstacleX)
  put(self, "obstacleY", 534)
  put(self, "pumpkinX", self.pumpkinX)
  put(self, "pumpkinY", 534)
  put(self, "ghostX", self.ghostX)
  put(self, "ghostY", self.ghostY)
  put(self, "ghostOpacity", 0.82 + math.sin(self.worldTime * 4) * 0.18)
  put(self, "candyX", self.candyX)
  put(self, "candyY", self.candyY + math.sin(self.worldTime * 4) * 7)
  put(self, "candyOpacity", if self.candyAlive then 1 else 0)
  put(self, "candy2X", self.candy2X)
  put(self, "candy2Y", self.candy2Y + math.sin(self.worldTime * 4 + 2) * 7)
  put(self, "candy2Opacity", if self.candy2Alive then 1 else 0)
  put(self, "platformX", self.platformX)
  put(self, "platformY", 418)
  put(self, "platformOpacity", 1)
  put(self, "underObstacleX", self.underObstacleX)
  put(self, "underObstacleY", 604)
  put(self, "underObstacleOpacity", 1)
  put(self, "dashOpacity", if self.dash > 0 then 1 else 0)
  put(self, "dashReady", dashCharge)
  put(self, "dodgeProgress", dodgeProgress)
  put(self, "afterX1", playerX - 27)
  put(self, "afterX2", playerX - 52)
  put(self, "afterY", playerPivotY)
  put(self, "afterRotation", playerRotation)
  put(self, "afterOpacity1", if self.dash > 0 then (1 - dodgeProgress) * 0.45 else 0)
  put(self, "afterOpacity2", if self.dash > 0 then (1 - dodgeProgress) * 0.24 else 0)
  put(self, "attackState", if self.attackTime > 0 then self.attackStage else 0)
  put(self, "attackProgress", attackProgress)
  put(self, "attackReady", attackReady)
  put(self, "attackHits", self.attackHits)
  put(self, "slashX", playerX + 42)
  put(self, "slashY", playerPivotY)
  put(self, "slashRotation", slashRotation)
  put(self, "slashScale", (0.75 + slashPulse * 0.5) * (if self.attackStage == 3 then 1.22 else 1))
  put(self, "slashOpacity", slashPulse)
  put(self, "projectileX", self.projectileX)
  put(self, "projectileY", self.projectileY)
  put(self, "projectileRotation", if self.projectileSide == 1 then 0 else math.pi)
  put(self, "projectileOpacity", if self.projectileActive then 1 else 0)
  put(self, "impactX", self.impactX)
  put(self, "impactY", self.impactY)
  put(self, "impactScale", 0.65 + (1 - self.impactTimer / 0.18) * 0.7)
  put(self, "impactOpacity", math.min(1, self.impactTimer / 0.1))
  put(self, "cameraX", cameraX)
  put(self, "cameraY", cameraY)
  put(self, "jumpPulse", self.jumpPulse)
  put(self, "hitOpacity", self.hitFlash)
  put(self, "menuOpacity", if self.phase == 0 or self.phase == 2 or self.phase == 4 then 1 else 0)
  put(self, "playOpacity", if active then 1 else 0)
  put(self, "pauseOpacity", if self.phase == 3 then 1 else 0)
  put(self, "dustPhase", 240 - (self.scroll % 36))
  put(self, "dustOpacity", if active and self.grounded and self.surfaceSide == 1 and self.dash <= 0 and self.flip <= 0 then 0.5 else 0)
  put(self, "hintOpacity", math.max(0, math.min(1, 7 - self.worldTime)))
  put(self, "collectOpacity", self.collectFlash)
  put(self, "collectX", self.collectX)
  put(self, "collectY", self.collectY)
  put(self, "progress", math.min(1, self.speed / 680))
  put(self, "heart1", if self.lives >= 1 then 1 else 0.16)
  put(self, "heart2", if self.lives >= 2 then 1 else 0.16)
  put(self, "heart3", if self.lives >= 3 then 1 else 0.16)
  put(self, "chapter", chapter)
  put(self, "chapterOpacity", chapterOpacity)
  put(self, "chapterProgress", math.min(1, self.worldTime / RUN_LENGTH))
  put(self, "warningX", warningX)
  put(self, "warningY", warningY)
  put(self, "warningOpacity", warningOpacity)
  put(self, "warningScale", warningPulse)
  put(self, "perfectOpacity", if self.perfectTimer > 0 then math.min(1, self.perfectTimer / 0.18) else 0)
  put(self, "perfectScale", 0.82 + (1 - math.min(1, self.perfectTimer / 0.48)) * 0.35)
  put(self, "slowMoOpacity", if self.slowMo > 0 then 0.34 else 0)
  put(self, "speedLineOpacity", math.min(0.8, (if self.dash > 0 then 0.66 elseif self.sugarRush > 0 then 0.48 else 0) + math.max(0, self.worldTime - FACTORY_START) / 60))
  put(self, "vignetteOpacity", math.min(0.72, math.max(0, self.worldTime - (BOSS_START - 2)) / 12))
  put(self, "foregroundX", wrap(self.scroll * 1.28, 1500))
  put(self, "enemyShotX", self.enemyShotX)
  put(self, "enemyShotY", self.enemyShotY)
  put(self, "enemyShotOpacity", if self.enemyShotActive then 1 else 0)
  put(self, "enemyShotRotation", self.time * 8)
  put(self, "knightX", self.knightX)
  put(self, "knightY", 534)
  put(self, "knightOpacity", if self.knightAlive then 1 else 0)
  put(self, "knightGuard", if self.attackStage == 3 then 0.3 else 1)
  put(self, "bossX", bossX)
  put(self, "bossY", 442 + math.sin(self.worldTime * 1.35) * 8)
  put(self, "bossOpacity", bossOpacity)
  put(self, "bossScale", 0.94 + math.sin(self.worldTime * 1.35) * 0.018)
  put(self, "bossHp", self.bossHp / BOSS_MAX_HP)
  put(self, "bossHitOpacity", self.bossHit)
  put(self, "bossEyeOpacity", bossOpacity * (0.68 + math.sin(self.time * 5) * 0.32))
  put(self, "chaseOpacity", math.min(1, math.max(0, (self.worldTime - (BOSS_START - 1)) / 2)))
  put(self, "finishOpacity", if self.phase == 4 then 1 else 0)
  put(self, "bossPhase", bossPhase)
  put(self, "bossShieldOpacity", if bossPhase == 2 or bossPhase == 1 and self.bossHp <= 8 then bossOpacity * bossPulse else 0)
  put(self, "bossCoreOpacity", if bossPhase == 3 then bossOpacity * bossPulse else 0)
  put(self, "bossArmRotation", math.sin(self.worldTime * (if bossPhase == 3 then 4.8 else 2.2)) * (if bossPhase == 3 then 0.28 else 0.12))
  put(self, "bossMouthScale", 0.88 + math.abs(math.sin(self.worldTime * (if bossPhase == 3 then 5.2 else 2.6))) * 0.28)
  put(self, "factoryOpacity", factoryOpacity)
  put(self, "factoryDoorOpen", if self.phase == 4 then 1 else math.max(0, (self.worldTime - (RUN_LENGTH - 2)) / 2))
  put(self, "factoryGlowOpacity", factoryOpacity * (0.42 + math.sin(self.time * 2.4) * 0.16))
  put(self, "bridgeBreakProgress", bridgeBreak)
  put(self, "bridgeBreakOpacity", if bossPhase == 3 then 1 else 0)
  put(self, "bridgeShardRotation", bridgeBreak * 0.42 + math.sin(self.time * 3) * 0.025)
  put(self, "finisherOpacity", if self.phase == 4 then 1 else 0)
  put(self, "finisherScale", 0.78 + self.victoryTimer * 0.28)
  put(self, "finalFlashOpacity", if self.phase == 4 then math.min(0.7, self.victoryTimer) else 0)
  put(self, "dangerCount", self.attackHits + self.perfectCount)
  put(self, "inputBuffer", math.min(1, self.jumpBuffer / JUMP_BUFFER_TIME))
  put(self, "coyoteReady", math.min(1, self.coyoteTimer / COYOTE_TIME))
  put(self, "cancelOpacity", math.min(1, self.cancelFlash / 0.12))
  put(self, "bossAttackType", bossAttackType)
  put(self, "bossAttackProgress", bossAttackProgress)
  put(self, "bossTelegraphOpacity", bossTelegraph)
  put(self, "bossTelegraphScale", 0.82 + (1 - bossTelegraph) * 0.34)
  put(self, "shockwaveX", shockwaveX)
  put(self, "shockwaveY", 520)
  put(self, "shockwaveOpacity", if shockwaveActive then math.sin(waveTravel * math.pi) * 0.95 else 0)
  put(self, "shockwaveEchoOpacity", if shockwaveActive and bossPhase == 3 then math.sin(waveTravel * math.pi) * 0.62 else 0)
  put(self, "shockwaveScale", 0.72 + waveTravel * 0.55)
  put(self, "sweepY", 455)
  put(self, "sweepOpacity", if sweepActive then math.sin(((bossAttackProgress - 0.24) / 0.42) * math.pi) * 0.78 else 0)
  put(self, "bossImpactOpacity", if bossAttackType > 0 and math.abs(bossAttackProgress - telegraphEnd) < 0.055 then 0.85 else 0)
  put(self, "difficultyLevel", chapter)
  put(self, "trialPace", math.min(1.35, trialPace))
  put(self, "meteorX", 260)
  put(self, "meteorY", meteorY)
  put(self, "meteorOpacity", if meteorActive then 0.85 + math.sin(meteorTravel * math.pi) * 0.15 else 0)
  put(self, "meteorScale", 0.72 + meteorTravel * 0.46)
  put(self, "meteorTargetOpacity", math.max(0, meteorTargetOpacity))
  put(self, "runTime", self.worldTime)
  put(self, "perfectCount", self.perfectCount)
  put(self, "damageTaken", self.damageTaken)
  put(self, "musicMode", self.musicMode)
  put(self, "musicDuck", if self.musicMode > 0 then 1 - math.min(1, self.musicVolume / 0.62) else 0)
  put(self, "skyX", wrap(self.time * 19 + self.scroll * 0.035, 1280))
  put(self, "batY1", 148 + math.sin(self.time * 1.7) * 7)
  put(self, "batY2", 244 + math.sin(self.time * 1.35 + 1.8) * 9)
  put(self, "batY3", 328 + math.sin(self.time * 1.55 + 3.1) * 6)
  put(self, "batWingL", -0.12 + math.sin(self.time * 8.5) * 0.34)
  put(self, "batWingR", 0.12 - math.sin(self.time * 8.5) * 0.34)
  put(self, "sugarMeter", self.sugarMeter)
  put(self, "sugarRushOpacity", if self.sugarRush > 0 then 0.72 + math.sin(self.time * 9) * 0.18 else 0)
  put(self, "sugarRushScale", 0.88 + math.sin(self.time * 7) * 0.08)
  put(self, "sugarBurstOpacity", math.min(1, self.sugarBurst / 0.45))
  say(self, "scoreText", string.format("%06d", math.floor(self.score)))
  say(self, "distanceText", string.format("%04d m", math.floor(self.distance)))
  say(self, "candyText", string.format("%02d", self.candyCount))
  say(self, "statusText", if chapter == 1 then "I  ROOFTOP DELIVERY" elseif chapter == 2 then "II  CURSED FACTORY" else "FINAL  CAULDRON DUEL")
  say(self, "comboText", if self.perfectTimer > 0 then "PERFECT DODGE  +140" elseif self.sugarRush > 0 then "SUGAR RUSH  ×2" elseif self.combo > 1 then "SWEET STREAK  ×" .. self.combo else "")
  say(self, "dashText", if dashCharge >= 0.995 then "DASH READY" else string.format("CHARGING %02d%%", math.floor(dashCharge * 100)))
  say(self, "attackText", if self.attackTime > 0 then "SUGAR CUT  ×" .. self.attackStage elseif attackReady >= 0.995 then "BLADE READY" else "BLADE RECOVER")
  say(self, "chapterText", chapterLabel)
  say(self, "objectiveText", objective)
  say(self, "bossPhaseText", if bossPhase == 1 and self.bossHp <= 8 or bossPhase == 2 and self.bossHp <= 6 then "ARMOR SEALED · SURVIVE THE NEXT SHIFT" elseif bossPhase == 1 then "PHASE I · SUGAR VOLLEY" elseif bossPhase == 2 then "PHASE II · CHAIN 3 TO BREAK GUARD" elseif bossPhase == 3 then "PHASE III · CHAIN 3 TO CUT CORE" else "")
  say(self, "bossAttackText", if bossAttackType == 1 and bossPhase == 3 then "DOUBLE WAVE · HOLD JUMP" elseif bossAttackType == 1 then "JUMP THE SHOCKWAVE" elseif bossAttackType == 2 then "FLIP BELOW THE SWEEP" elseif bossAttackType == 3 then "DODGE THE SUGAR PRESS" else "READ THE VOLLEY")
  say(self, "rankText", "TRIAL RANK  " .. trialRank)
  say(self, "rivalText", string.format("GUILD PACE  %s%03d", if rivalDelta >= 0 then "+" else "-", math.abs(rivalDelta)))
end

local function advance(self: Runner, dt: number): boolean
  self.time += math.min(dt, 0.05)
  local actionProperty = self.numbers["action"]
  if actionProperty and actionProperty.value > 0 then
    local action = math.floor(actionProperty.value)
    actionProperty.value = 0
    act(self, action)
  end
  if self.phase == 1 then
    local remaining = math.min(dt, 0.05)
    while remaining > 0 do
      local stepSize = math.min(remaining, 1 / 120)
      step(self, stepSize)
      remaining -= stepSize
    end
  end
  updateMusic(self, math.min(dt, 0.05))
  publish(self)
  return true
end

return function(_context: Context): Layout<Runner>
  return {
    numbers = {}, strings = {}, phase = 0, time = 0, worldTime = 0, scroll = 0,
    y = 534, oldY = 534, vy = 0, grounded = true, jumps = 0, speed = 360,
    score = 0, best = 0, distance = 0, candyCount = 0, lives = 3, dash = 0,
    dashCooldown = 0, invincible = 0, hitFlash = 0, hitRecoil = 0, landing = 0,
    airTime = 0, jumpPulse = 0, combo = 0,
    comboClock = 0, collectFlash = 0, collectX = 260, collectY = 440,
    obstacleX = 1020, pumpkinX = 1780, ghostX = 1450, ghostY = 400,
    candyX = 680, candyY = 455, candyAlive = true, candy2X = 980,
    candy2Y = 360, candy2Alive = true, platformX = 1190,
    surfaceSide = 1, flip = 0, flipFrom = 1, flipTarget = 1, flipCooldown = 0,
    attackTime = 0, attackDuration = 0.3, attackCooldown = 0,
    attackComboClock = 0, attackStage = 0, attackQueued = false,
    projectileActive = false, projectileX = 300, projectileY = 482,
    projectileSide = 1, projectileStage = 0, attackHits = 0, impactTimer = 0, impactX = 600,
    impactY = 482, hitStop = 0, underObstacleX = 1320,
    perfectTimer = 0, perfectCooldown = 0, slowMo = 0,
    enemyShotX = 1420, enemyShotY = 470, enemyShotActive = false,
    enemyShotCooldown = 10.5, enemyShotWave = 0,
    knightX = 3100, knightAlive = true, bossHp = BOSS_MAX_HP, bossHit = 0,
    victoryTimer = 0, damageDisabled = false, autoClearBoss = false,
    autoPilot = false, autoBeat = 0, autoActionCooldown = 0, bossAnnounced = false,
    maxCombo = 0, perfectCount = 0, damageTaken = 0, finishBonus = 0,
    finisherTimer = 0,
    jumpBuffer = 0, coyoteTimer = 0, jumpHeld = false, jumpHold = 0,
    cancelFlash = 0,
    jumpSound = nil, slashSound = nil, perfectSound = nil, impactSound = nil,
    bossSound = nil, rooftopMusic = nil, chaseMusic = nil, bossMusic = nil,
    musicSound = nil, musicMode = 0, musicVolume = 0, musicPaused = false,
    sugarMeter = 0, sugarRush = 0, sugarBurst = 0,
    pose = {}, lastDt = 1 / 60,
    init = init, advance = advance, pointerDown = pointerDown,
    -- Physical keys are routed through state-machine listeners to the same
    -- action property as touch controls. This avoids host-specific script
    -- focus behavior while preserving a single gameplay input path.
  }
end
