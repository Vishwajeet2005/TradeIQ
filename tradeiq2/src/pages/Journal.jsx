import { useState } from 'react'
import { Card, Badge, Button, Input, Empty } from '../components/ui'
import LogModal from '../components/LogModal'
import s from './Journal.module.css'

const FILTERS = ['All', 'Winners', 'Losers', 'Long', 'Short']
const EMOTION_COLORS = {
  disciplined: 'success', confident: 'success', neutral: 'neutral',
  impulsive: 'danger', overconfident: 'warning', anxious: 'warning', fearful: 'danger'
}

export default function Journal({ trades, onAdd, onDelete }) {
  const [modal, setModal] = useState(false)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [sortKey, setSortKey] = useState('date')
  const [sortDir, setSortDir] = useState('desc')

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const filtered = trades
    .filter(t => {
      const q = search.toLowerCase()
      const matchSearch = !q || t.coin?.toLowerCase().includes(q) || t.setup?.toLowerCase().includes(q) || t.notes?.toLowerCase().includes(q)
      const matchFilter =
        filter === 'All' ? true :
        filter === 'Winners' ? t.pnl > 0 :
        filter === 'Losers' ? t.pnl < 0 :
        filter === 'Long' ? t.direction === 'long' :
        filter === 'Short' ? t.direction === 'short' : true
      return matchSearch && matchFilter
    })
    .sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey]
      if (sortKey === 'pnl') { va = +va; vb = +vb }
      if (sortKey === 'date') { va = new Date(va); vb = new Date(vb) }
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
    })

  const totalPnl = filtered.reduce((s, t) => s + (t.pnl || 0), 0)
  const SortIcon = ({ col }) => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: sortKey === col ? 1 : 0.3, marginLeft: 3 }}>
      {sortDir === 'asc' && sortKey === col
        ? <polyline points="18 15 12 9 6 15"/>
        : <polyline points="6 9 12 15 18 9"/>}
    </svg>
  )

  return (
    <div className={s.page}>
      <div className={s.topbar}>
        <div>
          <h1 className={s.title}>Journal</h1>
          <p className={s.sub}>{trades.length} trades logged</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setModal(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Log trade
        </Button>
      </div>

      <div className={s.toolbar}>
        <div className={s.filters}>
          {FILTERS.map(f => (
            <button key={f} className={`${s.filter_btn} ${filter === f ? s.filter_active : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div className={s.toolbar_right}>
          <Input placeholder="Search coin, setup, notes…" value={search} onChange={e => setSearch(e.target.value)} className={s.search} />
          {filtered.length > 0 && (
            <div className={`${s.summary} ${totalPnl >= 0 ? s.pos : s.neg}`}>
              {filtered.length} trades · {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      <Card padding={false}>
        {filtered.length === 0
          ? <Empty title="No trades found" description="Try adjusting your filters or log a new trade." action={<Button variant="primary" size="sm" onClick={() => setModal(true)}>Log trade</Button>} />
          : (
            <table className={s.table}>
              <thead>
                <tr>
                  <th onClick={() => toggleSort('date')} className={s.sortable}>Date <SortIcon col="date" /></th>
                  <th>Asset</th>
                  <th>Setup</th>
                  <th>Dir</th>
                  <th onClick={() => toggleSort('entry')} className={s.sortable}>Entry <SortIcon col="entry" /></th>
                  <th onClick={() => toggleSort('exit')} className={s.sortable}>Exit <SortIcon col="exit" /></th>
                  <th>Size</th>
                  <th>R:R</th>
                  <th onClick={() => toggleSort('pnl')} className={s.sortable}>P&L <SortIcon col="pnl" /></th>
                  <th>Emotion</th>
                  <th>Hold</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <>
                    <tr key={t.id} className={`${s.row} ${expanded === t.id ? s.row_open : ''}`} onClick={() => setExpanded(expanded === t.id ? null : t.id)}>
                      <td className={s.date_cell}>{t.date}</td>
                      <td>
                        <div className={s.asset_cell}>
                          <div className={s.asset_dot}>{t.coin?.[0]}</div>
                          <span className={s.asset_name}>{t.coin}</span>
                        </div>
                      </td>
                      <td className={s.setup_cell}>{t.setup || <span className={s.empty_cell}>—</span>}</td>
                      <td><Badge variant={t.direction}>{t.direction}</Badge></td>
                      <td>${t.entry?.toLocaleString()}</td>
                      <td>${t.exit?.toLocaleString()}</td>
                      <td className={s.muted}>${t.size?.toLocaleString()}</td>
                      <td className={s.muted}>{t.rr ?? '—'}</td>
                      <td className={t.pnl >= 0 ? s.pos : s.neg} style={{ fontWeight: 600 }}>
                        {t.pnl >= 0 ? '+' : ''}${t.pnl?.toFixed(2)}
                      </td>
                      <td><Badge variant={EMOTION_COLORS[t.emotion] || 'neutral'}>{t.emotion}</Badge></td>
                      <td className={s.muted}>{t.duration || '—'}</td>
                      <td>
                        <button className={s.del_btn} onClick={e => { e.stopPropagation(); onDelete(t.id) }} title="Delete trade">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                        </button>
                      </td>
                    </tr>
                    {expanded === t.id && (
                      <tr key={`${t.id}-exp`} className={s.expanded_row}>
                        <td colSpan={12}>
                          <div className={s.expanded}>
                            <div className={s.exp_section}>
                              <div className={s.exp_label}>Trade Notes</div>
                              <div className={s.exp_text}>{t.notes || 'No notes recorded.'}</div>
                            </div>
                            {t.tags?.length > 0 && (
                              <div className={s.exp_section}>
                                <div className={s.exp_label}>Tags</div>
                                <div className={s.exp_tags}>{t.tags.map(tag => <span key={tag} className={s.tag}>{tag}</span>)}</div>
                              </div>
                            )}
                            <div className={s.exp_stats}>
                              {t.sl && <div className={s.exp_stat}><span className={s.exp_stat_label}>Stop Loss</span><span className={s.neg}>${t.sl}</span></div>}
                              {t.tp && <div className={s.exp_stat}><span className={s.exp_stat_label}>Take Profit</span><span className={s.pos}>${t.tp}</span></div>}
                              {t.rr && <div className={s.exp_stat}><span className={s.exp_stat_label}>R:R</span><span>{t.rr}</span></div>}
                              {t.duration && <div className={s.exp_stat}><span className={s.exp_stat_label}>Duration</span><span>{t.duration}</span></div>}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}
      </Card>

      {modal && <LogModal onClose={() => setModal(false)} onSave={t => { onAdd(t); setModal(false) }} />}
    </div>
  )
}
