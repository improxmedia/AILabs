# IMPROX AI — 2 Hour Fast Launch Guide

This version is intentionally simple for a quick private team launch.

## What is ready

- Private team code login
- IMPROX branded interface
- Friendly non-technical UI
- 3 visible tools only:
  - IMPROX Genius Pro
  - IMPROX Vision Studio
  - IMPROX Video Studio
- Server-side API routes so provider keys are not exposed
- Basic admin view

## Run locally

```bash
cd improx-ai-playground
npm install
cp .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000
```

Default team access code:

```text
IMPROX-TEAM-2026
```

## Before sharing with your team

Edit `.env.local`:

```env
TEAM_ACCESS_CODE=your_private_team_code_here
ADMIN_SECRET=your_admin_secret_here
```

## Deploy quickly on Vercel

1. Push this folder to GitHub.
2. Open Vercel.
3. Import the GitHub repository.
4. Add environment variable:

```env
TEAM_ACCESS_CODE=your_private_team_code_here
```

5. Deploy.
6. Share the Vercel link only with your team.

## Important

Current AI responses are demo placeholders. To make real AI work, connect your chosen API inside:

```text
lib/providers.ts
```

For fastest real launch, connect text/chat first, then image/video later.
