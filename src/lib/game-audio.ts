export type GameSfx = "start" | "tap" | "reveal" | "success" | "error" | "complete";
export type GameMusicTheme = "character" | "verse" | "crossword" | "million";

export type GameAudioState = {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  musicStarted: boolean;
};

const listeners = new Set<() => void>();
const progressions: Record<GameMusicTheme, number[][]> = {
  character: [[130.81, 155.56, 196, 261.63], [116.54, 146.83, 174.61, 233.08], [146.83, 174.61, 220, 293.66], [123.47, 155.56, 185, 246.94]],
  verse: [[130.81, 155.56, 196, 261.63], [146.83, 196, 220, 293.66], [116.54, 146.83, 196, 261.63], [123.47, 164.81, 196, 246.94]],
  crossword: [[110, 138.59, 164.81, 220], [123.47, 155.56, 185, 246.94], [98, 123.47, 146.83, 196], [130.81, 164.81, 196, 261.63]],
  million: [[98, 123.47, 146.83, 196], [103.83, 130.81, 155.56, 207.65], [92.5, 116.54, 138.59, 185], [110, 146.83, 174.61, 220]],
};

let audioContext: AudioContext | null = null;
let musicGain: GainNode | null = null;
let musicTimer: number | null = null;
let musicStep = 0;
let musicEnabled = true;
let sfxEnabled = true;
let musicStarted = false;
let musicTheme: GameMusicTheme = "character";
if (typeof window !== "undefined") {
  musicEnabled = window.localStorage.getItem("disciple.game.music") !== "off";
  sfxEnabled = window.localStorage.getItem("disciple.game.sfx") !== "off";
}
let audioSnapshot: GameAudioState = { musicEnabled, sfxEnabled, musicStarted };

const emit = () => {
  audioSnapshot = { musicEnabled, sfxEnabled, musicStarted };
  listeners.forEach((listener) => listener());
};

export function subscribeGameAudio(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getGameAudioState(): GameAudioState {
  return audioSnapshot;
}

function ensureContext() {
  if (typeof window === "undefined") return null;
  if (audioContext) return audioContext;
  const AudioContextConstructor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextConstructor) return null;
  audioContext = new AudioContextConstructor();
  musicGain = audioContext.createGain();
  musicGain.gain.value = 0;
  musicGain.connect(audioContext.destination);
  return audioContext;
}

function playMusicStep() {
  const context = ensureContext();
  if (!context || !musicGain || !musicEnabled) return;
  const destination = musicGain;
  if (!destination) return;
  const now = context.currentTime;
  const progression = progressions[musicTheme];
  const chord = progression[musicStep % progression.length];
  chord.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = index === 0 ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(index === 0 ? 0.28 : 0.13, now + 0.24);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.1);
    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start(now);
    oscillator.stop(now + 3.2);
  });

  const bass = context.createOscillator();
  const bassGain = context.createGain();
  bass.type = "sine";
  bass.frequency.setValueAtTime(chord[0] / 2, now);
  bassGain.gain.setValueAtTime(0.0001, now);
  bassGain.gain.exponentialRampToValueAtTime(0.18, now + 0.3);
  bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.1);
  bass.connect(bassGain);
  bassGain.connect(destination);
  bass.start(now);
  bass.stop(now + 3.2);

  if (musicStep % 2 === 0) {
    const bell = context.createOscillator();
    const bellGain = context.createGain();
    bell.type = "sine";
    bell.frequency.setValueAtTime(chord[3] * 2, now + 0.55);
    bellGain.gain.setValueAtTime(0.0001, now);
    bellGain.gain.exponentialRampToValueAtTime(0.07, now + 0.62);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
    bell.connect(bellGain);
    bellGain.connect(destination);
    bell.start(now + 0.55);
    bell.stop(now + 2.3);
  }
  musicStep += 1;
}

export function startGameMusic(theme?: GameMusicTheme) {
  musicStarted = true;
  const pathName = typeof window !== "undefined" ? window.location.pathname : "";
  musicTheme =
    theme ??
    (pathName.includes("cruzadas")
      ? "crossword"
      : pathName.includes("milhao")
        ? "million"
        : pathName.includes("versiculo")
          ? "verse"
          : "character");
  const context = ensureContext();
  if (!context || !musicEnabled || musicTimer !== null) {
    emit();
    return;
  }
  void context.resume();
  if (musicGain) {
    musicGain.gain.cancelScheduledValues(context.currentTime);
    musicGain.gain.setTargetAtTime(0.38, context.currentTime, 0.7);
  }
  playMusicStep();
  musicTimer = window.setInterval(playMusicStep, 3200);
  emit();
}

export function stopGameMusic() {
  if (musicTimer !== null) {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }
  if (audioContext && musicGain) musicGain.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.15);
  emit();
}

export function toggleGameMusic() {
  musicEnabled = !musicEnabled;
  if (typeof window !== "undefined") window.localStorage.setItem("disciple.game.music", musicEnabled ? "on" : "off");
  if (musicEnabled && musicStarted) startGameMusic();
  else if (!musicEnabled) stopGameMusic();
  emit();
}

export function toggleGameSfx() {
  sfxEnabled = !sfxEnabled;
  if (typeof window !== "undefined") window.localStorage.setItem("disciple.game.sfx", sfxEnabled ? "on" : "off");
  emit();
}

export function playGameSfx(kind: GameSfx) {
  if (!sfxEnabled) return;
  const context = ensureContext();
  if (!context) return;
  void context.resume();
  const now = context.currentTime;
  const notes: Record<GameSfx, number[]> = {
    start: [261.63, 329.63, 392, 523.25],
    tap: [440],
    reveal: [392, 523.25, 659.25],
    success: [523.25, 659.25, 783.99, 1046.5],
    error: [329.63, 246.94, 196],
    complete: [392, 523.25, 659.25, 783.99, 1046.5],
  };
  const durations: Record<GameSfx, number> = { start: 0.13, tap: 0.08, reveal: 0.16, success: 0.14, error: 0.16, complete: 0.18 };
  notes[kind].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const startAt = now + index * (kind === "tap" ? 0 : 0.075);
    oscillator.type = kind === "error" ? "sawtooth" : "triangle";
    oscillator.frequency.setValueAtTime(frequency, startAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(kind === "tap" ? 0.06 : 0.14, startAt + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + durations[kind]);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + durations[kind] + 0.02);
  });
}
