# IMPROX MEDIA AI Playground

White-label AI playground starter for IMPROX MEDIA.

Users only see IMPROX branding and selected branded models:

- IMPROX Genius Pro — premium chat/agent model
- IMPROX Vision Studio — image generation
- IMPROX Video Studio — video generation

## Important

Do not put API keys in frontend code. Backend routes call providers securely.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

## Deploy

Recommended:

- GitHub repository
- Vercel deployment
- Environment variables in Vercel dashboard
- Supabase/Clerk/Firebase for production auth

## Production checklist

- Replace demo access control in `lib/auth.ts` with Clerk/Supabase Auth
- Connect real providers in `lib/providers.ts`
- Add database for users, credits, usage logs
- Add payments via Razorpay/Stripe
- Add privacy policy and terms

## Fast private team launch

See `FAST_LAUNCH.md`.

This version uses a simple private team access code:

```env
TEAM_ACCESS_CODE=IMPROX-TEAM-2026
```

Change this before sharing the app.
