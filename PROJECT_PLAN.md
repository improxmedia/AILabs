# IMPROX AI Playground — Build Plan

## Public model names

These are the only names users should see in the main product UI:

1. **IMPROX Genius Pro** — top-level paid chat/agent model
2. **IMPROX Vision Studio** — image generation model
3. **IMPROX Video Studio** — video generation model

## Private backend model mapping

Keep this mapping private in server code/environment variables.

| Public model | Suggested backend options | Notes |
|---|---|---|
| IMPROX Genius Pro | Claude Opus/Sonnet, GPT-5/GPT-4.1, Gemini Pro, Arena gateway | Use the highest-quality paid text model available to your budget. |
| IMPROX Vision Studio | FLUX Pro, GPT Image, Imagen, Arena image gateway | Good for ad creatives, thumbnails, posters. |
| IMPROX Video Studio | Google Veo, Runway, Kling, Luma, Arena video gateway | Good for reels, product videos, cinematic clips. |

## Legal-safe product wording

Use:

> IMPROX AI is an AI productivity platform by IMPROX MEDIA. Some AI processing may be powered by trusted third-party AI infrastructure providers. All access, billing, user management, and experience are controlled by IMPROX MEDIA.

Avoid claiming you trained or own the foundation model unless you actually did.

## Next technical steps

1. Choose actual API providers.
2. Add provider API keys into hosting environment variables.
3. Replace demo responses in `lib/providers.ts`.
4. Replace demo users in `lib/auth.ts` with real auth.
5. Add database tables: users, model_access, credit_ledger, generation_jobs.
6. Add admin panel forms to create/disable users and assign model access.
7. Add Razorpay/Stripe billing.
8. Deploy to Vercel under `ai.improxmedia.com`.
