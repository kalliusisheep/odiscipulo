// Mascote vivo — Nível 1.
// Estado global e leve (sem novas dependências) que controla o "humor" e as
// reações da ovelha com base em dados reais: horário, dia da semana, streak e
// last_activity_date. Componentes de qualquer tela podem chamar `trigger(...)`
// para disparar uma reação pontual (pular ao ganhar XP, dançar ao subir de
// nível, comemorar streak etc).
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type MascotEvent = "wave" | "jump" | "dance" | "streak" | "sad" | null;

type MascotState = {
  event: MascotEvent;
  message: string | null;
  moodEmoji: string;
};

type MascotCtx = {
  state: MascotState;
  /** Dispara uma reação pontual. Some sozinha após `durationMs`. */
  trigger: (event: Exclude<MascotEvent, null>, message?: string, durationMs?: number) => void;
  /** Atualiza só a mensagem da ovelha, sem mexer na animação atual. */
  say: (message: string) => void;
};

const Ctx = createContext<MascotCtx | null>(null);

function greetingForNow(): { text: string; emoji: string } {
  const now = new Date();
  const hour = now.getHours();
  const isSunday = now.getDay() === 0;

  if (isSunday) return { text: "Hoje é dia de culto? 🙏", emoji: "🙏" };
  if (hour >= 5 && hour < 12) return { text: "Bom dia! Vamos estudar?", emoji: "☀️" };
  if (hour >= 12 && hour < 18) return { text: "Boa tarde! Pronto pra continuar?", emoji: "🌤️" };
  if (hour >= 18 && hour < 23) return { text: "Boa noite!", emoji: "🌙" };
  return { text: "Já tá tarde… não esquece de descansar.", emoji: "😴" };
}

export function MascotProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MascotState>({ event: null, message: null, moodEmoji: "😀" });
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = useCallback(
    (event: Exclude<MascotEvent, null>, message?: string, durationMs = 1600) => {
      if (clearTimer.current) clearTimeout(clearTimer.current);
      setState((s) => ({ event, message: message ?? s.message, moodEmoji: s.moodEmoji }));
      clearTimer.current = setTimeout(() => {
        setState((s) => ({ ...s, event: null }));
      }, durationMs);
    },
    [],
  );

  const say = useCallback((message: string) => {
    setState((s) => ({ ...s, message }));
  }, []);

  // Ao abrir o app: busca a última atividade real do usuário e decide entre
  // "senti sua falta" (streak quebrado) ou uma saudação normal de boas-vindas.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user || cancelled) return;
      const { data: p } = await supabase
        .from("profiles")
        .select("last_activity_date")
        .eq("id", u.user.id)
        .maybeSingle();
      if (cancelled) return;

      const todayStr = new Date().toISOString().slice(0, 10);
      const last = (p?.last_activity_date as string | null) ?? null;
      const diffDays = last
        ? Math.floor((new Date(todayStr).getTime() - new Date(last).getTime()) / 86400000)
        : null;
      const missedDays = diffDays !== null && diffDays >= 2;

      if (missedDays) {
        setState({ event: "sad", message: "Senti sua falta…", moodEmoji: "😔" });
        sadTimer.current = setTimeout(() => {
          if (!cancelled) setState({ event: null, message: "Vamos recomeçar hoje?", moodEmoji: "🙂" });
        }, 3200);
      } else {
        const g = greetingForNow();
        setState({ event: "wave", message: g.text, moodEmoji: g.emoji });
        clearTimer.current = setTimeout(() => {
          if (!cancelled) setState((s) => ({ ...s, event: null }));
        }, 1500);
      }
    })();
    return () => {
      cancelled = true;
      if (clearTimer.current) clearTimeout(clearTimer.current);
      if (sadTimer.current) clearTimeout(sadTimer.current);
    };
  }, []);

  return <Ctx.Provider value={{ state, trigger, say }}>{children}</Ctx.Provider>;
}

export function useMascot() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMascot must be used within MascotProvider");
  return ctx;
}
