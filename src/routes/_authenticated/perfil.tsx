import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CHARACTERS, BIBLE_VERSIONS, type BibleVersion } from "@/data/content";
import { getLevel, xpToNextLevel, levelProgressPct, MAX_LEVEL } from "@/data/levels";
import { toast } from "sonner";
import { isUsernameAvailable, isValidUsername, normalizeUsername } from "@/lib/username";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

import { useApp } from "@/lib/app-context";
import {
  AtSign,
  Bell,
  Church,
  Copy,
  Check,
  LogOut,
  BookOpen,
  Flame,
  Trophy,
  Clock,
  Camera,
  Loader2,
  Pencil,
  X,
  ChevronDown,
  ChevronRight,
  Star,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/perfil")({
  component: PerfilPage,
});

const BIBLE_VERSION_OPTIONS: { code: BibleVersion; name: string; description: string }[] = [
  { code: "NVI", name: "Nova Versão Internacional", description: "Tradução moderna e de leitura fluida" },
  { code: "NAA", name: "Nova Almeida Atualizada", description: "Equilíbrio entre fidelidade e clareza" },
  { code: "ACF", name: "Almeida Corrigida Fiel", description: "Tradução clássica e formal" },
  { code: "NVT", name: "Nova Versão Transformadora", description: "Linguagem contemporânea e acessível" },
];

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
  const [versionOpen, setVersionOpen] = useState(false);
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
      const { count } = await supabase
        .from("lesson_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", u.user.id);
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
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });
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

  if (!profile) {
    return (
      <div className="mx-auto flex max-w-lg items-center gap-2 px-4 pt-10 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Carregando perfil…
      </div>
    );
  }

  const level = getLevel(profile.xp);
  const ch = CHARACTERS.find((c) => c.id === profile.avatar_char) ?? CHARACTERS[0];
  const toNext = xpToNextLevel(profile.xp);
  const pct = levelProgressPct(profile.xp);

  // Anel de progresso de XP ao redor do avatar
  const RING_R = 60;
  const RING_C = 2 * Math.PI * RING_R;
  const ringOffset = RING_C - (pct / 100) * RING_C;

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 pt-6 pb-10">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Perfil</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ViewModeToggle />
        </div>
      </header>

      {/* ── Hero: identidade + progresso ─────────────────────────────── */}
      <section className="card-elevated animate-slide-up overflow-hidden">
        <div
          className="relative overflow-hidden bg-cover bg-center p-6 pt-8 text-center"
          style={{ backgroundImage: "url(/sheep-profile.jpeg)" }}
        >
          {/* Camada de leitura: escurece só o suficiente para o texto respirar, sem apagar a arte */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,8,20,0.15) 0%, rgba(10,8,20,0.30) 45%, rgba(10,8,20,0.82) 100%)",
            }}
          />
          <div
            className="absolute inset-0 mix-blend-multiply"
            style={{
              background:
                "linear-gradient(140deg, color-mix(in oklab, var(--primary) 35%, transparent), transparent 60%)",
            }}
          />

          <div className="relative z-10">
            <div className="relative mx-auto h-32 w-32">
              <svg viewBox="0 0 136 136" className="absolute inset-0 h-32 w-32 -rotate-90">
                <circle cx="68" cy="68" r={RING_R} fill="none" strokeWidth="5" stroke="rgba(255,255,255,0.3)" />
                <circle
                  cx="68"
                  cy="68"
                  r={RING_R}
                  fill="none"
                  strokeWidth="5"
                  strokeLinecap="round"
                  stroke="url(#profileRingGradient)"
                  strokeDasharray={RING_C}
                  strokeDashoffset={ringOffset}
                  style={{ transition: "stroke-dashoffset 0.6s ease-out" }}
                />
                <defs>
                  <linearGradient id="profileRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--primary-glow)" />
                    <stop offset="100%" stopColor="var(--ancient)" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-[8px] overflow-hidden rounded-full bg-surface-2 text-5xl shadow-[0_0_0_3px_rgba(255,255,255,0.15)]">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Foto de perfil" className="h-full w-full object-cover" />
                ) : level.avatar ? (
                  <img src={level.avatar} alt={level.title} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center">{ch.emoji}</span>
                )}
              </div>

              <span className="absolute -top-1 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-ancient px-2.5 py-1 text-[11px] font-bold text-ancient-foreground shadow-md ring-2 ring-black/20">
                <Star className="h-3 w-3 fill-current" /> Nv {level.level}
              </span>

              <button
                onClick={onPickFile}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-black/20 transition-transform hover:scale-105 disabled:opacity-60"
                aria-label="Enviar foto"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">
              {profile.display_name}
            </h2>

            <div className="mt-1.5 flex items-center justify-center gap-1">
              {editingUsername ? (
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center rounded-full border border-primary bg-background px-2 py-1">
                    <AtSign className="h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      autoFocus
                      value={usernameDraft}
                      maxLength={24}
                      onChange={(e) => setUsernameDraft(normalizeUsername(e.target.value))}
                      className="w-32 bg-transparent px-1 text-xs font-semibold outline-none"
                    />
                  </div>
                  <button
                    onClick={() => void saveUsername()}
                    disabled={savingUsername}
                    className="rounded-full bg-primary p-1 text-primary-foreground disabled:opacity-50"
                    aria-label="Salvar"
                  >
                    {savingUsername ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => setEditingUsername(false)}
                    className="rounded-full border border-border bg-background p-1 text-muted-foreground"
                    aria-label="Cancelar"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 rounded-full bg-black/25 py-1 pl-3 pr-1 text-xs font-medium text-white/85 backdrop-blur-sm ring-1 ring-white/10">
                  <span>@{profile.username ?? "sem-id"}</span>
                  {profile.username && (
                    <button
                      onClick={() => void copyUsername()}
                      className="rounded-full p-1.5 transition-colors hover:bg-white/15 hover:text-white"
                      aria-label="Copiar ID"
                    >
                      {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                    </button>
                  )}
                  <button
                    onClick={startEditUsername}
                    className="rounded-full p-1.5 transition-colors hover:bg-white/15 hover:text-white"
                    aria-label="Editar ID"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            <p className="mt-3 text-sm font-semibold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">
              {level.title}
            </p>

            <div className="mx-auto mt-3 max-w-xs">
              <div className="mb-1 flex items-center justify-between text-[10px] font-medium text-white/70">
                <span>
                  Nível {level.level} / {MAX_LEVEL}
                </span>
                <span>{Math.round(pct)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-black/30">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-glow to-ancient transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-white/70">
                {toNext === null ? "Nível máximo alcançado 🔥" : `Faltam ${toNext} XP para o próximo nível`}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border p-4">
          <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Bio
          </label>
          <textarea
            value={bioDraft}
            onChange={(e) => setBioDraft(e.target.value.slice(0, 240))}
            onBlur={() => void saveBio()}
            placeholder="Conte um pouco sobre sua caminhada com Cristo…"
            rows={3}
            className="w-full resize-none rounded-2xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-shadow focus:border-primary focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_18%,transparent)] focus:outline-none"
          />
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Sua bio aparece no ranking e no perfil.</span>
            <span>{bioDraft.length}/240</span>
          </div>
        </div>
      </section>

      {/* ── Estatísticas ──────────────────────────────────────────────── */}
      <section className="card-elevated p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estatísticas</p>
        <div className="grid grid-cols-4 divide-x divide-border">
          <Stat icon={Trophy} label="Nível" value={String(level.level)} accent="text-primary" />
          <Stat icon={Flame} label="Ofensiva" value={`${profile.streak}d`} accent="text-streak" />
          <Stat icon={BookOpen} label="Lições" value={String(lessonsCount)} accent="text-primary-glow" />
          <Stat icon={Clock} label="Estudo" value={`${lessonsCount * 8}m`} accent="text-ancient" />
        </div>
      </section>

      <BibleVersionSelector
        value={bibleVersion}
        open={versionOpen}
        onOpenChange={setVersionOpen}
        onSelect={(code) => {
          setBibleVersion(code);
          void update({ bible_version: code });
          setVersionOpen(false);
        }}
      />

      {/* ── Preferências ──────────────────────────────────────────────── */}
      <section className="card-elevated divide-y divide-border overflow-hidden">
        <PreferenceRow
          icon={Church}
          title="Comunidade"
          description={profile.church_name ?? "Não vinculado a uma igreja"}
          control={
            <button
              onClick={() => {
                const v = window.prompt("Nome da igreja:", profile.church_name ?? "");
                if (v !== null) void update({ church_name: v });
              }}
              className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
            >
              Vincular
            </button>
          }
        />
        <PreferenceRow
          icon={Bell}
          title="Lembrete de Devocional"
          description="Mantém sua ofensiva ativa."
          control={
            <Switch
              checked={profile.notify_devocional}
              onCheckedChange={(checked) => void update({ notify_devocional: checked })}
              aria-label="Ativar lembrete de devocional"
            />
          }
        />
        <PreferenceRow
          icon={ShieldCheck}
          title="Sou líder / discipulador"
          description="Habilita o Modo Líder."
          control={
            <Switch
              checked={profile.is_leader}
              onCheckedChange={(checked) => void update({ is_leader: checked })}
              aria-label="Habilitar modo líder"
            />
          }
        />
      </section>

      <button
        onClick={() => void signOut()}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3 text-sm font-medium text-muted-foreground transition-all hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
      >
        <LogOut className="h-4 w-4" /> Sair
      </button>
    </div>
  );
}

function PreferenceRow({
  icon: Icon,
  title,
  description,
  control,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{description}</p>
      </div>
      {control}
    </div>
  );
}

function BibleVersionSelector({
  value,
  open,
  onOpenChange,
  onSelect,
}: {
  value: BibleVersion;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (code: BibleVersion) => void;
}) {
  const current = BIBLE_VERSION_OPTIONS.find((option) => option.code === value) ?? BIBLE_VERSION_OPTIONS[0];
  return (
    <>
      <section>
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Versão da Bíblia
        </p>
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          className="card-elevated flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:border-primary/50"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground">
            {current.code}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">{current.name}</span>
            <span className="block truncate text-xs text-muted-foreground">{current.description}</span>
          </span>
          <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
        </button>
      </section>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Versão da Bíblia</DialogTitle>
            <DialogDescription>Escolha a versão exibida em lições, estudos e mural.</DialogDescription>
          </DialogHeader>
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
            {BIBLE_VERSION_OPTIONS.map((option) => {
              const selected = value === option.code;
              return (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => onSelect(option.code)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                    selected ? "bg-primary/5" : "hover:bg-surface-2"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                      selected ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground"
                    }`}
                  >
                    {option.code}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{option.name}</span>
                    <span className="block text-xs text-muted-foreground">{option.description}</span>
                  </span>
                  {selected && <Check className="h-5 w-5 shrink-0 text-primary" />}
                  {!selected && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-1 text-center">
      <Icon className={`h-4 w-4 ${accent ?? "text-primary"}`} />
      <p className="text-base font-bold leading-tight">{value}</p>
      <p className="text-[9px] uppercase leading-tight tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
