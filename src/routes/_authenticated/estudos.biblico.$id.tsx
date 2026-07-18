import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { bibleStudies } from "@/data/estudos";
import { verseText } from "@/data/content";
import { useApp } from "@/lib/app-context";
import { ArrowLeft, BookOpen, Check, X, NotebookPen, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/estudos/biblico/$id")({
  component: EstudoBiblicoPage,
});

function EstudoBiblicoPage() {
  const { id } = Route.useParams();
  const { bibleVersion } = useApp();
  const study = bibleStudies.find((s) => s.id === id);
  const notesKey = `disciple.notes.${id}`;
  const [notes, setNotes] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(notesKey);
    if (raw) setNotes(raw);
  }, [notesKey]);

  const saveNotes = (value: string) => {
    setNotes(value);
    if (typeof window !== "undefined") window.localStorage.setItem(notesKey, value);
  };

  if (!study) {
    return (
      <div className="mx-auto max-w-lg p-6 text-center">
        <p>Estudo não encontrado.</p>
        <Link to="/estudos" className="mt-4 inline-block text-primary underline">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 pt-6">
      <Link to="/estudos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Estudos
      </Link>

      <header className="space-y-2">
        <span className="inline-block rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
          Estudo Bíblico
        </span>
        <h1 className="text-2xl font-semibold">{study.title}</h1>
        <p className="text-sm text-muted-foreground">{study.description}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 font-serif italic text-ancient">
            <BookOpen className="h-3 w-3" /> {study.passage}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {study.minutes} min
          </span>
        </div>
      </header>

      {study.sections.map((sec, si) => (
        <section key={si} className="space-y-3">
          <h2 className="text-lg font-semibold">{sec.heading}</h2>
          <div className="space-y-2">
            {sec.body.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-foreground/90">{p}</p>
            ))}
          </div>

          {sec.verses?.map((v, vi) => (
            <div key={vi} className="rounded-2xl border border-ancient/30 bg-ancient/5 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-ancient">
                {v.ref} · {bibleVersion}
              </div>
              <p className="mt-1.5 font-serif text-base leading-relaxed">
                {verseText(v, bibleVersion)}
              </p>
              {v.originals && v.originals.length > 0 && (
                <div className="mt-3 space-y-1.5 border-t border-ancient/20 pt-3">
                  {v.originals.map((o, oi) => (
                    <div key={oi} className="text-xs">
                      <span className="font-serif text-ancient">{o.word}</span>
                      <span className="text-muted-foreground"> ({o.translit}, {o.lang}) — </span>
                      <span className="text-foreground/80">{o.meaning}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {sec.originals && sec.originals.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Línguas originais
              </p>
              <div className="space-y-1.5">
                {sec.originals.map((o, oi) => (
                  <div key={oi} className="text-xs">
                    <span className="font-serif text-ancient">{o.word}</span>
                    <span className="text-muted-foreground"> ({o.translit}, {o.lang}) — </span>
                    <span className="text-foreground/80">{o.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ))}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Quiz</h2>
        {study.quiz.map((q, qi) => {
          const picked = answers[qi];
          return (
            <div key={qi} className="card-elevated p-4">
              <p className="text-sm font-medium">{qi + 1}. {q.question}</p>
              <div className="mt-3 space-y-1.5">
                {q.options.map((opt, oi) => {
                  const isPicked = picked === oi;
                  const answered = picked !== undefined;
                  const isCorrect = oi === q.correctIndex;
                  const state = !answered
                    ? "border-border hover:border-primary/50"
                    : isPicked && isCorrect
                      ? "border-success bg-success/10"
                      : isPicked
                        ? "border-destructive bg-destructive/10"
                        : isCorrect
                          ? "border-success/50"
                          : "border-border opacity-60";
                  return (
                    <button
                      key={oi}
                      disabled={answered}
                      onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-all ${state}`}
                    >
                      <span>{opt}</span>
                      {answered && isPicked && (isCorrect
                        ? <Check className="h-4 w-4 text-success" />
                        : <X className="h-4 w-4 text-destructive" />)}
                    </button>
                  );
                })}
              </div>
              {picked !== undefined && q.explanation && (
                <p className="mt-2 text-xs text-muted-foreground">{q.explanation}</p>
              )}
            </div>
          );
        })}
      </section>

      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <NotebookPen className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-semibold">Minhas anotações</h2>
        </div>
        <p className="text-xs text-muted-foreground">Salvo automaticamente neste dispositivo.</p>
        <textarea
          value={notes}
          onChange={(e) => saveNotes(e.target.value)}
          rows={6}
          placeholder="O que Deus está te dizendo neste estudo?"
          className="w-full resize-none rounded-2xl border border-border bg-input px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
      </section>
    </div>
  );
}
