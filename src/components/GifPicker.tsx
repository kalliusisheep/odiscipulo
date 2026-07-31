import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Gif = {
  id: string;
  previewUrl: string;
  url: string;
  description: string;
};

type GifSearchResponse = {
  gifs?: Gif[];
  error?: string;
};

/**
 * Botão de GIF que abre um painel de busca (via Edge Function "gif-search",
 * que consulta o Tenor) e devolve o GIF escolhido pelo `onSelect`.
 * Usado no campo de comentário do feed.
 */
export function GifPicker({ onSelect, className }: { onSelect: (gifUrl: string) => void; className?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = async (term: string) => {
    setLoading(true);
    setErrored(false);
    try {
      const { data, error } = await supabase.functions.invoke<GifSearchResponse>("gif-search", {
        body: { q: term },
      });
      if (error || !data || data.error) throw error ?? new Error(data?.error ?? "Falha ao buscar GIFs");
      setGifs(data.gifs ?? []);
    } catch (e) {
      console.error("GifPicker: falha ao buscar GIFs:", e);
      setErrored(true);
      setGifs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    void search("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void search(query), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Adicionar GIF"
        title="Adicionar GIF"
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
          open
            ? "border-primary bg-primary/15 text-primary"
            : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-primary"
        }`}
      >
        <ImagePlus className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute bottom-10 left-0 z-20 w-72 rounded-2xl border border-border bg-popover p-2.5 shadow-xl animate-slide-up">
          <div className="flex items-center gap-2 rounded-full border border-border bg-input px-3 py-1.5">
            <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar GIF na web…"
              className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar busca de GIF"
              className="shrink-0 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-2 grid max-h-64 grid-cols-3 gap-1.5 overflow-y-auto">
            {loading && (
              <div className="col-span-3 flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            )}
            {!loading && errored && (
              <p className="col-span-3 py-6 text-center text-[11px] text-muted-foreground">
                Não foi possível buscar GIFs agora.
              </p>
            )}
            {!loading && !errored && gifs.length === 0 && (
              <p className="col-span-3 py-6 text-center text-[11px] text-muted-foreground">Nenhum GIF encontrado.</p>
            )}
            {!loading &&
              gifs.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    onSelect(g.url);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="aspect-square overflow-hidden rounded-lg bg-surface-2 transition-transform hover:scale-[1.04]"
                  title={g.description}
                >
                  <img src={g.previewUrl} alt={g.description} className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
