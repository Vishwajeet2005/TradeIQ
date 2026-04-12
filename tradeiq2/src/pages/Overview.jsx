import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, Stat, Badge, Button, Empty } from '../components/ui'
import LogModal from '../components/LogModal'
import s from './Overview.module.css'

function PnlTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const v = payload[0].value
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 10px', fontSize: 12 }}>
      <div style={{ fontWeight: 600, color: v >= 0 ? 'var(--green)' : 'var(--red)' }}>{v >= 0 ? '+' : ''}${v.toFixed(2)}</div>
    </div>
  )
}

export default function Overview({ trades, stats, onAdd }) {
  const [modal, setModal] = useState(false)
  const recent = trades.slice(0, 7)
  const pnlPos = stats.totalPnl >= 0

  // Weekly bar data
  const weekData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => ({
    day,
    pnl: trades[i]?.pnl ?? 0,
  }))

  return (
    <div className={s.page}>
      <div className={s.topbar}>
        <div>
          <h1 className={s.title}>Overview</h1>
          <p className={s.sub}>Performance summary across {stats.totalTrades} trades</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setModal(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Log trade
        </Button>
      </div>

      {/* KPI row */}
      <div className={s.kpi_row}>
        {[
          { label: 'Total P&L', value: `${pnlPos ? '+' : ''}$${stats.totalPnl.toLocaleString()}`, change: pnlPos ? 'Profitable' : 'In drawdown', changeType: pnlPos ? 'pos' : 'neg' },
          { label: 'Win Rate', value: `${stats.winRate}%`, sub: `${stats.wins}W / ${stats.losses}L` },
          { label: 'Avg R:R', value: stats.avgRR, sub: 'Risk-reward ratio' },
          { label: 'Profit Factor', value: stats.profitFactor, sub: stats.profitFactor > 1 ? 'Above break-even' : 'Below break-even' },
          { label: 'Avg Win', value: `$${stats.avgWin}`, changeType: 'pos', change: `vs -$${Math.abs(stats.avgLoss)} loss` },
          { label: 'Trades', value: stats.totalTrades, sub: `${stats.streak}-day streak` },
        ].map((k, i) => (
          <Card key={i} padding={false} className={s.kpi_card}>
            <div className={s.kpi_inner}>
              <Stat {...k} />
            </div>
          </Card>
        ))}
      </div>

      <div className={s.grid}>
        {/* Left: recent trades */}
        <div className={s.left}>
          <Card padding={false}>
            <div className={s.card_header}>
              <span className={s.card_title}>Recent Trades</span>
            </div>
            {recent.length === 0 ? (
              <Empty title="No trades yet" description="Log your first trade to see it here." action={<Button variant="primary" size="sm" onClick={() => setModal(true)}>Log trade</Button>} />
            ) : (
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Setup</th>
                    <th>Dir</th>
                    <th>Entry</th>
                    <th>Exit</th>
                    <th>R:R</th>
                    <th>P&L</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map(t => (
                    <tr key={t.id}>
                      <td>
                        <div className={s.asset_cell}>
                          <div className={s.asset_dot}>{t.coin?.[0]}</div>
                          <div>
                            <div className={s.asset_name}>{t.coin}</div>
                            <div className={s.asset_pair}>{t.pair}</div>
                          </div>
                        </div>
                      </td>
                      <td className={s.setup_cell}>{t.setup || '—'}</td>
                      <td><Badge variant={t.direction}>{t.direction}</Badge></td>
                      <td>${t.entry?.toLocaleString()}</td>
                      <td>${t.exit?.toLocaleString()}</td>
                      <td className={s.rr_cell}>{t.rr ?? '—'}</td>
                      <td className={t.pnl >= 0 ? s.pos : s.neg}>{t.pnl >= 0 ? '+' : ''}${t.pnl?.toFixed(2)}</td>
                      <td className={s.date_cell}>{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className={s.right}>
          <Card padding={false}>
            <div className={s.card_header}>
              <span className={s.card_title}>Cumulative P&L</span>
              <span className={`${s.card_val} ${pnlPos ? s.pos : s.neg}`}>{pnlPos ? '+' : ''}${stats.totalPnl.toFixed(2)}</span>
            </div>
            <div className={s.chart_area}>
              <ResponsiveContainer width="100%" height={130}>
                <LineChart data={stats.pnlCurve} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <YAxis hide />
                  <Tooltip content={<PnlTooltip />} />
                  <Line type="monotone" dataKey="pnl" stroke={pnlPos ? 'var(--green)' : 'var(--red)'} strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card padding={false}>
            <div className={s.card_header}>
              <span className={s.card_title}>Setups</span>
            </div>
            <div className={s.setup_list}>
              {Object.entries(stats.setupBreakdown).sort((a,b) => b[1]-a[1]).slice(0,6).map(([setup, count]) => (
                <div key={setup} className={s.setup_row}>
                  <span className={s.setup_name}>{setup}</span>
                  <div className={s.setup_bar_wrap}>
                    <div className={s.setup_bar} style={{ width: `${(count / stats.totalTrades) * 100}%` }} />
                  </div>
                  <span className={s.setup_count}>{count}</span>
                </div>
              ))}
            </div>
          </Card>

          {stats.bestTrade && (
            <Card padding={false}>
              <div className={s.card_header}><span className={s.card_title}>Notable Trades</span></div>
              <div className={s.notable_list}>
                <div className={s.notable_row}>
                  <span className={s.notable_label}>Best trade</span>
                  <span className={s.pos}>{stats.bestTrade.coin} +${stats.bestTrade.pnl?.toFixed(2)}</span>
                </div>
                <div className={s.notable_row}>
                  <span className={s.notable_label}>Worst trade</span>
                  <span className={s.neg}>{stats.worstTrade?.coin} ${stats.worstTrade?.pnl?.toFixed(2)}</span>
                </div>
                <div className={s.notable_row}>
                  <span className={s.notable_label}>Most traded</span>
                  <span>{Object.entries(trades.reduce((a,t)=>{a[t.coin]=(a[t.coin]||0)+1;return a},{})).sort((a,b)=>b[1]-a[1])[0]?.[0] ?? '—'}</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {modal && <LogModal onClose={() => setModal(false)} onSave={t => { onAdd(t); setModal(false) }} />}
    </div>
  )
}
