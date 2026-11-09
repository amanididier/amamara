/**
 * Amamara's locked WaveSpeed production model lineup.
 * Keep provider model IDs here so UI, quoting and generation share one source of truth.
 */
export const IMAGE_MODELS = {
  "gpt-image-2.5": {
    label: "GPT Image 2.5",
    endpoint: "openai/gpt-image-2.5-sunburst/text-to-image",
    purpose: "High-fidelity campaign artwork and accurate on-image typography",
  },
  "seedream-5-pro": {
    label: "Seedream 5.0 Pro",
    endpoint: "bytedance/seedream-v5.0-pro",
    purpose: "Premium commercial layouts and polished advertising visuals",
  },
  "nano-banana-2": {
    label: "Nano Banana 2",
    endpoint: "google/nano-banana-2/text-to-image",
    purpose: "Fast creative iterations and reference-aware campaign artwork",
  },
  "nano-banana-pro": {
    label: "Nano Banana Pro",
    endpoint: "google/nano-banana-pro/text-to-image",
    purpose: "High-detail image generation and complex reference-driven work",
  },
} as const;

export const VIDEO_MODELS = {
  ugc: {
    label: "MiniMax H3",
    endpoint: "wavespeed-ai/minimax-h3/reference-to-video",
    mode: "reference-to-video",
    resolution: "768p",
    nativeAudio: true,
    maxReferenceImages: 9,
    durations: [10, 15] as const,
  },
  product: {
    label: "Kling 3.0 Standard",
    endpoint: "kwaivgi/kling-v3.0-std/image-to-video",
    mode: "image-to-video",
    resolution: "provider-default",
    nativeAudio: true,
    durations: [10, 15] as const,
  },
  cinematic: {
    label: "Seedance 2.0",
    endpoint: "bytedance/seedance-2.0/reference-to-video",
    mode: "reference-to-video",
    resolution: "720p",
    nativeAudio: true,
    durations: [10, 15] as const,
  },
} as const;

export type ImageModelKey = keyof typeof IMAGE_MODELS;
export type VideoStyleKey = keyof typeof VIDEO_MODELS;

export const SELF_SERVICE_VIDEO_DURATIONS = [10, 15] as const;
export const PROFESSIONAL_VIDEO_MIN_DURATION = 30;
