import { useState } from 'react'
import { Card, Button, Input, Select, Alert, Badge } from '../components/ui'
import { groqChat, hasGroqKey, setGroqKey, getGroqKey } from '../lib/groq'
import s from './Predictions.module.css'

const COINS = ['BTC', 'ETH', 'SOL', 'BNB', 'AVAX', 'LINK', 'MATIC', 'ADA', 'DOT', 'XRP']
const TIMEFRAMES = ['1H', '4H', '1D', '3D', '1W']

const SYSTEM = `You are a professional quantitative crypto market analyst with deep expertise in technical analysis, on-chain metrics, and market structure. 
You provide structured, data-driven analysis reports — not financial advice. 
You are precise, objective, and professional. 
Always include a clear disclaimer that this is analytical output only, not financial advice.
Format responses with clear ## section headers.`

const PREDICTION_PROMPT = (coin, tf, price, context) => `Generate a professional market analysis report for ${coin}/USDT on the ${tf} timeframe.

Current price context: ${price ? `Current price: $${price}` : 'No price provided'}
${context ? `Additional context from trader: ${context}` : ''}

Provide a structured analysis report with the following sections:

## Market Structure
Analyze the current market structure (higher highs/lows, distribution, accumulation, etc.)

## Key Levels
Identify 2-3 critical support and resistance levels with specific price targets.

## Trend Assessment
Current trend direction, strength, and potential reversal signals.

## Scenario Analysis
## Bullish Case
Conditions for bullish continuation and price targets.

## Bearish Case
Conditions for bearish reversal and downside targets.

## Risk Factors
Key risks and events that could invalidate either scenario.

## Summary
A concise 2-3 sentence summary of the overall outlook.

BIAS: [BULLISH/BEARISH/NEUTRAL] | CONFIDENCE: [LOW/MEDIUM/HIGH] | TIMEFRAME: ${tf}

Disclaimer: This is algorithmic analysis for educational purposes only. Not financial advice. Always do your own research and manage risk appropriately.`

function ApiKeySetup({ onSave }) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  function save() {
    if (!key.trim().startsWith('gsk_')) return setError('Groq API keys start with "gsk_". Get yours at console.groq.com')
    setGroqKey(key.trim()); onSave()
  }
  return (
    <Card className={s.key_card}>
      <div className={s.key_header}>
        <div className={s.key_title}>Connect Groq API</div>
        <div className={s.key_sub}>AI Predictions require a free Groq API key. Your key is stored locally only.</div>
      </div>
      <div className={s.key_body}>
        <Input label="Groq API Key" type="password" placeholder="gsk_..." value={key} onChange={e => { setKey(e.target.value); setError('') }} error={error} hint="Get a free key at console.groq.com → API Keys" />
        <Button variant="primary" size="lg" style={{ width: '100%' }} onClick={save}>Save and continue</Button>
      </div>
    </Card>
  )
}

function formatPrediction(text) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    if (line.startsWith('## ')) return <div key={i} className={s.r_heading}>{line.slice(3)}</div>
    if (line.startsWith('# ')) return <div key={i} className={s.r_h1}>{line.slice(2)}</div>
    if (line.match(/^(BIAS:|CONFIDENCE:|TIMEFRAME:)/)) return null
    if (line.toLowerCase().includes('disclaimer:')) return <div key={i} className={s.r_disclaimer}>{line}</div>
    if (line.trim() === '') return <div key={i} className={s.r_gap} />
    if (line.startsWith('- ') || line.startsWith('• ')) return <div key={i} className={s.r_bullet}>{line.slice(2)}</div>
    const html = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
    return <p key={i} className={s.r_para} dangerouslySetInnerHTML={{ __html: html }} />
  })
}

export default function Predictions() {
  const [hasKey, setHasKey] = useState(hasGroqKey)
  const [coin, setCoin] = useState('BTC')
  const [customCoin, setCustomCoin] = useState('')
  const [timeframe, setTimeframe] = useState('4H')
  const [price, setPrice] = useState('')
  const [context, setContext] = useState('')
  const [result, setResult] = useState(null)
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])

  const activeCoin = customCoin.trim().toUpperCase() || coin

  async function runPrediction() {
    setLoading(true); setResult(null); setMeta(null); setError('')
    try {
      const text = await groqChat(
        [{ role: 'user', content: PREDICTION_PROMPT(activeCoin, timeframe, price, context) }],
        SYSTEM,
        { temperature: 0.5, maxTokens: 1600 }
      )
      const biasMatch = text.match(/BIAS:\s*(BULLISH|BEARISH|NEUTRAL)/i)
      const confMatch = text.match(/CONFIDENCE:\s*(LOW|MEDIUM|HIGH)/i)
      const bias = biasMatch?.[1]?.toUpperCase() || 'NEUTRAL'
      const conf = confMatch?.[1]?.toUpperCase() || 'MEDIUM'
      const m = { bias, confidence: conf, coin: activeCoin, timeframe, timestamp: new Date().toLocaleString() }
      setMeta(m)
      setResult(text)
      setHistory(h => [m, ...h.slice(0, 4)])
    } catch (e) {
      if (e.message === 'NO_KEY') { setHasKey(false); return }
      setError(e.message || 'Prediction failed. Check your API key.')
    } finally { setLoading(false) }
  }

  if (!hasKey) return (
    <div className={s.page}>
      <div className={s.topbar}><div><h1 className={s.title}>Predictions</h1><p className={s.sub}>AI-powered market analysis</p></div></div>
      <ApiKeySetup onSave={() => setHasKey(true)} />
    </div>
  )

  const biasVariant = meta?.bias === 'BULLISH' ? 'success' : meta?.bias === 'BEARISH' ? 'danger' : 'neutral'
  const confVariant = meta?.confidence === 'HIGH' ? 'success' : meta?.confidence === 'LOW' ? 'warning' : 'neutral'

  return (
    <div className={s.page}>
      <div className={s.topbar}>
        <div>
          <h1 className={s.title}>Predictions</h1>
          <p className={s.sub}>AI-powered market structure analysis · Qwen QwQ-32B via Groq</p>
        </div>
        <div className={s.disclaimer_pill}>For educational purposes only — not financial advice</div>
      </div>

      <div className={s.grid}>
        <div className={s.input_col}>
          <Card padding={false}>
            <div className={s.card_header}><span className={s.card_title}>Analysis Parameters</span></div>
            <div className={s.card_body}>
              {error && <Alert type="error">{error}</Alert>}

              <div className={s.form_row}>
                <Select label="Coin" value={coin} onChange={e => setCoin(e.target.value)}>
                  {COINS.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
                <Input label="Or enter custom" placeholder="e.g. PEPE, ARB" value={customCoin} onChange={e => setCustomCoin(e.target.value)} />
              </div>

              <div className={s.tf_field}>
                <div className={s.tf_label}>Timeframe</div>
                <div className={s.tf_row}>
                  {TIMEFRAMES.map(tf => (
                    <button key={tf} className={`${s.tf_btn} ${timeframe === tf ? s.tf_active : ''}`} onClick={() => setTimeframe(tf)}>{tf}</button>
                  ))}
                </div>
              </div>

              <Input label="Current price (optional)" type="number" placeholder="e.g. 83450" value={price} onChange={e => setPrice(e.target.value)} hint="Helps calibrate the analysis to current market conditions" />

              <div className={s.context_field}>
                <label className={s.field_label}>Additional context (optional)</label>
                <textarea
                  className={s.textarea}
                  rows={4}
                  placeholder="Describe what you're seeing on the chart, any recent news, your own thesis, or specific patterns you want analyzed..."
                  value={context}
                  onChange={e => setContext(e.target.value)}
                />
              </div>

              <Button variant="primary" size="lg" loading={loading} style={{ width: '100%' }} onClick={runPrediction}>
                Generate analysis — {activeCoin}/{timeframe}
              </Button>

              <p className={s.note}>AI analysis is based on pattern recognition and probability. Always apply your own judgment and proper risk management.</p>
            </div>
          </Card>

          {history.length > 0 && (
            <Card padding={false} className={s.history_card}>
              <div className={s.card_header}><span className={s.card_title}>Recent analyses</span></div>
              <div className={s.history_list}>
                {history.map((h, i) => (
                  <div key={i} className={s.history_item}>
                    <span className={s.history_coin}>{h.coin}/{h.timeframe}</span>
                    <Badge variant={h.bias === 'BULLISH' ? 'success' : h.bias === 'BEARISH' ? 'danger' : 'neutral'} size="sm">{h.bias}</Badge>
                    <span className={s.history_time}>{h.timestamp}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className={s.output_col}>
          {!result && !loading && (
            <Card className={s.empty_card}>
              <div className={s.empty_inner}>
                <div className={s.empty_icon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </div>
                <div className={s.empty_title}>No analysis generated</div>
                <div className={s.empty_desc}>Select a coin and timeframe, then click Generate to receive a structured market analysis report.</div>
              </div>
            </Card>
          )}

          {loading && (
            <Card className={s.loading_card}>
              <div className={s.loading_inner}>
                <div className={s.loading_dots}><div /><div /><div /></div>
                <div className={s.loading_text}>Generating {activeCoin} analysis…</div>
                <div className={s.loading_sub}>Qwen QwQ-32B is processing market structure</div>
              </div>
            </Card>
          )}

          {result && !loading && meta && (
            <div className={s.result_wrap}>
              <Card padding={false} className={s.meta_card}>
                <div className={s.meta_inner}>
                  <div className={s.meta_coin}>{meta.coin}/USDT</div>
                  <div className={s.meta_badges}>
                    <div className={s.meta_item}>
                      <div className={s.meta_label}>Bias</div>
                      <Badge variant={biasVariant} size="md">{meta.bias}</Badge>
                    </div>
                    <div className={s.meta_sep} />
                    <div className={s.meta_item}>
                      <div className={s.meta_label}>Confidence</div>
                      <Badge variant={confVariant} size="md">{meta.confidence}</Badge>
                    </div>
                    <div className={s.meta_sep} />
                    <div className={s.meta_item}>
                      <div className={s.meta_label}>Timeframe</div>
                      <span className={s.meta_val}>{meta.timeframe}</span>
                    </div>
                    <div className={s.meta_sep} />
                    <div className={s.meta_item}>
                      <div className={s.meta_label}>Generated</div>
                      <span className={s.meta_val}>{meta.timestamp}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card padding={false}>
                <div className={s.card_header}>
                  <span className={s.card_title}>Market Analysis Report</span>
                  <span className={s.powered}>Qwen QwQ-32B · Groq</span>
                </div>
                <div className={s.result_body}>{formatPrediction(result)}</div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
