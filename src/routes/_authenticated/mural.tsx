import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BookHeart, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/mural")({
  component: MuralPage,
});

type Post = {
  id: string;
  author_name: string;
  body: string;
  is_answered: boolean;
  amens_seed: number;
  created_at: string;
  user_id: string | null;
};
type Diary = { id: string; lesson_title: string; question: string; answer: string; created_at: string };

function MuralPage() {
  const [tab, setTab] = useState<"clamores" | "diario">("clamores");
  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Comunidade</p>
          <h1 className="text-xl font-semibold">Mural</h1>
        </div>
        <ThemeToggle />
      </header>

      <div className="overflow-hidden rounded-2xl">
        <img
          src="/mural-banner.jpg"
          alt="Ovelha em oração em meio à tempestade"
          className="h-auto w-full object-cover"
        />
      </div>

      <div className="relative flex rounded-full border border-border bg-surface p-1 text-sm">
        <button
          onClick={() => setTab("clamores")}
          className={`flex-1 rounded-full py-2 font-medium transition-all ${tab === "clamores" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Clamores
        </button>
        <button
          onClick={() => setTab("diario")}
          className={`flex-1 rounded-full py-2 font-medium transition-all ${tab === "diario" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Meu Diário
        </button>
      </div>

      {tab === "clamores" ? <Clamores /> : <Diario />}
    </div>
  );
}

function Clamores() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [myAmens, setMyAmens] = useState<Set<string>>(new Set());
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [text, setText] = useState("");
  const [me, setMe] = useState<{ id: string; name: string } | null>(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (u.user) {
        const { data: prof } = await supabase.from("profiles").select("display_name").eq("id", u.user.id).maybeSingle();
        setMe({ id: u.user.id, name: prof?.display_name ?? u.user.email!.split("@")[0] });
      }
      await refresh(u.user?.id ?? null);
    })();
  }, []);

  const refresh = async (uid: string | null) => {
    const { data: p } = await supabase.from("mural_posts").select("*").order("created_at", { ascending: false });
    const list = (p ?? []) as Post[];
    setPosts(list);
    const { data: amens } = await supabase.from("mural_amens").select("post_id, user_id");
    const c: Record<string, number> = {};
    const mine = new Set<string>();
    for (const p of list) c[p.id] = p.amens_seed;
    for (const a of amens ?? []) {
      c[a.post_id] = (c[a.post_id] ?? 0) + 1;
      if (uid && a.user_id === uid) mine.add(a.post_id);
    }
    setCounts(c);
    setMyAmens(mine);
  };

  const clamar = async () => {
    if (!text.trim() || !me || posting) return;
    setPosting(true);
    const { error } = await supabase.from("mural_posts").insert({
      user_id: me.id,
      author_name: me.name,
      body: text.trim(),
    });
    setPosting(false);
    if (!error) {
      setText("");
      await refresh(me.id);
    }
  };

  const toggleAmen = async (postId: string) => {
    if (!me) return;
    const has = myAmens.has(postId);
    if (has) {
      await supabase.from("mural_amens").delete().eq("post_id", postId).eq("user_id", me.id);
    } else {
      await supabase.from("mural_amens").insert({ post_id: postId, user_id: me.id });
    }
    await refresh(me.id);
  };

  return (
    <div className="space-y-4">
      <div className="card-elevated p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Escreva seu clamor para o mural…"
          className="w-full resize-none rounded-xl border border-border bg-input p-3 text-sm outline-none focus:border-primary"
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={() => void clamar()}
            disabled={!text.trim() || posting}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-glow disabled:opacity-50"
          >
            Clamar
          </button>
        </div>
      </div>

      {posts.map((p) => (
        <article key={p.id} className="card-elevated p-4">
          <header className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              {p.author_name[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{p.author_name}</p>
              <p className="text-[11px] text-muted-foreground">
                {formatDistanceToNow(new Date(p.created_at), { locale: ptBR, addSuffix: true })}
              </p>
            </div>
            {p.is_answered && (
              <span className="inline-flex items-center gap-1 rounded-full bg-success/20 px-2.5 py-0.5 text-[10px] font-semibold text-success">
                <CheckCircle2 className="h-3 w-3" /> Pedido Respondido!
              </span>
            )}
          </header>
          <p className="mt-3 text-sm leading-relaxed">{p.body}</p>
          <button
            onClick={() => void toggleAmen(p.id)}
            className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              myAmens.has(p.id)
                ? "border-primary bg-primary/20 text-primary"
                : "border-border bg-background text-muted-foreground hover:border-primary/40"
            }`}
          >
            Amém 🙏 <span className="font-semibold">({counts[p.id] ?? 0})</span>
          </button>
        </article>
      ))}
    </div>
  );
}

function Diario() {
  const [entries, setEntries] = useState<Diary[]>([]);

  useEffect(() => {
    void (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase.from("diary_entries").select("*").eq("user_id", u.user.id).order("created_at", { ascending: false });
      setEntries((data ?? []) as Diary[]);
    })();
  }, []);

  if (entries.length === 0) {
    return (
      <div className="card-elevated flex flex-col items-center px-6 py-12 text-center">
        <BookHeart className="mb-3 h-10 w-10 text-primary" />
        <h3 className="font-semibold">Seu diário está aguardando</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete uma lição — sua resposta de reflexão será salva aqui automaticamente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((e) => (
        <article key={e.id} className="card-elevated p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{e.lesson_title}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(e.created_at), { locale: ptBR, addSuffix: true })}
          </p>
          <p className="mt-3 text-sm font-medium">{e.question}</p>
          <p className="mt-2 rounded-xl bg-surface-2 p-3 text-sm leading-relaxed text-foreground/90 scripture">
            "{e.answer}"
          </p>
        </article>
      ))}
    </div>
  );
}
