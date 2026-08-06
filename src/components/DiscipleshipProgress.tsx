import { useEffect, useState } from "react";
import { Loader2, Target, UserRound, UsersRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Person = {
  id: string;
  display_name: string;
  username: string | null;
};

type Group = {
  id: string;
  name: string;
};

type Assignment = {
  disciple_id: string;
  group_id: string | null;
  content_id: string;
};

type Member = {
  group_id: string;
  disciple_id: string;
};

type Progress = {
  done: number;
  total: number;
};

function ProgressBar({ progress, tone = "primary" }: { progress: Progress; tone?: "primary" | "gold" }) {
  const percent = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
  const fill = tone === "gold" ? "from-amber-300 to-yellow-100" : "from-primary to-primary-glow";

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-2 p-[2px]">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${fill} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-9 text-right text-[10px] font-bold text-muted-foreground">{percent}%</span>
    </div>
  );
}

export function DiscipleshipProgress({ leaderId }: { leaderId: string }) {
  const [people, setPeople] = useState<Person[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const [{ data: links }, { data: groupRows }, { data: applied }] = await Promise.all([
        supabase.from("leader_disciples").select("disciple_id").eq("leader_id", leaderId),
        supabase.from("groups").select("id, name").eq("leader_id", leaderId).order("created_at"),
        supabase
          .from("discipleship_assignments")
          .select("disciple_id, group_id, content_id")
          .eq("leader_id", leaderId)
          .eq("status", "active"),
      ]);

      const discipleIds = [...new Set((links ?? []).map((link) => link.disciple_id))];
      const groupIds = (groupRows ?? []).map((group) => group.id);
      const contentIds = [...new Set((applied ?? []).map((assignment) => assignment.content_id))];
      const [{ data: profiles }, { data: groupMembers }, { data: progress }] = await Promise.all([
        discipleIds.length
          ? supabase
              .from("profiles")
              .select("id, display_name, username")
              .in("id", discipleIds)
          : Promise.resolve({ data: [] }),
        groupIds.length
          ? supabase
              .from("group_members")
              .select("group_id, disciple_id")
              .in("group_id", groupIds)
          : Promise.resolve({ data: [] }),
        discipleIds.length && contentIds.length
          ? supabase
              .from("lesson_progress")
              .select("user_id, lesson_id")
              .in("user_id", discipleIds)
              .in("lesson_id", contentIds)
          : Promise.resolve({ data: [] }),
      ]);

      setPeople((profiles ?? []) as Person[]);
      setGroups((groupRows ?? []) as Group[]);
      setMembers((groupMembers ?? []) as Member[]);
      setAssignments((applied ?? []) as Assignment[]);
      setCompleted(
        new Set((progress ?? []).map((row) => `${row.user_id}:${row.lesson_id}`)),
      );
      setLoading(false);
    })();
  }, [leaderId]);

  const progressForPerson = (personId: string): Progress => {
    const contentIds = [
      ...new Set(
        assignments
          .filter((assignment) => assignment.disciple_id === personId)
          .map((assignment) => assignment.content_id),
      ),
    ];
    return {
      total: contentIds.length,
      done: contentIds.filter((contentId) => completed.has(`${personId}:${contentId}`)).length,
    };
  };

  const progressForGroup = (groupId: string): Progress => {
    const rows = assignments.filter((assignment) => assignment.group_id === groupId);
    const keys = new Set(rows.map((row) => `${row.disciple_id}:${row.content_id}`));
    return {
      total: keys.size,
      done: [...keys].filter((key) => completed.has(key)).length,
    };
  };

  if (loading) {
    return (
      <section className="card-elevated flex items-center justify-center gap-2 p-5 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Calculando progresso...
      </section>
    );
  }

  const hasAssignments = assignments.length > 0;

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3 px-1">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Target className="h-4 w-4 text-primary" /> Progresso do discipulado
          </h2>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Acompanhe cada pessoa e o avanço dos seus grupos.
          </p>
        </div>
        {hasAssignments && (
          <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
            {assignments.length} aplicações
          </span>
        )}
      </div>

      {!hasAssignments ? (
        <div className="card-elevated border-dashed p-5 text-center text-sm text-muted-foreground">
          Aplique uma trilha para começar a acompanhar o progresso.
        </div>
      ) : (
        <div className="card-elevated divide-y divide-border/70 overflow-hidden">
          <div className="p-4">
            <p className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
              <UserRound className="h-3.5 w-3.5 text-primary" /> Individual
            </p>
            <div className="space-y-3">
              {people.map((person) => {
                const progress = progressForPerson(person.id);
                return (
                  <div key={person.id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold">{person.display_name}</p>
                        <p className="truncate text-[10px] text-muted-foreground">
                          {progress.total ? `${progress.done} de ${progress.total} concluídas` : "Sem conteúdo aplicado"}
                        </p>
                      </div>
                      {person.username && <span className="text-[10px] text-muted-foreground">@{person.username}</span>}
                    </div>
                    <ProgressBar progress={progress} />
                  </div>
                );
              })}
            </div>
          </div>

          {groups.length > 0 && (
            <div className="p-4">
              <p className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                <UsersRound className="h-3.5 w-3.5 text-amber-500" /> Coletivo
              </p>
              <div className="space-y-3">
                {groups.map((group) => {
                  const groupMemberCount = members.filter((member) => member.group_id === group.id).length;
                  const progress = progressForGroup(group.id);
                  return (
                    <div key={group.id} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold">{group.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {groupMemberCount} membro{groupMemberCount === 1 ? "" : "s"} · {progress.done} de {progress.total} concluídas
                          </p>
                        </div>
                      </div>
                      <ProgressBar progress={progress} tone="gold" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
