// Utilitário para buscar passagens bíblicas via bible-api.com.
// Cache simples em memória + localStorage, indexado por versão.
import type { BibleVersion } from "@/data/content";

const MEM: Record<string, string> = {};

// bible-api.com só possui algumas traduções livres. Mapeamos as versões
// escolhidas pelo usuário para a tradução equivalente disponível.
// NVI/NAA/NVT não estão disponíveis publicamente — caem para Almeida.
const VERSION_TO_API: Record<BibleVersion, string> = {
  NVI: "almeida",
  NAA: "almeida",
  ACF: "almeida",
  NVT: "almeida",
  KJV: "kjv",
};

export function apiTranslationFor(version: BibleVersion): string {
  return VERSION_TO_API[version] ?? "almeida";
}

export function bibleLabelFor(version: BibleVersion): string {
  // Deixamos claro para o leitor quando o texto exibido é Almeida (fallback).
  const api = apiTranslationFor(version);
  if (api === "almeida" && version !== "ACF") return `${version} (Almeida)`;
  return version;
}

export async function fetchPassage(ref: string, version: BibleVersion = "NVI"): Promise<string> {
  const translation = apiTranslationFor(version);
  const key = `bible:${translation}:${ref}`;
  if (MEM[key]) return MEM[key];
  if (typeof window !== "undefined") {
    const cached = window.localStorage.getItem(key);
    if (cached) {
      MEM[key] = cached;
      return cached;
    }
  }
  const url = `https://bible-api.com/${encodeURIComponent(ref)}?translation=${translation}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao buscar ${ref}`);
  const json = (await res.json()) as { text?: string; verses?: { verse: number; text: string }[] };
  const text =
    json.verses?.map((v) => `${v.verse} ${v.text.trim()}`).join(" ") ??
    (json.text ?? "").trim();
  MEM[key] = text;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(key, text);
    } catch {
      /* quota */
    }
  }
  return text;
}
