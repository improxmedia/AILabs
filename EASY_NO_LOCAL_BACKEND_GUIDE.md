# IMPROX AI — Easy Setup Without Complex Local Backend

You do **not** need to teach your team any backend setup.

Final flow:

```text
Team opens private link → login/magic link → uses IMPROX AI
```

The backend runs automatically on Vercel as serverless API routes.

## 1. Frontend status

Frontend is ready:

- Private IMPROX branding
- User-friendly interface
- User ID/password login
- Optional magic access links
- Image upload/editing UI
- Copy/download output
- Mobile-friendly layout

## 2. Deploy once, team uses only link

Deploy to Vercel once. Your team only uses:

```text
https://your-project.vercel.app
```

Recommended custom URL:

```text
https://ai.improxmedia.com
```

## 3. Provider links to get API keys

### Gemini API key

Use this if you want easiest Google setup:

```text
https://aistudio.google.com/app/apikey
```

Vercel env:

```env
IMPROX_GENIUS_PROVIDER=gemini
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.5-pro
```

### OpenAI / GPT API key

```text
https://platform.openai.com/api-keys
```

Vercel env:

```env
IMPROX_GENIUS_PROVIDER=openai-compatible
IMPROX_GENIUS_API_KEY=your_openai_key
IMPROX_GENIUS_API_URL=https://api.openai.com/v1/chat/completions
IMPROX_GENIUS_MODEL=gpt-4.1
```

### NVIDIA API key / models

```text
https://build.nvidia.com/
```

Vercel env:

```env
IMPROX_GENIUS_PROVIDER=openai-compatible
NVIDIA_API_KEY=your_nvidia_key
IMPROX_GENIUS_API_KEY=your_nvidia_key
IMPROX_GENIUS_API_URL=https://integrate.api.nvidia.com/v1/chat/completions
IMPROX_GENIUS_MODEL=meta/llama-3.1-405b-instruct
```

## 4. Team login options

### Option A — User ID/password

```env
TEAM_USERS=admin:StrongPass:admin:IMPROX Admin,editor:EditorPass:enterprise:Production Editor,designer:DesignerPass:creator:Designer
```

### Option B — Magic access links

For non-technical team members, create links:

```env
TEAM_MAGIC_LINKS=editorlink2026:editor:enterprise:Production Editor,designlink2026:designer:creator:Designer
```

Then send them:

```text
https://your-project.vercel.app/api/auth/magic?token=editorlink2026
```

They click once and enter the app. Do not share magic links publicly.

## 5. Recommended easiest launch

Use Gemini first because key setup is simple:

```env
IMPROX_GENIUS_PROVIDER=gemini
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.5-pro
```

Use NVIDIA for image/editing after testing endpoints from your NVIDIA account.

## 6. Team instruction

Send this to your team:

```text
Open this private IMPROX AI link. If you get a magic access link, click it once and start using the workspace. Do not share the link outside IMPROX MEDIA.
```
