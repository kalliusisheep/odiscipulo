import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { bookNameById } from "@/data/bible-books";
import { highlightClass, listAllMarks } from "@/lib/bible-user-data";
import { ArrowLeft, BookMarked, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/biblia/marcados")({
  head: () => ({
    meta: [
      { title: "Meus marcadores bíblicos — Disciple" },
      { name: "description", content: "Seus destaques, anotações, favoritos e marcadores da Bíblia de Estudos." },
      { property: "og:title", content: "Meus marcadores bíblicos — Disciple" },
      { property: "og:description", content: "Destaques, anotações, favoritos e marcadores reunidos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Marcados,
});

const TABS = ["Destaques", "Anotações", "Favoritos", "Marcadores"] as const;

function Marcados() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Destaques");
  const [data, setData] = useState<Awaited<ReturnType<typeof listAllMarks>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadMarks = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setData(await listAllMarks());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMarks();
  }, [loadMarks]);

  const item = (book: number, chapter: number, verse: number, extra?: string, color?: string) => (
    <Link
      key={`${book}-${chapter}-${verse}-${extra ?? ""}`}
      to="/biblia/$book/$chapter"
      params={{ book: String(book), chapter: String(chapter) }}
      className={`bible-mark-card block rounded-2xl border border-border/70 p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/35 ${color ? highlightClass(color) : "bg-surface/70"}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
        {bookNameById(book)} {chapter}:{verse}
      </p>
      {extra && <p className="mt-1 text-sm text-foreground/85">{extra}</p>}
    </Link>
  );

  return (
    <div className="bible-secondary-page mx-auto max-w-lg px-4 pb-28 pt-4 animate-slide-up">
      <div className="border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
        <Link to="/biblia" aria-label="Voltar" className="rounded-full p-2 text-muted-foreground hover:bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary">Sua biblioteca</p><h1 className="text-xl font-extrabold">Meus marcadores</h1></div>
        </div>
        <p className="mt-2 pl-10 text-xs text-muted-foreground">Tudo o que você separou para voltar depois.</p>
      </div>

      <div className="bible-library-tabs mt-4 flex gap-2 overflow-x-auto rounded-2xl border border-border/70 bg-surface/45 p-1.5 pb-1">
        {TABS.map((t) => {
          const count =
            t === "Destaques"
              ? data?.highlights.length ?? 0
              : t === "Anotações"
                ? data?.notes.length ?? 0
                : t === "Favoritos"
                  ? data?.favorites.length ?? 0
                  : data?.bookmarks.length ?? 0;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={`flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                tab === t
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-surface text-muted-foreground"
              }`}
            >
              {t}
              <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold ${
                tab === t ? "bg-primary/15 text-primary" : "bg-surface-2 text-muted-foreground"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="mt-16 flex flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Carregando sua biblioteca…</p>
        </div>
      )}

      {error && !loading && (
        <div className="mt-8 rounded-[1.5rem] border border-destructive/20 bg-destructive/5 p-6 text-center">
          <p className="text-sm font-extrabold">Não foi possível carregar seus marcadores</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Tente novamente para sincronizar destaques, anotações e favoritos.</p>
          <button type="button" onClick={() => void loadMarks()} className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground">Tentar novamente</button>
        </div>
      )}

      {data && !loading && !error && (
        <div className="mt-4 space-y-2.5">
          {tab === "Destaques" &&
            (data.highlights.length
              ? data.highlights.map((h) => item(h.book, h.chapter, h.verse, undefined, h.color))
              : <Empty tab={tab} />)}
          {tab === "Anotações" &&
            (data.notes.length ? data.notes.map((n) => item(n.book, n.chapter, n.verse, n.content)) : <Empty tab={tab} />)}
          {tab === "Favoritos" &&
            (data.favorites.length ? data.favorites.map((f) => item(f.book, f.chapter, f.verse)) : <Empty tab={tab} />)}
          {tab === "Marcadores" &&
            (data.bookmarks.length
              ? data.bookmarks.map((b) => item(b.book, b.chapter, b.verse, b.label ?? undefined))
              : <Empty tab={tab} />)}
        </div>
      )}
    </div>
  );
}

function Empty({ tab }: { tab: (typeof TABS)[number] }) {
  const copy: Record<(typeof TABS)[number], [string, string]> = {
    Destaques: ["Nenhum destaque ainda", "Toque em um versículo e use Destacar para guardá-lo aqui."],
    Anotações: ["Nenhuma anotação ainda", "Suas reflexões salvas aparecerão nesta seção."],
    Favoritos: ["Nenhum favorito ainda", "Marque versículos importantes para encontrá-los rapidamente."],
    Marcadores: ["Nenhum marcador ainda", "Crie um marcador ao estudar um capítulo da Bíblia."],
  };
  const [title, description] = copy[tab];

  return (
    <div className="mt-8 rounded-[1.5rem] border border-dashed border-border bg-surface/60 p-6 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <BookMarked className="h-5 w-5" />
      </span>
      <p className="mt-3 text-sm font-extrabold">{title}</p>
      <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
