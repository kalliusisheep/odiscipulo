import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  className?: string;
};

function formatAudioTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

/** Player de nota de voz com controles consistentes em todos os navegadores. */
export function VoiceNotePlayer({ src, className }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setHasError(false);

    const handleLoadedMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handleError = () => setHasError(true);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [src]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setHasError(true);
      }
    } else {
      audio.pause();
    }
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(value)) return;
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const progress = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;
  const fallbackClassName = "w-full max-w-[280px]";

  return (
    <div
      className={`voice-note-player group flex min-h-14 items-center gap-3 rounded-2xl border border-foreground/10 bg-background/35 px-3 py-2.5 shadow-[0_8px_24px_-18px_rgb(0_0_0_/_0.8)] backdrop-blur-sm ${className ?? fallbackClassName}`}
      role="group"
      aria-label="Nota de voz"
    >
      <audio ref={audioRef} preload="metadata" src={src} className="hidden" />

      <button
        type="button"
        onClick={() => void togglePlayback()}
        disabled={hasError}
        className="voice-note-player-play flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_7px_16px_-8px_var(--primary)] transition-transform duration-200 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={hasError ? "Áudio indisponível" : isPlaying ? "Pausar áudio" : "Reproduzir áudio"}
      >
        {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/65">
            {hasError ? "Áudio indisponível" : "Mensagem de voz"}
          </span>
          <span className="shrink-0 text-[10px] font-semibold tabular-nums text-foreground/65">
            {formatAudioTime(currentTime)} / {formatAudioTime(duration)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.01}
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => handleSeek(Number(event.target.value))}
          disabled={hasError || !duration}
          aria-label="Progresso do áudio"
          className="voice-note-player-seek w-full"
          style={{
            background: `linear-gradient(90deg, var(--primary) ${progress}%, color-mix(in oklab, var(--foreground) 16%, transparent) ${progress}%)`,
          }}
        />
      </div>
    </div>
  );
}
