# TradeIQ
 
![Status](https://img.shields.io/badge/Status-Active-success) ![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Groq-informational) ![AI](https://img.shields.io/badge/AI-Qwen%20QwQ--32B-purple)
 
**Professional crypto trading journal with AI-powered analysis and predictions — built for real traders.**
 
---
 
## What it does
 
TradeIQ is a local-first trading journal that turns your trade log into a learning machine. Every trade you record feeds an AI analysis engine (Qwen QwQ-32B via Groq) that surfaces patterns, mistakes, and market structure insights you'd otherwise miss.
 
---
 
## Features
 
- **Authentication** — register/login with per-user data isolation
- **Overview dashboard** — 6 KPIs, recent trades table, cumulative P&L chart, setup breakdown
- **Journal** — full trade log with sortable columns, filters, search, expandable notes
- **AI Analysis** — 4 analysis types powered by Qwen QwQ-32B via Groq API
- **Predictions** — AI market structure analysis for any coin and timeframe
- **Progress system** — XP, level roadmap, achievement tracking
- **Dark mode** — system-aware toggle, persisted to localStorage
---
 
## Tech stack
 
| Layer | Technology |
|---|---|
| Frontend | React + Vite (multi-page SPA) |
| Routing | React Router v6 |
| Styling | CSS Modules (no Tailwind, no UI libraries) |
| Charts | Recharts (P&L visualisation) |
| AI | Groq API + Qwen QwQ-32B |
| Storage | localStorage (local-first, zero backend required) |
 
---
 
## Getting started
 
```bash
git clone https://github.com/Vishwajeet2005/TradeIQ.git
cd TradeIQ/tradeiq2
npm install
npm run dev
# Open http://localhost:5173
```
 
**To enable AI features:**
 
1. Get a free API key at [console.groq.com](https://console.groq.com)
2. In the app, navigate to AI Analysis or Predictions
3. Paste your key when prompted — stored in localStorage only, never sent to any server other than Groq
---
 
## Deployment
 
```bash
npm run build
# Upload dist/ to Vercel, Netlify, or Cloudflare Pages
```
 
No environment variables needed — the Groq key is user-provided at runtime.
 
---
 
## Roadmap
 
- [ ] Replace localStorage with Supabase for cloud sync and multi-device access
- [ ] Real-time crypto prices via CoinGecko API
- [ ] Webhook alerts when AI predictions match open trades
- [ ] Mobile app with Expo (same API, same data model)
 
