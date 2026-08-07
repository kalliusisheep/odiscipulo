import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import { CHARACTERS, BIBLE_VERSIONS, type BibleVersion } from "@/data/content";
import { toast } from "sonner";
import { isUsernameAvailable, isValidUsername, normalizeUsername } from "@/lib/username";
import { getVapidKey, isPushSupported, subscribeAndPersist } from "@/lib/push";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChurchLinkDialog } from "@/components/ChurchLinkDialog";
import type { ChurchOption } from "@/lib/church";

import { useApp } from "@/lib/app-context";
import { APP_LANGUAGES, languageByCode, THEME_OPTIONS, type AppLanguage, type AppTheme } from "@/lib/i18n";
import {
  AtSign,
  Bell,
  Church,
  Copy,
  Check,
  LogOut,
  BookOpen,
  Camera,
  Loader2,
  Pencil,
  X,
  ChevronRight,
  Sparkles,
  NotebookPen,
  ArrowUpRight,
  Crown,
  Settings2,
  ShieldCheck,
  Trophy,
  MessageCircle,
  Gamepad2,
  Languages,
  Palette,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/perfil")({
  component: PerfilPage,
});

// Avatares prontos disponíveis em /public/avatares (avatar-1.png … avatar-10.png)
const PRESET_AVATARS = Array.from({ length: 10 }, (_, i) => `/avatares/avatar-${i + 1}.png`);

const BIBLE_VERSION_OPTIONS: { code: BibleVersion; name: string; description: string }[] = [
  {
    code: "NVI",
    name: "Nova Versão Internacional",
    description: "Tradução moderna e de leitura fluida",
  },
  {
    code: "NAA",
    name: "Nova Almeida Atualizada",
    description: "Equilíbrio entre fidelidade e clareza",
  },
  { code: "ACF", name: "Almeida Corrigida Fiel", description: "Tradução clássica e formal" },
  {
    code: "NVT",
    name: "Nova Versão Transformadora",
    description: "Linguagem contemporânea e acessível",
  },
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
  const [bioDraft, setBioDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [churchDialogOpen, setChurchDialogOpen] = useState(false);
  const [savingDevotionalReminder, setSavingDevotionalReminder] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { bibleVersion, setBibleVersion, language, setLanguage, theme, setTheme, t } = useApp();
  const nav = useNavigate();

  useEffect(() => {
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", u.user.id)
        .maybeSingle();
      if (p) {
        setProfile(p as Profile);
        setBioDraft((p as Profile).bio ?? "");
        setBibleVersion(p.bible_version as (typeof BIBLE_VERSIONS)[number]);
      }
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
      const { data: signed } = await supabase.storage
        .from("avatars")
        .createSignedUrl(path, 60 * 60 * 24 * 365);
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

  const toggleDevotionalReminder = async () => {
    if (!profile || savingDevotionalReminder) return;

    const nextValue = !profile.notify_devocional;
    setSavingDevotionalReminder(true);

    try {
      if (nextValue) {
        if (!isPushSupported()) {
          toast.error("Este dispositivo não oferece notificações push.");
          return;
        }

        if (!getVapidKey()) {
          toast.error("As notificações push ainda não estão configuradas.");
          return;
        }

        const permission =
          Notification.permission === "granted"
            ? "granted"
            : await Notification.requestPermission();

        if (permission !== "granted") {
          toast.error("Permita as notificações do navegador para ativar o lembrete.");
          return;
        }

        const subscription = await subscribeAndPersist();
        if (!subscription) throw new Error("push-subscription-not-saved");
      }

      const { error } = await supabase
        .from("profiles")
        .update({ notify_devocional: nextValue })
        .eq("id", profile.id);

      if (error) throw error;

      setProfile((current) =>
        current ? { ...current, notify_devocional: nextValue } : current,
      );
      toast.success(
        nextValue
          ? "Lembrete ativado! Você receberá avisos às 06h e às 20h."
          : "Lembrete de devocional desativado.",
      );
    } catch {
      toast.error("Não foi possível atualizar as notificações neste dispositivo.");
    } finally {
      setSavingDevotionalReminder(false);
    }
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

  const ch = CHARACTERS.find((c) => c.id === profile.avatar_char) ?? CHARACTERS[0];

  return (
    <div className="mx-auto max-w-lg space-y-5 px-3 pt-5 sm:px-4">
      <header className="relative flex min-h-10 animate-slide-up items-start px-1">
        <h1 className="text-2xl font-extrabold tracking-tight">Meu perfil</h1>
        <div className="absolute right-1 top-0 flex shrink-0 items-center">
          <ViewModeToggle />
        </div>
      </header>

      <section
        className="relative isolate animate-slide-up overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-[#2b3364] via-[#1c2445] to-[#111827] text-white shadow-2xl shadow-primary/10"
        style={{ animationDelay: "40ms", animationFillMode: "backwards" }}
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-primary-glow/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.07),transparent_45%)]" />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            src="/sheep-profile.jpeg"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-[center_28%] brightness-[0.72] saturate-[0.9]"
          />
          <div className="absolute inset-0 bg-[#111827]/15" />
        </div>

        <div className="relative z-10 p-5">
          <div className="flex items-center gap-4">
            <div className="relative h-[92px] w-[92px] shrink-0">
              <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-primary via-primary-glow to-white/20 p-[3px]">
                <div className="h-full w-full rounded-[25px] bg-[#161d36]" />
              </div>
              <div className="absolute inset-[5px] flex items-center justify-center overflow-hidden rounded-[24px] bg-surface-2 text-4xl ring-1 ring-white/10">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Foto de perfil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{ch.emoji}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setAvatarDialogOpen(true)}
                disabled={uploading}
                className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-[3px] ring-[#1c2445] transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
                aria-label="Trocar foto"
              >
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Camera className="h-3.5 w-3.5" />
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/55">
                <Sparkles className="h-3 w-3 text-primary" /> Seu perfil
              </p>
              <h2 className="mt-1 truncate text-lg font-extrabold leading-tight">
                {profile.display_name}
              </h2>

              <div className="mt-1.5 flex min-h-7 items-center gap-1">
                {editingUsername ? (
                  <>
                    <div className="flex min-w-0 flex-1 items-center rounded-full border border-white/15 bg-black/20 px-2 py-1 backdrop-blur-sm">
                      <AtSign className="h-3 w-3 shrink-0 text-white/45" />
                      <input
                        autoFocus
                        value={usernameDraft}
                        maxLength={24}
                        onChange={(e) => setUsernameDraft(normalizeUsername(e.target.value))}
                        className="min-w-0 flex-1 bg-transparent px-1 text-[11px] font-semibold text-white outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => void saveUsername()}
                      disabled={savingUsername}
                      className="rounded-full bg-primary p-1.5 text-primary-foreground disabled:opacity-50"
                      aria-label="Salvar ID"
                    >
                      {savingUsername ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingUsername(false)}
                      className="rounded-full bg-white/10 p-1.5 text-white/70"
                      aria-label="Cancelar edição"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="truncate text-[11px] font-semibold text-white/65">
                      @{profile.username ?? "sem-id"}
                    </span>
                    {profile.username && (
                      <button
                        type="button"
                        onClick={() => void copyUsername()}
                        className="rounded-full p-1 text-white/55 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label="Copiar ID"
                      >
                        {copied ? (
                          <Check className="h-3 w-3 text-emerald-300" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={startEditUsername}
                      className="rounded-full p-1 text-white/55 transition-colors hover:bg-white/10 hover:text-white"
                      aria-label="Editar ID"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                  </>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-primary/20 px-2.5 py-1 text-[10px] font-extrabold text-primary-foreground ring-1 ring-primary/30">
                  Perfil pessoal
                </span>
                {profile.church_name && (
                  <span className="max-w-full truncate rounded-full bg-white/[0.08] px-2.5 py-1 text-[10px] font-semibold text-white/70 ring-1 ring-white/10">
                    {profile.church_name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

      </section>

      <section
        className="card-elevated animate-slide-up overflow-hidden p-4"
        style={{ animationDelay: "75ms", animationFillMode: "backwards" }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Pencil className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-extrabold">Sobre mim</h3>
              <p className="text-[10px] text-muted-foreground">
                Salvo automaticamente ao sair do campo
              </p>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground">
            {bioDraft.length}/240
          </span>
        </div>
        <textarea
          value={bioDraft}
          onChange={(e) => setBioDraft(e.target.value.slice(0, 240))}
          onBlur={() => void saveBio()}
          placeholder="Conte um pouco sobre sua caminhada com Cristo…"
          rows={3}
          className="mt-3 w-full resize-none rounded-[18px] border border-border/70 bg-background/70 px-3.5 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground transition-all focus:border-primary/60 focus:outline-none focus:ring-4 focus:ring-primary/10"
        />
      </section>

      <section
        className="animate-slide-up"
        style={{ animationDelay: "125ms", animationFillMode: "backwards" }}
      >
        <SectionLabel>Atalhos pessoais</SectionLabel>
        <div className="grid grid-cols-1 gap-2.5">
          <JourneyShortcut
            icon={NotebookPen}
            eyebrow="Relembre"
            title="Minhas Notas"
            description="Marcações e trechos salvos"
            onClick={() => void nav({ to: "/notas" })}
          />
        </div>
      </section>

      <section
        className="animate-slide-up"
        style={{ animationDelay: "145ms", animationFillMode: "backwards" }}
      >
        <SectionLabel>Comunidade</SectionLabel>
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => void nav({ to: "/jogos" })}
            className="group card-elevated flex w-full items-center gap-3.5 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-ancient/10 text-ancient ring-1 ring-ancient/10 transition-colors group-hover:bg-ancient/15">
              <Gamepad2 className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[9px] font-extrabold uppercase tracking-[0.14em] text-ancient">
                Comunidade
              </span>
              <span className="mt-0.5 block text-sm font-extrabold">Jogos</span>
              <span className="mt-1 block text-[10px] leading-snug text-muted-foreground">
                Desafie seus irmãos com personagens e histórias da Bíblia.
              </span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-ancient" />
          </button>

          <button
            type="button"
            onClick={() => void nav({ to: "/ranking" })}
            className="group card-elevated flex w-full items-center gap-3.5 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-primary/10 text-primary ring-1 ring-primary/10 transition-colors group-hover:bg-primary/15">
              <Trophy className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[9px] font-extrabold uppercase tracking-[0.14em] text-primary">
                Conexão
              </span>
              <span className="mt-0.5 block text-sm font-extrabold">Ranking da comunidade</span>
              <span className="mt-1 block text-[10px] leading-snug text-muted-foreground">
                Veja pessoas próximas, convide amigos e acompanhe a caminhada juntos.
              </span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary" />
          </button>

          <button
            type="button"
            onClick={() => void nav({ to: "/mensagens" })}
            className="group card-elevated flex w-full items-center gap-3.5 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-success/10 text-success ring-1 ring-success/10 transition-colors group-hover:bg-success/15">
              <MessageCircle className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[9px] font-extrabold uppercase tracking-[0.14em] text-success">
                Converse
              </span>
              <span className="mt-0.5 block text-sm font-extrabold">Meus Irmãos</span>
              <span className="mt-1 block text-[10px] leading-snug text-muted-foreground">
                Encontre seus irmãos e continue a conversa.
              </span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-success" />
          </button>
        </div>
      </section>

      <section
        className="animate-slide-up"
        style={{ animationDelay: "150ms", animationFillMode: "backwards" }}
      >
        <div className="mb-2 flex items-center gap-2 px-1">
          <Settings2 className="h-3.5 w-3.5 text-primary" />
          <SectionLabel className="mb-0 px-0">{t("profile.preferences")}</SectionLabel>
        </div>
        <div className="card-elevated divide-y divide-border/70 overflow-hidden">
          <LanguageSelector
            value={language}
            open={languageOpen}
            onOpenChange={setLanguageOpen}
            onSelect={(value) => {
              setLanguage(value);
              setLanguageOpen(false);
            }}
          />
          <ThemeSelector
            value={theme}
            open={themeOpen}
            onOpenChange={setThemeOpen}
            onSelect={(value) => {
              setTheme(value);
              setThemeOpen(false);
            }}
          />
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
          <SettingsRow
            icon={Church}
            title={t("profile.myChurch")}
            subtitle={profile.church_name ?? "Não vinculado a uma igreja"}
            action={
              <button
                onClick={() => setChurchDialogOpen(true)}
                className="min-h-9 shrink-0 rounded-full border border-primary/15 bg-primary/[0.06] px-3 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
              >
                {profile.church_name ? "Alterar" : "Vincular"}
              </button>
            }
          />
          <SettingsRow
            icon={Bell}
            title={t("profile.devotionalReminder")}
            subtitle={
              profile.notify_devocional
                ? "Você receberá avisos às 06h e às 20h."
                : "Receba um aviso diário para não perder a Palavra."
            }
            action={
              <ToggleSwitch
                checked={profile.notify_devocional}
                onChange={() => void toggleDevotionalReminder()}
                disabled={savingDevotionalReminder}
                ariaLabel="Ativar lembrete de devocional"
              />
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
          setProfile((p) =>
            p ? { ...p, church_id: church?.id ?? null, church_name: church?.name ?? null } : p,
          )
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

      <section
        className="animate-slide-up overflow-hidden rounded-[22px] border border-border/70 bg-surface"
        style={{ animationDelay: "180ms", animationFillMode: "backwards" }}
      >
        <div className="flex items-center gap-3 px-4 py-3.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">Conta protegida</p>
            <p className="text-xs text-muted-foreground">
              Seus dados e preferências ficam vinculados ao seu acesso.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="flex w-full items-center justify-between border-t border-border/70 px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-destructive/5 hover:text-destructive"
        >
          <span className="flex items-center gap-2">
            <LogOut className="h-4 w-4" /> Sair da conta
          </span>
          <ChevronRight className="h-4 w-4 opacity-40" />
        </button>
      </section>

      <p
        className="animate-slide-up pb-2 text-center text-[11px] text-muted-foreground/70"
        style={{ animationDelay: "220ms", animationFillMode: "backwards" }}
      >
        O Discípulo 🐑 — sua caminhada, um passo de cada vez.
      </p>
    </div>
  );
}

function SectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`mb-2 px-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground ${className}`}
    >
      {children}
    </p>
  );
}

function JourneyShortcut({
  icon: Icon,
  eyebrow,
  title,
  description,
  onClick,
}: {
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group card-elevated relative flex min-h-[82px] items-center gap-3 overflow-hidden p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-transform group-hover:scale-125" />
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-primary/10 text-primary ring-1 ring-primary/10">
        <Icon className="h-5 w-5" />
      </span>
      <span className="relative min-w-0 flex-1">
        <span className="block text-[9px] font-extrabold uppercase tracking-[0.14em] text-primary">
          {eyebrow}
        </span>
        <span className="mt-0.5 block text-sm font-extrabold leading-tight">{title}</span>
        <span className="mt-1 block truncate text-[10px] leading-snug text-muted-foreground">
          {description}
        </span>
      </span>
      <ArrowUpRight className="relative h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary" />
    </button>
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
    <div className="flex items-center gap-3 p-4 transition-colors hover:bg-surface-2/40">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-primary/10 text-primary ring-1 ring-primary/10">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  ariaLabel,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${checked ? "bg-primary" : "bg-muted"} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ease-out ${
          checked ? "translate-x-[1.25rem]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function LanguageSelector({
  value,
  open,
  onOpenChange,
  onSelect,
}: {
  value: AppLanguage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (value: AppLanguage) => void;
}) {
  const { t } = useApp();
  const current = languageByCode(value);

  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-surface-2/40"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-primary/10 text-primary ring-1 ring-primary/10">
          <Languages className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">{t("profile.language")}</p>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {t("profile.languageDescription")}
          </p>
        </div>
        <span className="rounded-full bg-primary/[0.07] px-2.5 py-1 text-[10px] font-extrabold text-primary">
          {current.nativeLabel}
        </span>
      </button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("profile.languageDialogTitle")}</DialogTitle>
            <DialogDescription>{t("profile.languageDialogDescription")}</DialogDescription>
          </DialogHeader>
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
            {APP_LANGUAGES.map((option) => {
              const selected = option.code === value;
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
                    {option.nativeLabel.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{option.label}</span>
                    <span className="block text-xs text-muted-foreground">
                      {option.nativeLabel}
                    </span>
                  </span>
                  {selected ? (
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                  )}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ThemeSelector({
  value,
  open,
  onOpenChange,
  onSelect,
}: {
  value: AppTheme;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (value: AppTheme) => void;
}) {
  const { t } = useApp();
  const current = THEME_OPTIONS.find((option) => option.id === value) ?? THEME_OPTIONS[0];

  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-surface-2/40"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-primary/10 text-primary ring-1 ring-primary/10">
          <Palette className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">{t("profile.theme")}</p>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {t("profile.themeDescription")}
          </p>
        </div>
        <span className={`h-6 w-6 rounded-full border-2 border-border shadow-inner theme-preview-${value}`} aria-hidden="true" />
        <span className="max-w-[5.5rem] truncate text-[10px] font-extrabold text-primary">
          {t(current.labelKey)}
        </span>
      </button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("profile.themeDialogTitle")}</DialogTitle>
            <DialogDescription>{t("profile.themeDialogDescription")}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2.5">
            {THEME_OPTIONS.map((option) => {
              const selected = option.id === value;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onSelect(option.id)}
                  className={`group rounded-2xl border p-3 text-left transition-all active:scale-[0.98] ${
                    selected ? "border-primary bg-primary/10 shadow-lg shadow-primary/10" : "border-border hover:border-primary/40"
                  }`}
                >
                  <span className={`theme-preview-${option.id} block h-12 rounded-xl border border-border/70 shadow-inner`} />
                  <span className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-sm font-extrabold">{t(option.labelKey)}</span>
                    {selected && <Check className="h-4 w-4 text-primary" />}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-muted-foreground">
                    {t(option.descriptionKey)}
                  </span>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
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
  const { t } = useApp();
  const current =
    BIBLE_VERSION_OPTIONS.find((option) => option.code === value) ?? BIBLE_VERSION_OPTIONS[0];
  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-surface-2/40"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-primary/10 text-primary ring-1 ring-primary/10">
          <BookOpen className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">{t("profile.bibleVersion")}</p>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{current.name}</p>
        </div>
        <span className="rounded-full bg-primary/[0.07] px-2.5 py-1 text-[10px] font-extrabold text-primary">
          {current.code}
        </span>
      </button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("profile.bibleVersion")}</DialogTitle>
            <DialogDescription>
              Escolha a versão exibida em lições, estudos e mural.
            </DialogDescription>
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
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-2 text-muted-foreground"
                    }`}
                  >
                    {option.code}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{option.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  </span>
                  {selected && <Check className="h-5 w-5 shrink-0 text-primary" />}
                  {!selected && (
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                  )}
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
          <DialogDescription>
            Selecione um avatar pronto ou envie sua própria foto.
          </DialogDescription>
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
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
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
        <div className="flex items-center gap-4 bg-surface-2/60 p-5">
          <div className="h-24 w-24 shrink-0 animate-pulse rounded-[28px] bg-surface-2" />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="h-3 w-20 animate-pulse rounded-full bg-surface-2" />
            <div className="h-5 w-36 animate-pulse rounded-full bg-surface-2" />
            <div className="h-3 w-24 animate-pulse rounded-full bg-surface-2" />
          </div>
        </div>
      </div>
      <div className="card-elevated h-40 animate-pulse bg-surface-2/60" />
      <div className="card-elevated h-56 animate-pulse bg-surface-2/60" />
    </div>
  );
}
