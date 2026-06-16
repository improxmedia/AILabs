# Vercel Deploy Steps

## 1. Push to GitHub

```bash
cd improx-ai-playground
git init
git add .
git commit -m "Launch IMPROX AI private workspace"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_LINK
git push -u origin main
```

## 2. Deploy on Vercel

1. Go to https://vercel.com
2. Click **Add New Project**
3. Import your GitHub repo
4. Framework should auto-detect: **Next.js**
5. Add environment variables:

```env
TEAM_ACCESS_CODE=your_private_team_code
ADMIN_SECRET=your_admin_secret
IMPROX_GENIUS_API_KEY=your_api_key_optional
IMPROX_GENIUS_API_URL=https://api.openai.com/v1/chat/completions
IMPROX_GENIUS_MODEL=gpt-4.1
```

6. Click Deploy

## 3. Connect domain later

Suggested domain:

```text
ai.improxmedia.com
```

For today, Vercel preview link is enough.
