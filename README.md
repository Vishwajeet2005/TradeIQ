# TradeIQ — Professional Crypto Trading Journal

A production-ready crypto trading journal built for real traders.

## Tech Stack
- React + Vite (multi-page SPA)
- React Router v6
- CSS Modules (zero Tailwind, zero UI libraries)
- Recharts (P&L charts)
- Groq API + Qwen QwQ-32B (AI analysis & predictions)
- localStorage (per-user data persistence)

## Features
- **Authentication** — Register/login with per-user data isolation
- **Dark mode** — System-aware toggle, persisted to localStorage
- **Overview** — 6 KPIs, recent trades table, cumulative P&L chart, setup breakdown
- **Journal** — Full trade log with sortable columns, filters, search, expandable notes
- **AI Analysis** — 4 analysis types powered by Qwen QwQ-32B via Groq
- **Predictions** — AI market structure analysis for any coin/timeframe
- **Progress** — XP system, level roadmap, achievement tracking

## Run locally

```bash
npm install
npm run dev
```
Open http://localhost:5173

## Setup Groq API (for AI features)
1. Go to console.groq.com → sign up free
2. Go to API Keys → Create key
3. In the app, navigate to AI Analysis or Predictions
4. Paste your key when prompted (stored locally only)

## Deploy to production

```bash
npm run build
# Upload dist/ to Vercel / Netlify / Cloudflare Pages
```

One-click deploy on Vercel:
1. Push to GitHub
2. Import to vercel.com
3. Deploy (no env vars needed — Groq key is user-provided)

## Monetization path
- Free tier: Full journal, 5 AI analyses/month
- Pro tier: Unlimited AI analyses + predictions → $9.99/month
- Gate the API calls with a usage counter in localStorage
- Add Stripe Checkout for payment
- 100 paid users = ~$1,000/month MRR

## Scaling roadmap
1. Replace localStorage with Supabase (free tier) for cloud sync
2. Add real-time crypto prices via CoinGecko API
3. Add webhook alerts when predictions match your open trades
4. Build a mobile app with Expo (same API, same data)
