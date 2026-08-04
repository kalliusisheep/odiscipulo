import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, NotebookPen, Plus, Search } from "lucide-react";
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
    <div className="mx-auto max-w-lg space-y-5 px-4 pb-24 pt-6">
      <button
        type="button"
        onClick={() => void nav({ to: "/perfil" })}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Perfil
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Minhas Notas</h1>
        <button
          type="button"
          onClick={() => void handleCreate()}
          disabled={creating}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:bg-primary-glow active:scale-95 disabled:opacity-60"
          aria-label="Criar anotação"
        >
          {creating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
        </button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título ou conteúdo…"
          className="w-full rounded-2xl border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/50"
        />
      </div>

      {loading ? (
        <div className="flex justify-center pt-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-elevated flex flex-col items-center gap-2 px-6 py-12 text-center">
          <NotebookPen className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm font-medium text-foreground">
            {query ? "Nenhuma nota encontrada." : "Você ainda não tem nenhuma anotação."}
          </p>
          {!query && (
            <p className="text-xs text-muted-foreground">Toque no + para criar a primeira.</p>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((note) => (
            <button
              key={note.id}
              type="button"
              onClick={() => void nav({ to: "/notas/$id", params: { id: note.id } })}
              className="card-elevated block w-full p-4 text-left transition-colors hover:border-primary/40"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="truncate text-sm font-semibold text-foreground">
                  {note.title || "Sem título"}
                </h2>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {new Date(note.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {plainTextFromDoc(note.content) || "Anotação em branco"}
              </p>
              {note.source_content_title && (
                <span className="mt-2 inline-block rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-medium text-accent-foreground">
                  De: {note.source_content_title}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
