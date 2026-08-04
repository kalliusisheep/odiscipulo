import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { bookNameById } from "@/data/bible-books";
import { highlightClass, listAllMarks } from "@/lib/bible-user-data";
import { ArrowLeft, Loader2 } from "lucide-react";

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

  useEffect(() => {
    void listAllMarks().then(setData);
  }, []);

  const item = (book: number, chapter: number, verse: number, extra?: string, color?: string) => (
    <Link
      key={`${book}-${chapter}-${verse}-${extra ?? ""}`}
      to="/biblia/$book/$chapter"
      params={{ book: String(book), chapter: String(chapter) }}
      className={`block rounded-2xl border border-border p-3.5 ${color ? highlightClass(color) : "bg-surface"}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
        {bookNameById(book)} {chapter}:{verse}
      </p>
      {extra && <p className="mt-1 text-sm text-foreground/85">{extra}</p>}
    </Link>
  );

  return (
    <div className="mx-auto max-w-lg px-4 pt-4 pb-28 animate-slide-up">
      <div className="flex items-center gap-2">
        <Link to="/biblia" aria-label="Voltar" className="rounded-full p-2 text-muted-foreground hover:bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold">Meus marcadores</h1>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
              tab === t ? "border-primary bg-primary/15 text-primary" : "border-border bg-surface text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {!data && (
        <div className="mt-16 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {data && (
        <div className="mt-4 space-y-2">
          {tab === "Destaques" &&
            (data.highlights.length
              ? data.highlights.map((h) => item(h.book, h.chapter, h.verse, undefined, h.color))
              : <Empty />)}
          {tab === "Anotações" &&
            (data.notes.length ? data.notes.map((n) => item(n.book, n.chapter, n.verse, n.content)) : <Empty />)}
          {tab === "Favoritos" &&
            (data.favorites.length ? data.favorites.map((f) => item(f.book, f.chapter, f.verse)) : <Empty />)}
          {tab === "Marcadores" &&
            (data.bookmarks.length
              ? data.bookmarks.map((b) => item(b.book, b.chapter, b.verse, b.label ?? undefined))
              : <Empty />)}
        </div>
      )}
    </div>
  );
}

function Empty() {
  return <p className="mt-10 text-center text-sm text-muted-foreground">Nada por aqui ainda.</p>;
}
