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
import { ChurchLinkDialog } from "@/components/ChurchLinkDialog";
import type { ChurchOption } from "@/lib/church";

import { useApp } from "@/lib/app-context";
import { useMascot, profileStatsLine } from "@/lib/mascot";
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
  ShieldCheck,
  Sparkles,
  NotebookPen,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/perfil")({
  component: PerfilPage,
});

// Avatares prontos disponíveis em /public/avatares (avatar-1.png … avatar-10.png)
const PRESET_AVATARS = Array.from({ length: 10 }, (_, i) => `/avatares/avatar-${i + 1}.png`);

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
  church_id: string | null;
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
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [churchDialogOpen, setChurchDialogOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { bibleVersion, setBibleVersion } = useApp();
  const nav = useNavigate();
  const { say } = useMascot();
  const statsCommentedRef = useRef(false);

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

      // Comenta as estatísticas reais do perfil (XP, lições, sequência),
      // uma única vez por visita à aba.
      if (!statsCommentedRef.current && p) {
        const line = profileStatsLine((p.xp as number) ?? 0, count ?? 0, (p.streak as number) ?? 0);
        if (line) {
          statsCommentedRef.current = true;
          setTimeout(() => say(line), 2600);
        }
      }
    })();
  }, [setBibleVersion, say]);

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

  const selectPresetAvatar = async (src: string) => {
    await update({ avatar_url: src });
    setAvatarDialogOpen(false);
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

  if (!profile) return <PerfilSkeleton />;

  const level = getLevel(profile.xp);
  const ch = CHARACTERS.find((c) => c.id === profile.avatar_char) ?? CHARACTERS[0];
  const toNext = xpToNextLevel(profile.xp);
  const pct = Math.round(levelProgressPct(profile.xp));

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 pt-6">
      <header className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Perfil</h1>
          <p className="text-xs text-muted-foreground">Sua jornada de fé, em um só lugar</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ViewModeToggle />
        </div>
      </header>

      {/* ── Hero: avatar, nível, XP ─────────────────────────────── */}
      <section
        className="card-elevated animate-slide-up overflow-hidden"
        style={{ animationDelay: "40ms", animationFillMode: "backwards" }}
      >
        <div
          className="relative overflow-hidden px-5 pb-6 pt-7 text-center"
          style={{
            backgroundImage: "url(/sheep-profile.jpeg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* overlay em degradê para manter texto e botões legíveis, com toque de cor da marca */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/60 to-black/80" />
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(circle at 50% -10%, color-mix(in oklab, var(--primary) 55%, transparent), transparent 60%)",
            }}
          />

          <div className="relative z-10">
            {/* Avatar com anel de progresso de XP */}
            <div className="relative mx-auto h-28 w-28">
              <div
                className="absolute inset-0 rounded-[28px] p-[3px] transition-[background] duration-700"
                style={{
                  background: `conic-gradient(var(--primary) ${pct * 3.6}deg, color-mix(in oklab, white 22%, transparent) 0deg)`,
                }}
              >
                <div className="h-full w-full rounded-[25px] bg-black/30 backdrop-blur-sm" />
              </div>
              <div className="absolute inset-[3px] flex items-center justify-center overflow-hidden rounded-[25px] bg-surface-2 text-5xl ring-1 ring-white/10">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Foto de perfil" className="h-full w-full object-cover" />
                ) : level.avatar ? (
                  <img src={level.avatar} alt={level.title} className="h-full w-full object-cover" />
                ) : (
                  <span>{ch.emoji}</span>
                )}
              </div>
              <button
                onClick={() => setAvatarDialogOpen(true)}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-background transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
                aria-label="Trocar foto"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </div>

            <h2 className="mt-3 text-lg font-bold text-white">{profile.display_name}</h2>

            <div className="mt-1 flex items-center justify-center gap-1.5">
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
                <>
                  <span className="text-xs font-medium text-white/80">@{profile.username ?? "sem-id"}</span>
                  {profile.username && (
                    <button
                      onClick={() => void copyUsername()}
                      className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-primary"
                      aria-label="Copiar ID"
                    >
                      {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                    </button>
                  )}
                  <button
                    onClick={startEditUsername}
                    className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-primary"
                    aria-label="Editar ID"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                </>
              )}
            </div>

            {/* Pílula de nível + barra de XP */}
            <div className="mx-auto mt-4 w-full max-w-[260px]">
              <div className="mb-1.5 flex items-center justify-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm">
                  <Sparkles className="h-3 w-3" />
                  Nível {level.level} / {MAX_LEVEL}
                </span>
              </div>
              <p className="text-sm font-semibold text-white">{level.title}</p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow transition-[width] duration-700 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-white/75">
                {toNext === null ? "Nível máximo alcançado 🔥" : `Faltam ${toNext} XP para o próximo nível`}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border p-4">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bio</label>
          <textarea
            value={bioDraft}
            onChange={(e) => setBioDraft(e.target.value.slice(0, 240))}
            onBlur={() => void saveBio()}
            placeholder="Conte um pouco sobre sua caminhada com Cristo…"
            rows={3}
            className="w-full resize-none rounded-2xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
            <span>Sua bio aparece no ranking e no perfil.</span>
            <span>{bioDraft.length}/240</span>
          </div>
        </div>
      </section>

      {/* ── Estatísticas ─────────────────────────────────────────── */}
      <section className="animate-slide-up" style={{ animationDelay: "90ms", animationFillMode: "backwards" }}>
        <SectionLabel>Estatísticas</SectionLabel>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={Trophy} label="Nível" value={String(level.level)} tint="var(--primary)" delay={0} />
          <StatCard icon={Flame} label="Ofensiva" value={`${profile.streak}d`} tint="var(--streak)" delay={40} />
          <StatCard icon={BookOpen} label="Lições" value={String(lessonsCount)} tint="var(--success)" delay={80} />
          <StatCard icon={Clock} label="Estudo" value={`${lessonsCount * 8}m`} tint="var(--ancient)" delay={120} />
        </div>
      </section>

      {/* ── Versão da Bíblia ─────────────────────────────────────── */}
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

      {/* ── Preferências ─────────────────────────────────────────── */}
      <section className="animate-slide-up" style={{ animationDelay: "140ms", animationFillMode: "backwards" }}>
        <SectionLabel>Preferências</SectionLabel>
        <div className="card-elevated divide-y divide-border overflow-hidden">
          <SettingsRow
            icon={Church}
            title="Comunidade"
            subtitle={profile.church_name ?? "Não vinculado a uma igreja"}
            action={
              <button
                onClick={() => setChurchDialogOpen(true)}
                className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/50 hover:text-primary"
              >
                {profile.church_name ? "Alterar" : "Vincular"}
              </button>
            }
          />
          <SettingsRow
            icon={Bell}
            title="Lembrete de Devocional"
            subtitle="Mantém sua ofensiva ativa."
            action={
              <ToggleSwitch
                checked={profile.notify_devocional}
                onChange={() => void update({ notify_devocional: !profile.notify_devocional })}
                ariaLabel="Ativar lembrete de devocional"
              />
            }
          />
          <SettingsRow
            icon={ShieldCheck}
            title="Sou líder / discipulador"
            subtitle="Habilita o Modo Líder."
            action={
              <ToggleSwitch
                checked={profile.is_leader}
                onChange={() => void update({ is_leader: !profile.is_leader })}
                ariaLabel="Habilitar modo líder"
              />
            }
          />
          <SettingsRow
            icon={NotebookPen}
            title="Minhas Notas"
            subtitle="Anotações, marcações e trechos salvos"
            action={
              <button
                onClick={() => void nav({ to: "/notas" })}
                className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/50 hover:text-primary"
              >
                Abrir
              </button>
            }
          />
        </div>
      </section>

      <ChurchLinkDialog
        open={churchDialogOpen}
        onOpenChange={setChurchDialogOpen}
        userId={profile.id}
        currentChurchId={profile.church_id}
        currentChurchName={profile.church_name}
        onLinked={(church: ChurchOption | null) =>
          setProfile((p) => (p ? { ...p, church_id: church?.id ?? null, church_name: church?.name ?? null } : p))
        }
      />

      <AvatarPickerDialog
        open={avatarDialogOpen}
        onOpenChange={setAvatarDialogOpen}
        currentAvatar={profile.avatar_url}
        uploading={uploading}
        onSelectPreset={(src) => void selectPresetAvatar(src)}
        onUploadClick={() => {
          setAvatarDialogOpen(false);
          onPickFile();
        }}
      />

      <button
        onClick={() => void signOut()}
        className="flex w-full animate-slide-up items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3.5 text-sm font-medium text-muted-foreground transition-all hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive active:scale-[0.99]"
        style={{ animationDelay: "180ms", animationFillMode: "backwards" }}
      >
        <LogOut className="h-4 w-4" /> Sair
      </button>

      <p
        className="animate-slide-up pb-2 text-center text-[11px] text-muted-foreground/70"
        style={{ animationDelay: "220ms", animationFillMode: "backwards" }}
      >
        O Discípulo 🐑 — sua caminhada, um passo de cada vez.
      </p>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</p>;
}

function StatCard({
  icon: Icon,
  label,
  value,
  tint,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tint: string;
  delay?: number;
}) {
  return (
    <div
      className="card-elevated animate-slide-up flex flex-col items-center gap-2 p-3.5 text-center transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "backwards" }}
    >
      <span
        className="flex h-10 w-10 items-center justify-center rounded-2xl"
        style={{ background: `color-mix(in oklab, ${tint} 16%, transparent)`, color: tint }}
      >
        <Icon className="h-5 w-5" />
      </span>
      <p className="text-lg font-bold leading-none">{value}</p>
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function SettingsRow({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function ToggleSwitch({ checked, onChange, ariaLabel }: { checked: boolean; onChange: () => void; ariaLabel: string }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${checked ? "bg-primary" : "bg-muted"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ease-out ${
          checked ? "translate-x-[1.25rem]" : "translate-x-0"
        }`}
      />
    </button>
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
      <section className="animate-slide-up" style={{ animationDelay: "115ms", animationFillMode: "backwards" }}>
        <SectionLabel>Versão da Bíblia</SectionLabel>
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          className="card-elevated flex w-full items-center gap-3 p-4 text-left transition-colors hover:border-primary/40"
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

function AvatarPickerDialog({
  open,
  onOpenChange,
  currentAvatar,
  uploading,
  onSelectPreset,
  onUploadClick,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatar: string | null;
  uploading: boolean;
  onSelectPreset: (src: string) => void;
  onUploadClick: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Escolher avatar</DialogTitle>
          <DialogDescription>Selecione um avatar pronto ou envie sua própria foto.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-2.5">
          {PRESET_AVATARS.map((src) => {
            const selected = currentAvatar === src;
            return (
              <button
                key={src}
                type="button"
                onClick={() => onSelectPreset(src)}
                className={`relative aspect-square overflow-hidden rounded-2xl bg-surface-2 ring-2 transition-transform hover:scale-105 active:scale-95 ${
                  selected ? "ring-primary" : "ring-transparent"
                }`}
                aria-label="Selecionar avatar"
              >
                <img src={src} alt="Avatar" className="h-full w-full object-cover" loading="lazy" />
                {selected && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Check className="h-6 w-6 text-white" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onUploadClick}
          disabled={uploading}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl border border-border py-2.5 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          Enviar do dispositivo
        </button>
      </DialogContent>
    </Dialog>
  );
}

function PerfilSkeleton() {
  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-5 w-20 animate-pulse rounded-full bg-surface-2" />
          <div className="h-3 w-40 animate-pulse rounded-full bg-surface-2" />
        </div>
        <div className="h-10 w-24 animate-pulse rounded-full bg-surface-2" />
      </div>
      <div className="card-elevated overflow-hidden">
        <div className="flex flex-col items-center gap-3 bg-surface-2/60 px-5 pb-6 pt-7">
          <div className="h-28 w-28 animate-pulse rounded-[28px] bg-surface-2" />
          <div className="h-4 w-32 animate-pulse rounded-full bg-surface-2" />
          <div className="h-3 w-24 animate-pulse rounded-full bg-surface-2" />
          <div className="h-2 w-full max-w-[260px] animate-pulse rounded-full bg-surface-2" />
        </div>
        <div className="border-t border-border p-4">
          <div className="h-16 w-full animate-pulse rounded-2xl bg-surface-2" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card-elevated h-24 animate-pulse bg-surface-2/60" />
        ))}
      </div>
      <div className="card-elevated h-16 animate-pulse bg-surface-2/60" />
      <div className="card-elevated h-40 animate-pulse bg-surface-2/60" />
    </div>
  );
}
