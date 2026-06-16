# CEO Launch Brief — IMPROX AI Private Team Workspace

## Decision

We are launching a simple private MVP, not a complex SaaS product.

Goal: get IMPROX MEDIA team using the private AI workspace today.

## Product positioning

Name: **IMPROX AI**

Public message:

> IMPROX AI is a private AI workspace by IMPROX MEDIA for faster content, creative planning, image concepts, and video briefs.

## What team members see

Only three simple tools:

1. **IMPROX Genius Pro** — content, captions, campaigns, strategy, writing
2. **IMPROX Vision Studio** — image/ad/poster prompt creator
3. **IMPROX Video Studio** — reel/ad/video concept creator

They do not see backend provider names.

## Today's launch scope

### Included now

- Private code login
- Branded IMPROX interface
- Simple prompt box
- Quick prompt buttons
- Copy output button
- Admin view
- Protected app routes
- Server-side provider routing
- Real chat connector ready via environment variable

### Not included today

- Full database
- Billing
- Complex user management
- Full image/video generation API processing
- Team analytics

These come after the MVP is validated.

## Fastest way to make real AI work

Add an OpenAI-compatible API key in Vercel or `.env.local`:

```env
IMPROX_GENIUS_API_KEY=your_key
IMPROX_GENIUS_API_URL=https://api.openai.com/v1/chat/completions
IMPROX_GENIUS_MODEL=gpt-4.1
TEAM_ACCESS_CODE=your_private_team_code
```

If you use another OpenAI-compatible gateway, change only `IMPROX_GENIUS_API_URL` and `IMPROX_GENIUS_MODEL`.

## Access code policy

- Share the access code only with internal IMPROX MEDIA team.
- Change code weekly during MVP.
- Do not post code in public WhatsApp/Telegram groups.

## 2-hour launch plan

### 0–20 min

- Create GitHub repository
- Push project folder

### 20–45 min

- Import repo to Vercel
- Add environment variables
- Deploy

### 45–75 min

- Test login
- Test Genius Pro
- Test Vision Studio prompt output
- Test Video Studio brief output

### 75–100 min

- Share link with 2–3 trusted internal users
- Ask them to create captions/campaigns/video ideas

### 100–120 min

- Fix only urgent issues
- Share to wider team

## Team instruction message

Send this to your team:

> Team, we are testing our private IMPROX AI workspace today. Use it for captions, campaign ideas, content planning, image prompts, and video concepts. Please do not share the link or access code outside IMPROX MEDIA. Keep prompts simple and direct.

## Legal-safe footer text

> IMPROX AI may use trusted third-party AI infrastructure providers to process requests securely. Access and user experience are managed by IMPROX MEDIA.
