import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CHARACTERS, BIBLE_VERSIONS } from "@/data/content";
import { getLevel, streakToNextLevel, MAX_LEVEL } from "@/data/levels";
import { toast } from "sonner";
import { isUsernameAvailable, isValidUsername, normalizeUsername } from "@/lib/username";

import { useApp } from "@/lib/app-context";
import { AtSign, Bell, Church, Copy, Check, LogOut, BookOpen, Flame, Trophy, Clock, Camera, Loader2, Pencil, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/perfil")({
  component: PerfilPage,
});

type Profile = {
  id: string;
  display_name: string;
  username: string | null;
  avatar_char: string;
  avatar_url: string | null;
  bio: string | null;
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
  const [bioDraft, setBioDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { bibleVersion, setBibleVersion } = useApp();
  const nav = useNavigate();

  useEffect(() => {
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: p } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      if (p) {
        setProfile(p as Profile);
        setBioDraft((p as Profile).bio ?? "");
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

  const onPickFile = () => fileRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${profile.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data: signed } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60 * 24 * 365);
      const url = signed?.signedUrl ?? null;
      if (url) await update({ avatar_url: url });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const saveBio = async () => {
    await update({ bio: bioDraft.trim() || null });
  };

  const copyUsername = async () => {
    if (!profile?.username) return;
    try {
      await navigator.clipboard.writeText(`@${profile.username}`);
      setCopied(true);
      toast.success("ID copiado!");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  const startEditUsername = () => {
    setUsernameDraft(profile?.username ?? "");
    setEditingUsername(true);
  };

  const saveUsername = async () => {
    if (!profile) return;
    const u = normalizeUsername(usernameDraft);
    if (!isValidUsername(u)) {
      toast.error("ID inválido (3–24 caracteres: letras, números, . ou _).");
      return;
    }
    if (u === profile.username) {
      setEditingUsername(false);
      return;
    }
    setSavingUsername(true);
    const available = await isUsernameAvailable(u, profile.id);
    if (!available) {
      setSavingUsername(false);
      toast.error("Esse ID já está em uso.");
      return;
    }
    await update({ username: u });
    setSavingUsername(false);
    setEditingUsername(false);
    toast.success("ID atualizado!");
  };

  if (!profile) return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>;

  const level = getLevel(profile.streak);
  const ch = CHARACTERS.find((c) => c.id === profile.avatar_char) ?? CHARACTERS[0];
  const toNext = streakToNextLevel(profile.streak);

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 pt-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Perfil</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ViewModeToggle />
        </div>
      </header>

      <section className="card-elevated overflow-hidden">
        <div className="bg-gradient-to-br from-primary/20 to-primary-glow/10 p-5 text-center">
          <div className="relative mx-auto h-28 w-28">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-surface-2 ring-2 ring-primary/40 text-6xl">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Foto de perfil" className="h-full w-full object-cover" />
              ) : level.avatar ? (
                <img src={level.avatar} alt={level.title} className="h-full w-full object-cover" />
              ) : (
                <span>{ch.emoji}</span>
              )}
            </div>
            <button
              onClick={onPickFile}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-background disabled:opacity-60"
              aria-label="Enviar foto"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
          </div>
          <h2 className="mt-3 text-lg font-bold">{profile.display_name}</h2>
          <p className="text-xs text-muted-foreground">Sua Patente:</p>
          <p className="text-base font-semibold text-primary">Nível {level.level} / {MAX_LEVEL}: {level.title}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {toNext === null ? "Nível máximo alcançado 🔥" : `Faltam ${toNext} dia${toNext === 1 ? "" : "s"} de ofensiva para subir de nível`}
          </p>
        </div>

        <div className="border-t border-border p-4">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bio</label>
          <textarea
            value={bioDraft}
            onChange={(e) => setBioDraft(e.target.value.slice(0, 240))}
            onBlur={() => void saveBio()}
            placeholder="Conte um pouco sobre sua caminhada com Cristo…"
            rows={3}
            className="w-full resize-none rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>Sua bio aparece no ranking e no perfil.</span>
            <span>{bioDraft.length}/240</span>
          </div>
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
