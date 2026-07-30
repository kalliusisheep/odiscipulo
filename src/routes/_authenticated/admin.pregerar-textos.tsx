import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, CheckCircle2, PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { allLessons, verseText } from "@/data/content";
import { bibleStudies } from "@/data/estudos";

export const Route = createFileRoute("/_authenticated/admin/pregerar-textos")({
  component: PregerarTextosPage,
});

// Página utilitária (não aparece em nenhum menu — acesse direto pela URL
// /admin/pregerar-textos). Ela percorre TODAS as lições e estudos bíblicos do
// app e chama a edge function "generate-share-text" uma vez para cada um.
//
// A própria função já verifica o cache antes de chamar a IA, então rodar esta
// página várias vezes é seguro: itens já gerados são pulados (retornam do
// cache instantaneamente) e só os novos (lições adicionadas depois) custam
// uma chamada de IA. É assim que os textos ficam "pré-gerados e armazenados",
// sem nenhum usuário real esperar a IA no primeiro compartilhamento.

type QueueItem = { lessonId: string; title: string; context: string };

function buildLessonQueue(): QueueItem[] {
  const lessons = allLessons().map(({ lesson }) => ({
    lessonId: lesson.id,
    title: lesson.title,
    context: [
      lesson.intro.join(" "),
      lesson.verses.map((v) => `${v.ref}: ${verseText(v, "NVI")}`).join(" "),
      lesson.deepDive,
      lesson.application,
    ]
      .filter(Boolean)
      .join(" ")
      .slice(0, 2000),
  }));

  const studies = bibleStudies.map((study) => ({
    lessonId: `bible:${study.id}`,
    title: study.title,
    context: [
      study.sections.flatMap((sec) => sec.body).join(" "),
      study.sections
        .flatMap((sec) => sec.verses ?? [])
        .map((v) => `${v.ref}: ${verseText(v, "NVI")}`)
        .join(" "),
      study.application,
    ]
      .filter(Boolean)
      .join(" ")
      .slice(0, 2000),
  }));

  return [...lessons, ...studies];
}

type ItemStatus = "pendente" | "gerando" | "ok" | "erro";

function PregerarTextosPage() {
  const [running, setRunning] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>({});
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  const appendLog = (line: string) => setLog((prev) => [...prev.slice(-200), line]);

  const start = async () => {
    if (running) return;
    setRunning(true);
    setDone(0);
    setLog([]);

    const queue = buildLessonQueue();
    setTotal(queue.length);
    const initialStatuses: Record<string, ItemStatus> = {};
    queue.forEach((q) => (initialStatuses[q.lessonId] = "pendente"));
    setStatuses(initialStatuses);

    for (const item of queue) {
      setStatuses((prev) => ({ ...prev, [item.lessonId]: "gerando" }));
      try {
        const { data, error } = await supabase.functions.invoke<{ text?: string; cached?: boolean }>(
          "generate-share-text",
          { body: { lessonId: item.lessonId, title: item.title, context: item.context } },
        );
        if (error) throw error;
        setStatuses((prev) => ({ ...prev, [item.lessonId]: "ok" }));
        appendLog(`✓ ${item.title} ${data?.cached ? "(já estava em cache)" : "(gerado agora)"}`);
      } catch (err) {
        setStatuses((prev) => ({ ...prev, [item.lessonId]: "erro" }));
        appendLog(`✗ ${item.title} — falhou: ${err instanceof Error ? err.message : "erro desconhecido"}`);
      }
      setDone((d) => d + 1);
      // Pequena pausa entre chamadas pra não sobrecarregar a IA Gateway.
      await new Promise((r) => setTimeout(r, 250));
    }

    setRunning(false);
  };

  const okCount = Object.values(statuses).filter((s) => s === "ok").length;
  const errorCount = Object.values(statuses).filter((s) => s === "erro").length;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-xl font-bold text-foreground">Pré-gerar textos de compartilhamento</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Isso chama a IA uma vez para cada lição e estudo bíblico do app e salva o resultado no banco. Depois de
        rodar, nenhum usuário vai precisar esperar a IA gerar nada ao compartilhar — o texto já estará pronto.
        Rodar de novo é seguro: itens já prontos são só confirmados, não gerados de novo.
      </p>

      <button
        type="button"
        onClick={() => void start()}
        disabled={running}
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
        {running ? "Gerando…" : "Iniciar pré-geração"}
      </button>

      {total > 0 && (
        <div className="mt-4 text-sm text-foreground">
          <p>
            Progresso: {done}/{total} — <span className="text-green-600">{okCount} ok</span>
            {errorCount > 0 && <span className="text-destructive"> · {errorCount} com erro</span>}
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${total ? (done / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {!running && total > 0 && done === total && (
        <p className="mt-4 flex items-center gap-2 text-sm font-medium text-green-600">
          <CheckCircle2 className="h-4 w-4" /> Concluído.
        </p>
      )}

      {log.length > 0 && (
        <pre className="mt-6 max-h-96 overflow-auto rounded-xl bg-muted/50 p-4 text-xs text-muted-foreground">
          {log.join("\n")}
        </pre>
      )}
    </div>
  );
}
