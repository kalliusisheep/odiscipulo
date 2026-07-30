import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(supabaseUrl, serviceRoleKey);

type RequestBody = {
  lessonId?: string;
  title?: string;
  context?: string;
};

// Esta função NÃO chama mais nenhuma IA em tempo real. Todo o conteúdo é
// escrito previamente (seguindo a persona do mentor de discipulado) e
// gravado na tabela public.lesson_share_texts via migrations. A função só
// busca o texto já pronto — por isso a resposta é sempre instantânea.
//
// Texto usado apenas se, por engano, uma lição nova for lançada no app antes
// do texto correspondente ser escrito e adicionado à tabela — para o botão
// de compartilhar nunca quebrar para o usuário nesse meio-tempo.
function fallbackText(title: string): string {
  return (
    `Hoje eu terminei de estudar sobre "${title}" e queria muito dividir isso com você. ` +
    `Esse tempo na Palavra me lembrou que Deus continua falando com quem separa um momento pra ouvir Ele. ` +
    `Se você tiver alguns minutos livres hoje, separa um tempinho pra pensar sobre isso também. ` +
    `Acredito que pode fazer diferença no seu dia, do mesmo jeito que fez no meu.`
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { lessonId, title }: RequestBody = await req.json();

    if (!lessonId || !title) {
      return Response.json(
        { error: "lessonId e title são obrigatórios." },
        { status: 400, headers: corsHeaders },
      );
    }

    const { data: found, error: selectError } = await admin
      .from("lesson_share_texts")
      .select("share_text")
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (selectError) console.error("generate-share-text: erro ao consultar cache:", selectError);

    if (found?.share_text) {
      return Response.json({ text: found.share_text, cached: true }, { headers: corsHeaders });
    }

    // Lição ainda sem texto pré-escrito na tabela — usa o texto de reserva e
    // NÃO grava nada no banco, para não travar um texto genérico no lugar
    // do texto de verdade que ainda vai ser escrito para essa lição.
    console.warn(`generate-share-text: nenhum texto pré-gerado encontrado para lessonId="${lessonId}".`);
    return Response.json({ text: fallbackText(title), cached: false }, { headers: corsHeaders });
  } catch (error) {
    console.error("generate-share-text: erro inesperado:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Erro desconhecido." },
      { status: 500, headers: corsHeaders },
    );
  }
});
