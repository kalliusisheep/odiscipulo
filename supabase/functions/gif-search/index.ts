const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TENOR_API_KEY = Deno.env.get("TENOR_API_KEY");

type TenorResult = {
  id: string;
  content_description?: string;
  media_formats?: {
    gif?: { url: string };
    tinygif?: { url: string };
  };
};

type RequestBody = { q?: string };

// Proxy simples para a Tenor API — mantém a chave no servidor e devolve só
// os campos que a UI (GifPicker) precisa. Usado no comentário do feed.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!TENOR_API_KEY) {
      console.error("gif-search: TENOR_API_KEY não configurada nos secrets do projeto.");
      return Response.json(
        { error: "Busca de GIFs não configurada." },
        { status: 500, headers: corsHeaders },
      );
    }

    const { q }: RequestBody = req.method === "POST" ? await req.json() : {};
    const term = (q ?? "").trim();

    const params = new URLSearchParams({
      key: TENOR_API_KEY,
      client_key: "odiscipulo",
      limit: "24",
      media_filter: "gif,tinygif",
      contentfilter: "high",
      locale: "pt_BR",
    });
    if (term) params.set("q", term);

    const endpoint = term
      ? `https://tenor.googleapis.com/v2/search?${params.toString()}`
      : `https://tenor.googleapis.com/v2/featured?${params.toString()}`;

    const resp = await fetch(endpoint);
    if (!resp.ok) {
      console.error("gif-search: Tenor respondeu com erro:", resp.status, await resp.text());
      return Response.json({ error: "Falha ao buscar GIFs." }, { status: 502, headers: corsHeaders });
    }

    const data = (await resp.json()) as { results?: TenorResult[] };
    const gifs = (data.results ?? [])
      .map((r) => ({
        id: r.id,
        previewUrl: r.media_formats?.tinygif?.url ?? r.media_formats?.gif?.url ?? "",
        url: r.media_formats?.gif?.url ?? "",
        description: r.content_description ?? "GIF",
      }))
      .filter((g) => g.url);

    return Response.json({ gifs }, { headers: corsHeaders });
  } catch (error) {
    console.error("gif-search: erro inesperado:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Erro desconhecido." },
      { status: 500, headers: corsHeaders },
    );
  }
});
