import {mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const sampleRate = 44100;
const out = path.resolve(import.meta.dirname, '..', 'runner', 'assets', 'audio');
mkdirSync(out, {recursive: true});

function wav(name, seconds, sample) {
  const frames = Math.floor(seconds * sampleRate);
  const dataSize = frames * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVEfmt ', 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < frames; i++) {
    const t = i / sampleRate;
    const value = Math.max(-1, Math.min(1, sample(t, seconds)));
    buffer.writeInt16LE(Math.round(value * 32767), 44 + i * 2);
  }
  writeFileSync(path.join(out, `${name}.wav`), buffer);
}

const decay = (t, seconds, power=2) => Math.pow(Math.max(0, 1 - t / seconds), power);
const sweep = (t, from, to, seconds) => Math.sin(Math.PI * 2 * (from * t + (to - from) * t * t / (2 * seconds)));
const hz = midi => 440 * Math.pow(2, (midi - 69) / 12);
const sine = (t, frequency) => Math.sin(Math.PI * 2 * frequency * t);
const triangle = (t, frequency) => Math.asin(Math.sin(Math.PI * 2 * frequency * t)) * 2 / Math.PI;
const square = (t, frequency) => Math.sign(Math.sin(Math.PI * 2 * frequency * t));
const beatPhase = (t, beatsPerSecond) => (t * beatsPerSecond) % 1;
const pulse = (phase, falloff=8) => Math.exp(-phase * falloff);

function musicBox(t, notes, beatsPerSecond, offset=0) {
  const beat = Math.floor(t * beatsPerSecond + offset);
  const phase = beatPhase(t + offset / beatsPerSecond, beatsPerSecond);
  const frequency = hz(notes[((beat % notes.length) + notes.length) % notes.length]);
  return (sine(t, frequency) * 0.72 + sine(t, frequency * 2.01) * 0.18 + sine(t, frequency * 3.98) * 0.1)
    * pulse(phase, 5.8);
}

function softKick(t, beatsPerSecond, every=2) {
  const beat = Math.floor(t * beatsPerSecond);
  const phase = beatPhase(t, beatsPerSecond);
  if (beat % every !== 0) return 0;
  const frequency = 76 - phase * 34;
  return sine(t, frequency) * pulse(phase, 12);
}

wav('jump', 0.22, (t, d) => sweep(t, 280, 820, d) * decay(t, d, 1.8) * 0.34);
wav('slash', 0.18, (t, d) => (sweep(t, 1300, 360, d) + Math.sin(t * 2 * Math.PI * 2100) * 0.25) * decay(t, d, 2.5) * 0.28);
wav('perfect', 0.42, (t, d) => (sweep(t, 180, 920, d) * 0.5 + Math.sin(t * 2 * Math.PI * 1320) * 0.2) * decay(t, d, 1.35) * 0.38);
wav('impact', 0.24, (t, d) => (Math.sin(t * 2 * Math.PI * 74) + Math.sin(t * 2 * Math.PI * 112) * 0.55) * decay(t, d, 3.2) * 0.38);
wav('boss', 0.95, (t, d) => (sweep(t, 92, 42, d) + Math.sin(t * 2 * Math.PI * 51) * 0.6) * decay(t, d, 1.4) * 0.27);

// Three loop-safe, fully original cues. Each lasts an exact number of beats so
// the manual AudioSound replay in the Rive runtime lands cleanly on beat one.
wav('music-rooftop', 8, t => {
  const bps = 1; // 60 BPM, eight slow beats per loop
  const arp = musicBox(t, [69, 76, 72, 77, 69, 74, 72, 76], bps * 2);
  const pad = sine(t, hz(45)) * 0.55 + sine(t, hz(52)) * 0.2;
  const breath = 0.7 + Math.sin(Math.PI * 2 * t / 8) * 0.3;
  const bell = sine(t, 1320) * pulse(beatPhase(t + 0.25, bps), 16);
  return (arp * 0.15 + pad * 0.05 * breath + bell * 0.012) * 0.78;
});

wav('music-chase', 8, t => {
  const bps = 2.5; // 150 BPM, twenty mechanical beats per loop
  const arp = musicBox(t, [69, 72, 76, 79, 81, 79, 76, 72], bps * 2);
  const answer = musicBox(t, [57, 60, 64, 63], bps, 0.5);
  const drive = square(t, hz(45)) * (0.28 + pulse(beatPhase(t, bps), 4) * 0.72);
  const hats = (Math.sin(t * 2 * Math.PI * 4300) + Math.sin(t * 2 * Math.PI * 6173))
    * pulse(beatPhase(t, bps * 2), 18);
  const clank = (sine(t, 713) + sine(t, 1069) * 0.7) * pulse(beatPhase(t, bps / 2), 14);
  return arp * 0.13 + answer * 0.055 + drive * 0.045 + softKick(t, bps) * 0.12 + hats * 0.018 + clank * 0.022;
});

wav('music-boss-loop', 8, t => {
  const bps = 3; // 180 BPM, twenty-four urgent beats per loop
  const bassNotes = [33, 33, 39, 38, 33, 36, 34, 39];
  const beat = Math.floor(t * bps);
  const bass = triangle(t, hz(bassNotes[beat % bassNotes.length])) * (0.35 + pulse(beatPhase(t, bps), 4) * 0.65);
  const omen = musicBox(t, [69, 70, 75, 69, 66, 70, 63, 66], bps * 2);
  const metallic = (sine(t, 812) + sine(t, 1217) * 0.5) * pulse(beatPhase(t, bps), 9);
  const warDrum = softKick(t, bps, 1) + softKick(t + 1 / (bps * 2), bps, 2) * 0.45;
  return bass * 0.1 + omen * 0.09 + warDrum * 0.15 + metallic * 0.025;
});

console.log('Generated original runner SFX and three adaptive music loops.');
