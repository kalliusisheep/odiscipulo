import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { normalizeUsername } from "@/lib/username";
import { toast } from "sonner";
import { ArrowLeft, AtSign, Church, Loader2, Search, UserCheck, UserPlus, Users } from "lucide-react";
import { formatPresence, isPresenceOnline } from "@/lib/presence";

export const Route = createFileRoute("/_authenticated/mensagens/novo")({
  component: NovaMensagemPage,
});

type Contact = {
  id: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
  last_seen_at: string | null;
};

type ChurchSuggestion = Contact & { church_name: string };

function NovaMensagemPage() {
  const nav = useNavigate();
  const [myId, setMyId] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [friendIds, setFriendIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // Busca real por ID (username) na tabela profiles do Supabase/Lovable Cloud
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Contact[]>([]);
  const [searchedOnce, setSearchedOnce] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  // Sugestões de contatos: outros usuários vinculados à mesma igreja
  const [churchMembers, setChurchMembers] = useState<ChurchSuggestion[]>([]);

  const loadContacts = async (currentMyId: string) => {
    const { data: fr } = await supabase.from("friendships").select("friend_id").eq("user_id", currentMyId);
    const ids = (fr ?? []).map((r) => r.friend_id as string);
    setFriendIds(new Set(ids));

    if (ids.length === 0) {
      setContacts([]);
      return;
    }

    const withPresence = await supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url, last_seen_at, updated_at")
      .in("id", ids);
    const profiles = withPresence.error
      ? ((await supabase.from("profiles").select("id, display_name, username, avatar_url, updated_at").in("id", ids)).data ?? []).map((p) => ({ ...p, last_seen_at: p.updated_at ?? null }))
      : (withPresence.data ?? []);

    const list = ((profiles ?? []) as Contact[])
      .filter((p) => p.username)
      .sort((a, b) => a.display_name.localeCompare(b.display_name));
    setContacts(list);
  };

  const loadChurchSuggestions = async (currentMyId: string) => {
    const { data: myProfile } = await supabase
      .from("profiles")
      .select("church_id")
      .eq("id", currentMyId)
      .maybeSingle();

    if (!myProfile?.church_id) {
      setChurchMembers([]);
      return;
    }

    // Todo usuário vinculado ao mesmo registro de igreja (mesmo church_id)
    // aparece como sugestão — o vínculo é exato, não uma comparação de texto.
    const withPresence = await supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url, last_seen_at, updated_at, church_name")
      .eq("church_id", myProfile.church_id)
      .neq("id", currentMyId)
      .limit(20);
    const members = withPresence.error
      ? ((await supabase
          .from("profiles")
          .select("id, display_name, username, avatar_url, updated_at, church_name")
          .eq("church_id", myProfile.church_id)
          .neq("id", currentMyId)
          .limit(20)).data ?? []).map((p) => ({ ...p, last_seen_at: p.updated_at ?? null }))
      : (withPresence.data ?? []);

    const list = ((members ?? []) as ChurchSuggestion[]).filter((m) => m.username && m.church_name);
    setChurchMembers(list);
  };

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        setLoading(false);
        return;
      }
      setMyId(u.user.id);
      await loadContacts(u.user.id);
      await loadChurchSuggestions(u.user.id);
      setLoading(false);
    })();
  }, []);

  // Busca por ID em tempo real (com pequeno atraso para não disparar a cada tecla)
  useEffect(() => {
    const q = normalizeUsername(query);
    if (!myId || q.length < 2) {
      setSearchResults([]);
      setSearchedOnce(false);
      return;
    }
    setSearching(true);
    const timeout = setTimeout(async () => {
      const withPresence = await supabase
        .from("profiles")
        .select("id, display_name, username, avatar_url, last_seen_at, updated_at")
        .ilike("username", `%${q}%`)
        .neq("id", myId)
        .limit(8);
      const data = withPresence.error
        ? ((await supabase
            .from("profiles")
            .select("id, display_name, username, avatar_url, updated_at")
            .ilike("username", `%${q}%`)
            .neq("id", myId)
            .limit(8)).data ?? []).map((p) => ({ ...p, last_seen_at: p.updated_at ?? null }))
        : (withPresence.data ?? []);

      setSearchResults(((data ?? []) as Contact[]).filter((p) => p.username));
      setSearching(false);
      setSearchedOnce(true);
    }, 350);
    return () => clearTimeout(timeout);
  }, [query, myId]);

  const filteredContacts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) => c.display_name.toLowerCase().includes(q) || c.username.toLowerCase().includes(q),
    );
  }, [contacts, query]);

  const addFriend = async (contact: Contact) => {
    if (!myId) return;
    setAddingId(contact.id);
    // Usa a função add_friend (SECURITY DEFINER) do banco, que insere a amizade
    // nos dois sentidos. Um insert direto na tabela friendships falha, pois a
    // policy de RLS só permite inserir linhas onde user_id = você mesmo.
    const { error } = await supabase.rpc("add_friend", { _target: contact.id });
    setAddingId(null);
    if (error) {
      toast.error("Não foi possível adicionar esse irmão(ã).");
      return;
    }
    toast.success(`${contact.display_name} agora é seu irmão(ã)!`);
    setFriendIds((prev) => new Set(prev).add(contact.id));
    await loadContacts(myId);
    await nav({ to: "/mensagens/$username", params: { username: contact.username } });
  };

  const isSearchingById = normalizeUsername(query).length >= 2;

  // Não sugere quem já é contato — esses já aparecem na lista de contatos.
  const churchSuggestions = useMemo(
    () => churchMembers.filter((m) => !friendIds.has(m.id)),
    [churchMembers, friendIds],
  );

  return (
    <div className="mx-auto min-h-[100dvh] max-w-lg space-y-5 px-4 pb-28 pt-5">
      <header className="rounded-[1.75rem] border border-primary/20 bg-gradient-to-br from-primary/12 via-surface to-surface p-4 shadow-lg shadow-primary/5">
        <div className="flex items-start gap-3">
          <Link
            to="/mensagens"
            aria-label="Voltar para mensagens"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-background/50 text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Comunhão</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Novo contato</h1>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Encontre um irmão da comunidade e comece uma conversa.
            </p>
          </div>
        </div>
      </header>

      <div className="relative rounded-2xl border border-border bg-surface/80 p-1.5 shadow-sm">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar pelo ID do seu irmão(ã)…"
          className="w-full rounded-xl bg-transparent py-3 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:bg-background/40"
        />
      </div>

      {loading && <p className="text-sm text-muted-foreground">Carregando…</p>}

      {/* Sugestões de contatos vinculados à mesma igreja — logo abaixo da busca */}
      {!loading && !isSearchingById && churchSuggestions.length > 0 && (
        <section className="space-y-2">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Church className="h-3.5 w-3.5" /> Sugestões da sua igreja
          </p>
          <ul className="space-y-2">
            {churchSuggestions.map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-3 rounded-2xl border border-primary/25 bg-surface-2 p-3"
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-surface">
                  {m.avatar_url && <img src={m.avatar_url} alt="" className="h-full w-full object-cover" />}
                  <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-surface-2 ${formatPresence(m.last_seen_at) === "Online agora" ? "bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.8)]" : "bg-rose-400 shadow-[0_0_7px_rgba(251,113,133,0.65)]"}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{m.display_name}</p>
                  <p className="truncate text-xs text-muted-foreground">@{m.username}</p>
                  <p className={`mt-0.5 truncate text-[11px] ${formatPresence(m.last_seen_at) === "Online agora" ? "font-semibold text-emerald-400" : "text-muted-foreground"}`}>
                    {formatPresence(m.last_seen_at)}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-primary">
                    <Church className="h-3 w-3 shrink-0" /> {m.church_name}
                  </p>
                </div>
                <button
                  onClick={() => void addFriend(m)}
                  disabled={addingId === m.id}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold transition-colors hover:border-primary disabled:opacity-60"
                >
                  {addingId === m.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <UserPlus className="h-3.5 w-3.5" />
                  )}
                  Adicionar
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Resultados da busca real por ID (usuários de verdade, sejam ou não seus contatos) */}
      {!loading && isSearchingById && (
        <section className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Resultados da busca
          </p>

          {searching && (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Buscando pelo ID…
            </p>
          )}

          {!searching && searchedOnce && searchResults.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
              Nenhum usuário encontrado com o ID "{normalizeUsername(query)}".
            </p>
          )}

          <ul className="space-y-2">
            {searchResults.map((p) => {
              const alreadyFriend = friendIds.has(p.id);
              return (
                <li
                  key={p.id}
                  className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-surface-2 p-3"
                >
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-surface">
                    {p.avatar_url && <img src={p.avatar_url} alt="" className="h-full w-full object-cover" />}
                    <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-surface-2 ${isPresenceOnline(p.last_seen_at) ? "bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.8)]" : "bg-rose-400 shadow-[0_0_7px_rgba(251,113,133,0.65)]"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.display_name}</p>
                    <p className="truncate text-xs text-muted-foreground">@{p.username}</p>
                    <p className={`mt-0.5 truncate text-[11px] ${isPresenceOnline(p.last_seen_at) ? "font-semibold text-emerald-400" : "text-muted-foreground"}`}>
                      {formatPresence(p.last_seen_at)}
                    </p>
                  </div>
                  {alreadyFriend ? (
                    <Link
                      to="/mensagens/$username"
                      params={{ username: p.username }}
                      className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                    >
                      <UserCheck className="h-3.5 w-3.5" /> Conversar
                    </Link>
                  ) : (
                    <button
                      onClick={() => void addFriend(p)}
                      disabled={addingId === p.id}
                      className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold transition-colors hover:border-primary disabled:opacity-60"
                    >
                      {addingId === p.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <UserPlus className="h-3.5 w-3.5" />
                      )}
                      Adicionar
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Lista de contatos já adicionados */}
      {!loading && !isSearchingById && (
        <>
          {contacts.length === 0 ? (
            <div className="card-elevated flex flex-col items-center gap-3 p-6 text-center">
              <Users className="h-10 w-10 text-primary" />
              <p className="text-sm font-semibold">Você ainda não tem contatos</p>
              <p className="text-xs text-muted-foreground">
                Solicite ao seu irmão(ã) o ID de usuário atribuído na hora da criação da conta.
              </p>

              <div className="mt-1 flex w-full items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-3 text-left">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <AtSign className="h-4 w-4" />
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Como encontrar o ID:</span> basta seu
                  irmão(ã) abrir a aba <span className="font-semibold text-primary">Perfil</span>. O ID
                  aparece logo abaixo da foto de perfil.
                </p>
              </div>
            </div>
          ) : (
            <>
              {filteredContacts.length === 0 ? (
                <p className="pt-4 text-center text-xs text-muted-foreground">
                  Nenhum contato encontrado para "{query}".
                </p>
              ) : (
                <ul className="space-y-2">
                  {filteredContacts.map((c) => (
                    <li key={c.id}>
                      <Link
                        to="/mensagens/$username"
                        params={{ username: c.username }}
                        className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2 p-3 transition-colors hover:border-primary/40"
                      >
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-surface">
                          {c.avatar_url && (
                            <img src={c.avatar_url} alt="" className="h-full w-full object-cover" />
                          )}
                          <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-surface-2 ${isPresenceOnline(c.last_seen_at) ? "bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.8)]" : "bg-rose-400 shadow-[0_0_7px_rgba(251,113,133,0.65)]"}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{c.display_name}</p>
                          <p className="truncate text-xs text-muted-foreground">@{c.username}</p>
                          <p className={`mt-0.5 truncate text-[11px] ${isPresenceOnline(c.last_seen_at) ? "font-semibold text-emerald-400" : "text-muted-foreground"}`}>
                            {formatPresence(c.last_seen_at)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
