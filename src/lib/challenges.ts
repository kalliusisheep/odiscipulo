import { supabase } from "@/integrations/supabase/client";

export type ChallengeScope = "module" | "trail";
export type ChallengeStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "completed"
  | "canceled";

export type Challenge = {
  id: string;
  challenger_id: string;
  challenged_id: string;
  scope_type: ChallengeScope;
  scope_id: string;
  status: ChallengeStatus;
  first_finisher_id: string | null;
  first_finished_at: string | null;
  second_finished_at: string | null;
  created_at: string;
  accepted_at: string | null;
};

/** Balanceamento (também refletido em finish_challenge_step) */
export const CHALLENGE_XP = {
  winner: 150,
  dualCompletion: 75,
  participation: 50,
} as const;

export async function listMyChallenges(myId: string): Promise<Challenge[]> {
  const { data } = await supabase
    .from("challenges")
    .select("*")
    .or(`challenger_id.eq.${myId},challenged_id.eq.${myId}`)
    .in("status", ["pending", "accepted"])
    .order("created_at", { ascending: false });
  return (data ?? []) as Challenge[];
}

export async function listPeerChallenges(myId: string, peerId: string) {
  const { data } = await supabase
    .from("challenges")
    .select("*")
    .or(
      `and(challenger_id.eq.${myId},challenged_id.eq.${peerId}),and(challenger_id.eq.${peerId},challenged_id.eq.${myId})`,
    )
    .in("status", ["pending", "accepted"])
    .order("created_at", { ascending: false });
  return (data ?? []) as Challenge[];
}

export async function createChallenge(input: {
  targetId: string;
  scopeType: ChallengeScope;
  scopeId: string;
}) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Não autenticado");
  const { error } = await supabase.from("challenges").insert({
    challenger_id: u.user.id,
    challenged_id: input.targetId,
    scope_type: input.scopeType,
    scope_id: input.scopeId,
  });
  if (error) throw error;
}

export async function respondChallenge(id: string, accept: boolean) {
  const { error } = await supabase
    .from("challenges")
    .update(
      accept
        ? { status: "accepted", accepted_at: new Date().toISOString() }
        : { status: "rejected" },
    )
    .eq("id", id);
  if (error) throw error;
}

/** Cancela somente um convite ainda pendente enviado pelo usuário atual. */
export async function cancelChallenge(id: string) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Não autenticado");

  const { error } = await supabase
    .from("challenges")
    .update({ status: "canceled" })
    .eq("id", id)
    .eq("challenger_id", u.user.id)
    .eq("status", "pending");
  if (error) throw error;
}

export async function getChallengeProgressPct(challengeId: string, userId: string) {
  const { data } = await supabase.rpc("challenge_progress", {
    _user: userId,
    _challenge_id: challengeId,
  });
  return Number(data ?? 0);
}

/** Após completar qualquer lição, chame para todos os desafios ativos. */
export async function checkFinishChallenges(myId: string) {
  const active = await listMyChallenges(myId);
  const accepted = active.filter((c) => c.status === "accepted");
  for (const c of accepted) {
    await supabase.rpc("finish_challenge_step", { _challenge_id: c.id });
  }
}

/** Ids de usuários envolvidos em qualquer desafio ativo com o usuário atual. */
export async function getMyChallengePartnerIds(myId: string): Promise<Set<string>> {
  const list = await listMyChallenges(myId);
  const s = new Set<string>();
  for (const c of list) {
    if (c.status !== "accepted") continue;
    s.add(c.challenger_id === myId ? c.challenged_id : c.challenger_id);
  }
  return s;
}
