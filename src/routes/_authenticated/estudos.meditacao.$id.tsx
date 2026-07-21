import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { aiMeditations } from "@/data/estudos";
import { useCelebration } from "@/lib/celebration";
import { awardXpAndStreak } from "@/lib/progress";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Sparkles, Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/estudos/meditacao/$id")({
  component: MeditacaoPage,
});

function MeditacaoPage() {
  const { id } = Route.useParams();
  const med = aiMeditations.find((m) => m.id === id);
  const [idx, setIdx] = useState(-1); // -1 = intro; 0..n-1 = passos; n = pergunta central
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { celebrateActivity } = useCelebration();

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo(0, 0);
  }, [idx]);

  if (!med) {
    return (
      <div className="mx-auto max-w-lg p-6 text-center">
        <p>Meditação não encontrada.</p>
        <Link to="/estudos" className="mt-4 inline-block text-primary underline">Voltar</Link>
      </div>
    );
  }

  const total = med.steps.length;
  const atIntro = idx === -1;
  const atFinal = idx === total;
  const currentStep = idx >= 0 && idx < total ? med.steps[idx] : null;

  const progressPct = atIntro ? 0 : atFinal ? 100 : Math.round(((idx + 1) / (total + 1)) * 100);

  const save = async () => {
    if (!answer.trim() || saving) return;
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      await supabase.from("diary_entries").insert({
        user_id: u.user.id,
        lesson_id: `med:${med.id}`,
        lesson_title: `Meditação: ${med.title}`,
        question: med.centralQuestion,
        answer: answer.trim(),
      });
      await supabase.from("lesson_progress").upsert(
        { user_id: u.user.id, lesson_id: `med:${med.id}`, xp_gained: 50 },
        { onConflict: "user_id,lesson_id" },
      );
      const xp = 50;
      const { prevXp, newXp } = await awardXpAndStreak(u.user.id, xp);
      celebrateActivity({ prevXp, newXp, xp });
      setSaved(true);
    }
    setSaving(false);
  };

  return (
    <div className="mx-auto max-w-lg px-4 pt-4 pb-24 animate-slide-up">
      <div className="mb-4 flex items-center gap-3">
        <Link
          to="/estudos"
          className="rounded-full p-2 text-muted-foreground hover:bg-surface"
          aria-label="Voltar aos estudos"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full bg-gradient-to-r from-ancient to-primary transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Clock className="h-3 w-3" /> {med.minutes} min
        </span>
      </div>

      <div className="mb-5">
        <span className="inline-flex items-center gap-1 rounded-full bg-ancient/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ancient">
          <Sparkles className="h-3 w-3" /> Meditação Guiada
        </span>
        <h1 className="mt-2 text-2xl font-semibold">{med.title}</h1>
        <p className="mt-1 inline-flex items-center gap-1 font-serif text-xs italic text-ancient">
          <BookOpen className="h-3 w-3" /> {med.passage}
        </p>
      </div>

      {atIntro && (
        <div className="space-y-5">
          <div className="card-elevated border-l-4 border-l-ancient p-5">
            <p className="scripture text-base leading-relaxed text-foreground/90">{med.intro}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface/50 p-4 text-sm text-muted-foreground">
            <p><strong className="text-foreground">Prepare-se:</strong> encontre um lugar silencioso. Coloque o celular no modo silencioso. Respire fundo três vezes antes de começar.</p>
          </div>
          <button
            onClick={() => setIdx(0)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-ancient to-primary py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-[1.01]"
          >
            <Sparkles className="h-4 w-4" /> Iniciar meditação
          </button>
        </div>
      )}

      {currentStep && (
        <div className="space-y-5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Pausa {idx + 1} de {total}
          </div>

          <section className="card-elevated space-y-4 p-6">
            <h2 className="font-serif text-xl text-ancient">{currentStep.heading}</h2>
            <p className="scripture text-base leading-relaxed text-foreground/90">{currentStep.body}</p>
            {currentStep.scripture && (
              <p className="rounded-xl border border-ancient/30 bg-ancient/5 px-3 py-2 text-xs font-semibold text-ancient">
                {currentStep.scripture}
              </p>
            )}
            {currentStep.pauseSeconds && (
              <p className="text-xs italic text-muted-foreground">
                Sugestão: fique em silêncio por cerca de {currentStep.pauseSeconds} segundos antes de avançar.
              </p>
            )}
          </section>

          <div className="flex gap-2">
            {idx > 0 && (
              <button
                onClick={() => setIdx(idx - 1)}
                className="flex-1 rounded-2xl border border-border py-3 text-sm font-medium text-muted-foreground hover:border-primary/40"
              >
                Voltar
              </button>
            )}
            <button
              onClick={() => setIdx(idx + 1)}
              className="flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-glow"
            >
              {idx === total - 1 ? "Ir à centralização" : "Próxima pausa"} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {atFinal && (
        <div className="space-y-5">
          <div className="card-elevated border-l-4 border-l-primary p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Centralização</p>
            <p className="mt-2 scripture text-base leading-relaxed">{med.centralQuestion}</p>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={7}
            disabled={saved}
            placeholder="Escute o que Deus tem falado ao seu coração e escreva devagar…"
            className="w-full resize-none rounded-2xl border border-border bg-input p-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary disabled:opacity-70"
          />
          <p className="text-[11px] text-muted-foreground">
            Sua resposta será salva no <strong>Mural → Meu Diário</strong>, marcada como <em>Meditação</em>.
          </p>

          {saved ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 rounded-2xl bg-success/10 py-3 text-sm font-semibold text-success">
                <Check className="h-4 w-4" /> Salvo no seu diário
              </div>
              <Link
                to="/estudos"
                className="block rounded-2xl border border-border py-3 text-center text-sm font-medium text-muted-foreground"
              >
                Voltar aos estudos
              </Link>
            </div>
          ) : (
            <button
              onClick={() => void save()}
              disabled={!answer.trim() || saving}
              className="w-full rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary-glow disabled:opacity-50"
            >
              {saving ? "Salvando…" : "Salvar no diário"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
