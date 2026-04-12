import { useState, useEffect } from 'react'

const SAMPLE = [
  { id: 1, coin: 'BTC', pair: 'BTC/USDT', direction: 'long', entry: 83200, exit: 84420, size: 5000, pnl: 294.2, rr: 2.4, emotion: 'disciplined', setup: 'Breakout', notes: 'Clean breakout above weekly resistance. Sized in at 50%, added on retest. Exited at planned TP.', date: '2026-04-12', duration: '4h 20m', tags: ['breakout', 'trend-following'] },
  { id: 2, coin: 'ETH', pair: 'ETH/USDT', direction: 'short', entry: 1840, exit: 1876, size: 3000, pnl: -140.8, rr: -1.2, emotion: 'impulsive', setup: 'Counter-trend', notes: 'Went against the dominant trend. Entered without confirmation. Classic mistake.', date: '2026-04-11', duration: '1h 05m', tags: ['revenge', 'counter-trend'] },
  { id: 3, coin: 'SOL', pair: 'SOL/USDT', direction: 'long', entry: 132.4, exit: 148.2, size: 8000, pnl: 953.2, rr: 3.1, emotion: 'disciplined', setup: 'RSI Divergence', notes: 'Bullish divergence on 4H. Patient entry after confirmation candle. Let the trade run to full target.', date: '2026-04-11', duration: '11h 40m', tags: ['divergence', 'swing'] },
  { id: 4, coin: 'AVAX', pair: 'AVAX/USDT', direction: 'long', entry: 28.1, exit: 26.8, size: 2000, pnl: -95.4, rr: -1.0, emotion: 'overconfident', setup: 'Support bounce', notes: 'Oversized position at support level. Did not wait for confirmation. Support broke.', date: '2026-04-10', duration: '2h 15m', tags: ['oversized', 'no-confirmation'] },
  { id: 5, coin: 'LINK', pair: 'LINK/USDT', direction: 'short', entry: 14.2, exit: 12.8, size: 4000, pnl: 394.4, rr: 2.8, emotion: 'disciplined', setup: 'Supply zone', notes: 'Supply zone rejection on 1H. Clear structure. Held position through minor pullback.', date: '2026-04-09', duration: '6h 30m', tags: ['supply-zone', 'structure'] },
  { id: 6, coin: 'BTC', pair: 'BTC/USDT', direction: 'long', entry: 81400, exit: 83100, size: 6000, pnl: 625.3, rr: 2.6, emotion: 'disciplined', setup: 'Demand zone', notes: 'Key demand zone on daily. Bought with 2R setup. Scaled out 50% at 1R, let rest run.', date: '2026-04-08', duration: '8h 10m', tags: ['demand-zone', 'scaling'] },
  { id: 7, coin: 'BNB', pair: 'BNB/USDT', direction: 'long', entry: 598, exit: 621, size: 3500, pnl: 134.5, rr: 1.9, emotion: 'neutral', setup: 'EMA crossover', notes: 'EMA 20/50 crossover on 2H. Average setup, average result.', date: '2026-04-07', duration: '5h 00m', tags: ['ema', 'crossover'] },
  { id: 8, coin: 'MATIC', pair: 'MATIC/USDT', direction: 'short', entry: 0.62, exit: 0.58, size: 2500, pnl: 161.3, rr: 2.2, emotion: 'disciplined', setup: 'Range breakdown', notes: 'Clean range breakdown with volume confirmation. Textbook execution.', date: '2026-04-06', duration: '3h 45m', tags: ['breakdown', 'volume'] },
]

function key(userId) { return `tiq_trades_${userId}` }

export function useTrades(userId) {
  const [trades, setTrades] = useState(() => {
    if (!userId) return []
    try {
      const saved = localStorage.getItem(key(userId))
      return saved ? JSON.parse(saved) : SAMPLE
    } catch { return SAMPLE }
  })

  useEffect(() => {
    if (userId) localStorage.setItem(key(userId), JSON.stringify(trades))
  }, [trades, userId])

  useEffect(() => {
    if (!userId) return
    try {
      const saved = localStorage.getItem(key(userId))
      setTrades(saved ? JSON.parse(saved) : SAMPLE)
    } catch { setTrades(SAMPLE) }
  }, [userId])

  function addTrade(trade) {
    const t = { ...trade, id: Date.now() }
    setTrades(prev => [t, ...prev])
    return t
  }

  function deleteTrade(id) { setTrades(prev => prev.filter(t => t.id !== id)) }

  function updateTrade(id, updates) { setTrades(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t)) }

  const wins = trades.filter(t => t.pnl > 0)
  const losses = trades.filter(t => t.pnl < 0)
  const totalPnl = trades.reduce((s, t) => s + t.pnl, 0)
  const avgRR = trades.length ? (trades.reduce((s, t) => s + (t.rr || 0), 0) / trades.length).toFixed(2) : 0
  const profitFactor = losses.length
    ? Math.abs(wins.reduce((s, t) => s + t.pnl, 0) / losses.reduce((s, t) => s + t.pnl, 0)).toFixed(2)
    : 'N/A'

  const stats = {
    totalPnl: +totalPnl.toFixed(2),
    winRate: trades.length ? Math.round((wins.length / trades.length) * 100) : 0,
    totalTrades: trades.length,
    wins: wins.length,
    losses: losses.length,
    avgWin: wins.length ? +(wins.reduce((s, t) => s + t.pnl, 0) / wins.length).toFixed(2) : 0,
    avgLoss: losses.length ? +(losses.reduce((s, t) => s + t.pnl, 0) / losses.length).toFixed(2) : 0,
    avgRR: +avgRR,
    profitFactor,
    streak: 7,
    xp: 1340,
    level: 7,
    emotionBreakdown: trades.reduce((a, t) => { a[t.emotion] = (a[t.emotion] || 0) + 1; return a }, {}),
    bestTrade: trades.reduce((b, t) => t.pnl > (b?.pnl ?? -Infinity) ? t : b, null),
    worstTrade: trades.reduce((b, t) => t.pnl < (b?.pnl ?? Infinity) ? t : b, null),
    setupBreakdown: trades.reduce((a, t) => { if (t.setup) a[t.setup] = (a[t.setup] || 0) + 1; return a }, {}),
    pnlCurve: (() => { let r = 0; return [...trades].reverse().map((t, i) => ({ i, pnl: +(r += t.pnl).toFixed(2), date: t.date })) })(),
  }

  return { trades, addTrade, deleteTrade, updateTrade, stats }
}
