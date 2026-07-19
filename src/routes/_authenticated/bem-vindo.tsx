import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/bem-vindo")({
  component: BemVindoPage,
});

function BemVindoPage() {
  const nav = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        void nav({ to: "/auth" });
        return;
      }
      const { data: p } = await supabase
        .from("profiles")
        .select("onboarded, first_name, last_name, display_name")
        .eq("id", u.user.id)
        .maybeSingle();
      if (p?.onboarded) {
        void nav({ to: "/home" });
        return;
      }
      // Pre-fill from Google metadata if available
      const meta = u.user.user_metadata as Record<string, unknown> | undefined;
      const fullName = (meta?.full_name as string) ?? (meta?.name as string) ?? "";
      if (fullName) {
        const parts = fullName.trim().split(/\s+/);
        setFirstName(parts[0] ?? "");
        setLastName(parts.slice(1).join(" "));
      }
      setChecking(false);
    })();
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const first = firstName.trim();
    if (!first) {
      setError("Digite seu nome para continuar.");
      return;
    }
    setError(null);
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) {
      void nav({ to: "/auth" });
      return;
    }
    const last = lastName.trim();
    const display = last ? `${first} ${last}` : first;
    const { error: upErr } = await supabase
      .from("profiles")
      .update({
        first_name: first,
        last_name: last || null,
        display_name: display,
        onboarded: true,
      })
      .eq("id", u.user.id);
    setSaving(false);
    if (upErr) {
      setError(upErr.message);
      return;
    }
    await nav({ to: "/home" });
  };

  if (checking) {
    return <main className="flex min-h-screen items-center justify-center bg-background" />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-xl shadow-primary/30">
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">A paz do Senhor!</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Como devemos te chamar na sua jornada?
          </p>
        </div>

        <form onSubmit={submit} className="card-elevated space-y-3 p-6">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Nome <span className="text-destructive">*</span>
            </span>
            <input
              autoFocus
              type="text"
              required
              maxLength={40}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ex.: Pedro"
              className="w-full rounded-xl border border-border bg-input px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sobrenome <span className="text-muted-foreground/60">(opcional)</span>
            </span>
            <input
              type="text"
              maxLength={60}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Ex.: Silva"
              className="w-full rounded-xl border border-border bg-input px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary-glow disabled:opacity-50"
          >
            {saving ? "Salvando…" : "Começar jornada"}
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-[11px] text-muted-foreground">
            Você poderá alterar depois no seu Perfil.
          </p>
        </form>
      </div>
    </main>
  );
}
