export type ImproxModelId = "improx-genius-pro" | "improx-vision-studio" | "improx-video-studio";

export const IMPROX_MODELS = {
  "improx-genius-pro": {
    id: "improx-genius-pro",
    publicName: "IMPROX Genius Pro",
    category: "chat",
    description: "Top-level premium assistant for strategy, content, coding and research.",
    internalProviderHint: "OpenAI/Anthropic/Gemini/Arena gateway"
  },
  "improx-vision-studio": {
    id: "improx-vision-studio",
    publicName: "IMPROX Vision Studio",
    category: "image",
    description: "Premium image generation for ads, thumbnails, posters and creatives.",
    internalProviderHint: "FLUX/GPT Image/Imagen/Arena gateway"
  },
  "improx-video-studio": {
    id: "improx-video-studio",
    publicName: "IMPROX Video Studio",
    category: "video",
    description: "AI video generation for reels, product ads and cinematic shots.",
    internalProviderHint: "Veo/Runway/Kling/Luma/Arena gateway"
  }
} as const;

export const PUBLIC_MODELS = Object.values(IMPROX_MODELS).map(({ id, publicName, category, description }) => ({
  id,
  publicName,
  category,
  description
}));
