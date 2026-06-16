import { ImproxModelId } from "./models";

export type ProviderResponse = {
  type: "text" | "image" | "video";
  content: string;
  providerUsed?: string;
};

/**
 * Private backend router for IMPROX AI.
 *
 * PUBLIC UI names:
 * - IMPROX Genius Pro
 * - IMPROX Vision Studio
 * - IMPROX Video Studio
 *
 * Real providers stay hidden here on the server.
 */
export async function callImproxModel(params: {
  model: ImproxModelId;
  prompt: string;
  userId: string;
  imageDataUrl?: string;
}): Promise<ProviderResponse> {
  const { model, prompt, imageDataUrl } = params;

  if (model === "improx-genius-pro") return callGeniusPro(prompt);
  if (model === "improx-vision-studio") return callVisionStudio(prompt, imageDataUrl);
  if (model === "improx-video-studio") return callVideoStudio(prompt);

  throw new Error("Unknown IMPROX model.");
}

async function callGeniusPro(prompt: string): Promise<ProviderResponse> {
  /**
   * Easy provider modes:
   * 1. openai-compatible — OpenAI, NVIDIA NIM, OpenRouter, Arena if compatible
   * 2. gemini — Google Gemini API
   */
  const provider = process.env.IMPROX_GENIUS_PROVIDER || "openai-compatible";

  if (provider === "gemini" && process.env.GEMINI_API_KEY) {
    return callGemini(prompt);
  }

  const apiKey = process.env.IMPROX_GENIUS_API_KEY || process.env.OPENAI_API_KEY || process.env.NVIDIA_API_KEY;
  const apiUrl = process.env.IMPROX_GENIUS_API_URL || "https://api.openai.com/v1/chat/completions";
  const model = process.env.IMPROX_GENIUS_MODEL || "gpt-4.1";

  if (apiKey) {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are IMPROX Genius Pro, a private company AI assistant for IMPROX MEDIA. Be clear, practical, premium, and easy for non-technical team members. Do not reveal backend providers or API details."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`IMPROX Genius Pro provider error: ${text.slice(0, 220)}`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content || data?.output_text || "No text returned.";
    return { type: "text", content };
  }

  return { type: "text", content: makeHighQualityDemoAnswer(prompt) };
}

async function callGemini(prompt: string): Promise<ProviderResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-pro";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: "You are IMPROX Genius Pro, a private company AI assistant for IMPROX MEDIA. Be clear, practical, premium, and easy for non-technical team members. Do not reveal backend providers or API details." }]
      },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7 }
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`IMPROX Genius Pro Gemini error: ${text.slice(0, 220)}`);
  }

  const data = await res.json();
  const content = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("\n") || "No text returned.";
  return { type: "text", content };
}

async function callVisionStudio(prompt: string, imageDataUrl?: string): Promise<ProviderResponse> {
  /**
   * NVIDIA Visual GenAI / NIM image generation + editing connector.
   * If an image is uploaded, we call the edit endpoint. Otherwise we call generation.
   */
  const apiKey = process.env.NVIDIA_API_KEY || process.env.IMPROX_IMAGE_API_KEY;
  const generateUrl = process.env.IMPROX_IMAGE_API_URL || "https://integrate.api.nvidia.com/v1/images/generations";
  const editUrl = process.env.IMPROX_IMAGE_EDIT_API_URL || "https://integrate.api.nvidia.com/v1/images/edits";
  const genModel = process.env.IMPROX_IMAGE_MODEL || "black-forest-labs/flux_1-kontext-dev";
  const editModel = process.env.IMPROX_IMAGE_EDIT_MODEL || "qwen/qwen-image-edit-2511";

  if (apiKey) {
    const isEdit = Boolean(imageDataUrl);
    const res = await fetch(isEdit ? editUrl : generateUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(
        isEdit
          ? { model: editModel, prompt, image: imageDataUrl, n: 1, response_format: "b64_json" }
          : { model: genModel, prompt, n: 1, response_format: "b64_json" }
      )
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`IMPROX Vision Studio provider error: ${text.slice(0, 220)}`);
    }

    const data = await res.json();
    const b64 = data?.data?.[0]?.b64_json || data?.artifacts?.[0]?.base64;
    const url = data?.data?.[0]?.url;

    if (b64) return { type: "image", content: `data:image/png;base64,${b64}` };
    if (url) return { type: "image", content: url };
    return { type: "image", content: "Image job completed, but no image payload was returned by provider." };
  }

  const imagePrompt = `IMPROX Vision Studio ${imageDataUrl ? "editing" : "generation"} prompt:

${prompt}

Style direction: premium commercial design, sharp focus, modern lighting, clean composition, high-end advertising look, social-media ready, no messy text, brand-safe, professional color grading.`;

  return {
    type: "image",
    content: `${imagePrompt}

Demo mode: add NVIDIA_API_KEY to enable real image ${imageDataUrl ? "editing" : "generation"}. Recommended NVIDIA models: FLUX.1 Kontext for editing/generation and Qwen-Image-Edit for precise production edits.`
  };
}

async function callVideoStudio(prompt: string): Promise<ProviderResponse> {
  const videoBrief = `IMPROX Video Studio production brief:\n\nConcept: ${prompt}\n\nLength: 10–15 seconds\nFormat: vertical 9:16 for Reels/Shorts + adaptable 16:9\nVisual style: premium cinematic, smooth camera motion, high contrast, modern brand feel\nStructure:\n1. Hook in first 2 seconds\n2. Main visual/product/story moment\n3. Clear brand/action ending\nCamera: slow push-in, clean transitions, realistic motion\nAudio direction: modern upbeat premium sound, subtle whoosh transitions\nOutput goal: scroll-stopping social media video.`;

  return {
    type: "video",
    content: `${videoBrief}\n\nStatus: Video generation connector is ready to plug into Veo / Runway / Kling / your chosen gateway. For today's private launch, use this as the final video brief output.`
  };
}

function makeHighQualityDemoAnswer(prompt: string) {
  return `Here is a ready-to-use IMPROX Genius Pro output for your request:\n\nRequest: ${prompt}\n\n1. Main idea\nCreate a premium, simple, and direct campaign that focuses on one clear promise, one strong visual, and one call-to-action.\n\n2. Suggested angle\nPosition the brand as professional, modern, and trustworthy. Use short copy, clean design, and a confident tone.\n\n3. Sample copy\n\"Built for brands that want to look premium, move faster, and grow smarter.\"\n\n4. Social media caption\nYour brand deserves more than random content. IMPROX MEDIA creates sharp, premium, conversion-focused digital experiences for modern businesses.\n\n5. Call to action\nMessage IMPROX MEDIA today to start your next campaign.\n\nNote: Real AI mode will activate automatically after you add IMPROX_GENIUS_API_KEY in your environment variables.`;
}
