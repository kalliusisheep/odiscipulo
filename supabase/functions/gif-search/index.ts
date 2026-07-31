const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GIPHY_API_KEY = Deno.env.get("GIPHY_API_KEY");

type GiphyResult = {
  id: string;
  title?: string;
  images?: {
    fixed_width_small?: { url: string };
    fixed_height?: { url: string };
    original?: { url: string };
  };
};

type RequestBody = { q?: string };

// Proxy simples para a Giphy API — mantém a chave no servidor e devolve só
// os campos que a UI (GifPicker) precisa. Usado no comentário do feed.
// (Migrado da Tenor API, que a Google encerrou em 30/06/2026.)
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!GIPHY_API_KEY) {
      console.error("gif-search: GIPHY_API_KEY não configurada nos secrets do projeto.");
      return Response.json(
        { error: "Busca de GIFs não configurada." },
        { status: 500, headers: corsHeaders },
      );
    }

    const { q }: RequestBody = req.method === "POST" ? await req.json() : {};
    const term = (q ?? "").trim();

    const params = new URLSearchParams({
      api_key: GIPHY_API_KEY,
      limit: "24",
      rating: "pg-13",
      lang: "pt",
    });
    if (term) params.set("q", term);

    const endpoint = term
      ? `https://api.giphy.com/v1/gifs/search?${params.toString()}`
      : `https://api.giphy.com/v1/gifs/trending?${params.toString()}`;

    const resp = await fetch(endpoint);
    if (!resp.ok) {
      console.error("gif-search: Giphy respondeu com erro:", resp.status, await resp.text());
      return Response.json({ error: "Falha ao buscar GIFs." }, { status: 502, headers: corsHeaders });
    }

    const data = (await resp.json()) as { data?: GiphyResult[] };
    const gifs = (data.data ?? [])
      .map((r) => ({
        id: r.id,
        previewUrl: r.images?.fixed_width_small?.url ?? r.images?.fixed_height?.url ?? "",
        url: r.images?.fixed_height?.url ?? r.images?.original?.url ?? "",
        description: r.title ?? "GIF",
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
