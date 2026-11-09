import "server-only";

const API_BASE = "https://api.wavespeed.ai/api/v3";
const TERMINAL_STATUSES = new Set(["completed", "failed", "cancelled", "timeout", "deleted"]);

function apiKey() {
  const key = process.env["WAVESPEED_API_KEY"];
  if (!key) throw new Error("WaveSpeed is not configured. Add WAVESPEED_API_KEY to the Vercel project environment.");
  return key;
}

async function request(path: string, init?: RequestInit) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.message ?? body?.error ?? `WaveSpeed request failed (${response.status})`;
    throw new Error(String(message).slice(0, 500));
  }
  return body?.data ?? body;
}

export async function submitWaveSpeedPrediction(endpoint: string, input: Record<string, unknown>) {
  if (!/^[a-z0-9][a-z0-9./-]{2,180}$/.test(endpoint)) throw new Error("Invalid WaveSpeed model endpoint.");
  const result = await request(`/${endpoint}`, { method: "POST", body: JSON.stringify(input) });
  if (typeof result?.id !== "string" || !result.id) throw new Error("WaveSpeed did not return a prediction ID.");
  return { id: result.id, status: result.status ?? "created" };
}

export async function getWaveSpeedPrediction(predictionId: string) {
  if (!/^[a-zA-Z0-9_-]{4,160}$/.test(predictionId)) throw new Error("Invalid prediction ID.");
  const result = await request(`/predictions/${predictionId}/result`);
  return {
    id: predictionId,
    status: String(result?.status ?? "unknown"),
    outputs: Array.isArray(result?.outputs) ? result.outputs : [],
    error: result?.error ? String(result.error).slice(0, 500) : undefined,
    terminal: TERMINAL_STATUSES.has(String(result?.status ?? "")),
  };
}
