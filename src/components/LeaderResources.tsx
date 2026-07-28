import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, ChevronRight, Crown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SUPPORT_CONTENTS = [
  ["Orgulho", "Tiago 4:6", "Deus se opõe ao orgulhoso e concede graça ao humilde. O discipulado começa quando reconhecemos que dependemos de Cristo, não da nossa imagem ou capacidade.", "Em qual conversa desta semana posso ouvir antes de responder?"],
  ["Pecado", "1 João 1:9", "Em Cristo há perdão real para quem confessa, abandona a ocultação e caminha na luz com a igreja.", "Ore com sinceridade e procure apoio pastoral quando a luta for persistente."],
  ["Casamento", "Efésios 5:25", "O casamento cristão é uma aliança de serviço, fidelidade e amor sacrificial.", "Conversem sobre uma forma concreta de servir um ao outro nesta semana."],
  ["Namoro", "1 Tessalonicenses 4:3-4", "O namoro deve honrar a santidade, a dignidade e a clareza de propósito.", "Definam limites que protejam a pureza e conversem com uma liderança confiável."],
  ["Pornografia", "1 Coríntios 6:18-20", "A libertação envolve arrependimento, graça, limites práticos, prestação de contas e cuidado responsável.", "Não lute sozinho: remova acessos e procure apoio maduro."],
  ["Vícios", "1 Coríntios 6:12", "Nada deve dominar o discípulo além de Cristo. Dependências podem exigir cuidado espiritual, médico e psicológico.", "Converse hoje com alguém seguro e busque suporte profissional quando necessário."],
  ["Dificuldade financeira", "Mateus 6:33", "Deus chama seu povo à confiança, ao trabalho honesto, à mordomia e à sabedoria para pedir ajuda.", "Faça um orçamento simples e procure orientação prática na igreja."],
  ["Vida devocional", "Marcos 1:35", "Vida devocional é ritmo de escuta da Palavra, oração e obediência que sustenta a fé.", "Separe dez minutos diários para ler um Evangelho e responder a Deus em oração."],
  ["Perdão", "Efésios 4:32", "Perdoar é entregar a vingança a Deus e recusar que a ofensa governe o coração.", "Nomeie a dor diante de Deus e converse com seu pastor em situações graves."],
  ["Empatia", "Romanos 12:15", "A empatia cristã se aproxima da alegria e da dor do próximo sem minimizar nem corrigir apressadamente.", "Pergunte a alguém como ele está e escute sem interromper."],
  ["Serviço", "1 Pedro 4:10", "Tempo, dons, recursos e oportunidades florescem quando são oferecidos para o bem da igreja e do próximo.", "Escolha uma necessidade concreta da sua comunidade e sirva de forma prática."],
  ["Preparo para liderar", "2 Timóteo 2:15", "Preparar-se para liderar inclui caráter, conhecimento bíblico, oração, serviço e disposição para ser corrigido.", "Peça a um líder uma área específica para estudar e uma oportunidade simples para servir."],
  ["Batismo", "Romanos 6:3-4", "O batismo é o testemunho público de união com a morte e ressurreição de Cristo.", "Converse com seu pastor sobre os próximos passos."],
] as const;

export function LeaderResources({ completedLessons }: { completedLessons?: number }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const selectedContent = selected === null ? null : SUPPORT_CONTENTS[selected];

  return (
    <>
      <section className="space-y-2">
        <h2 className="px-1 text-sm font-semibold text-muted-foreground">Formação de liderança</h2>
        <Link to="/modulo/$id" params={{ id: "como-ser-lider" }} className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-900 p-4 transition-all duration-300 hover:scale-[1.01]">
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="relative flex items-center gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10"><Crown className="h-5 w-5 text-white/90" /></div><div className="min-w-0 flex-1"><span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Módulo de liderança</span><p className="mt-0.5 truncate font-semibold text-white/95">Como ser um líder</p><p className="truncate text-xs text-white/60">10 trilhas para liderar à maneira de Cristo</p>{completedLessons !== undefined && <div className="mt-2.5 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10 p-[2px]"><div className="h-full rounded-full bg-gradient-to-r from-violet-300 to-indigo-200" style={{ width: `${completedLessons * 10}%` }} /></div><span className="text-[10px] font-bold text-white/70">{completedLessons}/10</span></div>}</div><ChevronRight className="h-4 w-4 text-white/60" /></div>
        </Link>
      </section>

      <section className="space-y-2">
        <h2 className="px-1 text-sm font-semibold text-muted-foreground">Apoio ao discipulado</h2>
        <button type="button" onClick={() => { setSelected(null); setOpen(true); }} className="group relative block w-full overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-black via-zinc-900 to-black p-4 text-left transition-all hover:scale-[1.01]">
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex items-center gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10"><BookOpen className="h-5 w-5 text-white" /></div><div className="min-w-0 flex-1"><span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Biblioteca pastoral</span><p className="mt-0.5 font-semibold text-white">Conteúdos para discípulos</p><p className="truncate text-xs text-white/60">13 temas para conversas e acompanhamento</p></div><ChevronRight className="h-4 w-4 text-white/60" /></div>
        </button>
      </section>

      <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-h-[85vh] overflow-y-auto"><DialogHeader><DialogTitle>Conteúdos para discípulos</DialogTitle><DialogDescription>Material de apoio bíblico que complementa a comunhão e o cuidado da igreja local.</DialogDescription></DialogHeader>{selectedContent ? <div className="space-y-4"><button type="button" onClick={() => setSelected(null)} className="text-sm text-muted-foreground hover:text-foreground">← Todos os temas</button><section className="rounded-2xl border border-border bg-surface p-4"><p className="text-xs font-semibold uppercase tracking-wider text-primary">Fundamentação bíblica</p><h3 className="mt-1 text-xl font-bold">{selectedContent[0]}</h3><p className="mt-3 font-medium text-primary">{selectedContent[1]}</p></section><section className="card-elevated p-4"><p className="text-sm leading-relaxed">{selectedContent[2]}</p></section><section className="rounded-2xl border border-ancient/30 bg-ancient/5 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-ancient">Passo prático</p><p className="mt-2 text-sm leading-relaxed">{selectedContent[3]}</p></section></div> : <div className="grid gap-2">{SUPPORT_CONTENTS.map(([title, verse], index) => <button type="button" key={title} onClick={() => setSelected(index)} className="flex items-center justify-between rounded-xl border border-border p-3 text-left hover:border-primary/60"><div><p className="text-sm font-semibold">{title}</p><p className="text-xs text-muted-foreground">{verse}</p></div><ChevronRight className="h-4 w-4 text-muted-foreground" /></button>)}</div>}</DialogContent></Dialog>
    </>
  );
}
