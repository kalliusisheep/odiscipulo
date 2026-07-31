import { createFileRoute } from "@tanstack/react-router";
import { extractMentorMemory } from "@/lib/mentor.server";

export const Route = createFileRoute("/api/mentor/memory")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { messages: { role: string; content: string }[] };
          if (!Array.isArray(body?.messages)) return new Response("Bad request", { status: 400 });
          const facts = await extractMentorMemory(body.messages);
          return new Response(JSON.stringify({ facts }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          // Falha na extração não deve quebrar a experiência do usuário — o
          // chat já terminou normalmente. Só não guardamos memória desta vez.
          const msg = e instanceof Error ? e.message : "erro";
          console.error("Memória do Mentor: falha ao extrair", msg);
          return new Response(JSON.stringify({ facts: [] }), {
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
