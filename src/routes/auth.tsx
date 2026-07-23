import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useState } from "react";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

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

function Starfield() {
  const stars = Array.from({ length: 70 }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const x = (seed / 233280) * 100;
    const y = (((seed * 7) % 233280) / 233280) * 100;
    const size = ((i * 37) % 3) + 1;
    const opacity = 0.2 + ((i * 13) % 60) / 100;
    return { x, y, size, opacity, key: i };
  });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.15),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(59,130,246,0.12),_transparent_60%)]" />
      {stars.map((s) => (
        <span
          key={s.key}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            boxShadow: s.size > 2 ? "0 0 6px rgba(255,255,255,0.6)" : undefined,
          }}
        />
      ))}
    </div>
  );
}

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
      redirect_uri: window.location.origin + "/home",
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

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background font-sans text-foreground">
      <Starfield />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pt-6 pb-10">
        {/* Header */}
        <header className="flex items-center justify-center">
          <h1 className="text-lg font-extrabold tracking-tight text-white/95">
            Disciple
          </h1>
        </header>

        {/* Title */}
        <section className="mt-10 text-center">
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Discipulado cristão,
            <br />
            um passo por dia
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            Sua jornada de fé, gamificada e sustentada pela sua comunidade.
          </p>
        </section>

        {/* Mascote/logo + Card */}
        <section className="relative mt-24">
          <div className="absolute -inset-x-4 top-6 h-full rounded-[2rem] border border-white/5 bg-white/[0.02]" />
          <div className="absolute -inset-x-2 top-3 h-full rounded-[2rem] border border-white/10 bg-white/[0.03]" />

          {/* Mascote */}
<div className="absolute left-1/2 -top-16 z-20 -translate-x-1/2">
            <div className="relative h-36 w-36 overflow-hidden rounded-full shadow-[0_0_40px_rgba(168,85,247,0.5)]">
              <img
                src="/sheep-mascot.png"
                alt="Mascote ovelha com bíblia"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Card */}
          <div className="relative rounded-[2rem] bg-gradient-to-b from-purple-500/40 to-blue-500/40 p-[1.5px]">
            <div className="rounded-[calc(2rem-1.5px)] bg-[#0f0f1c]/85 px-6 pb-7 pt-24 backdrop-blur-xl shadow-[0_0_50px_-10px_rgba(139,92,246,0.35)]">
              {/* Tabs */}
              <div className="mx-auto flex w-full rounded-full bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all ${
                    mode === "signin"
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-[0_6px_20px_-6px_rgba(139,92,246,0.7)]"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all ${
                    mode === "signup"
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-[0_6px_20px_-6px_rgba(139,92,246,0.7)]"
                      : "text-slate-400 hover:text-slate-200"
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
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 py-3.5 text-sm font-extrabold text-white shadow-[0_10px_30px_-8px_rgba(139,92,246,0.7)] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
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
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-xs uppercase tracking-widest text-slate-500">ou</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              {/* Form */}
              <form onSubmit={submit} className="space-y-3">
                {mode === "signup" && (
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-full border border-purple-500/40 bg-white/[0.03] px-5 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-purple-400 focus:bg-white/[0.06] focus:ring-2 focus:ring-purple-500/30"
                  />
                )}
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full border border-purple-500/40 bg-white/[0.03] px-5 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-purple-400 focus:bg-white/[0.06] focus:ring-2 focus:ring-purple-500/30"
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  placeholder="Senha (mínimo 6 caracteres)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-full border border-purple-500/40 bg-white/[0.03] px-5 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-purple-400 focus:bg-white/[0.06] focus:ring-2 focus:ring-purple-500/30"
                />

                {error && <p className="text-xs text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 py-3.5 text-sm font-extrabold text-white shadow-[0_10px_30px_-8px_rgba(139,92,246,0.7)] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
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
              </form>
            </div>
          </div>
        </section>

        
      </div>
    </main>
  );
}
