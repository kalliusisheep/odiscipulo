import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, ArrowRight, AtSign, Check, X, Loader2 } from "lucide-react";
import {
  isUsernameAvailable,
  isValidUsername,
  normalizeUsername,
  suggestAvailableUsername,
} from "@/lib/username";

export const Route = createFileRoute("/_authenticated/bem-vindo")({
  component: BemVindoPage,
});

function BemVindoPage() {
  const nav = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameOk, setUsernameOk] = useState<boolean | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
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
      setUserId(u.user.id);
      const { data: p } = await supabase
        .from("profiles")
        .select("onboarded, first_name, last_name, display_name, username")
        .eq("id", u.user.id)
        .maybeSingle();
      if (p?.onboarded) {
        void nav({ to: "/home" });
        return;
      }
      const meta = u.user.user_metadata as Record<string, unknown> | undefined;
      const fullName = (meta?.full_name as string) ?? (meta?.name as string) ?? "";
      let first = p?.first_name ?? "";
      let last = p?.last_name ?? "";
      if (!first && fullName) {
        const parts = fullName.trim().split(/\s+/);
        first = parts[0] ?? "";
        last = parts.slice(1).join(" ");
      }
      setFirstName(first);
      setLastName(last);
      if (p?.username) {
        setUsername(p.username);
      } else if (first) {
        const suggested = await suggestAvailableUsername(first, last);
        setUsername(suggested);
      }
      setChecking(false);
    })();
  }, [nav]);

  // Debounced availability check
  useEffect(() => {
    if (!username) {
      setUsernameOk(null);
      setSuggestion(null);
      return;
    }
    if (!isValidUsername(username)) {
      setUsernameOk(false);
      setSuggestion(null);
      return;
    }
    setCheckingUsername(true);
    const t = setTimeout(async () => {
      const ok = await isUsernameAvailable(username, userId ?? undefined);
      setUsernameOk(ok);
      if (!ok && firstName) {
        setSuggestion(await suggestAvailableUsername(firstName, lastName));
      } else {
        setSuggestion(null);
      }
      setCheckingUsername(false);
    }, 350);
    return () => clearTimeout(t);
  }, [username, userId, firstName, lastName]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const first = firstName.trim();
    if (!first) {
      setError("Digite seu nome para continuar.");
      return;
    }
    const uname = username.trim().toLowerCase();
    if (!isValidUsername(uname)) {
      setError("ID inválido. Use letras, números, ponto ou underline (3-24 caracteres).");
      return;
    }
    setError(null);
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) {
      void nav({ to: "/auth" });
      return;
    }
    const available = await isUsernameAvailable(uname, u.user.id);
    if (!available) {
      setSaving(false);
      setUsernameOk(false);
      setError("Esse ID já está em uso. Escolha outro.");
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
        username: uname,
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
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
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
              onChange={(e) => {
                const v = e.target.value;
                setFirstName(v);
                if (!username && v) {
                  void suggestAvailableUsername(v, lastName).then(setUsername);
                }
              }}
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

          <div className="block">
            <span className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>ID de usuário <span className="text-destructive">*</span></span>
              <span className="normal-case text-[10px] text-muted-foreground/70">Letras, números, . ou _</span>
            </span>
            <div className="relative">
              <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                required
                maxLength={24}
                value={username}
                onChange={(e) => setUsername(normalizeUsername(e.target.value))}
                placeholder="pedro.silva123"
                className="w-full rounded-xl border border-border bg-input pl-9 pr-10 py-2.5 text-sm outline-none focus:border-primary"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checkingUsername ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : usernameOk === true ? (
                  <Check className="h-4 w-4 text-success" />
                ) : usernameOk === false ? (
                  <X className="h-4 w-4 text-destructive" />
                ) : null}
              </div>
            </div>
            {usernameOk === false && suggestion && (
              <p className="mt-1 text-[11px] text-muted-foreground">
                Já em uso.{" "}
                <button
                  type="button"
                  onClick={() => setUsername(suggestion)}
                  className="font-semibold text-primary underline underline-offset-2"
                >
                  Usar @{suggestion}
                </button>
              </p>
            )}
            {usernameOk === false && !suggestion && (
              <p className="mt-1 text-[11px] text-destructive">
                ID inválido. Use 3–24 caracteres (letras, números, . ou _).
              </p>
            )}
            {usernameOk === true && (
              <p className="mt-1 text-[11px] text-success">Disponível ✓</p>
            )}
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={saving || usernameOk === false || checkingUsername}
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
