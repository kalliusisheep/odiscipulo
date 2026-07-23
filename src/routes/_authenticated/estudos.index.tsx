import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Bird, Fish, Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import sheepMascot from "@/assets/sheep-mascot.png";


export const Route = createFileRoute("/_authenticated/estudos/")({
  head: () => ({
    meta: [
      { title: "O Discípulo — Entrar" },
      {
        name: "description",
        content:
          "Discipulado que forma hábito. Trilhas curtas, quizzes, diário e Mentor IA para crescer na fé um dia por vez.",
      },
      { property: "og:title", content: "O Discípulo — Entrar" },
      {
        property: "og:description",
        content:
          "Discipulado que forma hábito. Trilhas, quizzes, diário e Mentor IA sustentados pela sua igreja local.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function Starfield() {
  // deterministic tiny stars
  const stars = Array.from({ length: 70 }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const x = (seed / 233280) * 100;
    const y = ((seed * 7) % 233280) / 233280 * 100;
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

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error.message ?? "Falha ao entrar com o Google");
        setGoogleLoading(false);
        return;
      }
      if (result.redirected) return; // browser navigating away
      toast.success("Bem-vindo!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha e-mail e senha");
      return;
    }
    if (password.length < 6) {
      toast.error("A senha precisa ter pelo menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      if (tab === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu e-mail para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao autenticar";
      toast.error(
        msg.includes("Invalid login credentials")
          ? "E-mail ou senha inválidos"
          : msg.includes("already registered")
            ? "Este e-mail já está cadastrado"
            : msg,
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Você saiu da conta");
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background font-sans text-foreground">
      <Starfield />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pt-6 pb-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <button
            aria-label="Espírito Santo"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur"
          >
            <Bird className="h-5 w-5 text-white/90" strokeWidth={1.5} />
          </button>
          <h1 className="text-lg font-extrabold tracking-tight text-white/95">
            O Discípulo
          </h1>
          <button
            aria-label="Ichthys"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur"
          >
            <Fish className="h-5 w-5 text-white/90" strokeWidth={1.5} />
          </button>
        </header>

        {/* Title */}
        <section className="mt-10 text-center">
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Discipulado que
            <br />
            forma hábito
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            Trilhas curtas, quizzes, diário pessoal e um Mentor IA — para você
            crescer na fé um dia por vez, sustentado pela sua igreja e liderança
            local.
          </p>
        </section>

        {/* Mascot + Card */}
        <section className="relative mt-24">
          {/* Stacked layers behind card */}
          <div className="absolute -inset-x-4 top-6 h-full rounded-[2rem] border border-white/5 bg-white/[0.02]" />
          <div className="absolute -inset-x-2 top-3 h-full rounded-[2rem] border border-white/10 bg-white/[0.03]" />

          {/* Mascot */}
          <div className="absolute left-1/2 -top-22 z-20 -translate-x-1/2">
            <div className="relative h-44 w-44 overflow-hidden rounded-full">
              <img
                src={sheepMascot}
                alt="Mascote ovelha com bíblia"
                width={512}
                height={512}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Card */}
          <div
            className="relative rounded-[2rem] p-[1.5px]"
            style={{ background: "var(--gradient-border)" }}
          >
            <div
              className="rounded-[calc(2rem-1.5px)] bg-[#0f0f1c]/85 px-6 pb-7 pt-[4.5rem] backdrop-blur-xl"
              style={{ boxShadow: "var(--shadow-glow)" }}
            >
              {session ? (
                <div className="space-y-4 text-center">
                  <p className="text-sm text-slate-300">Você está autenticado como</p>
                  <p className="truncate text-base font-bold text-white">
                    {session.user.email ?? session.user.id}
                  </p>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-extrabold text-white shadow-[0_10px_30px_-8px_rgba(139,92,246,0.7)] transition-transform active:scale-[0.98]"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              ) : (
                <>
                  {/* Tabs */}
                  <div className="mx-auto flex w-full rounded-full bg-white/5 p-1">
                    <button
                      onClick={() => setTab("login")}
                      className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all ${
                        tab === "login"
                          ? "text-white shadow-[0_6px_20px_-6px_rgba(139,92,246,0.7)]"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                      style={
                        tab === "login"
                          ? { background: "var(--gradient-primary)" }
                          : undefined
                      }
                    >
                      Entrar
                    </button>
                    <button
                      onClick={() => setTab("signup")}
                      className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all ${
                        tab === "signup"
                          ? "text-white shadow-[0_6px_20px_-6px_rgba(139,92,246,0.7)]"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                      style={
                        tab === "signup"
                          ? { background: "var(--gradient-primary)" }
                          : undefined
                      }
                    >
                      Criar conta
                    </button>
                  </div>

                  {/* Google */}
                  <button
                    type="button"
                    onClick={handleGoogle}
                    disabled={googleLoading || loading}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-extrabold text-white shadow-[0_10px_30px_-8px_rgba(139,92,246,0.7)] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    {googleLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <GoogleIcon />
                    )}
                    Fazer login com o Google
                  </button>

                  {/* Divider */}
                  <div className="my-5 flex items-center gap-3">
                    <span className="h-px flex-1 bg-white/10" />
                    <span className="text-xs uppercase tracking-widest text-slate-500">
                      ou
                    </span>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>

                  {/* Inputs */}
                  <form className="space-y-3" onSubmit={handleSubmit}>
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="E-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-full border border-purple-500/40 bg-white/[0.03] px-5 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-purple-400 focus:bg-white/[0.06] focus:ring-2 focus:ring-purple-500/30"
                    />
                    <input
                      type="password"
                      autoComplete={tab === "login" ? "current-password" : "new-password"}
                      placeholder="Senha (mínimo 6 caracteres)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-full border border-purple-500/40 bg-white/[0.03] px-5 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-purple-400 focus:bg-white/[0.06] focus:ring-2 focus:ring-purple-500/30"
                    />

                    <button
                      type="submit"
                      disabled={loading || googleLoading}
                      className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-extrabold text-white shadow-[0_10px_30px_-8px_rgba(139,92,246,0.7)] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          {tab === "login" ? "Entrar" : "Criar conta"}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>

        <p className="mx-auto mt-8 max-w-xs text-center text-xs leading-relaxed text-slate-500">
          Ao continuar, você concorda com os Termos de Uso e a Política de
          Privacidade d'O Discípulo.
        </p>
      </div>
    </main>
  );
}

