import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, CheckCircle2, PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lessonById, verseText } from "@/data/content";

export const Route = createFileRoute("/_authenticated/admin/pregerar-narracao")({
  component: PregerarNarracaoPage,
});

// Página utilitária (não aparece em nenhum menu — acesse direto pela URL
// /admin/pregerar-narracao). Percorre as trilhas na ORDEM REAL do currículo
// (disciple_modules → disciple_trails, por "ord"), reconstrói exatamente os
// mesmos trechos de texto que o NarrationButton narraria em cada lição, e
// chama /api/tts para cada um.
//
// /api/tts já verifica o cache (bucket narration-audio, por hash do texto)
// antes de gerar — então tudo que já foi narrado alguma vez é pulado
// automaticamente, sem custo extra. É seguro rodar de novo a qualquer hora.
//
// Versão usada: NVI (mesma versão padrão usada em /admin/pregerar-textos).

/** Mesma lógica de divisão de sentenças usada no NarrationButton — precisa
 * gerar o áudio para o texto EXATO que será pedido depois, ou o cache não bate. */
function splitSentences(text: string): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const matches = clean.match(/[^.!?…]+[.!?…]+["')\]]*|[^.!?…]+$/g);
  if (!matches) return [clean];
  const out: string[] = [];
  for (const raw of matches) {
    const s = raw.trim();
    if (!s) continue;
    if (s.length < 12 && out.length > 0) {
      out[out.length - 1] = `${out[out.length - 1]} ${s}`;
    } else {
      out.push(s);
    }
  }
  return out;
}

type ModuleRow = { id: string; ord: number; title: string };
type TrailRow = {
  id: string;
  module_id: string;
  ord: number;
  title: string;
  lesson_id: string | null;
};

type QueueItem = { key: string; label: string; text: string };

async function buildQueue(): Promise<{ items: QueueItem[]; skippedTrails: string[] }> {
  const [{ data: modules }, { data: trailsData }] = await Promise.all([
    supabase.from("disciple_modules").select("id, ord, title").order("ord"),
    supabase.from("disciple_trails").select("id, module_id, ord, title, lesson_id").order("ord"),
  ]);

  const mods = (modules ?? []) as ModuleRow[];
  const trails = (trailsData ?? []) as TrailRow[];
  const trailsByModule = new Map<string, TrailRow[]>();
  for (const t of trails) {
    const list = trailsByModule.get(t.module_id) ?? [];
    list.push(t);
    trailsByModule.set(t.module_id, list);
  }

  const items: QueueItem[] = [];
  const skippedTrails: string[] = [];

  for (const mod of mods) {
    const modTrails = (trailsByModule.get(mod.id) ?? []).sort((a, b) => a.ord - b.ord);
    for (const trail of modTrails) {
      if (!trail.lesson_id) {
        skippedTrails.push(`${mod.title} › ${trail.title} (sem lição vinculada)`);
        continue;
      }
      const found = lessonById(trail.lesson_id);
      if (!found) {
        skippedTrails.push(
          `${mod.title} › ${trail.title} (lição "${trail.lesson_id}" não encontrada)`,
        );
        continue;
      }
      const { lesson } = found;
      const label = `${mod.title} › ${trail.title}`;

      const blocks: { tag: string; text: string }[] = [
        { tag: "titulo", text: lesson.title },
        ...lesson.intro.map((p, i) => ({ tag: `intro-${i}`, text: p })),
      ];
      lesson.verses.forEach((v, i) => {
        blocks.push({ tag: `verso-ref-${i}`, text: v.ref });
        blocks.push({ tag: `verso-texto-${i}`, text: `"${verseText(v, "NVI")}"` });
      });
      blocks.push({ tag: "explicacao", text: lesson.deepDive });
      blocks.push({ tag: "citacao", text: `"${lesson.theologianQuote.text}"` });

      for (const block of blocks) {
        for (const [si, sentence] of splitSentences(block.text).entries()) {
          items.push({ key: `${trail.id}:${block.tag}:${si}`, label, text: sentence });
        }
      }
    }
  }

  return { items, skippedTrails };
}

type ItemStatus = "pendente" | "gerando" | "ok" | "cache" | "erro";

function PregerarNarracaoPage() {
  const [running, setRunning] = useState(false);
  const [building, setBuilding] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>({});
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);

  const appendLog = (line: string) => setLog((prev) => [...prev.slice(-300), line]);

  const start = async () => {
    if (running) return;
    setRunning(true);
    setBuilding(true);
    setDone(0);
    setLog([]);
    setSkipped([]);

    const { items: queue, skippedTrails } = await buildQueue();
    setSkipped(skippedTrails);
    setBuilding(false);
    setTotal(queue.length);
    const initialStatuses: Record<string, ItemStatus> = {};
    queue.forEach((q) => (initialStatuses[q.key] = "pendente"));
    setStatuses(initialStatuses);

    let currentLabel = "";
    for (const item of queue) {
      if (item.label !== currentLabel) {
        currentLabel = item.label;
        appendLog(`— ${currentLabel} —`);
      }
      setStatuses((prev) => ({ ...prev, [item.key]: "gerando" }));
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: item.text }),
        });
        if (!res.ok) {
          const detail = await res.text().catch(() => "");
          throw new Error(`${res.status}${detail ? `: ${detail.slice(0, 200)}` : ""}`);
        }
        setStatuses((prev) => ({ ...prev, [item.key]: "ok" }));
      } catch (err) {
        setStatuses((prev) => ({ ...prev, [item.key]: "erro" }));
        appendLog(
          `  ✗ falhou: ${err instanceof Error ? err.message : "erro desconhecido"} — "${item.text.slice(0, 60)}..."`,
        );
      }
      setDone((d) => d + 1);
      // Pequena pausa entre chamadas pra não sobrecarregar a API da OpenAI.
      await new Promise((r) => setTimeout(r, 150));
    }

    appendLog(`Concluído: ${done + 1}/${queue.length}`);
    setRunning(false);
  };

  const okCount = Object.values(statuses).filter((s) => s === "ok").length;
  const errorCount = Object.values(statuses).filter((s) => s === "erro").length;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-xl font-bold text-foreground">Pré-gerar narração (áudio das lições)</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Percorre as trilhas na ordem real do currículo (Módulo 1 "Novo Convertido" primeiro, depois
        Módulo 2 "Fundamentos da Fé", e assim por diante) e gera o áudio de cada trecho que a
        narração vai precisar. Trechos que já têm áudio gerado (pela OpenAI) são pulados
        automaticamente pelo endpoint — rodar de novo é seguro.
      </p>

      <button
        type="button"
        onClick={() => void start()}
        disabled={running}
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {running ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <PlayCircle className="h-4 w-4" />
        )}
        {building ? "Montando fila…" : running ? "Gerando…" : "Iniciar pré-geração"}
      </button>

      {skipped.length > 0 && (
        <div className="mt-4 rounded-xl border border-border bg-surface-2 p-3 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">
            {skipped.length} trilha(s) sem conteúdo, puladas:
          </p>
          <ul className="mt-1 list-disc pl-4">
            {skipped.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}

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
