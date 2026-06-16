# Security Notice — API Keys

Never paste API keys in public places, GitHub issues, frontend code, screenshots, or team chats.

If a key is accidentally shared, rotate/regenerate it from the provider dashboard and update Vercel environment variables.

## Safe local setup

Use the secure setup script:

```bash
cd improx-ai-playground
./scripts/setup-env.sh
```

The script asks for your NVIDIA key silently and writes it only to `.env.local`, which is already ignored by Git.

## Safe Vercel setup

Add keys only in:

```text
Vercel Project → Settings → Environment Variables
```

Required variables:

```env
TEAM_USERS=admin:StrongPassword:admin:IMPROX Admin,editor:EditorPassword:enterprise:Production Editor
NVIDIA_API_KEY=your_key
IMPROX_GENIUS_API_KEY=your_key
IMPROX_GENIUS_API_URL=https://integrate.api.nvidia.com/v1/chat/completions
IMPROX_GENIUS_MODEL=meta/llama-3.1-405b-instruct
IMPROX_IMAGE_API_URL=https://integrate.api.nvidia.com/v1/images/generations
IMPROX_IMAGE_EDIT_API_URL=https://integrate.api.nvidia.com/v1/images/edits
IMPROX_IMAGE_MODEL=black-forest-labs/flux_1-kontext-dev
IMPROX_IMAGE_EDIT_MODEL=qwen/qwen-image-edit-2511
```
