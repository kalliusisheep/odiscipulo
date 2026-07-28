import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  BookOpen,
  Calendar,
  Check,
  ChevronRight,
  Crown,
  Loader2,
  MessageCircle,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { normalizeUsername } from "@/lib/username";

export const Route = createFileRoute("/_authenticated/lider")({
  component: LiderPage,
});

const db = supabase as any;

const TEMAS = [
  "Orgulho", "Pecado", "Casamento", "Namoro", "Pornografia", "Vícios (álcool/drogas)",
  "Dificuldade financeira", "Vida devocional", "Perdão", "Empatia", "Serviço (Mordomia)",
  "Preparo para liderar", "Batismo",
];
const LEADER_LESSON_IDS = ["csl-1", "csl-2", "csl-3", "csl-4", "csl-5", "csl-6", "csl-7", "csl-8", "csl-9", "csl-10"];
const DISCIPLE_CONTENTS = [
  ["Orgulho", "Tiago 4:6", "Deus se opõe ao orgulhoso e concede graça ao humilde. O discipulado começa quando reconhecemos que dependemos de Cristo, não da nossa imagem ou capacidade.", "Em qual conversa desta semana posso ouvir antes de responder?"],
  ["Pecado", "1 João 1:9", "Pecado não é apenas falha moral: é rebelião contra Deus. Em Cristo há perdão real para quem confessa, abandona a ocultação e caminha na luz com a igreja.", "Ore com sinceridade e procure apoio pastoral quando a luta for persistente."],
  ["Casamento", "Efésios 5:25", "O casamento cristão é uma aliança de serviço, fidelidade e amor sacrificial. Cristo e sua igreja dão o padrão; nenhum cônjuge é chamado a controlar ou ferir o outro.", "Conversem sobre uma forma concreta de servir um ao outro nesta semana."],
  ["Namoro", "1 Tessalonicenses 4:3-4", "O namoro deve honrar a santidade, a dignidade e a clareza de propósito. Não é um ensaio de casamento, mas um relacionamento que precisa de limites, verdade e acompanhamento maduro.", "Definam limites que protejam a pureza e conversem com uma liderança confiável."],
  ["Pornografia", "1 Coríntios 6:18-20", "A pornografia reduz pessoas criadas à imagem de Deus a objetos de consumo. A libertação envolve arrependimento, graça, limites práticos, prestação de contas e ajuda pastoral especializada quando necessária.", "Não lute sozinho: remova acessos, procure um líder maduro e estabeleça apoio responsável."],
  ["Vícios (álcool/drogas)", "1 Coríntios 6:12", "Nada deve dominar o discípulo além de Cristo. Dependências pedem cuidado espiritual e, muitas vezes, acompanhamento médico, psicológico e familiar; buscar tratamento é um passo de coragem, não de vergonha.", "Converse hoje com alguém seguro e busque suporte profissional se houver risco ou abstinência."],
  ["Dificuldade financeira", "Mateus 6:33", "A ansiedade financeira não se vence com promessas fáceis. Deus chama seu povo à confiança, ao trabalho honesto, à mordomia, à generosidade e à sabedoria para pedir ajuda em tempos difíceis.", "Faça um orçamento simples, priorize o essencial e procure orientação prática na igreja."],
  ["Vida devocional", "Marcos 1:35", "Jesus buscava o Pai em oração. Vida devocional não é desempenho religioso; é um ritmo de escuta da Palavra, oração e obediência que sustenta a fé nos dias comuns.", "Separe dez minutos diários para ler um Evangelho e responder a Deus em oração."],
  ["Perdão", "Efésios 4:32", "Perdoar não chama o mal de bem nem dispensa justiça e limites. É entregar a vingança a Deus e recusar que a ofensa governe o coração, seguindo a graça que recebemos em Cristo.", "Nomeie a dor diante de Deus e converse com seu pastor em situações graves ou de abuso."],
  ["Empatia", "Romanos 12:15", "A empatia cristã se aproxima da alegria e da dor do próximo sem minimizar, corrigir apressadamente ou transformar a conversa em nós mesmos. Ela reflete o Deus que se fez carne.", "Pergunte a alguém como ele está e escute sem interromper nem oferecer soluções imediatas."],
  ["Serviço (Mordomia)", "1 Pedro 4:10", "Tudo o que recebemos pertence a Deus e foi confiado para servir. Tempo, dons, recursos e oportunidades florescem quando são oferecidos para o bem da igreja e do próximo.", "Escolha uma necessidade concreta da sua comunidade e sirva de forma prática."],
  ["Preparo para liderar", "2 Timóteo 2:15", "Preparar-se para liderar inclui caráter, conhecimento bíblico, vida de oração, serviço humilde e disposição para ser corrigido. O chamado é reconhecido e amadurecido no contexto da igreja local.", "Peça a um líder uma área específica para estudar e uma oportunidade simples para servir."],
  ["Batismo", "Romanos 6:3-4", "O batismo é a ordenança dada por Cristo à igreja: um testemunho público de união com sua morte e ressurreição. Não salva por si mesmo, mas expressa a fé e a nova vida do discípulo.", "Se você crê em Cristo e ainda não foi batizado, converse com seu pastor sobre os próximos passos."],
] as const;

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
  const [leaderLessonsDone, setLeaderLessonsDone] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState<"disciple" | "group" | "meeting" | "contents" | null>(null);
  const [selectedContent, setSelectedContent] = useState<number | null>(null);
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
    const [linksResponse, contactsResponse, groupsResponse, meetingsResponse, progressResponse] = await Promise.all([
      db.from("leader_disciples").select("disciple_id").eq("leader_id", leaderId),
      db.from("friendships").select("friend_id").eq("user_id", leaderId),
      db.from("groups").select("id, name, topic, created_at").eq("leader_id", leaderId).order("created_at", { ascending: false }),
      db.from("leader_meetings").select("id, title, scheduled_at, location").eq("leader_id", leaderId).gte("scheduled_at", new Date().toISOString()).order("scheduled_at").limit(3),
      db.from("lesson_progress").select("lesson_id").eq("user_id", leaderId).in("lesson_id", LEADER_LESSON_IDS),
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
    setLeaderLessonsDone((progressResponse.data ?? []).length);
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
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pb-24 pt-6">
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link to="/home" className="rounded-full p-2 hover:bg-surface"><ArrowLeft className="h-5 w-5" /></Link>
          <div><p className="text-xs text-muted-foreground">Painel</p><h1 className="text-xl font-semibold">Modo Líder</h1></div>
        </div>
        <ThemeToggle />
      </header>

      <section className="card-elevated overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3"><Building2 className="h-4 w-4 text-primary" /><h2 className="text-sm font-semibold">Painel da Igreja</h2></div>
        <div className="grid grid-cols-3 divide-x divide-border">
          <Metric value={loading ? "—" : discipulos.length} label="Discípulos" />
          <Metric value={loading ? "—" : groups.length} label="Grupos" color="text-success" />
          <Metric value={loading ? "—" : meetings.length} label="Encontros" color="text-ancient" />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-2">
        <ActionBtn icon={Plus} label="Adicionar Discípulo" onClick={() => setDialog("disciple")} />
        <ActionBtn icon={Users} label="Novo grupo" onClick={() => setDialog("group")} />
        <ActionBtn icon={MessageCircle} label="Mensagem" onClick={() => void navigate({ to: "/mensagens" })} />
        <ActionBtn icon={Calendar} label="Encontro" onClick={() => setDialog("meeting")} />
      </div>

      <section className="space-y-2">
        <h2 className="px-1 text-sm font-semibold text-muted-foreground">Formação de liderança</h2>
        <Link
          to="/modulo/$id"
          params={{ id: "como-ser-lider" }}
          className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-900 p-4 transition-all duration-300 hover:scale-[1.01]"
        >
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10"><Crown className="h-5 w-5 text-white/90" /></div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Módulo de liderança</span>
              <p className="mt-0.5 truncate font-semibold text-white/95">Como ser um líder</p>
              <p className="truncate text-xs text-white/60">10 trilhas para liderar à maneira de Cristo</p>
              <div className="mt-2.5 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10 p-[2px]"><div className="h-full rounded-full bg-gradient-to-r from-violet-300 to-indigo-200" style={{ width: `${leaderLessonsDone * 10}%` }} /></div><span className="text-[10px] font-bold text-white/70">{leaderLessonsDone}/10</span></div>
            </div>
            <ChevronRight className="h-4 w-4 text-white/60" />
          </div>
        </Link>
      </section>

      <section className="space-y-2">
        <h2 className="px-1 text-sm font-semibold text-muted-foreground">Apoio ao discipulado</h2>
        <button onClick={() => { setSelectedContent(null); setDialog("contents"); }} className="group relative block w-full overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-black via-zinc-900 to-black p-4 text-left transition-all hover:scale-[1.01]">
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex items-center gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10"><BookOpen className="h-5 w-5 text-white" /></div><div className="min-w-0 flex-1"><span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Biblioteca pastoral</span><p className="mt-0.5 font-semibold text-white">Conteúdos para discípulos</p><p className="truncate text-xs text-white/60">13 temas para conversas e acompanhamento</p></div><ChevronRight className="h-4 w-4 text-white/60" /></div>
        </button>
      </section>

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

      <Dialog open={dialog === "contents"} onOpenChange={(open) => !open && setDialog(null)}><DialogContent className="max-h-[85vh] overflow-y-auto"><DialogHeader><DialogTitle>Conteúdos para discípulos</DialogTitle><DialogDescription>Material de apoio bíblico. Ele complementa, mas não substitui, a comunhão e o cuidado da igreja local.</DialogDescription></DialogHeader>{selectedContent === null ? <div className="grid gap-2">{DISCIPLE_CONTENTS.map(([title, verse], index) => <button key={title} onClick={() => setSelectedContent(index)} className="flex items-center justify-between rounded-xl border border-border p-3 text-left hover:border-primary/60"><div><p className="text-sm font-semibold">{title}</p><p className="text-xs text-muted-foreground">{verse}</p></div><ChevronRight className="h-4 w-4 text-muted-foreground" /></button>)}</div> : <ContentDetail content={DISCIPLE_CONTENTS[selectedContent]} onBack={() => setSelectedContent(null)} />}</DialogContent></Dialog>
    </div>
  );
}

function ContentDetail({ content, onBack }: { content: readonly [string, string, string, string]; onBack: () => void }) { const [title, verse, teaching, practice] = content; return <div className="space-y-4"><button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Todos os temas</button><section className="rounded-2xl border border-border bg-surface p-4"><p className="text-xs font-semibold uppercase tracking-wider text-primary">Fundamentação bíblica</p><h3 className="mt-1 text-xl font-bold">{title}</h3><p className="mt-3 font-medium text-primary">{verse}</p></section><section className="card-elevated p-4"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Para caminhar junto</p><p className="mt-2 text-sm leading-relaxed">{teaching}</p></section><section className="rounded-2xl border border-ancient/30 bg-ancient/5 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-ancient">Passo prático</p><p className="mt-2 text-sm leading-relaxed">{practice}</p></section><p className="text-center text-xs text-muted-foreground">Estude a Bíblia em oração e, quando necessário, procure seu pastor, líder ou um profissional qualificado.</p></div>; }

function Metric({ value, label, color = "text-primary" }: { value: string | number; label: string; color?: string }) { return <div className="p-4 text-center"><p className={`text-2xl font-bold ${color}`}>{value}</p><p className="text-[10px] uppercase text-muted-foreground">{label}</p></div>; }
function ActionBtn({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) { return <button onClick={onClick} className="card-elevated flex items-center gap-2 p-3 text-left text-sm font-medium transition-all hover:border-primary/50"><Icon className="h-4 w-4 text-primary" />{label}</button>; }
function Empty({ text }: { text: string }) { return <p className="card-elevated p-4 text-center text-xs text-muted-foreground">{text}</p>; }
function Avatar({ person }: { person: Person }) { return <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-sm font-semibold text-primary">{person.avatar_url ? <img src={person.avatar_url} alt="" className="h-full w-full object-cover" /> : person.display_name[0]}</div>; }
function PersonCard({ person }: { person: Person }) { return <div className="card-elevated flex items-center gap-3 p-4"><Avatar person={person} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{person.display_name}</p><p className="text-[11px] text-muted-foreground">@{person.username ?? "sem ID"} · {person.streak ?? 0} dias de ofensiva</p></div><ChevronRight className="h-4 w-4 text-muted-foreground" /></div>; }
function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) { return <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-border bg-input py-2 pl-9 pr-3 text-sm outline-none focus:border-primary" /></div>; }
function PersonList({ people, existingIds, onChoose, saving, empty = "Nenhum usuário encontrado com este ID." }: { people: Person[]; existingIds: Set<string>; onChoose: (person: Person) => Promise<void>; saving: boolean; empty?: string }) { if (!people.length) return <Empty text={empty} />; return <div className="space-y-2">{people.map((person) => { const exists = existingIds.has(person.id); return <div key={person.id} className="flex items-center gap-3 rounded-lg border border-border p-3"><Avatar person={person} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{person.display_name}</p><p className="truncate text-xs text-muted-foreground">@{person.username ?? "sem ID"}</p></div>{exists ? <span className="flex items-center gap-1 text-xs font-medium text-success"><Check className="h-4 w-4" /> Adicionado</span> : <button disabled={saving} onClick={() => void onChoose(person)} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60">Adicionar</button>}</div>; })}</div>; }
