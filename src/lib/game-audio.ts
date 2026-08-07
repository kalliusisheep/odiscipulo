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

type SfxToneOptions = {
  attack?: number;
  pan?: number;
  detune?: number;
  filter?: number;
  glideTo?: number;
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
let sfxGain: GainNode | null = null;
let sfxCompressor: DynamicsCompressorNode | null = null;
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
  sfxGain = audioContext.createGain();
  sfxCompressor = audioContext.createDynamicsCompressor();

  musicFilter.type = "lowpass";
  musicFilter.frequency.value = 5200;
  musicFilter.Q.value = 0.7;

  musicCompressor.threshold.value = -20;
  musicCompressor.knee.value = 10;
  musicCompressor.ratio.value = 7;
  musicCompressor.attack.value = 0.004;
  musicCompressor.release.value = 0.16;

  sfxCompressor.threshold.value = -16;
  sfxCompressor.knee.value = 8;
  sfxCompressor.ratio.value = 6;
  sfxCompressor.attack.value = 0.003;
  sfxCompressor.release.value = 0.12;

  musicGain.gain.value = 0;
  sfxGain.gain.value = 0.88;

  musicGain.connect(musicFilter);
  musicFilter.connect(musicCompressor);
  musicCompressor.connect(audioContext.destination);
  sfxGain.connect(sfxCompressor);
  sfxCompressor.connect(audioContext.destination);

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

function scheduleSfxTone(
  context: AudioContext,
  destination: AudioNode,
  frequency: number,
  startAt: number,
  duration: number,
  peak: number,
  type: OscillatorType,
  options: SfxToneOptions = {},
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const attack = options.attack ?? Math.min(0.018, duration * 0.25);
  let output: AudioNode = gain;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  oscillator.detune.setValueAtTime(options.detune ?? 0, startAt);
  if (options.glideTo) {
    oscillator.frequency.exponentialRampToValueAtTime(options.glideTo, startAt + duration * 0.8);
  }

  if (options.filter) {
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(options.filter, startAt);
    filter.Q.value = 0.9;
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
  oscillator.stop(startAt + duration + 0.035);
}

function scheduleSfxNoise(
  context: AudioContext,
  destination: AudioNode,
  startAt: number,
  duration: number,
  peak: number,
  frequency: number,
  type: BiquadFilterType = "bandpass",
) {
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  source.buffer = getNoiseBuffer(context);
  filter.type = type;
  filter.frequency.setValueAtTime(frequency, startAt);
  filter.Q.value = type === "highpass" ? 0.3 : 1.1;
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(peak, startAt + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start(startAt);
  source.stop(startAt + duration + 0.025);
}

function playSfxStart(context: AudioContext, destination: AudioNode, now: number) {
  scheduleSfxTone(context, destination, 65.41, now, 0.42, 0.38, "sine", { glideTo: 48, filter: 380 });
  scheduleSfxNoise(context, destination, now, 0.18, 0.16, 900, "lowpass");
  [261.63, 329.63, 392, 523.25].forEach((frequency, index) => {
    scheduleSfxTone(context, destination, frequency, now + 0.12 + index * 0.09, 0.32, 0.22, "sawtooth", {
      filter: 2600 + index * 500,
      pan: index % 2 === 0 ? -0.18 : 0.18,
    });
  });
  scheduleSfxTone(context, destination, 1046.5, now + 0.5, 0.5, 0.16, "sine", {
    filter: 7000,
    pan: 0.2,
  });
}

function playSfxTap(context: AudioContext, destination: AudioNode, now: number) {
  scheduleSfxNoise(context, destination, now, 0.025, 0.11, 3200, "highpass");
  scheduleSfxTone(context, destination, 920, now, 0.075, 0.13, "triangle", {
    glideTo: 560,
    filter: 4200,
  });
}

function playSfxReveal(context: AudioContext, destination: AudioNode, now: number) {
  scheduleSfxNoise(context, destination, now, 0.28, 0.1, 2400, "highpass");
  [392, 523.25, 659.25, 783.99].forEach((frequency, index) => {
    scheduleSfxTone(context, destination, frequency, now + index * 0.055, 0.22, 0.16, "triangle", {
      filter: 5200,
      pan: index % 2 === 0 ? -0.16 : 0.16,
    });
  });
}

function playSfxSuccess(context: AudioContext, destination: AudioNode, now: number) {
  scheduleSfxTone(context, destination, 82.41, now, 0.3, 0.28, "sine", { glideTo: 55, filter: 520 });
  scheduleSfxNoise(context, destination, now, 0.08, 0.12, 1900, "lowpass");
  [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
    scheduleSfxTone(context, destination, frequency, now + 0.08 + index * 0.065, 0.3, 0.2, "sine", {
      filter: 6200,
      pan: index % 2 === 0 ? -0.2 : 0.2,
    });
  });
}

function playSfxError(context: AudioContext, destination: AudioNode, now: number) {
  scheduleSfxTone(context, destination, 98, now, 0.38, 0.3, "sine", { glideTo: 54, filter: 680 });
  scheduleSfxTone(context, destination, 233.08, now, 0.34, 0.15, "sawtooth", { glideTo: 155.56, filter: 1100 });
  scheduleSfxNoise(context, destination, now + 0.015, 0.09, 0.1, 760, "lowpass");
}

function playSfxComplete(context: AudioContext, destination: AudioNode, now: number) {
  scheduleSfxTone(context, destination, 73.42, now, 0.52, 0.32, "sine", { glideTo: 49, filter: 420 });
  [392, 523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
    scheduleSfxTone(context, destination, frequency, now + 0.12 + index * 0.075, 0.42, 0.18, "triangle", {
      filter: 5600,
      pan: index % 2 === 0 ? -0.18 : 0.18,
    });
  });
  scheduleSfxNoise(context, destination, now + 0.38, 0.2, 0.08, 6400, "highpass");
}

function playSfxVictory(context: AudioContext, destination: AudioNode, now: number) {
  scheduleSfxTone(context, destination, 55, now, 0.72, 0.42, "sine", { glideTo: 40, filter: 380 });
  scheduleSfxNoise(context, destination, now, 0.18, 0.16, 520, "lowpass");
  [261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((frequency, index) => {
    scheduleSfxTone(context, destination, frequency, now + 0.1 + index * 0.075, 0.56, 0.2, index < 4 ? "sawtooth" : "sine", {
      filter: index < 4 ? 3200 : 7200,
      pan: index % 2 === 0 ? -0.2 : 0.2,
    });
  });
  scheduleSfxTone(context, destination, 1567.98, now + 0.86, 0.72, 0.16, "sine", {
    filter: 9000,
    pan: 0.24,
  });
}

function playSfxDefeat(context: AudioContext, destination: AudioNode, now: number) {
  scheduleSfxTone(context, destination, 73.42, now, 0.64, 0.34, "sine", { glideTo: 43.65, filter: 420 });
  [293.66, 246.94, 196, 146.83].forEach((frequency, index) => {
    scheduleSfxTone(context, destination, frequency, now + 0.08 + index * 0.1, 0.44, 0.16, "sawtooth", {
      glideTo: frequency * 0.82,
      filter: 1500,
    });
  });
  scheduleSfxNoise(context, destination, now + 0.16, 0.18, 0.08, 520, "lowpass");
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
  if (!context || !sfxGain) return;
  void context.resume();

  const now = context.currentTime;
  const destination = sfxGain;

  switch (kind) {
    case "start":
      playSfxStart(context, destination, now);
      break;
    case "tap":
      playSfxTap(context, destination, now);
      break;
    case "reveal":
      playSfxReveal(context, destination, now);
      break;
    case "success":
      playSfxSuccess(context, destination, now);
      break;
    case "error":
      playSfxError(context, destination, now);
      break;
    case "complete":
      playSfxComplete(context, destination, now);
      break;
    case "victory":
      playSfxVictory(context, destination, now);
      break;
    case "defeat":
      playSfxDefeat(context, destination, now);
      break;
  }
}
