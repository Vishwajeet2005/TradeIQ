import { useState } from 'react'
import { Button, Input, Select, Textarea, Alert } from './ui'
import s from './LogModal.module.css'

const EMOTIONS = ['disciplined', 'confident', 'neutral', 'impulsive', 'overconfident', 'anxious', 'fearful']
const SETUPS = ['Breakout', 'Breakdown', 'RSI Divergence', 'Support bounce', 'Resistance rejection', 'EMA crossover', 'Supply zone', 'Demand zone', 'Range breakout', 'Trend continuation', 'Reversal', 'Other']

export default function LogModal({ onClose, onSave }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({ coin: '', pair: '', direction: 'long', entry: '', exit: '', size: '', sl: '', tp: '', rr: '', emotion: 'disciplined', setup: '', notes: '', date: today, duration: '' })
  const [step, setStep] = useState(1)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setError('') }

  const pnl = form.entry && form.exit && form.size
    ? +((((form.direction === 'long' ? form.exit - form.entry : form.entry - form.exit) / form.entry) * form.size)).toFixed(2)
    : null

  const autoRR = form.entry && form.sl && form.tp
    ? +((Math.abs(form.tp - form.entry) / Math.abs(form.entry - form.sl)).toFixed(2))
    : null

  function validateStep1() {
    if (!form.coin.trim()) return 'Coin is required.'
    if (!form.entry || isNaN(+form.entry)) return 'Entry price is required.'
    if (!form.exit || isNaN(+form.exit)) return 'Exit price is required.'
    if (!form.size || isNaN(+form.size) || +form.size <= 0) return 'Position size is required.'
    return ''
  }

  function handleNext() {
    const err = validateStep1()
    if (err) { setError(err); return }
    setStep(2)
  }

  function handleSave() {
    if (!form.setup) { setError('Please select a trade setup.'); return }
    const trade = {
      ...form,
      coin: form.coin.toUpperCase().trim(),
      pair: form.pair || `${form.coin.toUpperCase()}/USDT`,
      entry: +form.entry, exit: +form.exit, size: +form.size,
      sl: form.sl ? +form.sl : null,
      tp: form.tp ? +form.tp : null,
      rr: autoRR || (form.rr ? +form.rr : null),
      pnl,
      tags: [],
    }
    onSave(trade)
    setSaved(true)
    setTimeout(onClose, 1200)
  }

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <div className={s.header}>
          <div>
            <div className={s.title}>Log trade</div>
            <div className={s.subtitle}>Step {step} of 2</div>
          </div>
          <div className={s.header_right}>
            <div className={s.steps}>
              <div className={`${s.step_dot} ${step >= 1 ? s.step_done : ''}`} />
              <div className={s.step_line} />
              <div className={`${s.step_dot} ${step >= 2 ? s.step_done : ''}`} />
            </div>
            <button className={s.close_btn} onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {saved ? (
          <div className={s.saved}>
            <div className={s.saved_check}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div className={s.saved_title}>Trade logged</div>
            <div className={s.saved_sub}>+80 XP added to your account</div>
          </div>
        ) : (
          <div className={s.body}>
            {error && <Alert type="error">{error}</Alert>}

            {step === 1 && (
              <div className={s.grid}>
                <div className={s.row_2}>
                  <Input label="Coin" placeholder="BTC" value={form.coin} onChange={e => set('coin', e.target.value)} />
                  <Input label="Date" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
                </div>

                <div className={s.direction_field}>
                  <label className={s.field_label}>Direction</label>
                  <div className={s.direction_btns}>
                    <button className={`${s.dir_btn} ${form.direction === 'long' ? s.dir_long : ''}`} onClick={() => set('direction', 'long')}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                      Long
                    </button>
                    <button className={`${s.dir_btn} ${form.direction === 'short' ? s.dir_short : ''}`} onClick={() => set('direction', 'short')}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                      Short
                    </button>
                  </div>
                </div>

                <div className={s.row_3}>
                  <Input label="Entry ($)" type="number" placeholder="0.00" value={form.entry} onChange={e => set('entry', e.target.value)} />
                  <Input label="Exit ($)" type="number" placeholder="0.00" value={form.exit} onChange={e => set('exit', e.target.value)} />
                  <Input label="Size ($)" type="number" placeholder="0.00" value={form.size} onChange={e => set('size', e.target.value)} />
                </div>

                <div className={s.row_3}>
                  <Input label="Stop Loss ($)" type="number" placeholder="Optional" value={form.sl} onChange={e => set('sl', e.target.value)} />
                  <Input label="Take Profit ($)" type="number" placeholder="Optional" value={form.tp} onChange={e => set('tp', e.target.value)} />
                  <Input label="Hold Duration" placeholder="e.g. 4h 30m" value={form.duration} onChange={e => set('duration', e.target.value)} />
                </div>

                {pnl !== null && (
                  <div className={`${s.pnl_row} ${pnl >= 0 ? s.pnl_pos : s.pnl_neg}`}>
                    <span>Estimated P&L</span>
                    <span>{pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}</span>
                    {autoRR && <span className={s.rr_pill}>R:R {autoRR}</span>}
                  </div>
                )}

                <Button variant="primary" size="lg" style={{ width: '100%' }} onClick={handleNext}>
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className={s.grid}>
                <Select label="Trade setup" value={form.setup} onChange={e => set('setup', e.target.value)}>
                  <option value="">Select a setup...</option>
                  {SETUPS.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>

                <div className={s.direction_field}>
                  <label className={s.field_label}>Emotional state</label>
                  <div className={s.emotion_grid}>
                    {EMOTIONS.map(e => (
                      <button key={e} className={`${s.emotion_btn} ${form.emotion === e ? s.emotion_active : ''}`} onClick={() => set('emotion', e)}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <Textarea label="Trade notes" placeholder="Why did you enter? What was the thesis? What went right or wrong? What would you do differently?" value={form.notes} onChange={e => set('notes', e.target.value)} rows={4} />

                <div className={s.row_2}>
                  <Button variant="secondary" size="lg" style={{ flex: 1 }} onClick={() => setStep(1)}>Back</Button>
                  <Button variant="primary" size="lg" style={{ flex: 2 }} onClick={handleSave}>Save trade</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
