import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Swords, ChevronDown, Check, X } from "lucide-react";
import { cancelChallenge, createChallenge, listPeerChallenges, type Challenge } from "@/lib/challenges";

type ModuleRow = { id: string; ord: number; title: string };
type TrailRow = { id: string; module_id: string; ord: number; title: string; lesson_id: string | null };
type Selection = { scopeType: "module" | "trail"; scopeId: string } | null;

export function ChallengeButton({ targetId, targetName }: { targetId: string; targetName: string }) {
  const [open, setOpen] = useState(false);
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [trails, setTrails] = useState<TrailRow[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selection, setSelection] = useState<Selection>(null);
  const [sending, setSending] = useState(false);
  const [existing, setExisting] = useState<Challenge[]>([]);

  const refreshChallenges = async () => {
    const { data: u } = await supabase.auth.getUser();
    if (u.user) setExisting(await listPeerChallenges(u.user.id, targetId));
  };

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      await refreshChallenges();
      channel = supabase
        .channel(`challenge-button-${u.user.id}-${targetId}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "challenges" }, () => void refreshChallenges())
        .subscribe();
    })();
    return () => {
      if (channel) void supabase.removeChannel(channel);
    };
  }, [targetId]);

  useEffect(() => {
    if (!open) return;
    void (async () => {
      const [{ data: mods }, { data: trs }] = await Promise.all([
        supabase.from("disciple_modules").select("id, ord, title").order("ord"),
        supabase.from("disciple_trails").select("id, module_id, ord, title, lesson_id").order("ord"),
      ]);
      setModules((mods ?? []) as ModuleRow[]);
      setTrails((trs ?? []) as TrailRow[]);
      await refreshChallenges();
    })();
  }, [open]);

  const send = async () => {
    if (!selection) return;
    setSending(true);
    try {
      await createChallenge({ targetId, scopeType: selection.scopeType, scopeId: selection.scopeId });
      toast.success(`Desafio enviado a ${targetName}!`);
      setOpen(false);
      setSelection(null);
      await refreshChallenges();
    } catch (e) {
      toast.error("Não foi possível enviar. Tente novamente.");
    } finally {
      setSending(false);
    }
  };

  const cancel = async (challenge: Challenge) => {
    setSending(true);
    try {
      await cancelChallenge(challenge.id);
      toast.success("Convite de desafio cancelado.");
      await refreshChallenges();
    } catch {
      toast.error("Não foi possível cancelar o desafio. Tente novamente.");
    } finally {
      setSending(false);
    }
  };

  const pendingSent = existing.find((challenge) => challenge.status === "pending" && challenge.challenger_id !== targetId);

  const trailsByModule = new Map<string, TrailRow[]>();
  for (const t of trails) {
    const arr = trailsByModule.get(t.module_id) ?? [];
    arr.push(t);
    trailsByModule.set(t.module_id, arr);
  }

  const isSel = (type: "module" | "trail", id: string) =>
    selection?.scopeType === type && selection.scopeId === id;

  return (
    <>
      <div className="flex justify-center">
        <button
          onClick={() => (pendingSent ? void cancel(pendingSent) : setOpen(true))}
          disabled={sending}
          className="challenge-fire-btn inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pendingSent ? <X className="h-4 w-4" /> : <Swords className="h-4 w-4" />}
          {pendingSent ? "Cancelar desafio" : "Desafiar"}
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Swords className="h-5 w-5 text-red-500" /> Desafiar {targetName}
            </DialogTitle>
            <DialogDescription>
              Escolha um módulo inteiro OU uma trilha específica. Quem terminar primeiro leva o bônus.
            </DialogDescription>
          </DialogHeader>

          {existing.length > 0 && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-300">
              Já existe {existing.length === 1 ? "um desafio ativo" : `${existing.length} desafios ativos`} entre vocês.
            </div>
          )}

          <div className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
            {modules.map((m) => {
              const mtrails = trailsByModule.get(m.id) ?? [];
              const isOpen = expanded === m.id;
              return (
                <div key={m.id} className="rounded-2xl border border-border bg-surface-2">
                  <div className="flex items-center gap-2 p-3">
                    <button
                      onClick={() =>
                        setSelection(isSel("module", m.id) ? null : { scopeType: "module", scopeId: m.id })
                      }
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                        isSel("module", m.id)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background"
                      }`}
                      aria-label={`Selecionar módulo ${m.title}`}
                    >
                      {isSel("module", m.id) && <Check className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => setExpanded(isOpen ? null : m.id)}
                      className="flex flex-1 items-center justify-between gap-2 text-left"
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Módulo {m.ord}
                        </p>
                        <p className="truncate text-sm font-semibold">{m.title}</p>
                      </div>
                      <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                  {isOpen && mtrails.length > 0 && (
                    <ul className="space-y-1 border-t border-border p-2">
                      {mtrails.map((t) => (
                        <li key={t.id}>
                          <button
                            onClick={() =>
                              setSelection(isSel("trail", t.id) ? null : { scopeType: "trail", scopeId: t.id })
                            }
                            className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                              isSel("trail", t.id) ? "bg-primary/15 text-primary" : "hover:bg-surface"
                            }`}
                          >
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 ${
                                isSel("trail", t.id) ? "border-primary bg-primary" : "border-border"
                              }`}
                            >
                              {isSel("trail", t.id) && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                            </span>
                            <span className="truncate">
                              {t.ord}. {t.title}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => void send()}
            disabled={!selection || sending}
            className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 text-sm font-bold uppercase tracking-wider text-white shadow disabled:opacity-50"
          >
            <Swords className="h-4 w-4" /> {sending ? "Enviando…" : "Enviar desafio"}
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
