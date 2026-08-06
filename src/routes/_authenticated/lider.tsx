import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  ChevronRight,
  Loader2,
  MessageCircle,
  Network,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { normalizeUsername } from "@/lib/username";
import { DiscipleshipProgress } from "@/components/DiscipleshipProgress";

export const Route = createFileRoute("/_authenticated/lider")({
  component: LiderPage,
});

const db = supabase as any;

const TEMAS = [
  "Orgulho", "Pecado", "Casamento", "Namoro", "Pornografia", "Vícios (álcool/drogas)",
  "Dificuldade financeira", "Vida devocional", "Perdão", "Empatia", "Serviço (Mordomia)",
  "Preparo para liderar", "Batismo",
];
type Person = { id: string; display_name: string; username: string | null; avatar_url: string | null; xp: number; streak: number };
type Group = { id: string; name: string; topic: string; created_at: string; members: number };
type Meeting = { id: string; title: string; scheduled_at: string; location: string | null };

function LiderPage() {
  const navigate = useNavigate();
  const [myId, setMyId] = useState<string | null>(null);
  const [discipulos, setDiscipulos] = useState<Person[]>([]);
  const [contacts, setContacts] = useState<Person[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState<"disciple" | "group" | "meeting" | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Person[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [groupName, setGroupName] = useState("");
  const [groupTopic, setGroupTopic] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("");

  const load = async (leaderId: string) => {
    const [linksResponse, contactsResponse, groupsResponse, meetingsResponse] = await Promise.all([
      db.from("leader_disciples").select("disciple_id").eq("leader_id", leaderId),
      db.from("friendships").select("friend_id").eq("user_id", leaderId),
      db.from("groups").select("id, name, topic, created_at").eq("leader_id", leaderId).order("created_at", { ascending: false }),
      db.from("leader_meetings").select("id, title, scheduled_at, location").eq("leader_id", leaderId).gte("scheduled_at", new Date().toISOString()).order("scheduled_at").limit(3),
    ]);

    const discipleIds = (linksResponse.data ?? []).map((row: { disciple_id: string }) => row.disciple_id);
    const contactIds = (contactsResponse.data ?? []).map((row: { friend_id: string }) => row.friend_id);
    const allIds = [...new Set([...discipleIds, ...contactIds])];
    const profilesResponse = allIds.length
      ? await db.from("profiles").select("id, display_name, username, avatar_url, xp, streak").in("id", allIds)
      : { data: [] };
    const people = (profilesResponse.data ?? []) as Person[];
    setDiscipulos(people.filter((person) => discipleIds.includes(person.id)));
    setContacts(people.filter((person) => contactIds.includes(person.id)));

    const rawGroups = groupsResponse.data ?? [];
    const groupIds = rawGroups.map((group: { id: string }) => group.id);
    const memberResponse = groupIds.length
      ? await db.from("group_members").select("group_id").in("group_id", groupIds)
      : { data: [] };
    const totals = new Map<string, number>();
    (memberResponse.data ?? []).forEach((member: { group_id: string }) => totals.set(member.group_id, (totals.get(member.group_id) ?? 0) + 1));
    setGroups(rawGroups.map((group: Omit<Group, "members">) => ({ ...group, members: totals.get(group.id) ?? 0 })));
    setMeetings((meetingsResponse.data ?? []) as Meeting[]);
  };

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setMyId(data.user.id);
        await load(data.user.id);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const query = normalizeUsername(search);
    if (!myId || query.length < 2) {
      setResults([]);
      return;
    }
    const timer = window.setTimeout(async () => {
      const { data } = await db
        .from("profiles")
        .select("id, display_name, username, avatar_url, xp, streak")
        .ilike("username", `%${query}%`)
        .neq("id", myId)
        .limit(8);
      setResults((data ?? []) as Person[]);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search, myId]);

  const availablePeople = useMemo(() => {
    const byId = new Map<string, Person>();
    [...contacts, ...discipulos].forEach((person) => byId.set(person.id, person));
    return [...byId.values()].sort((a, b) => a.display_name.localeCompare(b.display_name));
  }, [contacts, discipulos]);

  const addDisciple = async (person: Person) => {
    if (!myId) return;
    setSaving(true);
    const { error } = await db.from("leader_disciples").insert({ leader_id: myId, disciple_id: person.id });
    setSaving(false);
    if (error && error.code !== "23505") {
      toast.error("Não foi possível adicionar este discípulo.");
      return;
    }
    toast.success(`${person.display_name} foi adicionado(a) aos seus discípulos.`);
    setSearch("");
    await load(myId);
  };

  const createGroup = async () => {
    if (!myId || !groupName.trim() || !groupTopic || selectedIds.size === 0) {
      toast.error("Informe nome, tema e ao menos um membro.");
      return;
    }
    setSaving(true);
    const { data: group, error } = await db
      .from("groups")
      .insert({ name: groupName.trim(), topic: groupTopic, leader_id: myId })
      .select("id")
      .single();
    if (!error && group) {
      const { error: membersError } = await db
        .from("group_members")
        .insert([...selectedIds].map((disciple_id) => ({ group_id: group.id, disciple_id })));
      if (membersError) {
        toast.error("O grupo foi criado, mas não foi possível incluir todos os membros.");
      } else {
        toast.success("Grupo de discipulado criado com sucesso.");
      }
    } else {
      toast.error("Não foi possível criar o grupo.");
    }
    setSaving(false);
    if (!error) {
      setDialog(null);
      setGroupName("");
      setGroupTopic("");
      setSelectedIds(new Set());
      await load(myId);
    }
  };

  const createMeeting = async () => {
    if (!myId || !meetingTitle.trim() || !meetingDate) {
      toast.error("Informe o título e a data do encontro.");
      return;
    }
    setSaving(true);
    const { error } = await db.from("leader_meetings").insert({
      leader_id: myId,
      title: meetingTitle.trim(),
      scheduled_at: new Date(meetingDate).toISOString(),
      location: meetingLocation.trim() || null,
    });
    setSaving(false);
    if (error) {
      toast.error("Não foi possível agendar o encontro.");
      return;
    }
    toast.success("Encontro agendado.");
    setDialog(null);
    setMeetingTitle(""); setMeetingDate(""); setMeetingLocation("");
    await load(myId);
  };

  const toggleMember = (id: string) => setSelectedIds((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 pb-24 pt-5">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <Link
            to="/home"
            className="mt-0.5 rounded-full p-2 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            aria-label="Voltar para a página inicial"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">Espaço de liderança</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Modo Líder</h1>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Acompanhe pessoas e cuide de cada passo do discipulado.
            </p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <section className="card-elevated overflow-hidden border-primary/10 bg-gradient-to-b from-surface to-surface/80">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3"><Building2 className="h-4 w-4 text-primary" /><h2 className="text-sm font-semibold">Painel da Igreja</h2></div>
        <div className="grid grid-cols-3 divide-x divide-border">
          <Metric value={loading ? "—" : discipulos.length} label="Discípulos" />
          <Metric value={loading ? "—" : groups.length} label="Grupos" color="text-success" />
          <Metric value={loading ? "—" : meetings.length} label="Encontros" color="text-ancient" />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-2.5">
        <ActionBtn icon={Plus} label="Adicionar Discípulo" onClick={() => setDialog("disciple")} />
        <ActionBtn icon={Users} label="Novo grupo" onClick={() => setDialog("group")} />
        <ActionBtn icon={MessageCircle} label="Mensagem" onClick={() => void navigate({ to: "/mensagens" })} />
        <ActionBtn icon={Calendar} label="Encontro" onClick={() => setDialog("meeting")} />
      </div>

      <Link to="/lider/arvore" className="group card-elevated flex items-center gap-3 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"><Network className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1"><p className="text-sm font-semibold">Árvore de Discipulado</p><p className="text-xs text-muted-foreground">Veja sua linha de discipulado, de cima a baixo</p></div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>

      {myId && <DiscipleshipProgress leaderId={myId} />}

      <section className="space-y-2">
        <h2 className="px-1 text-sm font-semibold text-muted-foreground">Grupos de Discipulado</h2>
        {groups.length === 0 ? <Empty text="Nenhum grupo criado ainda." /> : groups.map((group) => (
          <div key={group.id} className="card-elevated flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary"><Users className="h-5 w-5" /></div>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{group.name}</p><p className="text-xs text-muted-foreground">{group.topic} · {group.members} membro{group.members === 1 ? "" : "s"}</p></div>
          </div>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="px-1 text-sm font-semibold text-muted-foreground">Seus discípulos</h2>
        {!loading && discipulos.length === 0 ? <Empty text="Adicione seu primeiro discípulo para começar." /> : discipulos.map((person) => <PersonCard key={person.id} person={person} />)}
      </section>

      {meetings.length > 0 && <section className="space-y-2"><h2 className="px-1 text-sm font-semibold text-muted-foreground">Próximos encontros</h2>{meetings.map((meeting) => <div key={meeting.id} className="card-elevated p-4"><p className="text-sm font-semibold">{meeting.title}</p><p className="mt-1 text-xs text-muted-foreground">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(meeting.scheduled_at))}{meeting.location ? ` · ${meeting.location}` : ""}</p></div>)}</section>}

      <Dialog open={dialog === "disciple"} onOpenChange={(open) => !open && setDialog(null)}><DialogContent className="max-h-[85vh] overflow-y-auto"><DialogHeader><DialogTitle>Adicionar Discípulo</DialogTitle><DialogDescription>Escolha um contato já adicionado ou procure pelo ID real do usuário.</DialogDescription></DialogHeader><SearchInput value={search} onChange={setSearch} placeholder="Buscar por ID (ex.: joao.silva)" />{search.trim().length >= 2 ? <PersonList people={results} existingIds={new Set(discipulos.map((person) => person.id))} onChoose={addDisciple} saving={saving} /> : <PersonList people={contacts} existingIds={new Set(discipulos.map((person) => person.id))} onChoose={addDisciple} saving={saving} empty="Você ainda não possui contatos adicionados." />}</DialogContent></Dialog>

      <Dialog open={dialog === "group"} onOpenChange={(open) => !open && setDialog(null)}><DialogContent className="max-h-[85vh] overflow-y-auto"><DialogHeader><DialogTitle>Novo grupo</DialogTitle><DialogDescription>Dê um nome, selecione o tema e marque os discípulos participantes.</DialogDescription></DialogHeader><label className="space-y-1 text-sm font-medium">Nome do grupo<input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Ex.: Homens firmes na fé" className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm font-normal outline-none focus:border-primary" /></label><label className="space-y-1 text-sm font-medium">Tema<select value={groupTopic} onChange={(e) => setGroupTopic(e.target.value)} className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm font-normal outline-none focus:border-primary"><option value="">Selecione um tema</option>{TEMAS.map((tema) => <option key={tema}>{tema}</option>)}</select></label><div className="space-y-2"><p className="text-sm font-medium">Membros ({selectedIds.size})</p>{discipulos.length === 0 ? <Empty text="Adicione discípulos antes de criar um grupo." /> : discipulos.map((person) => <label key={person.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3"><Checkbox checked={selectedIds.has(person.id)} onCheckedChange={() => toggleMember(person.id)} /><Avatar person={person} /><span className="flex-1 text-sm font-medium">{person.display_name}</span></label>)}</div><button onClick={() => void createGroup()} disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{saving && <Loader2 className="h-4 w-4 animate-spin" />}Criar grupo</button></DialogContent></Dialog>

      <Dialog open={dialog === "meeting"} onOpenChange={(open) => !open && setDialog(null)}><DialogContent><DialogHeader><DialogTitle>Agendar encontro</DialogTitle><DialogDescription>Registre o próximo encontro do seu discipulado.</DialogDescription></DialogHeader><label className="space-y-1 text-sm font-medium">Título<input value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} placeholder="Ex.: Encontro semanal" className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm font-normal outline-none focus:border-primary" /></label><label className="space-y-1 text-sm font-medium">Data e hora<input type="datetime-local" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm font-normal outline-none focus:border-primary" /></label><label className="space-y-1 text-sm font-medium">Local (opcional)<input value={meetingLocation} onChange={(e) => setMeetingLocation(e.target.value)} placeholder="Ex.: Sala 3" className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm font-normal outline-none focus:border-primary" /></label><button onClick={() => void createMeeting()} disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{saving && <Loader2 className="h-4 w-4 animate-spin" />}Agendar encontro</button></DialogContent></Dialog>

    </div>
  );
}

function Metric({ value, label, color = "text-primary" }: { value: string | number; label: string; color?: string }) {
  return (
    <div className="p-4 text-center">
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="mt-1 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
function ActionBtn({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card-elevated flex min-h-[52px] items-center gap-2.5 rounded-2xl p-3 text-left text-xs font-bold transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span className="leading-tight">{label}</span>
    </button>
  );
}
function Empty({ text }: { text: string }) {
  return <p className="card-elevated border-dashed p-4 text-center text-xs text-muted-foreground">{text}</p>; }
function Avatar({ person }: { person: Person }) { return <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-sm font-semibold text-primary">{person.avatar_url ? <img src={person.avatar_url} alt="" className="h-full w-full object-cover" /> : person.display_name[0]}</div>; }
function PersonCard({ person }: { person: Person }) {
  return (
    <div className="group card-elevated flex items-center gap-3 p-3.5 transition-all hover:-translate-y-0.5 hover:border-primary/30">
      <Avatar person={person} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{person.display_name}</p>
        <p className="text-[11px] text-muted-foreground">@{person.username ?? "sem ID"} · {person.streak ?? 0} dias de ofensiva</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5" />
    </div>
  );
}
function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) { return <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-border bg-input py-2 pl-9 pr-3 text-sm outline-none focus:border-primary" /></div>; }
function PersonList({ people, existingIds, onChoose, saving, empty = "Nenhum usuário encontrado com este ID." }: { people: Person[]; existingIds: Set<string>; onChoose: (person: Person) => Promise<void>; saving: boolean; empty?: string }) { if (!people.length) return <Empty text={empty} />; return <div className="space-y-2">{people.map((person) => { const exists = existingIds.has(person.id); return <div key={person.id} className="flex items-center gap-3 rounded-lg border border-border p-3"><Avatar person={person} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{person.display_name}</p><p className="truncate text-xs text-muted-foreground">@{person.username ?? "sem ID"}</p></div>{exists ? <span className="flex items-center gap-1 text-xs font-medium text-success"><Check className="h-4 w-4" /> Adicionado</span> : <button disabled={saving} onClick={() => void onChoose(person)} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60">Adicionar</button>}</div>; })}</div>; }
