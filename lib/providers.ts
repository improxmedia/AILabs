import { getImproxModel, ImproxModelId } from "./models";

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
  const publicModel = getImproxModel(model);

  if (publicModel.category === "chat") return callGeniusPro(prompt, model);
  if (publicModel.category === "image") return callVisionStudio(prompt, imageDataUrl, model);
  if (publicModel.category === "video") return callVideoStudio(prompt, model);

  throw new Error("Unknown IMPROX model.");
}

async function callGeniusPro(prompt: string, selectedModel?: string): Promise<ProviderResponse> {
  /**
   * Easy provider modes:
   * 1. openai-compatible — OpenAI, NVIDIA NIM, OpenRouter, Arena if compatible
   * 2. gemini — Google Gemini API
   */
  const provider = selectedModel === "improx-gemini-pro" ? "gemini" : selectedModel === "improx-llama-pro" ? "nvidia-llama" : (process.env.IMPROX_GENIUS_PROVIDER || "openai-compatible");

  if (provider === "gemini" && process.env.GEMINI_API_KEY) {
    return callGemini(prompt);
  }

  const apiUrl = provider === "nvidia-llama"
    ? "https://integrate.api.nvidia.com/v1/chat/completions"
    : (process.env.IMPROX_GENIUS_API_URL || "");
  const apiKey = provider === "nvidia-llama"
    ? process.env.NVIDIA_API_KEY
    : (process.env.IMPROX_GENIUS_API_KEY || process.env.OPENAI_API_KEY || (apiUrl.includes("nvidia.com") ? process.env.NVIDIA_API_KEY : undefined));
  const model = provider === "nvidia-llama"
    ? (process.env.NVIDIA_CHAT_MODEL || "meta/llama3-70b-instruct")
    : (process.env.IMPROX_GENIUS_MODEL || "gpt-4.1");
  const finalApiUrl = apiUrl || "https://api.openai.com/v1/chat/completions";

  if (apiKey) {
    const res = await fetch(finalApiUrl, {
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

async function callVisionStudio(prompt: string, imageDataUrl?: string, selectedModel?: string): Promise<ProviderResponse> {
  /**
   * NVIDIA IMAGE FIX:
   * NVIDIA Build visual models do NOT use /v1/images/generations for hosted API.
   * They use model-specific /v1/genai/... endpoints, for example:
   * https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev
   * https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-kontext-dev
   */
  const apiKey = process.env.NVIDIA_API_KEY || process.env.IMPROX_IMAGE_API_KEY;
  const provider = process.env.IMPROX_IMAGE_PROVIDER || "nvidia-native";

  if (apiKey && provider === "nvidia-native") {
    return callNvidiaNativeImage(prompt, imageDataUrl, apiKey, selectedModel);
  }

  // Optional OpenAI-compatible image API mode if you later use another gateway.
  const generateUrl = process.env.IMPROX_IMAGE_API_URL;
  const editUrl = process.env.IMPROX_IMAGE_EDIT_API_URL;
  const genModel = process.env.IMPROX_IMAGE_MODEL || "black-forest-labs/flux_1-kontext-dev";
  const editModel = process.env.IMPROX_IMAGE_EDIT_MODEL || "qwen/qwen-image-edit-2511";

  if (apiKey && generateUrl && provider === "openai-compatible-image") {
    const isEdit = Boolean(imageDataUrl);
    const res = await fetch(isEdit ? (editUrl || generateUrl) : generateUrl, {
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

    const text = await res.text();
    if (!res.ok) throw new Error(`IMPROX Vision Studio provider error: ${text.slice(0, 300)}`);
    const data = JSON.parse(text);
    const b64 = data?.data?.[0]?.b64_json || data?.artifacts?.[0]?.base64;
    const url = data?.data?.[0]?.url;
    if (b64) return { type: "image", content: `data:image/png;base64,${b64}` };
    if (url) return { type: "image", content: url };
    return { type: "image", content: "Image job completed, but no image payload was returned by provider." };
  }

  const imagePrompt = `IMPROX Vision Studio ${imageDataUrl ? "editing" : "generation"} prompt:\n\n${prompt}\n\nStyle direction: premium commercial design, sharp focus, modern lighting, clean composition, high-end advertising look, social-media ready, no messy text, brand-safe, professional color grading.`;

  return {
    type: "image",
    content: `${imagePrompt}\n\nDemo mode: add NVIDIA_API_KEY and IMPROX_IMAGE_PROVIDER=nvidia-native to enable real NVIDIA image generation.`
  };
}

async function callNvidiaNativeImage(prompt: string, imageDataUrl: string | undefined, apiKey: string, selectedModel?: string): Promise<ProviderResponse> {
  const forceEdit = selectedModel === "improx-kontext-edit";
  const isEdit = Boolean(imageDataUrl) || forceEdit;
  const url = isEdit
    ? process.env.IMPROX_IMAGE_EDIT_API_URL || "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-kontext-dev"
    : process.env.IMPROX_IMAGE_API_URL || "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev";

  const body = isEdit
    ? {
        prompt,
        image: imageDataUrl || null,
        cfg_scale: 3.5,
        aspect_ratio: imageDataUrl ? "match_input_image" : "1:1",
        samples: 1,
        seed: 0,
        steps: 30
      }
    : {
        prompt,
        height: 1024,
        width: 1024,
        cfg_scale: 5,
        mode: "base",
        samples: 1,
        seed: 0,
        steps: 30
      };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(body)
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`NVIDIA image error ${res.status}: ${text.slice(0, 400)}`);
  }

  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`NVIDIA returned non-JSON response: ${text.slice(0, 250)}`);
  }

  const b64 = data?.artifacts?.[0]?.base64 || data?.data?.[0]?.b64_json || data?.image || data?.output?.[0]?.image;
  const urlOut = data?.data?.[0]?.url || data?.url;

  if (b64) {
    const clean = String(b64).startsWith("data:image") ? String(b64) : `data:image/png;base64,${b64}`;
    return { type: "image", content: clean };
  }

  if (urlOut) return { type: "image", content: urlOut };

  return { type: "image", content: `NVIDIA request completed but image field was not found. Raw response: ${JSON.stringify(data).slice(0, 500)}` };
}

async function callVideoStudio(prompt: string, selectedModel?: string): Promise<ProviderResponse> {
  const videoBrief = `IMPROX Video Studio production brief:\n\nConcept: ${prompt}\n\nLength: 10–15 seconds\nFormat: vertical 9:16 for Reels/Shorts + adaptable 16:9\nVisual style: premium cinematic, smooth camera motion, high contrast, modern brand feel\nStructure:\n1. Hook in first 2 seconds\n2. Main visual/product/story moment\n3. Clear brand/action ending\nCamera: slow push-in, clean transitions, realistic motion\nAudio direction: modern upbeat premium sound, subtle whoosh transitions\nOutput goal: scroll-stopping social media video.`;

  return {
    type: "video",
    content: `${videoBrief}\n\nStatus: Video generation connector is ready to plug into Veo / Runway / Kling / your chosen gateway. For today's private launch, use this as the final video brief output.`
  };
}

function makeHighQualityDemoAnswer(prompt: string) {
  return `Here is a ready-to-use IMPROX Genius Pro output for your request:\n\nRequest: ${prompt}\n\n1. Main idea\nCreate a premium, simple, and direct campaign that focuses on one clear promise, one strong visual, and one call-to-action.\n\n2. Suggested angle\nPosition the brand as professional, modern, and trustworthy. Use short copy, clean design, and a confident tone.\n\n3. Sample copy\n\"Built for brands that want to look premium, move faster, and grow smarter.\"\n\n4. Social media caption\nYour brand deserves more than random content. IMPROX MEDIA creates sharp, premium, conversion-focused digital experiences for modern businesses.\n\n5. Call to action\nMessage IMPROX MEDIA today to start your next campaign.\n\nNote: Real AI mode will activate automatically after you add IMPROX_GENIUS_API_KEY in your environment variables.`;
}
