import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, ChevronRight, FileText, Loader2, NotebookPen, Plus, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { createBlankNote, listNotes, plainTextFromDoc, type NoteListItem } from "@/lib/notes";

export const Route = createFileRoute("/_authenticated/notas/")({
  component: NotasIndexPage,
});

function NotasIndexPage() {
  const nav = useNavigate();
  const [notes, setNotes] = useState<NoteListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setNotes(await listNotes());
      } catch (err) {
        console.error(err);
        toast.error("Não foi possível carregar suas anotações.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleCreate() {
    if (creating) return;
    setCreating(true);
    try {
      const note = await createBlankNote();
      await nav({ to: "/notas/$id", params: { id: note.id } });
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível criar a anotação agora.");
    } finally {
      setCreating(false);
    }
  }

  const filtered = notes.filter((n) => {
    if (!query.trim()) return true;
    const haystack = `${n.title} ${plainTextFromDoc(n.content)}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 pb-28 pt-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => void nav({ to: "/perfil" })}
            className="inline-flex items-center gap-1.5 rounded-full px-1 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Perfil
          </button>
          <span className="rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
            Seu espaço
          </span>
        </div>

        <header className="mt-7">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Anotações pessoais</p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Minhas notas</h1>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Guarde insights, orações e aprendizados da sua caminhada.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleCreate()}
              disabled={creating}
              className="flex h-12 shrink-0 items-center gap-2 rounded-2xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary-glow active:scale-95 disabled:opacity-60"
            >
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              <span className="hidden min-[390px]:inline">Nova nota</span>
            </button>
          </div>
        </header>

        <div className="mt-6 rounded-2xl border border-border bg-surface/80 p-1.5 shadow-sm">
          <div className="flex items-center gap-2 px-2.5">
            <Search className="h-4 w-4 shrink-0 text-primary" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar nas suas notas…"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Limpar busca"
                className="rounded-full px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between px-1">
          <div>
            <p className="text-sm font-bold text-foreground">{query ? "Resultados" : "Todas as notas"}</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "anotação" : "anotações"}
            </p>
          </div>
          <CalendarDays className="h-4 w-4 text-muted-foreground/60" />
        </div>

        {loading ? (
          <div className="flex justify-center pt-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-dashed border-border bg-surface/50 px-6 py-14 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              {query ? <Search className="h-6 w-6" /> : <NotebookPen className="h-6 w-6" />}
            </span>
            <p className="mt-4 text-sm font-bold text-foreground">
              {query ? "Nenhuma nota encontrada" : "Sua primeira nota começa aqui"}
            </p>
            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-relaxed text-muted-foreground">
              {query ? "Tente buscar por outra palavra ou título." : "Registre uma ideia, uma oração ou algo que Deus falou ao seu coração."}
            </p>
            {!query && (
              <button
                type="button"
                onClick={() => void handleCreate()}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground"
              >
                <Plus className="h-4 w-4" /> Criar primeira nota
              </button>
            )}
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {filtered.map((note) => (
              <button
                key={note.id}
                type="button"
                onClick={() => void nav({ to: "/notas/$id", params: { id: note.id } })}
                className="group w-full rounded-3xl border border-border bg-surface/75 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:bg-surface active:scale-[0.99]"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/10">
                    {note.source_content_title ? <Sparkles className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-3">
                      <span className="truncate text-sm font-bold text-foreground">{note.title || "Sem título"}</span>
                      <span className="shrink-0 text-[10px] font-medium text-muted-foreground">
                        {new Date(note.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "")}
                      </span>
                    </span>
                    <span className="mt-1.5 block line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {plainTextFromDoc(note.content) || "Anotação em branco — toque para começar a escrever."}
                    </span>
                    <span className="mt-3 flex items-center justify-between gap-2">
                      {note.source_content_title ? (
                        <span className="inline-flex min-w-0 items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-accent-foreground">
                          <Sparkles className="h-3 w-3 shrink-0" />
                          <span className="truncate">De: {note.source_content_title}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-muted-foreground/70">Nota pessoal</span>
                      )}
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
