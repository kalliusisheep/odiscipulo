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
 * que consulta a Giphy) e devolve o GIF escolhido pelo `onSelect`.
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
  const requestRef = useRef(0);

  const search = async (term: string) => {
    const requestId = ++requestRef.current;
    setLoading(true);
    setErrored(false);
    try {
      const { data, error } = await supabase.functions.invoke<GifSearchResponse>("gif-search", {
        body: { q: term },
      });
      if (error || !data || data.error) throw error ?? new Error(data?.error ?? "Falha ao buscar GIFs");
      if (requestId === requestRef.current) setGifs(data.gifs ?? []);
    } catch (e) {
      if (requestId !== requestRef.current) return;
      console.error("GifPicker: falha ao buscar GIFs:", e);
      setErrored(true);
      setGifs([]);
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void search(query), query ? 350 : 0);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/65 p-3 backdrop-blur-sm animate-fade-in sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Buscar GIF"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-[24px] border border-primary/25 bg-popover p-3 shadow-2xl shadow-black/40 animate-slide-up sm:animate-fade-in">
            <div className="flex items-center justify-between gap-3 px-1 pb-2">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">Adicionar reação</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Escolha um GIF para o comentário</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fechar busca de GIF" className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border bg-input px-3 py-1.5">
            <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar GIF na web…"
              className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="mt-3 grid max-h-[min(56vh,26rem)] grid-cols-3 gap-2 overflow-y-auto rounded-2xl bg-background/35 p-1.5">
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
          {/* Exigido pelos termos de uso da Giphy: atribuição visível onde a busca aparece. */}
            <p className="mt-2 text-center text-[9px] text-muted-foreground">Powered by GIPHY</p>
          </div>
        </div>
      )}
    </div>
  );
}
