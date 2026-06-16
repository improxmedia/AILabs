export type ImproxModelCategory = "chat" | "image" | "video";
export type ImproxModelId = string;

export type ImproxModel = {
  id: ImproxModelId;
  publicName: string;
  category: ImproxModelCategory;
  badge: string;
  description: string;
  engine: string;
  recommended?: boolean;
};

export const IMPROX_MODELS: Record<string, ImproxModel> = {
  "improx-genius-pro": {
    id: "improx-genius-pro",
    publicName: "IMPROX Genius Pro",
    category: "chat",
    badge: "Pro Agent",
    description: "Premium company assistant for campaigns, client ideas, strategy and content.",
    engine: "Company default premium engine",
    recommended: true
  },
  "improx-gemini-pro": {
    id: "improx-gemini-pro",
    publicName: "IMPROX Gemini Pro",
    category: "chat",
    badge: "Google Pro",
    description: "Strong long-form writing, planning, research and multimodal-style reasoning.",
    engine: "Google Gemini"
  },
  "improx-llama-pro": {
    id: "improx-llama-pro",
    publicName: "IMPROX Llama Pro",
    category: "chat",
    badge: "Llama AI",
    description: "Fast open-model style assistant for captions, drafts and internal production tasks.",
    engine: "Llama / NVIDIA NIM"
  },
  "improx-vision-studio": {
    id: "improx-vision-studio",
    publicName: "IMPROX Vision Studio",
    category: "image",
    badge: "Image Pro",
    description: "Main image generation tool for ads, posters, thumbnails and production creatives.",
    engine: "FLUX / NVIDIA Visual GenAI",
    recommended: true
  },
  "improx-flux-pro": {
    id: "improx-flux-pro",
    publicName: "IMPROX FLUX Pro",
    category: "image",
    badge: "FLUX",
    description: "High-quality commercial image generation for premium brand visuals.",
    engine: "FLUX.1 Dev"
  },
  "improx-kontext-edit": {
    id: "improx-kontext-edit",
    publicName: "IMPROX Kontext Edit",
    category: "image",
    badge: "AI Editing",
    description: "Upload an image and make prompt-based edits for production workflows.",
    engine: "FLUX.1 Kontext"
  },
  "improx-video-studio": {
    id: "improx-video-studio",
    publicName: "IMPROX Video Studio",
    category: "video",
    badge: "Video Brief",
    description: "Create reel concepts, ad scripts, shot lists and video production briefs.",
    engine: "Video planning engine",
    recommended: true
  },
  "improx-reel-director": {
    id: "improx-reel-director",
    publicName: "IMPROX Reel Director",
    category: "video",
    badge: "Reels",
    description: "Fast 10–30 second short-form video scripts for Instagram, YouTube and ads.",
    engine: "Short-form planner"
  }
};

export const PUBLIC_MODELS = Object.values(IMPROX_MODELS).map(({ id, publicName, category, badge, description, engine, recommended }) => ({
  id,
  publicName,
  category,
  badge,
  description,
  engine,
  recommended
}));

export function getImproxModel(id: string) {
  return IMPROX_MODELS[id] || IMPROX_MODELS["improx-genius-pro"];
}
