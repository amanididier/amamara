/**
 * Server-only image providers. Add new providers here; the app picks one by id.
 * - "gpt-image": OpenAI image model via Lovable AI (default)
 * - "nano-banana": Google Gemini 3 Pro Image ("Nano Banana Pro") via Lovable AI
 * - "higgsfield": placeholder until HIGGSFIELD_API_KEY / HIGGSFIELD_API_SECRET are added
 */
export type ImageConfig = {
  baseURL: string;
  apiKey: string;
  model: string;
  format: "openai" | "gemini-chat";
};

export const imageProviders = {
  "gpt-image": { model: "openai/gpt-image-2.5-sunburst", format: "openai" },
  "nano-banana": { model: "google/gemini-3-pro-image", format: "gemini-chat" },
} as const;

export type ImageProviderId = keyof typeof imageProviders | "higgsfield";

export const GATEWAY = "https://ai.gateway.lovable.dev";

export function generateImage(config: ImageConfig, prompt: string, stream = true) {
  const input =
    config.format === "openai"
      ? { prompt, ...(stream ? { partial_images: 1 } : {}) }
      : { messages: [{ role: "user", content: prompt }], modalities: ["image", "text"] };
  return fetch(`${config.baseURL}/v1/images/generations`, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: config.model, ...input, ...(stream ? { stream: true } : {}) }),
  });
}
