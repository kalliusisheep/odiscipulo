import { useEffect, useMemo, useState } from "react";
import { Check, GitCompareArrows, Loader2, RefreshCw } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  fetchChapter,
  PT_TRANSLATIONS,
  translationByCode,
  type Verse,
} from "@/lib/bible-source";
import { bookNameById } from "@/data/bible-books";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: number;
  chapter: number;
  currentTranslation: string;
};

function initialSelection(currentTranslation: string) {
  const second =
    PT_TRANSLATIONS.find((translation) => translation.code !== currentTranslation)?.code ??
    PT_TRANSLATIONS[1]?.code ??
    PT_TRANSLATIONS[0].code;
  return [currentTranslation, second];
}

export function VersionCompareSheet({
  open,
  onOpenChange,
  book,
  chapter,
  currentTranslation,
}: Props) {
  const [selected, setSelected] = useState(() => initialSelection(currentTranslation));
  const [chapters, setChapters] = useState<Record<string, Verse[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    setSelected((current) => {
      const valid = current.filter((code) =>
        PT_TRANSLATIONS.some((translation) => translation.code === code),
      );
      return valid.length >= 2 ? valid : initialSelection(currentTranslation);
    });
  }, [open, currentTranslation]);

  useEffect(() => {
    if (!open || selected.length < 2) return;
    let cancelled = false;
    setLoading(true);
    setError(false);

    Promise.all(
      selected.map(async (code) => [code, await fetchChapter(code, book, chapter)] as const),
    )
      .then((entries) => {
        if (!cancelled) setChapters(Object.fromEntries(entries));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, selected, book, chapter, reloadKey]);

  const verseNumbers = useMemo(
    () =>
      Array.from(
        new Set(
          selected.flatMap((code) => (chapters[code] ?? []).map((verse) => verse.verse)),
        ),
      ).sort((a, b) => a - b),
    [chapters, selected],
  );

  const toggleVersion = (code: string) => {
    setSelected((current) => {
      if (current.includes(code)) {
        return current.length > 2 ? current.filter((item) => item !== code) : current;
      }
      return current.length < 3 ? [...current, code] : current;
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[92vh] overflow-y-auto rounded-t-[30px] border-t border-primary/20 bg-background p-0 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="mx-auto w-full max-w-2xl px-5 pb-8 pt-4">
          <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-muted-foreground/30" />
          <header className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <GitCompareArrows className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">
                Estudo comparativo
              </p>
              <h2 className="mt-1 text-xl font-extrabold">Comparar versões</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {bookNameById(book)} {chapter} · escolha de 2 a 3 traduções para ler o mesmo
                versículo em paralelo.
              </p>
            </div>
          </header>

          <div className="mt-5">
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
              Versões selecionadas
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {PT_TRANSLATIONS.map((translation) => {
                const active = selected.includes(translation.code);
                const locked = active && selected.length === 2;
                return (
                  <button
                    key={translation.code}
                    type="button"
                    aria-pressed={active}
                    disabled={locked}
                    onClick={() => toggleVersion(translation.code)}
                    className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all active:scale-[0.98] ${
                      active
                        ? "border-primary bg-primary/10 text-foreground shadow-sm shadow-primary/10"
                        : "border-border bg-surface text-muted-foreground hover:border-primary/40"
                    } disabled:cursor-not-allowed disabled:opacity-80`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[10px] font-extrabold ${
                        active ? "bg-primary text-primary-foreground" : "bg-surface-2"
                      }`}
                    >
                      {active ? <Check className="h-4 w-4" /> : translation.label}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-extrabold">{translation.label}</span>
                      <span className="block truncate text-[10px] text-muted-foreground">
                        {translation.full}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">
              Você pode comparar até três versões. Mantenha pelo menos duas selecionadas.
            </p>
          </div>

          {loading && (
            <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface/60 p-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Carregando versões…
            </div>
          )}

          {error && !loading && (
            <div className="mt-6 rounded-2xl border border-destructive/25 bg-destructive/5 p-5 text-center">
              <p className="text-sm font-bold">Não foi possível carregar a comparação</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Verifique sua conexão e tente novamente.
              </p>
              <button
                type="button"
                onClick={() => setReloadKey((value) => value + 1)}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Tentar novamente
              </button>
            </div>
          )}

          {!loading && !error && verseNumbers.length > 0 && (
            <div className="mt-6 space-y-3">
              {verseNumbers.map((number) => (
                <div key={number} className="rounded-2xl border border-border bg-surface/50 p-3.5">
                  <span className="mb-3 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-extrabold text-primary">
                    Versículo {number}
                  </span>
                  <div className="space-y-3">
                    {selected.map((code) => {
                      const translation = translationByCode(code);
                      const verse = chapters[code]?.find((item) => item.verse === number);
                      return (
                        <div key={code} className="rounded-xl border border-border/70 bg-background/45 p-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-extrabold">{translation.label}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {translation.full}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-7 text-foreground/90">
                            {verse?.text ?? "Este versículo não está disponível nesta versão."}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && verseNumbers.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Nenhum texto disponível para comparar neste capítulo.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
