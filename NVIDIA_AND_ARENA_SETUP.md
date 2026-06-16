# NVIDIA + Arena Setup for IMPROX AI

## Private team URL

After deployment, your team URL will be the Vercel URL or your custom domain:

```text
https://your-vercel-project.vercel.app
```

Recommended final domain:

```text
https://ai.improxmedia.com
```

## Private user ID / password

Set users in Vercel environment variables:

```env
TEAM_USERS=admin:StrongAdminPass:admin:IMPROX Admin,editor:EditorPass123:enterprise:Production Editor,designer:DesignPass123:creator:Designer
```

Format:

```text
username:password:role:display name
```

Roles:

```text
admin
enterprise
creator
```

## NVIDIA API Setup

Set these in `.env.local` or Vercel:

```env
NVIDIA_API_KEY=your_nvidia_key
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_CHAT_MODEL=meta/llama-3.1-405b-instruct

IMPROX_GENIUS_API_KEY=your_nvidia_key
IMPROX_GENIUS_API_URL=https://integrate.api.nvidia.com/v1/chat/completions
IMPROX_GENIUS_MODEL=meta/llama-3.1-405b-instruct

IMPROX_IMAGE_API_URL=https://integrate.api.nvidia.com/v1/images/generations
IMPROX_IMAGE_EDIT_API_URL=https://integrate.api.nvidia.com/v1/images/edits
IMPROX_IMAGE_MODEL=black-forest-labs/flux_1-kontext-dev
IMPROX_IMAGE_EDIT_MODEL=qwen/qwen-image-edit-2511
```

## Recommended production image/editing model flow

### New image generation

Tool in app: **IMPROX Vision Studio**

Backend model recommendation:

```text
FLUX.1 Kontext / FLUX.1 Dev / Stable Diffusion 3.5 Large
```

### Image editing

User uploads image and writes edit instruction.

Backend model recommendation:

```text
FLUX.1 Kontext Dev
Qwen-Image-Edit
```

Good editing prompts:

```text
Remove background and make this product look premium on a clean studio background.
```

```text
Change the poster style to luxury black and gold, keep the product unchanged.
```

```text
Make this image suitable for Instagram ad, improve lighting, keep face natural.
```

## Arena API Setup

If Arena gives you an OpenAI-compatible endpoint, use:

```env
IMPROX_GENIUS_API_KEY=arena_api_key
IMPROX_GENIUS_API_URL=arena_chat_completions_url
IMPROX_GENIUS_MODEL=arena_model_id
```

For image:

```env
IMPROX_IMAGE_API_KEY=arena_api_key
IMPROX_IMAGE_API_URL=arena_image_generation_url
IMPROX_IMAGE_EDIT_API_URL=arena_image_edit_url
IMPROX_IMAGE_MODEL=arena_image_model_id
IMPROX_IMAGE_EDIT_MODEL=arena_edit_model_id
```

Do not expose Arena API keys to team members.
