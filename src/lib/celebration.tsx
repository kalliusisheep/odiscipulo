import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import confetti from "canvas-confetti";
import { getLevel, type LevelEntry } from "@/data/levels";
import { PartyPopper, Sparkles, X } from "lucide-react";

type CelebrationCtx = {
  celebrateActivity: (opts: { prevXp: number; newXp: number; xp?: number; level50Unlocked?: boolean }) => void;
};

const Ctx = createContext<CelebrationCtx | null>(null);

// Small WebAudio helpers — respect device volume via master gain and stay quiet if muted.
function playTone(freqs: number[], duration = 0.35, type: OscillatorType = "sine", volume = 0.18) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") void ctx.resume();
    const now = ctx.currentTime;
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = f;
      const start = now + i * 0.09;
      const end = start + duration;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, end);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(end + 0.02);
    });
    setTimeout(() => void ctx.close(), (freqs.length * 100) + duration * 1000 + 200);
  } catch {
    /* silent — audio is optional */
  }
}

function successChime() {
  // Bright triad: C5 → E5 → G5
  playTone([523.25, 659.25, 783.99], 0.32, "triangle", 0.16);
}

function levelUpFanfare() {
  // Longer fanfare: G4 C5 E5 G5 C6
  playTone([392, 523.25, 659.25, 783.99, 1046.5], 0.55, "triangle", 0.22);
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
        setTimeout(() => setLevelUp(nextLevel), 350);
      } else {
        successChime();
      }
    },
    [],
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

          <div className="relative mx-auto mt-5 h-40 w-64">
            <img
              src="/level-up-bg.jpeg"
              alt=""
              className="absolute left-1/2 top-1/2 h-36 w-64 -translate-x-1/2 -translate-y-1/2 rounded-2xl object-cover"
            />

            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-slate-950 ring-4 ring-ancient shadow-[0_0_60px_hsl(var(--ancient)/0.7)] animate-scale-in">
              {level.avatar ? (
                <img src={level.avatar} alt={level.title} className="h-full w-full object-cover" />
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
    </div>
  );
}
