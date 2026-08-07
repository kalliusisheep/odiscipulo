import { Music2, Volume2, VolumeX } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { getGameAudioState, stopGameMusic, subscribeGameAudio, toggleGameMusic, toggleGameSfx } from "@/lib/game-audio";

export function GameAudioControls() {
  const audio = useSyncExternalStore(subscribeGameAudio, getGameAudioState, getGameAudioState);
  useEffect(() => () => stopGameMusic(), []);
  return <div className="game-audio-controls fixed right-4 top-4 z-[60] flex items-center gap-1 rounded-2xl border border-border/40 bg-background/90 p-1.5 shadow-2xl shadow-black/30 backdrop-blur-xl" aria-label="Controles de áudio do jogo">
    <button type="button" aria-pressed={audio.musicEnabled} onClick={toggleGameMusic} className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all active:scale-95 ${audio.musicEnabled ? "bg-primary/15 text-primary shadow-sm shadow-primary/15" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"}`} title={audio.musicEnabled ? "Desativar música" : "Ativar música"} aria-label={audio.musicEnabled ? "Desativar música" : "Ativar música"}>{audio.musicEnabled ? <Music2 className="h-4 w-4" /> : <Music2 className="h-4 w-4 opacity-40" />}</button>
    <button type="button" aria-pressed={audio.sfxEnabled} onClick={toggleGameSfx} className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all active:scale-95 ${audio.sfxEnabled ? "bg-ancient/15 text-ancient shadow-sm" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"}`} title={audio.sfxEnabled ? "Desativar efeitos" : "Ativar efeitos"} aria-label={audio.sfxEnabled ? "Desativar efeitos" : "Ativar efeitos"}>{audio.sfxEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 opacity-60" />}</button>
  </div>;
}
