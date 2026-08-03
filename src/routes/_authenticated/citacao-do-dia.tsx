import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2, Quote, Share2 } from "lucide-react";
import { toast } from "sonner";
import { authorImageFor, quoteOfTheDay } from "@/data/daily-quotes";
import { generateShareImage } from "@/lib/share-image";

export const Route = createFileRoute("/_authenticated/citacao-do-dia")({
  head: () => ({
    meta: [
      { title: "Citação do dia — O Discípulo" },
      {
        name: "description",
        content:
          "Uma citação cristã verificada por dia, com referência da obra original, para meditar e compartilhar.",
      },
      { property: "og:title", content: "Citação do dia — O Discípulo" },
      {
        property: "og:description",
        content: "Uma citação cristã verificada por dia, com referência da obra original.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DailyQuotePage,
});

function slugify(text: string): string {
  return (
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60) || "citacao"
  );
}

function DailyQuotePage() {
  const nav = useNavigate();
  const quote = quoteOfTheDay();
  const image = authorImageFor(quote.author);
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      // Mesma imagem de fundo e a mesma formatação (fonte, tamanhos e
      // alinhamentos) usadas ao compartilhar uma lição concluída.
      const blob = await generateShareImage({
        title: quote.author,
        bodyText: `“${quote.text}”\n\n${quote.source}`,
        backgroundSrc: "/share-bg-cross.jpg",
      });
      const fileName = `${slugify(quote.author)}-citacao.jpg`;
      const file = new File([blob], fileName, { type: "image/jpeg" });

      const navigatorWithShare = navigator as Navigator & {
        canShare?: (data?: ShareData) => boolean;
        share?: (data: ShareData) => Promise<void>;
      };

      if (navigatorWithShare.share && navigatorWithShare.canShare?.({ files: [file] })) {
        try {
          await navigatorWithShare.share({ files: [file], title: quote.author });
          return;
        } catch (shareError) {
          if (shareError instanceof DOMException && shareError.name === "AbortError") return;
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
      console.error("Erro ao gerar a imagem da citação:", err);
      toast.error("Não foi possível gerar a imagem. Tente novamente.");
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pt-6 pb-28">
      <button
        type="button"
        onClick={() => void nav({ to: "/home" })}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <h1 className="flex items-center gap-2 text-xl font-semibold">
        <Quote className="h-5 w-5 text-ancient" /> Citação do dia
      </h1>

      <section className="relative overflow-hidden rounded-3xl border border-ancient/25 bg-surface-2">
        <img
          src={image}
          alt={`Retrato ilustrado de ${quote.author}`}
          loading="lazy"
          width={768}
          height={768}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top opacity-20"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-surface-2/70 via-surface-2/85 to-surface-2" />
        <div className="relative p-6">
          <p className="font-serif text-xl leading-relaxed text-foreground">“{quote.text}”</p>
          <p className="mt-4 text-sm font-bold text-primary">— {quote.author}</p>
          <p className="mt-1 text-xs text-muted-foreground">{quote.source}</p>
        </div>
      </section>

      <button
        type="button"
        onClick={() => void handleShare()}
        disabled={sharing}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-glow disabled:opacity-60"
      >
        {sharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
        {sharing ? "Preparando…" : "Compartilhar citação"}
      </button>
    </div>
  );
}
