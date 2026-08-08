import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ElementType } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Calendar,
  Check,
  Clock3,
  ChevronRight,
  Loader2,
  MessageCircle,
  Network,
  Plus,
  Search,
  Sparkles,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { normalizeUsername } from "@/lib/username";
import { DiscipleshipProgress } from "@/components/DiscipleshipProgress";
import { SUPPORT_MODULES } from "@/data/leader-support-content";

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
  const [dialog, setDialog] = useState<"disciple" | "discipleActions" | "group" | "meeting" | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedDisciple, setSelectedDisciple] = useState<Person | null>(null);
  const [studySearch, setStudySearch] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [removingDisciple, setRemovingDisciple] = useState(false);
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

  const supportLessons = useMemo(
    () => SUPPORT_MODULES.flatMap((module) => module.lessons.map((lesson) => ({ ...lesson, moduleTitle: module.title }))),
    [],
  );
  const filteredSupportLessons = useMemo(() => {
    const query = studySearch.trim().toLocaleLowerCase();
    if (!query) return supportLessons;
    return supportLessons.filter((lesson) => (lesson.moduleTitle + " " + lesson.title).toLocaleLowerCase().includes(query));
  }, [studySearch, supportLessons]);

  const openDisciple = (person: Person) => {
    setSelectedDisciple(person);
    setStudySearch("");
    setSelectedLessonId(supportLessons[0]?.id ?? "");
    setDialog("discipleActions");
  };

  const assignStudy = async () => {
    if (!myId || !selectedDisciple || !selectedLessonId) {
      toast.error("Escolha um estudo para atribuir.");
      return;
    }
    setSaving(true);
    const { error } = await db.from("discipleship_assignments").upsert(
      [{
        leader_id: myId,
        disciple_id: selectedDisciple.id,
        group_id: null,
        content_type: "support_lesson",
        content_id: selectedLessonId,
        status: "active",
      }],
      { onConflict: "leader_id,disciple_id,content_type,content_id", ignoreDuplicates: true },
    );
    setSaving(false);
    if (error) {
      toast.error("Não foi possível atribuir este estudo.");
      return;
    }
    const lesson = supportLessons.find((item) => item.id === selectedLessonId);
    toast.success((lesson?.title ?? "Estudo") + " atribuído a " + selectedDisciple.display_name + ".");
    setDialog(null);
    setSelectedDisciple(null);
    if (myId) await load(myId);
  };

  const removeDisciple = async () => {
    if (!myId || !selectedDisciple) return;
    setRemovingDisciple(true);
    const { error } = await db
      .from("leader_disciples")
      .delete()
      .eq("leader_id", myId)
      .eq("disciple_id", selectedDisciple.id);

    if (!error) {
      const { data: leaderGroups } = await db.from("groups").select("id").eq("leader_id", myId);
      const groupIds = (leaderGroups ?? []).map((group: { id: string }) => group.id);
      if (groupIds.length) {
        await db.from("group_members").delete().eq("disciple_id", selectedDisciple.id).in("group_id", groupIds);
      }
      await db.from("discipleship_assignments").delete().eq("leader_id", myId).eq("disciple_id", selectedDisciple.id).eq("status", "active");
    }

    setRemovingDisciple(false);
    if (error) {
      toast.error("Não foi possível remover este discípulo.");
      return;
    }
    toast.success(selectedDisciple.display_name + " foi removido do seu discipulado.");
    setDialog(null);
    setSelectedDisciple(null);
    await load(myId);
  };

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
    const scheduledAt = new Date(meetingDate);
    if (Number.isNaN(scheduledAt.getTime()) || scheduledAt.getTime() <= Date.now()) {
      toast.error("Escolha uma data e horário futuros.");
      return;
    }
    setSaving(true);
    const { error } = await db.from("leader_meetings").insert({
      leader_id: myId,
      title: meetingTitle.trim(),
      scheduled_at: scheduledAt.toISOString(),
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
    <main className="relative mx-auto min-h-screen max-w-xl overflow-hidden px-4 pb-28 pt-5">
      <div aria-hidden="true" className="pointer-events-none absolute -left-28 top-8 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-64 h-72 w-72 rounded-full bg-ancient/5 blur-3xl" />
      <div className="relative space-y-5">
        <header className="flex items-start gap-3">
          <Link to="/home" className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-surface/70 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground" aria-label="Voltar para a página inicial"><ArrowLeft className="h-4 w-4" /></Link>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2"><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Espaço de liderança</p><span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-success"><span className="h-1.5 w-1.5 rounded-full bg-success" />Ativo</span></div>
            <h1 className="mt-1 text-[28px] font-black tracking-[-0.04em]">Modo Líder</h1>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">Acompanhe pessoas, fortaleça vínculos e cuide de cada passo do discipulado.</p>
          </div>
          <div className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary sm:flex"><Sparkles className="h-5 w-5" /></div>
        </header>

        <section className="relative overflow-hidden rounded-[26px] border border-primary/20 bg-gradient-to-br from-primary/15 via-surface to-surface p-5 shadow-xl shadow-primary/5">
          <div aria-hidden="true" className="absolute -right-10 -top-14 h-36 w-36 rounded-full bg-primary/15 blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary"><Building2 className="h-5 w-5" /></span><div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary">Visão geral</p><h2 className="mt-0.5 text-base font-bold">Painel da Igreja</h2></div></div>
              <span className="rounded-full border border-border/70 bg-background/40 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">Resumo</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2"><Metric icon={UserRound} value={loading ? "—" : discipulos.length} label="Discípulos" /><Metric icon={Users} value={loading ? "—" : groups.length} label="Grupos" color="text-success" /><Metric icon={Calendar} value={loading ? "—" : meetings.length} label="Encontros" color="text-ancient" /></div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3 px-1"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">Ações rápidas</p><h2 className="mt-1 text-lg font-extrabold tracking-tight">Cuide da sua comunidade</h2></div><span className="text-[10px] font-medium text-muted-foreground">Tudo em um só lugar</span></div>
          <div className="grid grid-cols-2 gap-3"><ActionBtn icon={Plus} label="Adicionar discípulo" hint="Acompanhar uma pessoa" onClick={() => setDialog("disciple")} /><ActionBtn icon={Users} label="Novo grupo" hint="Caminhar em comunidade" onClick={() => setDialog("group")} /><ActionBtn icon={MessageCircle} label="Mensagem" hint="Conversar com irmãos" onClick={() => void navigate({ to: "/mensagens" })} /><ActionBtn icon={Calendar} label="Encontro" hint="Organizar o próximo passo" onClick={() => setDialog("meeting")} /></div>
        </section>

        <Link to="/lider/arvore" className="group flex items-center gap-3 rounded-[22px] border border-primary/20 bg-primary/5 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/45 hover:bg-primary/10"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary"><Network className="h-5 w-5" /></span><span className="min-w-0 flex-1"><span className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary">Visão da jornada <span className="h-1 w-1 rounded-full bg-primary" /></span><span className="mt-1 block text-sm font-bold">Árvore de discipulado</span><span className="mt-0.5 block text-xs text-muted-foreground">Veja sua linha de discipulado, de cima a baixo</span></span><ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" /></Link>

        {myId && <DiscipleshipProgress leaderId={myId} />}

        {meetings.length > 0 && <section className="space-y-3"><div className="flex items-end justify-between gap-3 px-1"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">Agenda</p><h2 className="mt-1 text-lg font-extrabold tracking-tight">Próximos encontros</h2></div><span className="rounded-full bg-ancient/10 px-2 py-1 text-[10px] font-bold text-ancient">{meetings.length} agendado{meetings.length === 1 ? "" : "s"}</span></div><div className="space-y-2.5">{meetings.map((meeting) => <div key={meeting.id} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-surface/75 p-3.5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ancient/10 text-ancient"><Clock3 className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{meeting.title}</p><p className="mt-1 truncate text-[11px] text-muted-foreground">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(meeting.scheduled_at))}{meeting.location ? " · " + meeting.location : ""}</p></div></div>)}</div></section>}

        <section className="space-y-3"><div className="flex items-end justify-between gap-3 px-1"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">Comunidade</p><h2 className="mt-1 text-lg font-extrabold tracking-tight">Grupos de discipulado</h2></div><span className="text-[10px] font-medium text-muted-foreground">{groups.length} grupo{groups.length === 1 ? "" : "s"}</span></div>{groups.length === 0 ? <Empty text="Crie um grupo para caminhar com mais pessoas." /> : <div className="space-y-2.5">{groups.map((group) => <div key={group.id} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-surface/75 p-3.5 transition-colors hover:border-primary/30"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success"><Users className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{group.name}</p><p className="mt-1 truncate text-[11px] text-muted-foreground">{group.topic} · {group.members} membro{group.members === 1 ? "" : "s"}</p></div><span className="rounded-full bg-background/60 px-2 py-1 text-[10px] font-semibold text-muted-foreground">Ativo</span></div>)}</div>}</section>

        <section className="space-y-3"><div className="flex items-end justify-between gap-3 px-1"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">Acompanhamento</p><h2 className="mt-1 text-lg font-extrabold tracking-tight">Seus discípulos</h2></div><span className="text-[10px] font-medium text-muted-foreground">{discipulos.length} pessoa{discipulos.length === 1 ? "" : "s"}</span></div>{!loading && discipulos.length === 0 ? <Empty text="Adicione seu primeiro discípulo para começar." /> : <div className="space-y-2.5">{discipulos.map((person) => <PersonCard key={person.id} person={person} onClick={() => openDisciple(person)} />)}</div>}</section>

        <Dialog open={dialog === "discipleActions"} onOpenChange={(open) => { if (!open) { setDialog(null); setSelectedDisciple(null); } }}>
          <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedDisciple ? selectedDisciple.display_name : "Discípulo"}</DialogTitle>
              <DialogDescription>Atribua um estudo, acompanhe o vínculo e gerencie este discípulo.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedDisciple && (
                <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-3">
                  <Avatar person={selectedDisciple} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{selectedDisciple.display_name}</p>
                    <p className="mt-1 truncate text-[11px] text-muted-foreground">@{selectedDisciple.username ?? "sem ID"} · {selectedDisciple.streak ?? 0} dias de ofensiva</p>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-bold"><BookOpen className="h-4 w-4 text-primary" /> Atribuir estudo</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">O progresso aparecerá no painel do líder.</p>
                  </div>
                  <span className="text-[10px] font-bold text-primary">{supportLessons.length} estudos</span>
                </div>
                <SearchInput value={studySearch} onChange={setStudySearch} placeholder="Buscar por título ou módulo" />
                <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                  {filteredSupportLessons.length ? filteredSupportLessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => setSelectedLessonId(lesson.id)}
                      className={"flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors " + (selectedLessonId === lesson.id ? "border-primary/60 bg-primary/10" : "border-border/70 bg-surface/60 hover:border-primary/35")}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-bold text-primary">{lesson.moduleTitle.slice(0, 2).toUpperCase()}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">{lesson.moduleTitle}</span>
                        <span className="mt-0.5 block truncate text-sm font-bold">{lesson.title}</span>
                      </span>
                      {selectedLessonId === lesson.id && <Check className="h-4 w-4 shrink-0 text-primary" />}
                    </button>
                  )) : <Empty text="Nenhum estudo encontrado." />}
                </div>
                <button type="button" onClick={() => void assignStudy()} disabled={saving || !selectedLessonId} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 transition-all hover:brightness-110 disabled:opacity-60">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />} Atribuir estudo selecionado
                </button>
              </div>
              <div className="border-t border-border/70 pt-4">
                <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">Gerenciar vínculo</p>
                <button type="button" onClick={() => void removeDisciple()} disabled={removingDisciple} className="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-bold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60">
                  {removingDisciple && <Loader2 className="h-4 w-4 animate-spin" />}<Trash2 className="h-4 w-4" /> Remover discípulo
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={dialog === "disciple"} onOpenChange={(open) => !open && setDialog(null)}><DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg"><DialogHeader><DialogTitle>Adicionar discípulo</DialogTitle><DialogDescription>Escolha um contato já adicionado ou procure pelo ID real do usuário.</DialogDescription></DialogHeader><div className="space-y-3"><SearchInput value={search} onChange={setSearch} placeholder="Buscar por ID (ex.: joao.silva)" /><p className="text-[11px] text-muted-foreground">{search.trim().length >= 2 ? "Resultados para sua busca" : "Seus contatos disponíveis"}</p>{search.trim().length >= 2 ? <PersonList people={results} existingIds={new Set(discipulos.map((person) => person.id))} onChoose={addDisciple} saving={saving} /> : <PersonList people={contacts} existingIds={new Set(discipulos.map((person) => person.id))} onChoose={addDisciple} saving={saving} empty="Você ainda não possui contatos adicionados." />}</div></DialogContent></Dialog>

        <Dialog open={dialog === "group"} onOpenChange={(open) => !open && setDialog(null)}><DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg"><DialogHeader><DialogTitle>Novo grupo</DialogTitle><DialogDescription>Dê um nome, selecione o tema e marque os discípulos participantes.</DialogDescription></DialogHeader><div className="space-y-4"><label className="block space-y-1.5 text-sm font-medium"><span>Nome do grupo</span><input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Ex.: Homens firmes na fé" className="w-full rounded-xl border border-border bg-input px-3.5 py-3 text-sm font-normal outline-none transition-colors focus:border-primary" /></label><label className="block space-y-1.5 text-sm font-medium"><span>Tema da caminhada</span><select value={groupTopic} onChange={(e) => setGroupTopic(e.target.value)} className="w-full rounded-xl border border-border bg-input px-3.5 py-3 text-sm font-normal outline-none transition-colors focus:border-primary"><option value="">Selecione um tema</option>{TEMAS.map((tema) => <option key={tema}>{tema}</option>)}</select></label><div className="space-y-2"><div className="flex items-center justify-between"><p className="text-sm font-medium">Membros</p><span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">{selectedIds.size} selecionado{selectedIds.size === 1 ? "" : "s"}</span></div>{discipulos.length === 0 ? <Empty text="Adicione discípulos antes de criar um grupo." /> : discipulos.map((person) => <label key={person.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/70 bg-surface/60 p-3 transition-colors hover:border-primary/30"><Checkbox checked={selectedIds.has(person.id)} onCheckedChange={() => toggleMember(person.id)} /><Avatar person={person} /><span className="flex-1 text-sm font-medium">{person.display_name}</span></label>)}</div><button type="button" onClick={() => void createGroup()} disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 transition-all hover:brightness-110 disabled:opacity-60">{saving && <Loader2 className="h-4 w-4 animate-spin" />}Criar grupo</button></div></DialogContent></Dialog>

        <Dialog open={dialog === "meeting"} onOpenChange={(open) => !open && setDialog(null)}><DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>Agendar encontro</DialogTitle><DialogDescription>Registre o próximo encontro do seu discipulado.</DialogDescription></DialogHeader><div className="space-y-4"><label className="block space-y-1.5 text-sm font-medium"><span>Título</span><input value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} placeholder="Ex.: Encontro semanal" className="w-full rounded-xl border border-border bg-input px-3.5 py-3 text-sm font-normal outline-none transition-colors focus:border-primary" /></label><label className="block space-y-1.5 text-sm font-medium"><span>Data e hora</span><input type="datetime-local" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} className="w-full rounded-xl border border-border bg-input px-3.5 py-3 text-sm font-normal outline-none transition-colors focus:border-primary" /></label><label className="block space-y-1.5 text-sm font-medium"><span>Local <span className="text-muted-foreground">(opcional)</span></span><input value={meetingLocation} onChange={(e) => setMeetingLocation(e.target.value)} placeholder="Ex.: Sala 3" className="w-full rounded-xl border border-border bg-input px-3.5 py-3 text-sm font-normal outline-none transition-colors focus:border-primary" /></label><button type="button" onClick={() => void createMeeting()} disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 transition-all hover:brightness-110 disabled:opacity-60">{saving && <Loader2 className="h-4 w-4 animate-spin" />}Agendar encontro</button></div></DialogContent></Dialog>
      </div>
    </main>
  );
}
function Metric({ icon: Icon, value, label, color = "text-primary" }: { icon: ElementType; value: string | number; label: string; color?: string }) {
  return <div className="rounded-2xl border border-border/60 bg-background/25 px-2 py-3 text-center"><Icon className={"mx-auto h-4 w-4 " + color} /><p className={"mt-1 text-2xl font-black tracking-tight " + color}>{value}</p><p className="mt-0.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">{label}</p></div>;
}
function ActionBtn({ icon: Icon, label, hint, onClick }: { icon: ElementType; label: string; hint: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="group flex min-h-[88px] items-center gap-3 rounded-[22px] border border-border/70 bg-surface/75 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/45 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5 active:translate-y-0" aria-label={label}><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15"><Icon className="h-5 w-5" /></span><span className="min-w-0 flex-1"><span className="block text-xs font-extrabold leading-tight">{label}</span><span className="mt-1 block text-[10px] leading-snug text-muted-foreground">{hint}</span></span><ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5" /></button>;
}
function Empty({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-border bg-surface/45 px-4 py-5 text-center text-xs leading-relaxed text-muted-foreground">{text}</div>;
}
function Avatar({ person }: { person: Person }) {
  return <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-sm font-bold text-primary">{person.avatar_url ? <img src={person.avatar_url} alt="" className="h-full w-full object-cover" /> : person.display_name[0]}</div>;
}
function PersonCard({ person, onClick }: { person: Person; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="group flex w-full items-center gap-3 rounded-2xl border border-border/70 bg-surface/75 p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"><Avatar person={person} /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{person.display_name}</span><span className="mt-1 block truncate text-[11px] text-muted-foreground">@{person.username ?? "sem ID"} · {person.streak ?? 0} dias de ofensiva</span></span><ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" /></button>;
}
function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <div className="relative"><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-border bg-input py-3 pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary" /></div>;
}
function PersonList({ people, existingIds, onChoose, saving, empty = "Nenhum usuário encontrado com este ID." }: { people: Person[]; existingIds: Set<string>; onChoose: (person: Person) => Promise<void>; saving: boolean; empty?: string }) {
  if (!people.length) return <Empty text={empty} />;
  return <div className="space-y-2">{people.map((person) => { const exists = existingIds.has(person.id); return <div key={person.id} className="flex items-center gap-3 rounded-xl border border-border/70 bg-surface/60 p-3"><Avatar person={person} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{person.display_name}</p><p className="truncate text-xs text-muted-foreground">@{person.username ?? "sem ID"}</p></div>{exists ? <span className="flex items-center gap-1 text-xs font-semibold text-success"><Check className="h-4 w-4" /> Adicionado</span> : <button type="button" disabled={saving} onClick={() => void onChoose(person)} className="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition-opacity disabled:opacity-60">Adicionar</button>}</div>; })}</div>;
}
