import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import { CHARACTERS, BIBLE_VERSIONS } from "@/data/content";
import { getLevel, streakToNextLevel, MAX_LEVEL } from "@/data/levels";

import { useApp } from "@/lib/app-context";
import { Bell, Church, LogOut, BookOpen, Flame, Trophy, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/perfil")({
  component: PerfilPage,
});

type Profile = {
  id: string;
  display_name: string;
  avatar_char: string;
  xp: number;
  streak: number;
  bible_version: string;
  notify_devocional: boolean;
  church_name: string | null;
  is_leader: boolean;
};

function PerfilPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lessonsCount, setLessonsCount] = useState(0);
  const { bibleVersion, setBibleVersion } = useApp();
  const nav = useNavigate();

  useEffect(() => {
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: p } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      if (p) {
        setProfile(p as Profile);
        setBibleVersion(p.bible_version as (typeof BIBLE_VERSIONS)[number]);
      }
      const { count } = await supabase.from("lesson_progress").select("*", { count: "exact", head: true }).eq("user_id", u.user.id);
      setLessonsCount(count ?? 0);
    })();
  }, [setBibleVersion]);

  const update = async (patch: Partial<Profile>) => {
    if (!profile) return;
    const next = { ...profile, ...patch };
    setProfile(next);
    await supabase.from("profiles").update(patch).eq("id", profile.id);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    await nav({ to: "/" });
  };

  if (!profile) return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>;

  const level = getLevel(profile.streak);
  const ch = CHARACTERS.find((c) => c.id === profile.avatar_char) ?? CHARACTERS[0];
  const toNext = streakToNextLevel(profile.streak);

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 pt-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Perfil</h1>
        <ViewModeToggle />
      </header>

      <section className="card-elevated overflow-hidden">
        <div className="bg-gradient-to-br from-primary/20 to-primary-glow/10 p-5 text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-surface-2 ring-2 ring-primary/40 text-6xl">
            {level.avatar ? (
              <img src={level.avatar} alt={level.title} className="h-full w-full object-cover" />
            ) : (
              <span>{ch.emoji}</span>
            )}
          </div>
          <h2 className="mt-3 text-lg font-bold">{profile.display_name}</h2>
          <p className="text-xs text-muted-foreground">Sua Patente:</p>
          <p className="text-base font-semibold text-primary">Nível {level.level} / {MAX_LEVEL}: {level.title}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {toNext === null ? "Nível máximo alcançado 🔥" : `Faltam ${toNext} dia${toNext === 1 ? "" : "s"} de ofensiva para subir de nível`}
          </p>
        </div>
      </section>


      <section className="card-elevated p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avatar bíblico</p>
        <div className="grid grid-cols-4 gap-2">
          {CHARACTERS.map((c) => (
            <button
              key={c.id}
              onClick={() => void update({ avatar_char: c.id })}
              className={`flex flex-col items-center gap-1 rounded-2xl border p-3 transition-all ${
                profile.avatar_char === c.id ? "border-primary bg-primary/10" : "border-border bg-background hover:border-primary/40"
              }`}
            >
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-[10px] font-medium">{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="card-elevated p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Versão da Bíblia</p>
        <div className="grid grid-cols-5 gap-2">
          {BIBLE_VERSIONS.map((v) => (
            <button
              key={v}
              onClick={() => {
                setBibleVersion(v);
                void update({ bible_version: v });
              }}
              className={`rounded-xl border py-2 text-xs font-semibold transition-all ${
                bibleVersion === v ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Escolha a versão exibida em lições, estudos e mural.
        </p>
      </section>

      <section className="card-elevated p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estatísticas</p>
        <div className="grid grid-cols-2 gap-2 text-center">
          <Stat icon={Trophy} label="Nível" value={String(level.level)} />
          <Stat icon={Flame} label="Ofensiva 🔥" value={`${profile.streak}d`} />
          <Stat icon={BookOpen} label="Lições" value={String(lessonsCount)} />
          <Stat icon={Clock} label="Estudo" value={`${lessonsCount * 8}m`} />
        </div>
      </section>

      <section className="card-elevated p-4">
        <div className="flex items-center gap-3">
          <Church className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Comunidade</p>
            <p className="text-xs text-muted-foreground">{profile.church_name ?? "Não vinculado a uma igreja"}</p>
          </div>
          <button
            onClick={() => {
              const v = window.prompt("Nome da igreja:", profile.church_name ?? "");
              if (v !== null) void update({ church_name: v });
            }}
            className="rounded-full border border-border px-3 py-1 text-xs font-medium"
          >
            Vincular
          </button>
        </div>
      </section>

      <section className="card-elevated p-4">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Lembrete de Devocional</p>
            <p className="text-xs text-muted-foreground">Mantém sua ofensiva ativa.</p>
          </div>
          <button
            onClick={() => void update({ notify_devocional: !profile.notify_devocional })}
            className={`h-6 w-11 rounded-full transition-all ${profile.notify_devocional ? "bg-primary" : "bg-muted"}`}
          >
            <div className={`h-5 w-5 rounded-full bg-white transition-all ${profile.notify_devocional ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </section>

      <section className="card-elevated p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Sou líder / discipulador</p>
            <p className="text-xs text-muted-foreground">Habilita o Modo Líder.</p>
          </div>
          <button
            onClick={() => void update({ is_leader: !profile.is_leader })}
            className={`h-6 w-11 rounded-full transition-all ${profile.is_leader ? "bg-primary" : "bg-muted"}`}
          >
            <div className={`h-5 w-5 rounded-full bg-white transition-all ${profile.is_leader ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </section>

      <button
        onClick={() => void signOut()}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3 text-sm font-medium text-muted-foreground transition-all hover:text-destructive"
      >
        <LogOut className="h-4 w-4" /> Sair
      </button>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-2 p-3">
      <Icon className="mx-auto h-4 w-4 text-primary" />
      <p className="mt-1 text-lg font-bold">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
