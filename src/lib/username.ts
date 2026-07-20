import { supabase } from "@/integrations/supabase/client";

export function normalizeUsername(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, ".")
    .replace(/[^a-z0-9._]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(/_{2,}/g, "_")
    .replace(/^[._]+|[._]+$/g, "")
    .slice(0, 24);
}

export function isValidUsername(u: string): boolean {
  return /^[a-z0-9][a-z0-9._]{2,22}[a-z0-9]$/.test(u);
}

export function suggestUsername(first: string, last?: string): string {
  const base = normalizeUsername(`${first}${last ? "." + last : ""}`) || "irmao";
  const suffix = Math.floor(100 + Math.random() * 900);
  return `${base}${suffix}`.slice(0, 24);
}

export async function isUsernameAvailable(username: string, ignoreUserId?: string): Promise<boolean> {
  const u = username.toLowerCase();
  let q = supabase.from("profiles").select("id").ilike("username", u).limit(1);
  if (ignoreUserId) q = q.neq("id", ignoreUserId);
  const { data } = await q;
  return (data?.length ?? 0) === 0;
}

export async function suggestAvailableUsername(first: string, last?: string): Promise<string> {
  for (let i = 0; i < 6; i++) {
    const candidate = suggestUsername(first, last);
    if (await isUsernameAvailable(candidate)) return candidate;
  }
  return `irmao${Date.now().toString().slice(-6)}`;
}
