import { Link } from "@tanstack/react-router";
import { Quote } from "lucide-react";
import { authorImageFor, quoteOfTheDay } from "@/data/daily-quotes";

/**
 * Card "Citação do dia" exibido na tela inicial, acima do primeiro módulo.
 * Mostra a citação sobre uma foto translúcida do autor citado e leva à
 * tela dedicada (com compartilhamento em imagem).
 */
export function DailyQuoteCard() {
  const quote = quoteOfTheDay();
  const image = authorImageFor(quote.author);

  return (
    <Link
      to="/citacao-do-dia"
      className="group relative block overflow-hidden rounded-3xl border border-ancient/25 bg-surface-2"
    >
      <img
        src={image}
        alt={`Retrato ilustrado de ${quote.author}`}
        loading="lazy"
        width={768}
        height={768}
        className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/2 object-cover object-top opacity-20 transition-opacity duration-300 group-hover:opacity-30"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-surface-2 via-surface-2/85 to-transparent" />

      <div className="relative p-5">
        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-ancient">
          <Quote className="h-3.5 w-3.5" /> Citação do dia
        </p>
        <p className="mt-2 font-serif text-base leading-snug text-foreground line-clamp-4">
          “{quote.text}”
        </p>
        <p className="mt-2 text-xs font-semibold text-muted-foreground">— {quote.author}</p>
      </div>
    </Link>
  );
}
