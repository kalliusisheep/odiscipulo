import { useState } from "react";
import { Mic, Square, Send, Trash2, Loader2 } from "lucide-react";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Props = {
  /** Chamado quando o usuário confirma o envio da nota gravada. */
  onSend: (blob: Blob, seconds: number, mimeType: string) => Promise<void> | void;
  /** Duração máxima da gravação, em segundos (padrão: 60s — suficiente para um testemunho/oração curtos). */
  maxSeconds?: number;
  className?: string;
};

/**
 * Botão de microfone que expande para um pequeno gravador inline: gravar →
 * ouvir prévia → enviar ou descartar. Usado tanto no mural de orações quanto
 * no chat entre usuários.
 */
export function VoiceRecorder({ onSend, maxSeconds = 60, className }: Props) {
  const { status, seconds, blob, blobUrl, mimeType, start, stop, cancel, reset } = useVoiceRecorder({ maxSeconds });
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!blob || sending) return;
    setSending(true);
    try {
      await onSend(blob, seconds, mimeType);
      reset();
    } catch (e) {
      console.error("Nota de voz: falha ao enviar", e);
    } finally {
      setSending(false);
    }
  };

  if (status === "idle" || status === "error") {
    return (
      <button
        type="button"
        onClick={() => void start()}
        aria-label="Gravar nota de voz"
        title={status === "error" ? "Não foi possível acessar o microfone" : "Gravar nota de voz"}
        className={
          className ??
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-primary transition-colors hover:bg-primary/10"
        }
      >
        <Mic className="h-4 w-4" />
      </button>
    );
  }

  if (status === "recording") {
    return (
      <div className="flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1.5">
        <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-destructive" />
        <span className="text-xs font-medium tabular-nums text-destructive">{formatTime(seconds)}</span>
        <button
          type="button"
          onClick={stop}
          aria-label="Parar gravação"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
        >
          <Square className="h-3 w-3" />
        </button>
      </div>
    );
  }

  // status === "recorded"
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-2 py-1.5">
      {blobUrl && <audio controls src={blobUrl} className="h-8 max-w-[160px]" />}
      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{formatTime(seconds)}</span>
      <button
        type="button"
        onClick={cancel}
        aria-label="Descartar gravação"
        disabled={sending}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive disabled:opacity-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => void handleSend()}
        aria-label="Enviar nota de voz"
        disabled={sending}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
      >
        {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
