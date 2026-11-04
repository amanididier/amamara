import { createFileRoute } from "@tanstack/react-router";
import { GATEWAY, generateImage, imageProviders } from "@/lib/image-gateway.server";

export const Route = createFileRoute("/api/generate-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { prompt?: string; stream?: boolean; provider?: string };
        const prompt = String(body.prompt ?? "").slice(0, 6000);
        if (!prompt.trim()) return new Response("Prompt required", { status: 400 });
        if (body.provider === "higgsfield") {
          if (!process.env["HIGGSFIELD_API_KEY"]) {
            return Response.json({ error: { message: "Higgsfield is not connected yet." } }, { status: 503 });
          }
          return Response.json({ error: { message: "Higgsfield adapter pending API docs." } }, { status: 501 });
        }
        const p = imageProviders[(body.provider as keyof typeof imageProviders) ?? "gpt-image"] ?? imageProviders["gpt-image"];
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        const upstream = await generateImage({ baseURL: GATEWAY, apiKey, ...p }, prompt, body.stream !== false);
        return new Response(upstream.body, {
          status: upstream.status,
          headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json", "Cache-Control": "no-cache" },
        });
      },
    },
  },
});
