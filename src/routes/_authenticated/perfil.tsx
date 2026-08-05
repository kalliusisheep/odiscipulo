import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CHARACTERS, BIBLE_VERSIONS, type BibleVersion } from "@/data/content";
import { getLevel, xpToNextLevel, levelProgressPct, MAX_LEVEL } from "@/data/levels";
import { toast } from "sonner";
import { isUsernameAvailable, isValidUsername, normalizeUsername } from "@/lib/username";
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
  ChevronRight,
  Sparkles,
  NotebookPen,
  ArrowUpRight,
  Crown,
  Settings2,
  ShieldCheck,
  Target,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/perfil")({
  component: PerfilPage,
});

// Avatares prontos dispon√≠veis em /public/avatares (avatar-1.png ‚Ä¶ avatar-10.png)
const PRESET_AVATARS = Array.from({ length: 10 }, (_, i) => `/avatares/avatar-${i + 1}.png`);

const BIBLE_VERSION_OPTIONS: { code: BibleVersion; name: string; description: string }[] = [
  {
    code: "NVI",
    name: "Nova Vers√£o Internacional",
    description: "Tradu√ß√£o moderna e de leitura fluida",
  },
  {
    code: "NAA",
    name: "Nova Almeida Atualizada",
    description: "Equil√≠brio entre fidelidade e clareza",
  },
  { code: "ACF", name: "Almeida Corrigida Fiel", description: "Tradu√ß√£o cl√°ssica e formal" },
  {
    code: "NVT",
    name: "Nova Vers√£o Transformadora",
    description: "Linguagem contempor√¢nea e acess√≠vel",
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
      const { count } = await supabase
        .from("lesson_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", u.user.id);
      setLessonsCount(count ?? 0);

      // Comenta as estat√≠sticas reais do perfil (XP, li√ß√µes, sequ√™ncia),
      // uma √∫nica vez por visita √† aba.
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

  const copyUsername = async () => {
    if (!profile?.username) return;
    try {
      await navigator.clipboard.writeText(`@${profile.username}`);
      setCopied(true);
      toast.success("ID copiado!");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("N√£o foi poss√≠vel copiar.");
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
      toast.error("ID inv√°lido (3‚Äì24 caracteres: letras, n√∫meros, . ou _).");
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
      toast.error("Esse ID j√° est√° em uso.");
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
    <div className="mx-auto max-w-lg space-y-5 px-3 pt-5 sm:px-4">
      <header className="flex animate-slide-up items-center justify-between gap-3 px-1">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            <Crown className="h-3.5 w-3.5" /> Minha caminhada
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Meu perfil</h1>
          <p className="text-xs text-muted-foreground">
            Sua identidade e seu progresso em um s√≥ lugar
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
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

        <div className="relative p-5">
          <div className="flex items-start gap-3.5">
            <div className="relative h-[82px] w-[82px] shrink-0">
              <div
                className="absolute inset-0 rounded-[24px] p-[3px]"
                style={{
                  background: `conic-gradient(var(--primary) ${pct * 3.6}deg, rgba(255,255,255,.16) 0deg)`,
                }}
              >
                <div className="h-full w-full rounded-[21px] bg-[#161d36]" />
              </div>
              <div className="absolute inset-[4px] flex items-center justify-center overflow-hidden rounded-[20px] bg-surface-2 text-4xl ring-1 ring-white/10">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Foto de perfil"
                    className="h-full w-full object-cover"
                  />
                ) : level.avatar ? (
                  <img
                    src={level.avatar}
                    alt={level.title}
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

            <div className="min-w-0 flex-1 pt-0.5">
              <p className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/55">
                <Sparkles className="h-3 w-3 text-primary" /> Sua jornada
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
                      aria-label="Cancelar edi√ß√£o"
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

              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-primary/20 px-2.5 py-1 text-[10px] font-extrabold text-primary-foreground ring-1 ring-primary/30">
                  N√≠vel {level.level}
                </span>
                <span className="rounded-full bg-white/[0.08] px-2.5 py-1 text-[10px] font-bold text-white/70 ring-1 ring-white/10">
                  {profile.xp} XP total
                </span>
              </div>
            </div>

            <div className="flex w-12 shrink-0 flex-col items-center rounded-[18px] border border-orange-300/25 bg-orange-400/10 px-1 py-2 text-center shadow-inner shadow-orange-300/5">
              <Flame className="h-4 w-4 text-orange-300" />
              <strong className="mt-0.5 text-lg leading-none text-◊Œ}∂âûÀk∫wµÁyëîÅîÅÖπΩ—îà(ÄÄÄÄÄÄÄÄÄÄÄÅΩπ±•ç¨ıÏ†§ÄÙ¯ÅŸΩ•êÅπÖÿ°ÏÅ—ºËÄàΩâ•â±•ÑàÅÙ•Ù(ÄÄÄÄÄÄÄÄÄÄº¯(ÄÄÄÄÄÄÄÄÄÄÒ)Ω’…πïÂM°Ω…—ç’–(ÄÄÄÄÄÄÄÄÄÄÄÅ•çΩ∏ıÌ9Ω—ïâΩΩ≠AïπÙ(ÄÄÄÄÄÄÄÄÄÄÄÅïÂïâ…Ω‹ÙâIï±ïµâ…îà(ÄÄÄÄÄÄÄÄÄÄÄÅ—•—±îÙâ5•π°ÖÃÅ9Ω—ÖÃà(ÄÄÄÄÄÄÄÄÄÄÄÅëïÕç…•¡—•Ω∏Ùâ5Ö…çáü’ïÃÅîÅ—…ïç°ΩÃÅÕÖ±ŸΩÃà(ÄÄÄÄÄÄÄÄÄÄÄÅΩπ±•ç¨ıÏ†§ÄÙ¯ÅŸΩ•êÅπÖÿ°ÏÅ—ºËÄàΩπΩ—ÖÃàÅÙ•Ù(ÄÄÄÄÄÄÄÄÄÄº¯(ÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄΩÕïç—•Ω∏¯((ÄÄÄÄÄÄÒÕïç—•Ω∏(ÄÄÄÄÄÄÄÅç±ÖÕÕ9ÖµîÙâÖπ•µÖ—îµÕ±•ëîµ’¿à(ÄÄÄÄÄÄÄÅÕ—Â±îıÌÏÅÖπ•µÖ—•Ωπï±Ö‰ËÄàƒ‘¡µÃà∞ÅÖπ•µÖ—•Ωπ•±±5ΩëîËÄââÖç≠›Ö…ëÃàÅıÙ(ÄÄÄÄÄÄ¯(ÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâµà¥»Åô±ï‡Å•—ïµÃµçïπ—ï»ÅùÖ¿¥»Å¡‡¥ƒà¯(ÄÄÄÄÄÄÄÄÄÄÒMï——•πùÃ»Åç±ÖÕÕ9ÖµîÙâ†¥Ã∏‘Å‹¥Ã∏‘Å—ï·–µ¡…•µÖ…‰àÄº¯(ÄÄÄÄÄÄÄÄÄÄÒMïç—•Ωπ1Öâï∞Åç±ÖÕÕ9ÖµîÙâµà¥¿Å¡‡¥¿à˘A…ïôïÀ©πç•ÖÃΩMïç—•Ωπ1Öâï∞¯(ÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâçÖ…êµï±ïŸÖ—ïêÅë•Ÿ•ëîµ‰Åë•Ÿ•ëîµâΩ…ëï»º‹¿ÅΩŸï…ô±Ω‹µ°•ëëï∏à¯(ÄÄÄÄÄÄÄÄÄÄÒ	•â±ïYï…Õ•ΩπMï±ïç—Ω»(ÄÄÄÄÄÄÄÄÄÄÄÅŸÖ±’îıÌâ•â±ïYï…Õ•ΩπÙ(ÄÄÄÄÄÄÄÄÄÄÄÅΩ¡ï∏ıÌŸï…Õ•Ωπ=¡ïπÙ(ÄÄÄÄÄÄÄÄÄÄÄÅΩπ=¡ïπ°ÖπùîıÌÕï—Yï…Õ•Ωπ=¡ïπÙ(ÄÄÄÄÄÄÄÄÄÄÄÅΩπMï±ïç–ıÏ°çΩëî§ÄÙ¯ÅÏ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅÕï—	•â±ïYï…Õ•Ω∏°çΩëî§Ï(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅŸΩ•êÅ’¡ëÖ—î°ÏÅâ•â±ï}Ÿï…Õ•Ω∏ËÅçΩëîÅÙ§Ï(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅÕï—Yï…Õ•Ωπ=¡ï∏°ôÖ±Õî§Ï(ÄÄÄÄÄÄÄÄÄÄÄÅıÙ(ÄÄÄÄÄÄÄÄÄÄº¯(ÄÄÄÄÄÄÄÄÄÄÒMï——•πùÕIΩ‹(ÄÄÄÄÄÄÄÄÄÄÄÅ•çΩ∏ıÌ°’…ç°Ù(ÄÄÄÄÄÄÄÄÄÄÄÅ—•—±îÙâΩµ’π•ëÖëîà(ÄÄÄÄÄÄÄÄÄÄÄÅÕ’â—•—±îıÌ¡…Ωô•±îπç°’…ç°}πÖµîÄ¸¸Äâ;çºÅŸ•πç’±ÖëºÅÑÅ’µÑÅ•ù…ï©ÑâÙ(ÄÄÄÄÄÄÄÄÄÄÄÅÖç—•Ω∏ıÏ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒâ’——Ω∏(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅΩπ±•ç¨ıÏ†§ÄÙ¯ÅÕï—°’…ç°•Ö±Ωù=¡ï∏°—…’î•Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅç±ÖÕÕ9ÖµîÙâµ•∏µ†¥‰ÅÕ°…•π¨¥¿Å…Ω’πëïêµô’±∞ÅâΩ…ëï»ÅâΩ…ëï»µ¡…•µÖ…‰ºƒ‘Åâúµ¡…•µÖ…‰Ωl¿∏¿ŸtÅ¡‡¥ÃÅ—ï·–µ·ÃÅôΩπ–µâΩ±êÅ—ï·–µ¡…•µÖ…‰Å—…ÖπÕ•—•Ω∏µçΩ±Ω…ÃÅ°ΩŸï»Èâúµ¡…•µÖ…‰ºƒ¿à(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌ¡…Ωô•±îπç°’…ç°}πÖµîÄ¸Äâ±—ï…Ö»àÄËÄâY•πç’±Ö»âÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩâ’——Ω∏¯(ÄÄÄÄÄÄÄÄÄÄÄÅÙ(ÄÄÄÄÄÄÄÄÄÄº¯(ÄÄÄÄÄÄÄÄÄÄÒMï——•πùÕIΩ‹(ÄÄÄÄÄÄÄÄÄÄÄÅ•çΩ∏ıÌ	ï±±Ù(ÄÄÄÄÄÄÄÄÄÄÄÅ—•—±îÙâ1ïµâ…ï—îÅëîÅïŸΩç•ΩπÖ∞à(ÄÄÄÄÄÄÄÄÄÄÄÅÕ’â—•—±îÙâ5Öπ”•¥ÅÕ’ÑÅΩôïπÕ•ŸÑÅÖ—•ŸÑ∏à(ÄÄÄÄÄÄÄÄÄÄÄÅÖç—•Ω∏ıÏ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒQΩùù±ïM›•—ç†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅç°ïç≠ïêıÌ¡…Ωô•±îππΩ—•ôÂ}ëïŸΩç•ΩπÖ±Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅΩπ°ÖπùîıÏ†§ÄÙ¯ÅŸΩ•êÅ’¡ëÖ—î°ÏÅπΩ—•ôÂ}ëïŸΩç•ΩπÖ∞ËÄÖ¡…Ωô•±îππΩ—•ôÂ}ëïŸΩç•ΩπÖ∞ÅÙ•Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÖ…•Ö1Öâï∞Ùâ—•ŸÖ»Å±ïµâ…ï—îÅëîÅëïŸΩç•ΩπÖ∞à(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄº¯(ÄÄÄÄÄÄÄÄÄÄÄÅÙ(ÄÄÄÄÄÄÄÄÄÄº¯(ÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄΩÕïç—•Ω∏¯((ÄÄÄÄÄÄÒ°’…ç°1•π≠•Ö±Ωú(ÄÄÄÄÄÄÄÅΩ¡ï∏ıÌç°’…ç°•Ö±Ωù=¡ïπÙ(ÄÄÄÄÄÄÄÅΩπ=¡ïπ°ÖπùîıÌÕï—°’…ç°•Ö±Ωù=¡ïπÙ(ÄÄÄÄÄÄÄÅ’Õï…%êıÌ¡…Ωô•±îπ•ëÙ(ÄÄÄÄÄÄÄÅç’……ïπ—°’…ç°%êıÌ¡…Ωô•±îπç°’…ç°}•ëÙ(ÄÄÄÄÄÄÄÅç’……ïπ—°’…ç°9ÖµîıÌ¡…Ωô•±îπç°’…ç°}πÖµïÙ(ÄÄÄÄÄÄÄÅΩπ1•π≠ïêıÏ°ç°’…ç†ËÅ°’…ç°=¡—•Ω∏ÅÅπ’±∞§ÄÙ¯(ÄÄÄÄÄÄÄÄÄÅÕï—A…Ωô•±î†°¿§ÄÙ¯(ÄÄÄÄÄÄÄÄÄÄÄÅ¿Ä¸ÅÏÄ∏∏π¿∞Åç°’…ç°}•êËÅç°’…ç†¸π•êÄ¸¸Åπ’±∞∞Åç°’…ç°}πÖµîËÅç°’…ç†¸ππÖµîÄ¸¸Åπ’±∞ÅÙÄËÅ¿∞(ÄÄÄÄÄÄÄÄÄÄ§(ÄÄÄÄÄÄÄÅÙ(ÄÄÄÄÄÄº¯((ÄÄÄÄÄÄÒŸÖ—Ö…A•ç≠ï…•Ö±Ωú(ÄÄÄÄÄÄÄÅΩ¡ï∏ıÌÖŸÖ—Ö…•Ö±Ωù=¡ïπÙ(ÄÄÄÄÄÄÄÅΩπ=¡ïπ°ÖπùîıÌÕï—ŸÖ—Ö…•Ö±Ωù=¡ïπÙ(ÄÄÄÄÄÄÄÅç’……ïπ—ŸÖ—Ö»ıÌ¡…Ωô•±îπÖŸÖ—Ö…}’…±Ù(ÄÄÄÄÄÄÄÅ’¡±ΩÖë•πúıÌ’¡±ΩÖë•πùÙ(ÄÄÄÄÄÄÄÅΩπMï±ïç—A…ïÕï–ıÏ°Õ…å§ÄÙ¯ÅŸΩ•êÅÕï±ïç—A…ïÕï—ŸÖ—Ö»°Õ…å•Ù(ÄÄÄÄÄÄÄÅΩπU¡±ΩÖë±•ç¨ıÏ†§ÄÙ¯ÅÏ(ÄÄÄÄÄÄÄÄÄÅÕï—ŸÖ—Ö…•Ö±Ωù=¡ï∏°ôÖ±Õî§Ï(ÄÄÄÄÄÄÄÄÄÅΩπA•ç≠•±î†§Ï(ÄÄÄÄÄÄÄÅıÙ(ÄÄÄÄÄÄº¯((ÄÄÄÄÄÄÒÕïç—•Ω∏(ÄÄÄÄÄÄÄÅç±ÖÕÕ9ÖµîÙâÖπ•µÖ—îµÕ±•ëîµ’¿ÅΩŸï…ô±Ω‹µ°•ëëï∏Å…Ω’πëïêµl»…¡·tÅâΩ…ëï»ÅâΩ…ëï»µâΩ…ëï»º‹¿ÅâúµÕ’…ôÖçîà(ÄÄÄÄÄÄÄÅÕ—Â±îıÌÏÅÖπ•µÖ—•Ωπï±Ö‰ËÄàƒ‡¡µÃà∞ÅÖπ•µÖ—•Ωπ•±±5ΩëîËÄââÖç≠›Ö…ëÃàÅıÙ(ÄÄÄÄÄÄ¯(ÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâô±ï‡Å•—ïµÃµçïπ—ï»ÅùÖ¿¥ÃÅ¡‡¥–Å¡‰¥Ã∏‘à¯(ÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâô±ï‡Å†¥ƒ¿Å‹¥ƒ¿Å•—ïµÃµçïπ—ï»Å©’Õ—•ô‰µçïπ—ï»Å…Ω’πëïêµ·∞ÅâúµÕ’ççïÕÃºƒ¿Å—ï·–µÕ’ççïÕÃà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒM°•ï±ë°ïç¨Åç±ÖÕÕ9ÖµîÙâ†¥‘Å‹¥‘àÄº¯(ÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâµ•∏µ‹¥¿Åô±ï‡¥ƒà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâ—ï·–µÕ¥ÅôΩπ–µâΩ±êà˘Ωπ—ÑÅ¡…Ω—ïù•ëÑΩ¿¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâ—ï·–µ·ÃÅ—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅMï’ÃÅëÖëΩÃÅîÅ¡…ïôïÀ©πç•ÖÃÅô•çÖ¥ÅŸ•πç’±ÖëΩÃÅÖºÅÕï‘ÅÖçïÕÕº∏(ÄÄÄÄÄÄÄÄÄÄÄÄΩ¿¯(ÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÒâ’——Ω∏(ÄÄÄÄÄÄÄÄÄÅ—Â¡îÙââ’——Ω∏à(ÄÄÄÄÄÄÄÄÄÅΩπ±•ç¨ıÏ†§ÄÙ¯ÅŸΩ•êÅÕ•ùπ=’–†•Ù(ÄÄÄÄÄÄÄÄÄÅç±ÖÕÕ9ÖµîÙâô±ï‡Å‹µô’±∞Å•—ïµÃµçïπ—ï»Å©’Õ—•ô‰µâï—›ïï∏ÅâΩ…ëï»µ–ÅâΩ…ëï»µâΩ…ëï»º‹¿Å¡‡¥–Å¡‰¥ÃÅ—ï·–µÕ¥ÅôΩπ–µÕïµ•âΩ±êÅ—ï·–µµ’—ïêµôΩ…ïù…Ω’πêÅ—…ÖπÕ•—•Ω∏µçΩ±Ω…ÃÅ°ΩŸï»ÈâúµëïÕ—…’ç—•Ÿîº‘Å°ΩŸï»È—ï·–µëïÕ—…’ç—•Ÿîà(ÄÄÄÄÄÄÄÄ¯(ÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâô±ï‡Å•—ïµÃµçïπ—ï»ÅùÖ¿¥»à¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒ1Ωù=’–Åç±ÖÕÕ9ÖµîÙâ†¥–Å‹¥–àÄº¯ÅMÖ•»ÅëÑÅçΩπ—Ñ(ÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÒ°ïŸ…ΩπI•ù°–Åç±ÖÕÕ9ÖµîÙâ†¥–Å‹¥–ÅΩ¡Öç•—‰¥–¿àÄº¯(ÄÄÄÄÄÄÄÄΩâ’——Ω∏¯(ÄÄÄÄÄÄΩÕïç—•Ω∏¯((ÄÄÄÄÄÄÒ¿(ÄÄÄÄÄÄÄÅç±ÖÕÕ9ÖµîÙâÖπ•µÖ—îµÕ±•ëîµ’¿Å¡à¥»Å—ï·–µçïπ—ï»Å—ï·–µlƒ≈¡·tÅ—ï·–µµ’—ïêµôΩ…ïù…Ω’πêº‹¿à(ÄÄÄÄÄÄÄÅÕ—Â±îıÌÏÅÖπ•µÖ—•Ωπï±Ö‰ËÄà»»¡µÃà∞ÅÖπ•µÖ—•Ωπ•±±5ΩëîËÄââÖç≠›Ö…ëÃàÅıÙ(ÄÄÄÄÄÄ¯(ÄÄÄÄÄÄÄÅ<Å•Õèµ¡’±ºÉ¬~BDÉäPÅÕ’ÑÅçÖµ•π°ÖëÑ∞Å’¥Å¡ÖÕÕºÅëîÅçÖëÑÅŸïË∏(ÄÄÄÄÄÄΩ¿¯(ÄÄÄÄΩë•ÿ¯(ÄÄ§Ï)Ù()ô’πç—•Ω∏ÅMïç—•Ωπ1Öâï∞°Ï(ÄÅç°•±ë…ï∏∞(ÄÅç±ÖÕÕ9ÖµîÄÙÄàà∞)ÙËÅÏ(ÄÅç°•±ë…ï∏ËÅIïÖç–πIïÖç—9ΩëîÏ(ÄÅç±ÖÕÕ9Öµî¸ËÅÕ—…•πúÏ)Ù§ÅÏ(ÄÅ…ï—’…∏Ä†(ÄÄÄÄÒ¿(ÄÄÄÄÄÅç±ÖÕÕ9ÖµîıÌÅµà¥»Å¡‡¥ƒÅ—ï·–µlƒ¡¡·tÅôΩπ–µï·—…ÖâΩ±êÅ’¡¡ï…çÖÕîÅ—…Öç≠•πúµl¿∏ƒŸïµtÅ—ï·–µµ’—ïêµôΩ…ïù…Ω’πêÄëÌç±ÖÕÕ9ÖµïıÅÙ(ÄÄÄÄ¯(ÄÄÄÄÄÅÌç°•±ë…ïπÙ(ÄÄÄÄΩ¿¯(ÄÄ§Ï)Ù()ô’πç—•Ω∏ÅM—Ö—%—ï¥°Ï(ÄÅ•çΩ∏ËÅ%çΩ∏∞(ÄÅ±Öâï∞∞(ÄÅŸÖ±’î∞(ÄÅ—•π–∞)ÙËÅÏ(ÄÅ•çΩ∏ËÅIïÖç–π±ïµïπ—QÂ¡îÏ(ÄÅ±Öâï∞ËÅÕ—…•πúÏ(ÄÅŸÖ±’îËÅÕ—…•πúÏ(ÄÅ—•π–ËÅÕ—…•πúÏ)Ù§ÅÏ(ÄÅ…ï—’…∏Ä†(ÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâçÖ…êµï±ïŸÖ—ïêÅô±ï‡Åµ•∏µ‹¥¿Å•—ïµÃµçïπ—ï»ÅùÖ¿¥ÃÅ¿¥Ã∏‘à¯(ÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâô±ï‡Å†¥ƒ¿Å‹¥ƒ¿ÅÕ°…•π¨¥¿Å•—ïµÃµçïπ—ï»Å©’Õ—•ô‰µçïπ—ï»Å…Ω’πëïêµlƒ—¡·tÅâúµÕ’…ôÖçî¥»à¯(ÄÄÄÄÄÄÄÄÒ%çΩ∏Åç±ÖÕÕ9ÖµîÙâ†µlƒ·¡·tÅ‹µlƒ·¡·tàÅÕ—Â±îıÌÏÅçΩ±Ω»ËÅ—•π–ÅıÙÄº¯(ÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâµ•∏µ‹¥¿à¯(ÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâ—…’πçÖ—îÅ—ï·–µâÖÕîÅôΩπ–µï·—…ÖâΩ±êÅ±ïÖë•πúµπΩπîà˘ÌŸÖ±’ïÙΩ¿¯(ÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâµ–¥ƒÅ—…’πçÖ—îÅ—ï·–µlÂ¡·tÅôΩπ–µâΩ±êÅ’¡¡ï…çÖÕîÅ—…Öç≠•πúµ›•ëï»Å—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà¯(ÄÄÄÄÄÄÄÄÄÅÌ±Öâï±Ù(ÄÄÄÄÄÄÄÄΩ¿¯(ÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄΩë•ÿ¯(ÄÄ§Ï)Ù()ô’πç—•Ω∏Å)Ω’…πïÂM°Ω…—ç’–°Ï(ÄÅ•çΩ∏ËÅ%çΩ∏∞(ÄÅïÂïâ…Ω‹∞(ÄÅ—•—±î∞(ÄÅëïÕç…•¡—•Ω∏∞(ÄÅΩπ±•ç¨∞)ÙËÅÏ(ÄÅ•çΩ∏ËÅIïÖç–π±ïµïπ—QÂ¡îÏ(ÄÅïÂïâ…Ω‹ËÅÕ—…•πúÏ(ÄÅ—•—±îËÅÕ—…•πúÏ(ÄÅëïÕç…•¡—•Ω∏ËÅÕ—…•πúÏ(ÄÅΩπ±•ç¨ËÄ†§ÄÙ¯ÅŸΩ•êÏ)Ù§ÅÏ(ÄÅ…ï—’…∏Ä†(ÄÄÄÄÒâ’——Ω∏(ÄÄÄÄÄÅ—Â¡îÙââ’——Ω∏à(ÄÄÄÄÄÅΩπ±•ç¨ıÌΩπ±•ç≠Ù(ÄÄÄÄÄÅç±ÖÕÕ9ÖµîÙâù…Ω’¿ÅçÖ…êµï±ïŸÖ—ïêÅ…ï±Ö—•ŸîÅµ•∏µ†µlƒÃ…¡·tÅΩŸï…ô±Ω‹µ°•ëëï∏Å¿¥–Å—ï·–µ±ïô–Å—…ÖπÕ•—•Ω∏µÖ±∞Å°ΩŸï»Ëµ—…ÖπÕ±Ö—îµ‰¥¿∏‘Å°ΩŸï»ÈâΩ…ëï»µ¡…•µÖ…‰ºÃ¿Å°ΩŸï»ÈÕ°ÖëΩ‹µ±úà(ÄÄÄÄ¯(ÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâ¡Ω•π—ï»µïŸïπ—ÃµπΩπîÅÖâÕΩ±’—îÄµ…•ù°–¥‡Äµ—Ω¿¥‡Å†¥»–Å‹¥»–Å…Ω’πëïêµô’±∞Åâúµ¡…•µÖ…‰ºƒ¿Åâ±’»¥…·∞Å—…ÖπÕ•—•Ω∏µ—…ÖπÕôΩ…¥Åù…Ω’¿µ°ΩŸï»ÈÕçÖ±î¥ƒ»‘àÄº¯(ÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâ…ï±Ö—•ŸîÅô±ï‡Å†µô’±∞Åô±ï‡µçΩ∞à¯(ÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâô±ï‡Å•—ïµÃµÕ—Ö…–Å©’Õ—•ô‰µâï—›ïï∏ÅùÖ¿¥»à¯(ÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâô±ï‡Å†¥ƒ¿Å‹¥ƒ¿Å•—ïµÃµçïπ—ï»Å©’Õ—•ô‰µçïπ—ï»Å…Ω’πëïêµlƒ—¡·tÅâúµ¡…•µÖ…‰ºƒ¿Å—ï·–µ¡…•µÖ…‰Å…•πú¥ƒÅ…•πúµ¡…•µÖ…‰ºƒ¿à¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒ%çΩ∏Åç±ÖÕÕ9ÖµîÙâ†¥‘Å‹¥‘àÄº¯(ÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÒ……Ω›U¡I•ù°–Åç±ÖÕÕ9ÖµîÙâ†¥–Å‹¥–Å—ï·–µµ’—ïêµôΩ…ïù…Ω’πêº–¿Å—…ÖπÕ•—•Ω∏µçΩ±Ω…ÃÅù…Ω’¿µ°ΩŸï»È—ï·–µ¡…•µÖ…‰àÄº¯(ÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâµ–¥ÃÅ—ï·–µlÂ¡·tÅôΩπ–µï·—…ÖâΩ±êÅ’¡¡ï…çÖÕîÅ—…Öç≠•πúµl¿∏ƒ—ïµtÅ—ï·–µ¡…•µÖ…‰à¯(ÄÄÄÄÄÄÄÄÄÅÌïÂïâ…Ω›Ù(ÄÄÄÄÄÄÄÄΩ¿¯(ÄÄÄÄÄÄÄÄÒ†ÃÅç±ÖÕÕ9ÖµîÙâµ–¥¿∏‘Å—ï·–µÕ¥ÅôΩπ–µï·—…ÖâΩ±êÅ±ïÖë•πúµ—•ù°–à˘Ì—•—±ïÙΩ†Ã¯(ÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâµ–¥ƒÅ—ï·–µlƒ¡¡·tÅ±ïÖë•πúµÕπ’úÅ—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà˘ÌëïÕç…•¡—•ΩπÙΩ¿¯(ÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄΩâ’——Ω∏¯(ÄÄ§Ï)Ù()ô’πç—•Ω∏ÅMï——•πùÕIΩ‹°Ï(ÄÅ•çΩ∏ËÅ%çΩ∏∞(ÄÅ—•—±î∞(ÄÅÕ’â—•—±î∞(ÄÅÖç—•Ω∏∞)ÙËÅÏ(ÄÅ•çΩ∏ËÅIïÖç–π±ïµïπ—QÂ¡îÏ(ÄÅ—•—±îËÅÕ—…•πúÏ(ÄÅÕ’â—•—±îËÅÕ—…•πúÏ(ÄÅÖç—•Ω∏ËÅIïÖç–πIïÖç—9ΩëîÏ)Ù§ÅÏ(ÄÅ…ï—’…∏Ä†(ÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâô±ï‡Å•—ïµÃµçïπ—ï»ÅùÖ¿¥ÃÅ¿¥–Å—…ÖπÕ•—•Ω∏µçΩ±Ω…ÃÅ°ΩŸï»ÈâúµÕ’…ôÖçî¥»º–¿à¯(ÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâô±ï‡Å†¥ƒ¿Å‹¥ƒ¿ÅÕ°…•π¨¥¿Å•—ïµÃµçïπ—ï»Å©’Õ—•ô‰µçïπ—ï»Å…Ω’πëïêµlƒ—¡·tÅâúµ¡…•µÖ…‰ºƒ¿Å—ï·–µ¡…•µÖ…‰Å…•πú¥ƒÅ…•πúµ¡…•µÖ…‰ºƒ¿à¯(ÄÄÄÄÄÄÄÄÒ%çΩ∏Åç±ÖÕÕ9ÖµîÙâ†¥‘Å‹¥‘àÄº¯(ÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâµ•∏µ‹¥¿Åô±ï‡¥ƒà¯(ÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâ—ï·–µÕ¥ÅôΩπ–µâΩ±êà˘Ì—•—±ïÙΩ¿¯(ÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâµ–¥¿∏‘Å—…’πçÖ—îÅ—ï·–µlƒ≈¡·tÅ—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà˘ÌÕ’â—•—±ïÙΩ¿¯(ÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÅÌÖç—•ΩπÙ(ÄÄÄÄΩë•ÿ¯(ÄÄ§Ï)Ù()ô’πç—•Ω∏ÅQΩùù±ïM›•—ç†°Ï(ÄÅç°ïç≠ïê∞(ÄÅΩπ°Öπùî∞(ÄÅÖ…•Ö1Öâï∞∞)ÙËÅÏ(ÄÅç°ïç≠ïêËÅâΩΩ±ïÖ∏Ï(ÄÅΩπ°ÖπùîËÄ†§ÄÙ¯ÅŸΩ•êÏ(ÄÅÖ…•Ö1Öâï∞ËÅÕ—…•πúÏ)Ù§ÅÏ(ÄÅ…ï—’…∏Ä†(ÄÄÄÄÒâ’——Ω∏(ÄÄÄÄÄÅΩπ±•ç¨ıÌΩπ°ÖπùïÙ(ÄÄÄÄÄÅ…Ω±îÙâÕ›•—ç†à(ÄÄÄÄÄÅÖ…•Ñµç°ïç≠ïêıÌç°ïç≠ïëÙ(ÄÄÄÄÄÅÖ…•Ñµ±Öâï∞ıÌÖ…•Ö1Öâï±Ù(ÄÄÄÄÄÅç±ÖÕÕ9ÖµîıÌÅ…ï±Ö—•ŸîÅ†¥‹Å‹¥ƒ»ÅÕ°…•π¨¥¿Å…Ω’πëïêµô’±∞Å—…ÖπÕ•—•Ω∏µçΩ±Ω…ÃÅë’…Ö—•Ω∏¥Ã¿¿ÄëÌç°ïç≠ïêÄ¸Äââúµ¡…•µÖ…‰àÄËÄââúµµ’—ïêâıÅÙ(ÄÄÄÄ¯(ÄÄÄÄÄÄÒÕ¡Ö∏(ÄÄÄÄÄÄÄÅç±ÖÕÕ9ÖµîıÌÅÖâÕΩ±’—îÅ—Ω¿¥¿∏‘Å±ïô–¥¿∏‘Å†¥ÿÅ‹¥ÿÅ…Ω’πëïêµô’±∞Åâúµ›°•—îÅÕ°ÖëΩ‹µµêÅ—…ÖπÕ•—•Ω∏µ—…ÖπÕôΩ…¥Åë’…Ö—•Ω∏¥Ã¿¿ÅïÖÕîµΩ’–ÄëÏ(ÄÄÄÄÄÄÄÄÄÅç°ïç≠ïêÄ¸Äâ—…ÖπÕ±Ö—îµ‡µlƒ∏»’…ïµtàÄËÄâ—…ÖπÕ±Ö—îµ‡¥¿à(ÄÄÄÄÄÄÄÅıÅÙ(ÄÄÄÄÄÄº¯(ÄÄÄÄΩâ’——Ω∏¯(ÄÄ§Ï)Ù()ô’πç—•Ω∏Å	•â±ïYï…Õ•ΩπMï±ïç—Ω»°Ï(ÄÅŸÖ±’î∞(ÄÅΩ¡ï∏∞(ÄÅΩπ=¡ïπ°Öπùî∞(ÄÅΩπMï±ïç–∞)ÙËÅÏ(ÄÅŸÖ±’îËÅ	•â±ïYï…Õ•Ω∏Ï(ÄÅΩ¡ï∏ËÅâΩΩ±ïÖ∏Ï(ÄÅΩπ=¡ïπ°ÖπùîËÄ°Ω¡ï∏ËÅâΩΩ±ïÖ∏§ÄÙ¯ÅŸΩ•êÏ(ÄÅΩπMï±ïç–ËÄ°çΩëîËÅ	•â±ïYï…Õ•Ω∏§ÄÙ¯ÅŸΩ•êÏ)Ù§ÅÏ(ÄÅçΩπÕ–Åç’……ïπ–ÄÙ(ÄÄÄÅ	%	1}YIM%=9}=AQ%=9Lπô•πê†°Ω¡—•Ω∏§ÄÙ¯ÅΩ¡—•Ω∏πçΩëîÄÙÙÙÅŸÖ±’î§Ä¸¸Å	%	1}YIM%=9}=AQ%=9Ml¡tÏ(ÄÅ…ï—’…∏Ä†(ÄÄÄÄ¯(ÄÄÄÄÄÄÒâ’——Ω∏(ÄÄÄÄÄÄÄÅ—Â¡îÙââ’——Ω∏à(ÄÄÄÄÄÄÄÅΩπ±•ç¨ıÏ†§ÄÙ¯ÅΩπ=¡ïπ°Öπùî°—…’î•Ù(ÄÄÄÄÄÄÄÅç±ÖÕÕ9ÖµîÙâô±ï‡Å‹µô’±∞Å•—ïµÃµçïπ—ï»ÅùÖ¿¥ÃÅ¿¥–Å—ï·–µ±ïô–Å—…ÖπÕ•—•Ω∏µçΩ±Ω…ÃÅ°ΩŸï»ÈâúµÕ’…ôÖçî¥»º–¿à(ÄÄÄÄÄÄ¯(ÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâô±ï‡Å†¥ƒ¿Å‹¥ƒ¿ÅÕ°…•π¨¥¿Å•—ïµÃµçïπ—ï»Å©’Õ—•ô‰µçïπ—ï»Å…Ω’πëïêµlƒ—¡·tÅâúµ¡…•µÖ…‰ºƒ¿Å—ï·–µ¡…•µÖ…‰Å…•πú¥ƒÅ…•πúµ¡…•µÖ…‰ºƒ¿à¯(ÄÄÄÄÄÄÄÄÄÄÒ	ΩΩ≠=¡ï∏Åç±ÖÕÕ9ÖµîÙâ†¥‘Å‹¥‘àÄº¯(ÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâµ•∏µ‹¥¿Åô±ï‡¥ƒà¯(ÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâ—ï·–µÕ¥ÅôΩπ–µâΩ±êà˘Yï…œçºÅëÑÅµâ±•ÑΩ¿¯(ÄÄÄÄÄÄÄÄÄÄÒ¿Åç±ÖÕÕ9ÖµîÙâµ–¥¿∏‘Å—…’πçÖ—îÅ—ï·–µlƒ≈¡·tÅ—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà˘Ìç’……ïπ–ππÖµïÙΩ¿¯(ÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâ…Ω’πëïêµô’±∞Åâúµ¡…•µÖ…‰Ωl¿∏¿›tÅ¡‡¥»∏‘Å¡‰¥ƒÅ—ï·–µlƒ¡¡·tÅôΩπ–µï·—…ÖâΩ±êÅ—ï·–µ¡…•µÖ…‰à¯(ÄÄÄÄÄÄÄÄÄÅÌç’……ïπ–πçΩëïÙ(ÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄΩâ’——Ω∏¯((ÄÄÄÄÄÄÒ•Ö±ΩúÅΩ¡ï∏ıÌΩ¡ïπÙÅΩπ=¡ïπ°ÖπùîıÌΩπ=¡ïπ°ÖπùïÙ¯(ÄÄÄÄÄÄÄÄÒ•Ö±ΩùΩπ—ïπ–¯(ÄÄÄÄÄÄÄÄÄÄÒ•Ö±Ωù!ïÖëï»¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒ•Ö±ΩùQ•—±î˘Yï…œçºÅëÑÅµâ±•ÑΩ•Ö±ΩùQ•—±î¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒ•Ö±ΩùïÕç…•¡—•Ω∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅÕçΩ±°ÑÅÑÅŸï…œçºÅï·•â•ëÑÅï¥Å±ßü’ïÃ∞ÅïÕ—’ëΩÃÅîÅµ’…Ö∞∏(ÄÄÄÄÄÄÄÄÄÄÄÄΩ•Ö±ΩùïÕç…•¡—•Ω∏¯(ÄÄÄÄÄÄÄÄÄÄΩ•Ö±Ωù!ïÖëï»¯(ÄÄÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâë•Ÿ•ëîµ‰Åë•Ÿ•ëîµâΩ…ëï»ÅΩŸï…ô±Ω‹µ°•ëëï∏Å…Ω’πëïê¥…·∞ÅâΩ…ëï»ÅâΩ…ëï»µâΩ…ëï»à¯(ÄÄÄÄÄÄÄÄÄÄÄÅÌ	%	1}YIM%=9}=AQ%=9LπµÖ¿†°Ω¡—•Ω∏§ÄÙ¯ÅÏ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅçΩπÕ–ÅÕï±ïç—ïêÄÙÅŸÖ±’îÄÙÙÙÅΩ¡—•Ω∏πçΩëîÏ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅ…ï—’…∏Ä†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒâ’——Ω∏(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅ≠ï‰ıÌΩ¡—•Ω∏πçΩëïÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅ—Â¡îÙââ’——Ω∏à(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅΩπ±•ç¨ıÏ†§ÄÙ¯ÅΩπMï±ïç–°Ω¡—•Ω∏πçΩëî•Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅç±ÖÕÕ9ÖµîıÌÅô±ï‡Å‹µô’±∞Å•—ïµÃµçïπ—ï»ÅùÖ¿¥ÃÅ¡‡¥–Å¡‰¥ÃÅ—ï·–µ±ïô–Å—…ÖπÕ•—•Ω∏µçΩ±Ω…ÃÄëÏ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÕï±ïç—ïêÄ¸Äââúµ¡…•µÖ…‰º‘àÄËÄâ°ΩŸï»ÈâúµÕ’…ôÖçî¥»à(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅıÅÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅç±ÖÕÕ9ÖµîıÌÅô±ï‡Å†¥ƒ¿Å‹¥ƒ¿ÅÕ°…•π¨¥¿Å•—ïµÃµçïπ—ï»Å©’Õ—•ô‰µçïπ—ï»Å…Ω’πëïêµ·∞Å—ï·–µ·ÃÅôΩπ–µâΩ±êÄëÏ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÕï±ïç—ïê(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¸Äââúµ¡…•µÖ…‰Å—ï·–µ¡…•µÖ…‰µôΩ…ïù…Ω’πêà(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄËÄââúµÕ’…ôÖçî¥»Å—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅıÅÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌΩ¡—•Ω∏πçΩëïÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâµ•∏µ‹¥¿Åô±ï‡¥ƒà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙââ±Ωç¨Å—ï·–µÕ¥ÅôΩπ–µÕïµ•âΩ±êà˘ÌΩ¡—•Ω∏ππÖµïÙΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙââ±Ωç¨Å—ï·–µ·ÃÅ—ï·–µµ’—ïêµôΩ…ïù…Ω’πêà¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌΩ¡—•Ω∏πëïÕç…•¡—•ΩπÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌÕï±ïç—ïêÄòòÄÒ°ïç¨Åç±ÖÕÕ9ÖµîÙâ†¥‘Å‹¥‘ÅÕ°…•π¨¥¿Å—ï·–µ¡…•µÖ…‰àÄº˘Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÏÖÕï±ïç—ïêÄòòÄ†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ°ïŸ…ΩπI•ù°–Åç±ÖÕÕ9ÖµîÙâ†¥–Å‹¥–ÅÕ°…•π¨¥¿Å—ï·–µµ’—ïêµôΩ…ïù…Ω’πêº–¿àÄº¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ•Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩâ’——Ω∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄ§Ï(ÄÄÄÄÄÄÄÄÄÄÄÅÙ•Ù(ÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄΩ•Ö±ΩùΩπ—ïπ–¯(ÄÄÄÄÄÄΩ•Ö±Ωú¯(ÄÄÄÄº¯(ÄÄ§Ï)Ù()ô’πç—•Ω∏ÅŸÖ—Ö…A•ç≠ï…•Ö±Ωú°Ï(ÄÅΩ¡ï∏∞(ÄÅΩπ=¡ïπ°Öπùî∞(ÄÅç’……ïπ—ŸÖ—Ö»∞(ÄÅ’¡±ΩÖë•πú∞(ÄÅΩπMï±ïç—A…ïÕï–∞(ÄÅΩπU¡±ΩÖë±•ç¨∞)ÙËÅÏ(ÄÅΩ¡ï∏ËÅâΩΩ±ïÖ∏Ï(ÄÅΩπ=¡ïπ°ÖπùîËÄ°Ω¡ï∏ËÅâΩΩ±ïÖ∏§ÄÙ¯ÅŸΩ•êÏ(ÄÅç’……ïπ—ŸÖ—Ö»ËÅÕ—…•πúÅÅπ’±∞Ï(ÄÅ’¡±ΩÖë•πúËÅâΩΩ±ïÖ∏Ï(ÄÅΩπMï±ïç—A…ïÕï–ËÄ°Õ…åËÅÕ—…•πú§ÄÙ¯ÅŸΩ•êÏ(ÄÅΩπU¡±ΩÖë±•ç¨ËÄ†§ÄÙ¯ÅŸΩ•êÏ)Ù§ÅÏ(ÄÅ…ï—’…∏Ä†(ÄÄÄÄÒ•Ö±ΩúÅΩ¡ï∏ıÌΩ¡ïπÙÅΩπ=¡ïπ°ÖπùîıÌΩπ=¡ïπ°ÖπùïÙ¯(ÄÄÄÄÄÄÒ•Ö±ΩùΩπ—ïπ–¯(ÄÄÄÄÄÄÄÄÒ•Ö±Ωù!ïÖëï»¯(ÄÄÄÄÄÄÄÄÄÄÒ•Ö±ΩùQ•—±î˘ÕçΩ±°ï»ÅÖŸÖ—Ö»Ω•Ö±ΩùQ•—±î¯(ÄÄÄÄÄÄÄÄÄÄÒ•Ö±ΩùïÕç…•¡—•Ω∏¯(ÄÄÄÄÄÄÄÄÄÄÄÅMï±ïç•ΩπîÅ’¥ÅÖŸÖ—Ö»Å¡…Ωπ—ºÅΩ‘ÅïπŸ•îÅÕ’ÑÅ¡ÀÕ¡…•ÑÅôΩ—º∏(ÄÄÄÄÄÄÄÄÄÄΩ•Ö±ΩùïÕç…•¡—•Ω∏¯(ÄÄÄÄÄÄÄÄΩ•Ö±Ωù!ïÖëï»¯(ÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâù…•êÅù…•êµçΩ±Ã¥‘ÅùÖ¿¥»∏‘à¯(ÄÄÄÄÄÄÄÄÄÅÌAIMQ}YQILπµÖ¿†°Õ…å§ÄÙ¯ÅÏ(ÄÄÄÄÄÄÄÄÄÄÄÅçΩπÕ–ÅÕï±ïç—ïêÄÙÅç’……ïπ—ŸÖ—Ö»ÄÙÙÙÅÕ…åÏ(ÄÄÄÄÄÄÄÄÄÄÄÅ…ï—’…∏Ä†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒâ’——Ω∏(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅ≠ï‰ıÌÕ…çÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅ—Â¡îÙââ’——Ω∏à(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅΩπ±•ç¨ıÏ†§ÄÙ¯ÅΩπMï±ïç—A…ïÕï–°Õ…å•Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅç±ÖÕÕ9ÖµîıÌÅ…ï±Ö—•ŸîÅÖÕ¡ïç–µÕ≈’Ö…îÅΩŸï…ô±Ω‹µ°•ëëï∏Å…Ω’πëïê¥…·∞ÅâúµÕ’…ôÖçî¥»Å…•πú¥»Å—…ÖπÕ•—•Ω∏µ—…ÖπÕôΩ…¥Å°ΩŸï»ÈÕçÖ±î¥ƒ¿‘ÅÖç—•ŸîÈÕçÖ±î¥‰‘ÄëÏ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÕï±ïç—ïêÄ¸Äâ…•πúµ¡…•µÖ…‰àÄËÄâ…•πúµ—…ÖπÕ¡Ö…ïπ–à(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅıÅÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÖ…•Ñµ±Öâï∞ÙâMï±ïç•ΩπÖ»ÅÖŸÖ—Ö»à(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ•µúÅÕ…åıÌÕ…çÙÅÖ±–ÙâŸÖ—Ö»àÅç±ÖÕÕ9ÖµîÙâ†µô’±∞Å‹µô’±∞ÅΩâ©ïç–µçΩŸï»àÅ±ΩÖë•πúÙâ±ÖÈ‰àÄº¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌÕï±ïç—ïêÄòòÄ†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Åç±ÖÕÕ9ÖµîÙâÖâÕΩ±’—îÅ•πÕï–¥¿Åô±ï‡Å•—ïµÃµçïπ—ï»Å©’Õ—•ô‰µçïπ—ï»Åâúµâ±Öç¨ºÃ¿à¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ°ïç¨Åç±ÖÕÕ9ÖµîÙâ†¥ÿÅ‹¥ÿÅ—ï·–µ›°•—îàÄº¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ•Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩâ’——Ω∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄ§Ï(ÄÄÄÄÄÄÄÄÄÅÙ•Ù(ÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÒâ’——Ω∏(ÄÄÄÄÄÄÄÄÄÅ—Â¡îÙââ’——Ω∏à(ÄÄÄÄÄÄÄÄÄÅΩπ±•ç¨ıÌΩπU¡±ΩÖë±•ç≠Ù(ÄÄÄÄÄÄÄÄÄÅë•ÕÖâ±ïêıÌ’¡±ΩÖë•πùÙ(ÄÄÄÄÄÄÄÄÄÅç±ÖÕÕ9ÖµîÙâµ–¥ƒÅô±ï‡Å‹µô’±∞Å•—ïµÃµçïπ—ï»Å©’Õ—•ô‰µçïπ—ï»ÅùÖ¿¥»Å…Ω’πëïê¥…·∞ÅâΩ…ëï»ÅâΩ…ëï»µâΩ…ëï»Å¡‰¥»∏‘Å—ï·–µÕ¥ÅôΩπ–µµïë•’¥Å—…ÖπÕ•—•Ω∏µçΩ±Ω…ÃÅ°ΩŸï»ÈâΩ…ëï»µ¡…•µÖ…‰º‘¿Å°ΩŸï»È—ï·–µ¡…•µÖ…‰Åë•ÕÖâ±ïêÈΩ¡Öç•—‰¥ÿ¿à(ÄÄÄÄÄÄÄÄ¯(ÄÄÄÄÄÄÄÄÄÅÌ’¡±ΩÖë•πúÄ¸Ä†(ÄÄÄÄÄÄÄÄÄÄÄÄÒ1ΩÖëï»»Åç±ÖÕÕ9ÖµîÙâ†¥–Å‹¥–ÅÖπ•µÖ—îµÕ¡•∏àÄº¯(ÄÄÄÄÄÄÄÄÄÄ§ÄËÄ†(ÄÄÄÄÄÄÄÄÄÄÄÄÒÖµï…ÑÅç±ÖÕÕ9ÖµîÙâ†¥–Å‹¥–àÄº¯(ÄÄÄÄÄÄÄÄÄÄ•Ù(ÄÄÄÄÄÄÄÄÄÅπŸ•Ö»ÅëºÅë•Õ¡ΩÕ•—•Ÿº(ÄÄÄÄÄÄÄÄΩâ’——Ω∏¯(ÄÄÄÄÄÄΩ•Ö±ΩùΩπ—ïπ–¯(ÄÄÄÄΩ•Ö±Ωú¯(ÄÄ§Ï)Ù()ô’πç—•Ω∏ÅAï…ô•±M≠ï±ï—Ω∏†§ÅÏ(ÄÅ…ï—’…∏Ä†(ÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâµ‡µÖ’—ºÅµÖ‡µ‹µ±úÅÕ¡Öçîµ‰¥–Å¡‡¥–Å¡–¥ÿà¯(ÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâô±ï‡Å•—ïµÃµçïπ—ï»Å©’Õ—•ô‰µâï—›ïï∏à¯(ÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâÕ¡Öçîµ‰¥»à¯(ÄÄÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâ†¥‘Å‹¥»¿ÅÖπ•µÖ—îµ¡’±ÕîÅ…Ω’πëïêµô’±∞ÅâúµÕ’…ôÖçî¥»àÄº¯(ÄÄÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâ†¥ÃÅ‹¥–¿ÅÖπ•µÖ—îµ¡’±ÕîÅ…Ω’πëïêµô’±∞ÅâúµÕ’…ôÖçî¥»àÄº¯(ÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâ†¥ƒ¿Å‹¥»–ÅÖπ•µÖ—îµ¡’±ÕîÅ…Ω’πëïêµô’±∞ÅâúµÕ’…ôÖçî¥»àÄº¯(ÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâçÖ…êµï±ïŸÖ—ïêÅΩŸï…ô±Ω‹µ°•ëëï∏à¯(ÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâô±ï‡Åô±ï‡µçΩ∞Å•—ïµÃµçïπ—ï»ÅùÖ¿¥ÃÅâúµÕ’…ôÖçî¥»ºÿ¿Å¡‡¥‘Å¡à¥ÿÅ¡–¥‹à¯(ÄÄÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâ†¥»‡Å‹¥»‡ÅÖπ•µÖ—îµ¡’±ÕîÅ…Ω’πëïêµl»·¡·tÅâúµÕ’…ôÖçî¥»àÄº¯(ÄÄÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâ†¥–Å‹¥Ã»ÅÖπ•µÖ—îµ¡’±ÕîÅ…Ω’πëïêµô’±∞ÅâúµÕ’…ôÖçî¥»àÄº¯(ÄÄÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâ†¥ÃÅ‹¥»–ÅÖπ•µÖ—îµ¡’±ÕîÅ…Ω’πëïêµô’±∞ÅâúµÕ’…ôÖçî¥»àÄº¯(ÄÄÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâ†¥»Å‹µô’±∞ÅµÖ‡µ‹µl»ÿ¡¡·tÅÖπ•µÖ—îµ¡’±ÕîÅ…Ω’πëïêµô’±∞ÅâúµÕ’…ôÖçî¥»àÄº¯(ÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙââΩ…ëï»µ–ÅâΩ…ëï»µâΩ…ëï»Å¿¥–à¯(ÄÄÄÄÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâ†¥ƒÿÅ‹µô’±∞ÅÖπ•µÖ—îµ¡’±ÕîÅ…Ω’πëïê¥…·∞ÅâúµÕ’…ôÖçî¥»àÄº¯(ÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâù…•êÅù…•êµçΩ±Ã¥»ÅùÖ¿¥ÃÅÕ¥Èù…•êµçΩ±Ã¥–à¯(ÄÄÄÄÄÄÄÅÌ……Ö‰πô…Ω¥°ÏÅ±ïπù—†ËÄ–ÅÙ§πµÖ¿†°|∞Å§§ÄÙ¯Ä†(ÄÄÄÄÄÄÄÄÄÄÒë•ÿÅ≠ï‰ıÌ•ÙÅç±ÖÕÕ9ÖµîÙâçÖ…êµï±ïŸÖ—ïêÅ†¥»–ÅÖπ•µÖ—îµ¡’±ÕîÅâúµÕ’…ôÖçî¥»ºÿ¿àÄº¯(ÄÄÄÄÄÄÄÄ§•Ù(ÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâçÖ…êµï±ïŸÖ—ïêÅ†¥ƒÿÅÖπ•µÖ—îµ¡’±ÕîÅâúµÕ’…ôÖçî¥»ºÿ¿àÄº¯(ÄÄÄÄÄÄÒë•ÿÅç±ÖÕÕ9ÖµîÙâçÖ…êµï±ïŸÖ—ïêÅ†¥–¿ÅÖπ•µÖ—îµ¡’±ÕîÅâúµÕ’…ôÖçî¥»ºÿ¿àÄº¯(ÄÄÄÄΩë•ÿ¯(ÄÄ§Ï)Ù