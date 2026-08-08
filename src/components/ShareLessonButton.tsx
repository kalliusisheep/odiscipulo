import { useState } from "react";
import { Check, Loader2, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getPreparedLessonShareText } from "@/data/lesson-share-texts";
import { generateShareImage } from "@/lib/share-image";

const SHARE_BACKGROUND_BASE = `${import.meta.env.BASE_URL.replace(/\/?$/, "/")}share-backgrounds/`;
const SHARE_BACKGROUNDS = [
  { src: `${SHARE_BACKGROUND_BASE}design-sem-nome.jpg`, label: "Horizonte" },
  { src: `${SHARE_BACKGROUND_BASE}design-sem-nome-1.jpg`, label: "Caminho dourado" },
  { src: `${SHARE_BACKGROUND_BASE}design-sem-nome-2.jpg`, label: "Montanhas" },
  { src: `${SHARE_BACKGROUND_BASE}design-sem-nome-3.jpg`, label: "Árvore no deserto" },
  { src: `${SHARE_BACKGROUND_BASE}design-sem-nome-4.jpg`, label: "Noite serena" },
  { src: `${SHARE_BACKGROUND_BASE}design-sem-nome-5.jpg`, label: "Floresta" },
  { src: `${SHARE_BACKGROUND_BASE}design-sem-nome-6.jpg`, label: "Mesa no cânion" },
  { src: `${SHARE_BACKGROUND_BASE}design-sem-nome-7.jpg`, label: "Mar e cruz" },
  { src: `${SHARE_BACKGROUND_BASE}design-sem-nome-8.jpg`, label: "Novo horizonte" },
] as const;

type ShareLessonButtonProps = {
  /** Identificador estável do conteúdo (lesson.id, ou "bible:<id>" etc.) — usado para cache do texto de IA. */
  lessonId: string;
  /** Título exibido no topo da imagem. */
  title: string;
  /** Resumo do conteúdo (introdução, versículos, aplicação…) usado como contexto para a IA escrever o texto. */
  shareContext: string;
  /** Imagem de fundo já existente no app. */
  backgroundSrc?: string;
  /** Referência exibida na arte final, quando o conteúdo é um versículo. */
  referenceText?: string;
  className?: string;
};

function slugify(text: string): string {
  const base = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base.slice(0, 60) || "licao";
}

function fallbackShareText(title: string): string {
  return (
    `Hoje eu passei um tempo estudando sobre "${title}" e queria muito dividir isso com você. ` +
    `Tem coisas que a gente aprende que não dá pra guardar só pra si — precisam ser compartilhadas. ` +
    `Se você tiver um tempinho livre, separa alguns minutos pra pensar sobre isso também. ` +
    `Acho que pode fazer diferença no seu dia, assim como fez no meu.`
  );
}

export function ShareLessonButton({
  lessonId,
  title,
  shareContext,
  backgroundSrc = SHARE_BACKGROUNDS[0].src,
  referenceText,
  className,
}: ShareLessonButtonProps) {
  const [sharing, setSharing] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState(
    SHARE_BACKGROUNDS.some((background) => background.src === backgroundSrc)
      ? backgroundSrc
      : SHARE_BACKGROUNDS[0].src,
  );

  const handleShare = async () => {
    if (sharing) return;
    setPickerOpen(false);
    setSharing(true);
    try {
      let shareText = getPreparedLessonShareText(lessonId) ?? fallbackShareText(title);
      try {
        const { data, error } = await supabase.functions.invoke<{ text?: string; cached?: boolean }>("generate-share-text", {
          body: { lessonId, title, context: shareContext },
        });
        if (!error && data?.text) {
          shareText =
            data.cached === false
              ? (getPreparedLessonShareText(lessonId) ?? data.text)
              : data.text;
        }
      } catch (fnError) {
        console.error("Não foi possível gerar o texto de compartilhamento, usando texto padrão:", fnError);
      }

      const blob = await generateShareImage({ title, bodyText: shareText, backgroundSrc: selectedBackground, referenceText });
      const fileName = `${slugify(title)}.jpg`;
      const file = new File([blob], fileName, { type: "image/jpeg" });

      const nav = navigator as Navigator & {
        canShare?: (data?: ShareData) => boolean;
        share?: (data: ShareData) => Promise<void>;
      };

      const canShareFile = nav.canShare ? nav.canShare({ files: [file] }) : true;
      if (nav.share && canShareFile) {
        try {
          await nav.share({ files: [file], title });
          toast.success("Imagem compartilhada!");
          return;
        } catch (shareError) {
          if (shareError instanceof DOMException && shareError.name === "AbortError") {
            return;
          }
          console.error("navigator.share falhou, baixando a imagem em vez disso:", shareError);
        }
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      toast.success("Imagem salva! Agora é só compartilhar onde quiser.");
    } catch (err) {
      console.error("Erro ao preparar compartilhamento:", err);
      toast.error("Não foi possível preparar a imagem para compartilhar. Tente novamente.");
    } finally {
      setSharing(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (!sharing) setPickerOpen(true);
        }}
        disabled={sharing}
        className={
          className ??
          "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-glow disabled:opacity-60"
        }
      >
        {sharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
        {sharing ? "Preparando…" : "Compartilhar"}
      </button>

      {pickerOpen && (
        <div className="fixed inset-0 z-[80] flex h-[100dvh] flex-col overflow-hidden bg-background/98 px-4 pt-5 backdrop-blur-xl">
          <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col">
            <header className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">
                  Compartilhar
                </p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
                  Escolha um fundo
                </h2>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                  Selecione a imagem que vai receber seu texto. A imagem final será preparada para compartilhar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Fechar seleção de fundo"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="mt-6 min-h-0 flex-1 overflow-y-auto pb-32 [scrollbar-width:thin]">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {SHARE_BACKGROUNDS.map((background) => {
                const selected = selectedBackground === background.src;
                return (
                  <button
                    key={background.src}
                    type="button"
                    onClick={() => setSelectedBackground(background.src)}
                    className={`group relative aspect-[3/4] overflow-hidden rounded-2xl border-2 text-left transition-all hover:-translate-y-0.5 ${
                      selected
                        ? "border-primary ring-4 ring-primary/20"
                        : "border-border/70 hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={background.src}
                      alt={`Fundo ${background.label}`}
                      loading="eager"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-10">
                      <span className="text-xs font-bold text-white">{background.label}</span>
                    </div>
                    {selected && (
                      <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                );
              })}
              </div>
            </div>

            <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-xl">
              <div className="mx-auto flex max-w-3xl items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">
                    {SHARE_BACKGROUNDS.find((background) => background.src === selectedBackground)?.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Fundo selecionado</p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleShare()}
                  className="rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-95"
                >
                  Usar este fundo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
