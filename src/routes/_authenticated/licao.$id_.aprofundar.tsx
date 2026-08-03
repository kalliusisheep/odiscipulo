import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { lessonById, verseText } from "@/data/content";
import { useApp } from "@/lib/app-context";
import { useReadingFontScale } from "@/hooks/use-reading-font-scale";
import { FontSizeControls } from "@/components/font-size-controls";
import { ArrowLeft, Layers } from "lucide-react";
import { NarrationButton } from "@/components/NarrationButton";

export const Route = createFileRoute("/_authenticated/licao/$id_/aprofundar")({
  validateSearch: (search: Record<string, unknown>) => ({
    modulo: typeof search.modulo === "string" ? search.modulo : undefined,
  }),
  component: AprofundarPage,
});

function AprofundarPage() {
  const { id } = Route.useParams();
  const { modulo } = Route.useSearch();
  const nav = useNavigate();
  const { bibleVersion } = useApp();
  const found = useMemo(() => lessonById(id), [id]);
  const { scaleIndex, increase, decrease, contentZoomStyle } = useReadingFontScale();

  const goBack = () => {
    void nav({ to: "/licao/$id", params: { id }, search: { modulo } });
  };

  if (!found || !found.lesson.deepen) {
    return (
      <div className="mx-auto max-w-lg p-6 text-center">
        <p>Conteúdo não encontrado.</p>
        <button type="button" onClick={goBack} className="mt-4 inline-block text-primary underline">
          Voltar
        </button>
      </div>
    );
  }

  const { lesson } = found;
  const deepen = lesson.deepen!;

  return (
    <div className="mx-auto max-w-lg pb-24 animate-slide-up">
      <div className="px-4">
        {/* Banner no topo da tela de Aprofundar (compartilhado por todas as trilhas) */}
        <div className="mt-3 mb-4 h-28 w-full overflow-hidden rounded-2xl sm:h-36">
          <img
            src="/aprofundar-banner.jpg"
            alt=""
            className="h-full w-full object-cover object-[center_28%]"
          />
        </div>

        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className="rounded-full p-2 text-muted-foreground hover:bg-surface"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Layers className="h-4 w-4 shrink-0 text-ancient" />
            <h1 className="truncate text-sm font-bold text-ancient" data-narrate>
              Aprofundar
            </h1>
          </div>
          <NarrationButton containerSelector='[data-tts-scope="aprofundar"]' />
          <FontSizeControls scaleIndex={scaleIndex} onIncrease={increase} onDecrease={decrease} />
        </div>

        <div style={contentZoomStyle} className="space-y-4" data-tts-scope="aprofundar">
          <p
            className="px-1 text-[10px] uppercase tracking-wider text-muted-foreground"
            data-narrate
          >
            {lesson.title} · contexto, exegese e mais
          </p>

          <div className="space-y-4 rounded-2xl border border-ancient/30 bg-ancient/5 p-4">
            {deepen.historicalContext && (
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider text-ancient"
                  data-narrate
                >
                  Contexto histórico e cultural
                </p>
                <p className="mt-1.5 text-base leading-relaxed" data-narrate>
                  {deepen.historicalContext}
                </p>
              </div>
            )}

            {deepen.additionalVerses && deepen.additionalVerses.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-ancient">
                  <span data-narrate>Passagens de apoio</span> ({bibleVersion})
                </p>
                <div className="mt-1.5 space-y-2">
                  {deepen.additionalVerses.map((v) => (
                    <div key={v.ref} className="rounded-xl bg-background/60 p-3">
                      <p
                        className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                        data-narrate
                      >
                        {v.ref}
                      </p>
                      <p className="mt-1 scripture text-base text-foreground/85" data-narrate>
                        {`"${verseText(v, bibleVersion)}"`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {deepen.exegeticalNotes && (
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider text-ancient"
                  data-narrate
                >
                  Notas de exegese
                </p>
                <p className="mt-1.5 text-base leading-relaxed" data-narrate>
                  {deepen.exegeticalNotes}
                </p>
              </div>
            )}

            {deepen.additionalKeywords && deepen.additionalKeywords.length > 0 && (
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider text-ancient"
                  data-narrate
                >
                  Mais palavras no idioma original
                </p>
                <ul className="mt-1.5 space-y-2">
                  {deepen.additionalKeywords.map((o, i) => (
                    <li
                      key={i}
                      className="rounded-xl border border-ancient/20 bg-background/60 p-2.5"
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="ancient-text text-lg text-ancient">{o.word}</span>
                        <span className="text-xs text-ancient/80">
                          ({o.translit}, {o.lang})
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-foreground/80" data-narrate>
                        {o.meaning}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {deepen.theologicalDebate && (
              <div className="rounded-xl border border-border bg-background/60 p-3">
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                  data-narrate
                >
                  Panorama entre tradições cristãs
                </p>
                <p className="mt-1.5 text-base leading-relaxed" data-narrate>
                  {deepen.theologicalDebate}
                </p>
                <p className="mt-2 text-[11px] italic text-muted-foreground" data-narrate>
                  Para aprofundar essa questão, converse com seu pastor ou líder de discipulado.
                </p>
              </div>
            )}

            {deepen.secondQuote && (
              <blockquote className="border-l-4 border-l-ancient pl-3">
                <p className="scripture text-base leading-relaxed text-ancient" data-narrate>
                  {`"${deepen.secondQuote.text}"`}
                </p>
                <footer className="mt-1.5 text-xs font-semibold text-ancient/80" data-narrate>
                  — {deepen.secondQuote.author}
                </footer>
              </blockquote>
            )}
          </div>

          <button
            type="button"
            onClick={goBack}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border py-4 text-sm font-semibold text-muted-foreground transition-all hover:bg-surface"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar à lição
          </button>
        </div>
      </div>
    </div>
  );
}
