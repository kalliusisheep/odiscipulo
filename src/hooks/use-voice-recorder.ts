import { useCallback, useEffect, useRef, useState } from "react";

export type RecorderStatus = "idle" | "recording" | "recorded" | "error";

type UseVoiceRecorderOptions = {
  /** Duração máxima da gravação, em segundos — evita áudios longos demais para o mural/chat. */
  maxSeconds?: number;
};

/** Escolhe o melhor mimeType de áudio suportado pelo navegador, na ordem de preferência. */
function pickMimeType(): string {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  for (const c of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported?.(c)) return c;
  }
  return "";
}

/**
 * Hook de gravação de áudio via MediaRecorder — usado tanto para notas de
 * voz no mural de orações quanto para mensagens de áudio no chat.
 */
export function useVoiceRecorder({ maxSeconds = 60 }: UseVoiceRecorderOptions = {}) {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [seconds, setSeconds] = useState(0);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mimeTypeRef = useRef<string>("");

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const reset = useCallback(() => {
    stopTimer();
    stopStream();
    recorderRef.current = null;
    chunksRef.current = [];
    setSeconds(0);
    setBlob(null);
    setBlobUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setStatus("idle");
  }, []);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = pickMimeType();
      mimeTypeRef.current = mimeType;
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stopTimer();
        stopStream();
        const finalBlob = new Blob(chunksRef.current, { type: mimeTypeRef.current || "audio/webm" });
        setBlob(finalBlob);
        setBlobUrl(URL.createObjectURL(finalBlob));
        setStatus("recorded");
      };
      recorderRef.current = recorder;
      recorder.start();
      setSeconds(0);
      setStatus("recording");
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          const next = s + 1;
          if (next >= maxSeconds) recorderRef.current?.stop();
          return next;
        });
      }, 1000);
    } catch (e) {
      console.error("Gravação de voz: microfone indisponível", e);
      setStatus("error");
    }
  }, [maxSeconds]);

  const stop = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  }, []);

  /** Interrompe e descarta a gravação em andamento (ou o áudio já gravado), sem salvar nada. */
  const cancel = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      chunksRef.current = [];
      recorderRef.current.onstop = () => {
        stopTimer();
        stopStream();
      };
      recorderRef.current.stop();
    }
    reset();
  }, [reset]);

  // Limpa microfone/timer/blob se o componente desmontar com gravação ativa.
  useEffect(
    () => () => {
      stopTimer();
      stopStream();
      setBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    },
    [],
  );

  return { status, seconds, blob, blobUrl, mimeType: mimeTypeRef.current, start, stop, cancel, reset };
}
