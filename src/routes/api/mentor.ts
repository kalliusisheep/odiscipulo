import { createFileRoute } from "@tanstack/react-router";
import { streamMentor } from "@/lib/mentor.server";

export const Route = createFileRoute("/api/mentor")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            messages: { role: string; content: string }[];
            memoryContext?: string;
          };
          if (!Array.isArray(body?.messages)) return new Response("Bad request", { status: 400 });
          const stream = await streamMentor(body.messages, body.memoryContext);
          return new Response(stream, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              Connection: "keep-alive",
            },
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "erro";
          return new Response(msg, { status: 500 });
        }
      },
    },
  },
});
