// Mascote vivo — Nível 1.
// Renderiza a imagem da ovelha (a mesma arte já usada no app: avatar do
// nível atual, ou a arte padrão) sempre com uma animação — nunca parada —
// e reage a eventos disparados via useMascot().trigger(...).
import { useMascot, type MascotEvent } from "@/lib/mascot";

const FALLBACK_SRC = "/sheep-mascot.png";

const EVENT_TO_ANIM_CLASS: Record<Exclude<MascotEvent, null>, string> = {
  wave: "animate-mascot-wave",
  jump: "animate-mascot-jump",
  dance: "animate-mascot-dance",
  streak: "animate-mascot-dance",
  sad: "animate-mascot-sad",
  pet: "animate-mascot-pet",
};

type Props = {
  src?: string;
  size?: number;
  className?: string;
  showMessage?: boolean;
};

export function MascotAvatar({ src, size = 96, className = "", showMessage = true }: Props) {
  const { state, pet } = useMascot();
  const { event, message, moodEmoji } = state;

  const animClass = event ? EVENT_TO_ANIM_CLASS[event] : "animate-mascot-idle";
  const showParticles = event === "jump" || event === "dance" || event === "streak" || event === "pet";
  const particleEmoji = event === "streak" ? "🔥" : event === "dance" ? "⭐" : event === "pet" ? "❤️" : "✨";

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      {showMessage && message && (
        <div className="animate-fade-in mb-1.5 max-w-[190px] rounded-2xl rounded-bl-sm bg-surface px-3 py-1.5 text-center text-[11px] font-medium leading-snug text-foreground shadow-md ring-1 ring-border">
          {message}
        </div>
      )}

      <div className="relative" style={{ width: size, height: size }}>
        <button
          type="button"
          onClick={() => pet()}
          aria-label="Fazer carinho na ovelha"
          className={`h-full w-full overflow-hidden rounded-full shadow-lg ring-2 ring-primary/30 ${animClass}`}
        >
          <img src={src || FALLBACK_SRC} alt="Mascote" className="h-full w-full object-cover" />
        </button>

        <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-surface text-xs shadow ring-1 ring-border">
          {moodEmoji}
        </span>

        {showParticles &&
          [...Array(6)].map((_, i) => (
            <span
              key={i}
              className="pointer-events-none absolute left-1/2 top-1/2 text-sm"
              style={{
                animation: `mascot-particle 1s ease-out ${i * 0.08}s forwards`,
                transform: `translate(-50%, -50%) rotate(${i * 60}deg)`,
              }}
            >
              {particleEmoji}
            </span>
          ))}
      </div>
    </div>
  );
}
