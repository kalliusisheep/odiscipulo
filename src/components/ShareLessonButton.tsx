import { useState } from "react";
import { Loader2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { generateShareImage } from "@/lib/share-image";

type ShareLessonButtonProps = {
  /** Identificador estável do conteúdo (lesson.id, ou "bible:<id>" etc.) — usado para cache do texto de IA. */
  lessonId: string;
  /** Título exibido no topo da imagem. */
  title: string;
  /** Resumo do conteúdo (introdução, versículos, aplicação…) usado como contexto para a IA escrever o texto. */
  shareContext: string;
  /** Imagem de fundo já existente no app. */
  backgroundSrc?: string;
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
  backgroundSrc = "/share-bg-cross.jpg",
  className,
}: ShareLessonButtonProps) {
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      let shareText = fallbackShareText(title);
      try {
        const { data, error } = await supabase.functions.invoke<{ text?: string }>("generate-share-text", {
          body: { lessonId, title, context: shareContext },
        });
        if (!error && data?.text) {
          shareText = data.text;
        }
      } catch (fnError) {
        console.error("Não foi possível gerar o texto de compartilhamento, usando texto padrão:", fnError);
      }

      const blob = await generateShareImage({ title, bodyText: shareText, backgroundSrc });
      const fileName = `${slugify(title)}.jpg`;
      const file = new File([blob], fileName, { type: "image/jpeg" });

      const nav = navigator as Navigator & {
        canShare?: (data?: ShareData) => boolean;
        share?: (data: ShareData) => Promise<void>;
      };

      if (nav.share && nav.canShare?.({ files: [file] })) {
        try {
          await nav.share({ files: [file], title });
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
    <button
      type="button"
      onClick={() => void handleShare()}
      disabled={sharing}
      className={
        className ??
        "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-glow disabled:opacity-60"
      }
    >
      {sharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
      {sharing ? "Preparando…" : "Compartilhar"}
    </button>
  );
}
