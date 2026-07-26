import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Search, UserPlus, Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/mensagens/novo")({
  component: NovaMensagemPage,
});

type Contact = {
  id: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
};

function NovaMensagemPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        setLoading(false);
        return;
      }
      const myId = u.user.id;

      const { data: fr } = await supabase
        .from("friendships")
        .select("friend_id")
        .eq("user_id", myId);
      const friendIds = (fr ?? []).map((r) => r.friend_id);

      if (friendIds.length === 0) {
        setContacts([]);
        setLoading(false);
        return;
      }

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, username, avatar_url")
        .in("id", friendIds);

      const list = ((profiles ?? []) as Contact[])
        .filter((p) => p.username)
        .sort((a, b) => a.display_name.localeCompare(b.display_name));
      setContacts(list);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.display_name.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q),
    );
  }, [contacts, query]);

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 pt-6 pb-24">
      <header className="flex items-center gap-3">
        <Link to="/mensagens" className="text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-xs text-muted-foreground">Iniciar conversa</p>
          <h1 className="text-xl font-semibold">Novo Contato</h1>
        </div>
      </header>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome ou @usuário…"
          className="w-full rounded-full border border-border bg-input py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      {loading && <p className="text-sm text-muted-foreground">Carregando contatos…</p>}

      {!loading && contacts.length === 0 && (
        <div className="card-elevated flex flex-col items-center gap-3 p-8 text-center">
          <Users className="h-10 w-10 text-primary" />
          <p className="text-sm font-semibold">Você ainda não tem contatos</p>
          <p className="text-xs text-muted-foreground">
            Adicione irmãos no Ranking para poder trocar mensagens com eles.
          </p>
          <Link
            to="/ranking"
            className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <UserPlus className="h-3.5 w-3.5" /> Adicionar contatos
          </Link>
        </div>
      )}

      {!loading && contacts.length > 0 && filtered.length === 0 && (
        <p className="pt-4 text-center text-xs text-muted-foreground">
          Nenhum contato encontrado para "{query}".
        </p>
      )}

      <ul className="space-y-2">
        {filtered.map((c) => (
          <li key={c.id}>
            <Link
              to="/mensagens/$username"
              params={{ username: c.username }}
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2 p-3 transition-colors hover:border-primary/40"
            >
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-surface">
                {c.avatar_url && (
                  <img src={c.avatar_url} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{c.display_name}</p>
                <p className="truncate text-xs text-muted-foreground">@{c.username}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
