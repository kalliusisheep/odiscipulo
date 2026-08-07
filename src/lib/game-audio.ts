export type GameSfx = "start" | "tap" | "reveal" | "success" | "error" | "complete" | "victory" | "defeat";
export type GameMusicTheme = "character" | "verse" | "crossword" | "million";

export type GameAudioState = {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  musicStarted: boolean;
};

type MusicThemeConfig = {
  tempo: number;
  progression: number[][];
  arpeggio: number[];
  arrangement: "heroic" | "calm" | "puzzle" | "arena";
};

const listeners = new Set<() => void>();
const musicThemes: Record<GameMusicTheme, MusicThemeConfig> = {
  character: {
    tempo: 126,
    progression: [
      [130.81, 155.56, 196, 261.63],
      [116.54, 146.83, 174.61, 233.08],
      [146.83, 174.61, 220, 293.66],
      [123.47, 155.56, 185, 246.94],
    ],
    arpeggio: [1, 2, 3, 2, 1, 2, 3, 2],
    arrangement: "heroic",
  },
  verse: {
    tempo: 104,
    progression: [
      [130.81, 155.56, 196, 261.63],
      [146.83, 196, 220, 293.66],
      [116.54, 146.83, 196, 261.63],
      [123.47, 164.81, 196, 246.94],
    ],
    arpeggio: [1, 2, 3, 2, 1, 2, 3, 2],
    arrangement: "calm",
  },
  crossword: {
    tempo: 118,
    progression: [
      [110, 138.59, 164.81, 220],
      [123.47, 155.56, 185, 246.94],
      [98, 123.47, 146.83, 196],
      [130.81, 164.81, 196, 261.63],
    ],
    arpeggio: [2, 1, 3, 1, 2, 1, 3, 2],
    arrangement: "puzzle",
  },
  million: {
    tempo: 138,
    progression: [
      [98, 123.47, 146.83, 196],
      [103.83, 130.81, 155.56, 207.65],
      [92.5, 116.54, 138.59, 185],
      [110, 146.83, 174.61, 220],
    ],
    arpeggio: [1, 2, 3, 2, 1, 2, 3, 3],
    arrangement: "arena",
  },
};

let audioContext: AudioContext | null = null;
let musicGain: GainNode | null = null;
let musicCompressor: DynamicsCompressorNode | null = null;
let musicFilter: BiquadFilterNode | null = null;
let musicTimer: number | null = null;
let musicStep = 0;
let musicEnabled = true;
let sfxEnabled = true;
let musicStarted = false;
let musicTheme: GameMusicTheme = "character";
let noiseBuffer: AudioBuffer | null = null;

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

  const AudioContextConstructor =
    window.AudioContext ??
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextConstructor) return null;

  audioContext = new AudioContextConstructor();
  musicGain = audioContext.createGain();
  musicFilter = audioContext.createBiquadFilter();
  musicCompressor = audioContext.createDynamicsCompressor();

  musicFilter.type = "lowpass";
  musicFilter.frequency.value = 5200;
  musicFilter.Q.value = 0.7;

  musicCompressor.threshold.value = -20;
  musicCompressor.knee.value = 10;
  musicCompressor.ratio.value = 7;
  musicCompressor.attack.value = 0.004;
  musicCompressor.release.value = 0.16;

  musicGain.gain.value = 0;
  musicGain.connect(musicFilter);
  musicFilter.connect(musicCompressor);
  musicCompressor.connect(audioContext.destination);

  return audioContext;
}

function getNoiseBuffer(context: AudioContext) {
  if (noiseBuffer) return noiseBuffer;

  const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let index = 0; index < channel.length; index += 1) {
    channel[index] = Math.random() * 2 - 1;
  }
  noiseBuffer = buffer;
  return buffer;
}

function scheduleTone(
  context: AudioContext,
  destination: AudioNode,
  frequency: number,
  startAt: number,
  duration: number,
  peak: number,
  type: OscillatorType,
  options: { attack?: number; pan?: number; detune?: number; filter?: number } = {},
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const attack = options.attack ?? 0.025;
  let output: AudioNode = gain;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  oscillator.detune.setValueAtTime(options.detune ?? 0, startAt);

  if (options.filter) {
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(options.filter, startAt);
    filter.Q.value = 0.6;
    gain.connect(filter);
    output = filter;
  }

  if (options.pan !== undefined && typeof context.createStereoPanner === "function") {
    const panner = context.createStereoPanner();
    panner.pan.setValueAtTime(options.pan, startAt);
    output.connect(panner);
    output = panner;
  }

  output.connect(destination);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(peak, startAt + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.connect(gain);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.05);
}

function scheduleKick(context: AudioContext, destination: AudioNode, startAt: number, peak = 0.42) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(138, startAt);
  oscillator.frequency.exponentialRampToValueAtTime(46, startAt + 0.18);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(peak, startAt + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.24);

  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + 0.28);
}

function scheduleNoise(
  context: AudioContext,
  destination: AudioNode,
  startAt: number,
  duration: number,
  peak: number,
  frequency: number,
) {
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  source.buffer = getNoiseBuffer(context);
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(frequency, startAt);
  filter.Q.value = 0.8;
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(peak, startAt + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start(startAt);
  source.stop(startAt + duration + 0.03);
}

function schedulePad(
  context: AudioContext,
  destination: AudioNode,
  chord: number[],
  startAt: number,
  duration: number,
  intensity: number,
) {
  chord.forEach((frequency, index) => {
    scheduleTone(context, destination, frequency, startAt, duration, intensity, index === 0 ? "sawtooth" : "triangle", {
      attack: 0.18,
      detune: index % 2 === 0 ? -5 : 5,
      filter: index === 0 ? 1500 : 2700,
      pan: (index - 1.5) * 0.12,
    });
  });
}

function playMusicBar() {
  const context = ensureContext();
  if (!context || !musicGain || !musicEnabled) return;

  const config = musicThemes[musicTheme];
  const beat = 60 / config.tempo;
  const barDuration = beat * 4;
  const now = context.currentTime + 0.025;
  const chord = config.progression[musicStep % config.progression.length];
  const destination = musicGain;

  schedulePad(context, destination, chord, now, barDuration * 0.94, config.arrangement === "arena" ? 0.14 : 0.105);

  const bassPattern = [0, 0, 1, 0];
  bassPattern.forEach((interval, beatIndex) => {
    const root = chord[0] / 2;
    const bassFrequency = interval === 1 ? root * 1.5 : root;
    scheduleTone(context, destination, bassFrequency, now + beatIndex * beat, beat * 0.72, 0.3, "sawtooth", {
      attack: 0.015,
      filter: 720,
    });
  });

  config.arpeggio.forEach((chordIndex, noteIndex) => {
    const frequency = chord[chordIndex];
    const startAt = now + noteIndex * beat * 0.5;
    scheduleTone(context, destination, frequency * 2, startAt, beat * 0.38, config.arrangement === "arena" ? 0.16 : 0.11, "triangle", {
      attack: 0.012,
      filter: config.arrangement === "puzzle" ? 3400 : 4600,
      pan: noteIndex % 2 === 0 ? -0.22 : 0.22,
    });
  });

  const kickBeats = config.arrangement === "calm" ? [0, 2] : [0, 1, 2, 3];
  kickBeats.forEach((beatIndex) => {
    scheduleKick(context, destination, now + beatIndex * beat, config.arrangement === "arena" ? 0.5 : 0.38);
  });

  if (config.arrangement !== "calm") {
    [1, 3].forEach((beatIndex) => {
      scheduleNoise(context, destination, now + beatIndex * beat, 0.16, config.arrangement === "arena" ? 0.2 : 0.14, 1650);
    });
  }

  for (let noteIndex = 0; noteIndex < 8; noteIndex += 1) {
    const hatStart = now + noteIndex * beat * 0.5;
    scheduleNoise(context, destination, hatStart, 0.045, config.arrangement === "arena" ? 0.085 : 0.055, 7200);
  }

  const accentFrequency = chord[3] * (musicStep % 2 === 0 ? 2 : 1.5);
  scheduleTone(
    context,
    destination,
    accentFrequency,
    now + beat * 3.25,
    beat * 0.65,
    config.arrangement === "arena" ? 0.17 : 0.1,
    "sine",
    { attack: 0.01, filter: 6800, pan: 0.12 },
  );

  musicStep += 1;
}

export function startGameMusic(theme?: GameMusicTheme) {
  musicStarted = true;
  const pathName = typeof window !== "undefined" ? window.location.pathname : "";
  const nextTheme =
    theme ??
    (pathName.includes("cruzadas")
      ? "crossword"
      : pathName.includes("milhao")
        ? "million"
        : pathName.includes("versiculo")
          ? "verse"
          : "character");

  if (musicTimer !== null && nextTheme === musicTheme) {
    emit();
    return;
  }

  if (musicTimer !== null) {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }

  musicTheme = nextTheme;
  musicStep = 0;

  const context = ensureContext();
  if (!context || !musicEnabled) {
    emit();
    return;
  }

  void context.resume();
  if (musicGain) {
    musicGain.gain.cancelScheduledValues(context.currentTime);
    musicGain.gain.setTargetAtTime(0.84, context.currentTime, 0.28);
  }

  const beat = 60 / musicThemes[musicTheme].tempo;
  playMusicBar();
  musicTimer = window.setInterval(playMusicBar, beat * 4 * 1000);
  emit();
}

export function stopGameMusic() {
  if (musicTimer !== null) {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }
  if (audioContext && musicGain) {
    musicGain.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.15);
  }
  emit();
}

export function toggleGameMusic() {
  musicEnabled = !musicEnabled;
  if (typeof window !== "undefined") {
    window.localStorage.setItem("disciple.game.music", musicEnabled ? "on" : "off");
  }
  if (musicEnabled && musicStarted) startGameMusic(musicTheme);
  else if (!musicEnabled) stopGameMusic();
  emit();
}

export function toggleGameSfx() {
  sfxEnabled = !sfxEnabled;
  if (typeof window !== "undefined") {
    window.localStorage.setItem("disciple.game.sfx", sfxEnabled ? "on" : "off");
  }
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
    victory: [523.25, 659.25, 783.99, 1046.5, 1318.51],
    defeat: [392, 329.63, 261.63, 196],
  };
  const durations: Record<GameSfx, number> = {
    start: 0.13,
    tap: 0.08,
    reveal: 0.16,
    success: 0.14,
    error: 0.16,
    complete: 0.18,
    victory: 0.2,
    defeat: 0.2,
  };

  notes[kind].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const startAt = now + index * (kind === "tap" ? 0 : 0.075);

    oscillator.type = kind === "error" || kind === "defeat" ? "sawtooth" : "triangle";
    oscillator.frequency.setValueAtTime(frequency, startAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(
      kind === "tap" ? 0.09 : kind === "error" || kind === "defeat" ? 0.22 : 0.28,
      startAt + 0.012,
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + durations[kind]);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + durations[kind] + 0.02);
  });
}
