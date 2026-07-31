import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Building2, Check, Loader2, Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createAndLinkChurch, linkProfileToChurch, normalizeChurchName, searchChurches, type ChurchOption } from "@/lib/church";

type ChurchLinkDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
  currentChurchId: string | null;
  currentChurchName: string | null;
  onLinked: (church: ChurchOption | null) => void;
};

export function ChurchLinkDialog({
  open,
  onOpenChange,
  userId,
  currentChurchId,
  currentChurchName,
  onLinked,
}: ChurchLinkDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ChurchOption[]>([]);
  const [searching, setSearching] = useState(false);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Reabre sempre com o nome atual (se houver) pré-preenchido, e limpa
  // resultados antigos da última vez que o modal foi usado.
  useEffect(() => {
    if (open) {
      setQuery(currentChurchName ?? "");
      setResults([]);
      setSavingKey(null);
    }
  }, [open, currentChurchName]);

  useEffect(() => {
    const norm = normalizeChurchName(query);
    if (!open || norm.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timeout = setTimeout(async () => {
      const found = await searchChurches(query);
      setResults(found);
      setSearching(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, open]);

  const norm = normalizeChurchName(query);
  const exactMatch = results.find((r) => normalizeChurchName(r.name) === norm);

  const applyLink = async (church: ChurchOption | null) => {
    if (!userId) return;
    const key = church ? `existing:${church.id}` : "unlink";
    setSavingKey(key);
    const ok = await linkProfileToChurch(userId, church);
    setSavingKey(null);
    if (!ok) {
      toast.error("Não foi possível atualizar sua igreja.");
      return;
    }
    toast.success(church ? `Vinculado a ${church.name}!` : "Desvinculado da igreja.");
    onLinked(church);
    onOpenChange(false);
  };

  const createAndLink = async () => {
    setSavingKey("new");
    const church = await createAndLinkChurch(query);
    if (!church) {
      setSavingKey(null);
      toast.error("Não foi possível cadastrar essa igreja.");
      return;
    }
    await applyLink(church);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vincular igreja</DialogTitle>
          <DialogDescription>
            Busque o nome da sua igreja. Irmãos vinculados à mesma igreja aparecem como sugestão na
            tela de novo contato.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nome da igreja…"
            className="w-full rounded-full border border-border bg-input py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="max-h-64 space-y-1.5 overflow-y-auto">
          {searching && (
            <p className="flex items-center gap-2 py-1 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Buscando…
            </p>
          )}

          {!searching &&
            results.map((c) => {
              const key = `existing:${c.id}`;
              const isCurrent = c.id === currentChurchId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => void applyLink(c)}
                  disabled={savingKey !== null}
                  className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface-2 p-3 text-left transition-colors hover:border-primary/40 disabled:opacity-60"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{c.name}</span>
                  {savingKey === key ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
                  ) : isCurrent ? (
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                  ) : null}
                </button>
              );
            })}

          {!searching && norm.length >= 2 && !exactMatch && (
            <button
              type="button"
              onClick={() => void createAndLink()}
              disabled={savingKey !== null}
              className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-primary/40 p-3 text-left transition-colors hover:bg-primary/5 disabled:opacity-60"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {savingKey === "new" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </span>
              <span className="min-w-0 flex-1 text-sm">
                Cadastrar <span className="font-semibold">"{query.trim()}"</span> como nova igreja
              </span>
            </button>
          )}
        </div>

        {currentChurchId && (
          <button
            type="button"
            onClick={() => void applyLink(null)}
            disabled={savingKey !== null}
            className="pt-1 text-center text-xs font-medium text-muted-foreground transition-colors hover:text-destructive disabled:opacity-60"
          >
            Desvincular da igreja atual
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
