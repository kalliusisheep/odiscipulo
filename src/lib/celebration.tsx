import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import confetti from "canvas-confetti";
import { getLevel, type LevelEntry } from "@/data/levels";
import { PartyPopper, Sparkles, X } from "lucide-react";
import { useMascot } from "@/lib/mascot";

type CelebrationCtx = {
  celebrateActivity: (opts: { prevXp: number; newXp: number; xp?: number; level50Unlocked?: boolean }) => void;
};

const Ctx = createContext<CelebrationCtx | null>(null);

// ------------------------------------------------------------------
// Sons estilo MMORPG (gerados no próprio aparelho via WebAudio — sem
// arquivos, sem download, e respeitando o volume do dispositivo).
// ------------------------------------------------------------------

function getAudioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  const ctx = new AudioCtx();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

type NoteOpts = {
  freq: number;
  start: number;
  dur: number;
  type?: OscillatorType;
  gain?: number;
  /** Deslize de altura até esta frequência (efeito "swoosh" de RPG). */
  glideTo?: number;
  /** Leve desafinação em cents para engrossar o timbre (voz dupla). */
  detune?: number;
};

/** Toca uma nota com envelope suave — o tijolo básico dos nossos sons. */
function note(ctx: AudioContext, out: AudioNode, o: NoteOpts) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = o.type ?? "triangle";
  osc.frequency.setValueAtTime(o.freq, o.start);
  if (o.glideTo) osc.frequency.exponentialRampToValueAtTime(o.glideTo, o.start + o.dur);
  if (o.detune) osc.detune.value = o.detune;
  const peak = o.gain ?? 0.16;
  gain.gain.setValueAtTime(0.0001, o.start);
  gain.gain.exponentialRampToValueAtTime(peak, o.start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, o.start + o.dur);
  osc.connect(gain).connect(out);
  osc.start(o.start);
  osc.stop(o.start + o.dur + 0.03);
}

/** Cria um "reverb" barato (delay curto realimentado) — dá o ar épico de masmorra. */
function makeBus(ctx: AudioContext) {
  const master = ctx.createGain();
  master.gain.value = 0.9;
  const delay = ctx.createDelay(1);
  delay.delayTime.value = 0.12;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.28;
  const wet = ctx.createGain();
  wet.gain.value = 0.3;
  master.connect(ctx.destination);
  master.connect(delay);
  delay.connect(feedback).connect(delay);
  delay.connect(wet).connect(ctx.destination);
  return master;
}

function closeSoon(ctx: AudioContext, afterSec: number) {
  setTimeout(() => void ctx.close(), afterSec * 1000 + 400);
}

/**
 * Som de "missão concluída" ao terminar uma lição: arpejo ascendente
 * brilhante com sino final — curto, marcante e com a cara do app.
 */
function successChime() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    const bus = makeBus(ctx);
    const t = ctx.currentTime + 0.02;
    // Arpejo Fá maior ascendente (quest complete)
    const arp = [523.25, 698.46, 880.0];
    arp.forEach((f, i) => {
      const s = t + i * 0.085;
      note(ctx, bus, { freq: f, start: s, dur: 0.22, type: "triangle", gain: 0.15 });
      note(ctx, bus, { freq: f * 2, start: s, dur: 0.16, type: "sine", gain: 0.06 });
    });
    // Sino final sustentado + oitava grave dando corpo
    const end = t + arp.length * 0.085;
    note(ctx, bus, { freq: 1046.5, start: end, dur: 0.9, type: "sine", gain: 0.14 });
    note(ctx, bus, { freq: 523.25, start: end, dur: 0.9, type: "triangle", gain: 0.09, detune: -6 });
    note(ctx, bus, { freq: 261.63, start: end, dur: 0.7, type: "sine", gain: 0.07 });
    closeSoon(ctx, 1.8);
  } catch {
    /* silent — audio is optional */
  }
}

/**
 * Fanfarra de LEVEL UP estilo MMORPG: swoosh ascendente, fanfarra de
 * metais em acorde e brilho cintilante no fim.
 */
function levelUpFanfare() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    const bus = makeBus(ctx);
    const t = ctx.currentTime + 0.02;

    // 1. Swoosh de ascensão
    note(ctx, bus, { freq: 180, start: t, dur: 0.45, type: "sawtooth", gain: 0.07, glideTo: 900 });

    // 2. Fanfarra: G4 → C5 → E5 → G5 (metais em duas vozes levemente desafinadas)
    const fanfare = [392.0, 523.25, 659.25, 783.99];
    fanfare.forEach((f, i) => {
      const s = t + 0.28 + i * 0.13;
      note(ctx, bus, { freq: f, start: s, dur: 0.3, type: "sawtooth", gain: 0.09 });
      note(ctx, bus, { freq: f, start: s, dur: 0.3, type: "square", gain: 0.05, detune: 8 });
      note(ctx, bus, { freq: f / 2, start: s, dur: 0.3, type: "triangle", gain: 0.07 });
    });

    // 3. Acorde final triunfal (C maior amplo) sustentado
    const chordAt = t + 0.28 + fanfare.length * 0.13;
    [261.63, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      note(ctx, bus, {
        freq: f,
        start: chordAt,
        dur: 1.4,
        type: i === 0 ? "triangle" : "sawtooth",
        gain: i === 0 ? 0.11 : 0.07,
        detune: i * 4,
      });
    });

    // 4. Cintilância (sparkles) por cima do acorde
    [1567.98, 2093.0, 2637.02, 2093.0, 3135.96].forEach((f, i) => {
      note(ctx, bus, { freq: f, start: chordAt + 0.12 + i * 0.07, dur: 0.22, type: "sine", gain: 0.05 });
    });

    closeSoon(ctx, 3);
  } catch {
    /* silent — audio is optional */
  }
}

function fireConfetti(intense = false) {
  if (typeof window === "undefined") return;
  const defaults = {
    zIndex: 9999,
    colors: ["#6366f1", "#8b5cf6", "#22c55e", "#f59e0b", "#ffffff"],
  };
  const count = intense ? 220 : 120;
  confetti({
    ...defaults,
    particleCount: count / 2,
    spread: 70,
    startVelocity: 45,
    origin: { x: 0.2, y: 0.7 },
  });
  confetti({
    ...defaults,
    particleCount: count / 2,
    spread: 70,
    startVelocity: 45,
    origin: { x: 0.8, y: 0.7 },
  });
  if (intense) {
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 90, spread: 120, startVelocity: 35, origin: { y: 0.4 } });
    }, 250);
  }
}

export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [levelUp, setLevelUp] = useState<LevelEntry | null>(null);
  const busy = useRef(false);
  const { trigger } = useMascot();

  const celebrateActivity = useCallback(
    ({ prevXp, newXp, level50Unlocked }: { prevXp: number; newXp: number; xp?: number; level50Unlocked?: boolean }) => {
      if (busy.current) return;
      busy.current = true;
      setTimeout(() => (busy.current = false), 400);

      const opts = { level50Unlocked };
      const prevLevel = getLevel(prevXp, opts);
      const nextLevel = getLevel(newXp, opts);
      const leveledUp = nextLevel.level > prevLevel.level;

      fireConfetti(leveledUp);
      if (leveledUp) {
        levelUpFanfare();
        trigger("dance", `Subiu de nível: ${nextLevel.title}! 🎉`, 2800);
        setTimeout(() => setLevelUp(nextLevel), 350);
      } else {
        successChime();
        trigger("jump", "+XP! ✨", 1500);
      }
    },
    [trigger],
  );

  return (
    <Ctx.Provider value={{ celebrateActivity }}>
      {children}
      {levelUp && <LevelUpOverlay level={levelUp} onClose={() => setLevelUp(null)} />}
    </Ctx.Provider>
  );
}

export function useCelebration() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCelebration must be used within CelebrationProvider");
  return ctx;
}

function LevelUpOverlay({ level, onClose }: { level: LevelEntry; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-background/85 px-6 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-ancient/40 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6 text-center text-white shadow-2xl animate-scale-in"
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 z-20 rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Radial glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--ancient)/0.35),transparent_60%)]" />

        {/* Sparkle particles */}
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-ancient"
            style={{
              top: "50%",
              left: "50%",
              animation: `confetti-pop 1.4s ease-out ${i * 0.06}s forwards`,
              transform: `translate(-50%, -50%) rotate(${i * 36}deg) translateY(-80px)`,
            }}
          />
        ))}

        <div className="relative">
          <div className="mx-auto flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-[0.3em] text-ancient">
            <Sparkles className="h-3.5 w-3.5" /> Nível conquistado <Sparkles className="h-3.5 w-3.5" />
          </div>

         <div className="relative mx-auto mt-5 h-48 w-80">
  <img
    src="/level-up-bg.jpeg"
    alt=""
    className="absolute left-1/2 top-1/2 h-44 w-80 -translate-x-1/2 -translate-y-1/2 rounded-2xl object-cover"
  />

  <div className="absolute left-1/2 top-[75%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-4 ring-ancient shadow-[0_0_60px_hsl(var(--ancient)/0.7)] animate-scale-in">
    {level.avatar ? (
      <img
        src={level.avatar}
        alt={level.title}
        className="h-full w-full scale-125 object-cover"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center bg-primary/30">
        <PartyPopper className="h-16 w-16 text-ancient" />
      </div>
    )}
  </div>
</div>
<p className="mt-5 text-[11px] font-semibold uppercase tracking-widest text-white/60">
            Nível {level.level}
          </p>
          <h2 className="mt-1 text-2xl font-black leading-tight">
            Você alcançou:
            <br />
            <span className="bg-gradient-to-r from-ancient via-primary-glow to-ancient bg-clip-text text-transparent">
              {level.title}
            </span>
          </h2>

          <button
            onClick={onClose}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-primary to-primary-glow py-3 text-sm font-bold shadow-lg shadow-primary/30 transition-transform active:scale-95"
          >
            Continuar jornada
          </button>
        </div>
      </div>
    </div>
  );
}
