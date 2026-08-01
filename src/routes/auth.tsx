import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — O Discípulo" },
      { name: "description", content: "Entre em O Discípulo e comece sua jornada de discipulado cristão gamificado." },
    ],
  }),
  ssr: false,
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();

  // Handles the case where we just landed back here after a full-page
  // OAuth redirect (e.g. Google). The session may already be set, or the
  // auth client may still be finishing the exchange — watch both so we
  // never get stuck showing the login form (or a blank screen) forever.
  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (active && data.user) {
        void navigate({ to: "/bem-vindo" });
        return;
      }
      if (active) setCheckingSession(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active && session?.user) {
        void navigate({ to: "/bem-vindo" });
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/home",
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        await navigate({ to: "/bem-vindo" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await navigate({ to: "/bem-vindo" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/auth",
    });
    if (result.error) {
      setError(result.error instanceof Error ? result.error.message : "Erro ao entrar com Google");
      setGoogleLoading(false);
      return;
    }
    if (result.redirected) return;
    await navigate({ to: "/bem-vindo" });
    setGoogleLoading(false);
  };

  // Shared background: the split image (white panel + desert/cross scene with the
  // mascot). Drop the asset at public/login-bg.jpg — see chat for details.
  // IMPORTANT: this lives INSIDE the same max-w-md box as the text column below,
  // so the image and the form always scale together — the white/art split can't
  // drift out of sync on wide viewports (e.g. the Lovable desktop preview).
  const Background = () => (
    <img
      src="/login-bg.jpg"
      alt=""
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover object-left"
    />
  );

  if (checkingSession) {
    return (
      <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 font-sans text-foreground">
        <div className="relative flex min-h-screen w-full max-w-md items-center justify-center overflow-hidden">
          <Background />
          <div className="relative z-10 flex flex-col items-center gap-3 rounded-2xl bg-white/90 px-6 py-5 shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-teal-700" />
            <p className="text-sm text-slate-500">Entrando...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 font-sans text-foreground">
      {/* The "phone" box: background art + content column scale together in here. */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-md overflow-hidden sm:min-h-[100dvh]">
        <Background />

        {/* Everything below lives inside the white half of the artwork only. */}
        <div className="relative z-10 flex w-[58%] min-w-[210px] flex-col justify-center px-5 py-8 sm:w-[56%]">
          {/* Brand */}
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-teal-800/30 text-teal-800">
              <ArrowRight className="hidden" />
              <span className="text-lg font-black">D</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-800">O Discípulo</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
            {mode === "signin" ? "Bem-vindo de volta" : "Comece sua jornada"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            {mode === "signin"
              ? "Entre para continuar sua trilha de discipulado."
              : "Crie sua conta e dê o primeiro passo hoje."}
          </p>

          {/* Tabs */}
          <div className="mt-6 flex w-full rounded-full bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 rounded-full py-2 text-sm font-bold transition-all ${
                mode === "signin"
                  ? "bg-teal-800 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-full py-2 text-sm font-bold transition-all ${
                mode === "signup"
                  ? "bg-teal-800 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Criar conta
            </button>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {googleLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              </svg>
            )}
            Continuar com Google
          </button>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs uppercase tracking-widest text-slate-400">ou</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Seu nome</label>
                <input
                  type="text"
                  placeholder="Como podemos te chamar?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
                />
              </div>
            )}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Endereço de e-mail</label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Senha</label>
              <input
                type="password"
                required
                minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-800 py-3.5 text-sm font-extrabold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {mode === "signin" ? "Entrar" : "Começar jornada"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            {mode === "signin" && (
              <button
                type="button"
                onClick={() => {
                  /* wire up your existing password-reset flow here if you have one */
                }}
                className="w-full text-center text-xs font-semibold text-teal-800 underline-offset-2 hover:underline"
              >
                Esqueceu a senha?
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
    </main>
  );
}
