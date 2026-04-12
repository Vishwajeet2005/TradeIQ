import { useState } from 'react'
import { Card, Button, Textarea, Select, Alert, Input } from '../components/ui'
import { groqChat, hasGroqKey, setGroqKey, getGroqKey } from '../lib/groq'
import s from './Analysis.module.css'

const ANALYSIS_TYPES = [
  { id: 'full', label: 'Full breakdown', desc: 'Comprehensive review of patterns, mistakes, and strengths' },
  { id: 'mistakes', label: 'Mistakes audit', desc: 'Identify recurring errors and psychological traps' },
  { id: 'strategy', label: 'Strategy review', desc: 'Evaluate your setup quality and execution' },
  { id: 'psychology', label: 'Psychology report', desc: 'Emotional pattern analysis and mental discipline score' },
]

const SYSTEM = `You are an elite professional crypto trading coach with 15 years of experience. 
You speak directly, specifically, and professionally — like a senior fund manager reviewing a junior trader's performance. 
No fluff. No generic advice. Reference specific trades, numbers, and patterns from the data provided.
Format your response with clear sections using markdown-style headers (##).
End your response with a Trader Score in this exact format: SCORE: [number]/100 | [Title]
Example: SCORE: 74/100 | Developing Trader`

const PROMPTS = {
  full: (data, emotion) => `Review this trader's recent session data and provide a full performance breakdown.

Session data:
${data}

Current emotional state: ${emotion}

Provide:
## Verdict
One direct sentence on overall performance quality.

## Patterns Identified
2-3 specific patterns you see in the data (reference actual trades/numbers).

## Strengths
What this trader is doing well.

## Areas to Fix
2-3 concrete, actionable improvements — be specific.

## Action Items
3 specific things to implement before the next session.

SCORE: [X]/100 | [Title]`,

  mistakes: (data, emotion) => `Audit this trader's mistakes with precision.

Session data:
${data}

Emotional state: ${emotion}

Provide:
## Primary Mistake
The single biggest error — reference specific trades.

## Behavioral Pattern
The underlying habit or psychological pattern causing losses.

## Hidden Mistake
One error the trader probably hasn't noticed yet.

## Correction Protocol
Exact steps to eliminate these mistakes.

SCORE: [X]/100 | [Title]`,

  strategy: (data, emotion) => `Evaluate this trader's strategy quality and execution.

Session data:
${data}

Emotional state: ${emotion}

Provide:
## Strategy Assessment
What their current approach appears to be from the data.

## Execution Quality
How well they're executing their apparent strategy.

## Setup Quality Rating
Rating each type of trade they're taking.

## Strategic Upgrade
The single most impactful change to their approach.

SCORE: [X]/100 | [Title]`,

  psychology: (data, emotion) => `Analyze this trader's psychological patterns and mental discipline.

Session data:
${data}

Emotional state: ${emotion}

Provide:
## Emotional Profile
How their emotions are affecting their trading decisions.

## Discipline Score
Assessment of rule-following vs impulsive behavior.

## Cognitive Biases Detected
Specific biases showing up in their trading behavior.

## Mental Discipline Protocol
A practical routine to improve psychological discipline.

SCORE: [X]/100 | [Title]`,
}

function ApiKeySetup({ onSave }) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')

  function save() {
    if (!key.trim().startsWith('gsk_')) return setError('Groq API keys start with "gsk_". Get yours at console.groq.com')
    setGroqKey(key.trim())
    onSave()
  }

  return (
    <Card className={s.key_card}>
      <div className={s.key_header}>
        <div className={s.key_title}>Connect Groq API</div>
        <div className={s.key_sub}>The AI Analysis feature requires a free Groq API key. Your key is stored locally in your browser only.</div>
      </div>
      <div className={s.key_body}>
        <Input
          label="Groq API Key"
          type="password"
          placeholder="gsk_..."
          value={key}
          onChange={e => { setKey(e.target.value); setError('') }}
          error={error}
          hint="Get a free key at console.groq.com → API Keys"
        />
        <Button variant="primary" size="lg" style={{ width: '100%' }} onClick={save}>Save and continue</Button>
        <p className={s.key_note}>Your key is never sent to our servers. Analysis runs directly from your browser to Groq's API using the Qwen QwQ-32B model.</p>
      </div>
    </Card>
  )
}

function formatResult(text) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <div key={i} className={s.result_heading}>{line.slice(3)}</div>
    if (line.startsWith('# ')) return <div key={i} className={s.result_h1}>{line.slice(2)}</div>
    if (line.match(/^SCORE:/)) return null
    if (line.trim() === '') return <div key={i} className={s.result_gap} />
    if (line.startsWith('- ') || line.startsWith('• ')) return <div key={i} className={s.result_bullet}>{line.slice(2)}</div>
    const bold = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    return <p key={i} className={s.result_para} dangerouslySetInnerHTML={{ __html: bold }} />
  })
}

export default function Analysis({ trades }) {
  const [hasKey, setHasKey] = useState(hasGroqKey)
  const [input, setInput] = useState('')
  const [emotion, setEmotion] = useState('neutral')
  const [type, setType] = useState('full')
  const [result, setResult] = useState(null)
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function autofill() {
    const text = trades.slice(0, 10).map(t =>
      `${t.date}: ${t.coin} ${t.direction.toUpperCase()} | Entry: $${t.entry} | Exit: $${t.exit} | Size: $${t.size} | P&L: ${t.pnl >= 0 ? '+' : ''}$${t.pnl?.toFixed(2)} | Setup: ${t.setup || 'unspecified'} | Emotion: ${t.emotion} | Notes: ${t.notes || 'none'}`
    ).join('\n')
    setInput(text)
  }

  async function analyze() {
    if (!input.trim()) return setError('Please enter your trade data.')
    setLoading(true)
    setResult(null)
    setScore(null)
    setError('')
    try {
      const text = await groqChat(
        [{ role: 'user', content: PROMPTS[type](input, emotion) }],
        SYSTEM,
        { temperature: 0.6, maxTokens: 1400 }
      )
      const scoreMatch = text.match(/SCORE:\s*(\d+)\/100\s*\|\s*([^\n]+)/i)
      if (scoreMatch) setScore({ num: parseInt(scoreMatch[1]), title: scoreMatch[2].trim() })
      setResult(text)
    } catch (e) {
      if (e.message === 'NO_KEY') { setHasKey(false); return }
      setError(e.message || 'Analysis failed. Check your API key and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!hasKey) return (
    <div className={s.page}>
      <div className={s.topbar}>
        <div><h1 className={s.title}>AI Analysis</h1><p className={s.sub}>Powered by Qwen QwQ-32B via Groq</p></div>
      </div>
      <ApiKeySetup onSave={() => setHasKey(true)} />
    </div>
  )

  const scoreColor = score ? (score.num >= 75 ? 'var(--green)' : score.num >= 55 ? 'var(--yellow)' : 'var(--red)') : 'var(--text)'

  return (
    <div className={s.page}>
      <div className={s.topbar}>
        <div>
          <h1 className={s.title}>AI Analysis</h1>
          <p className={s.sub}>Powered by Qwen QwQ-32B via Groq</p>
        </div>
        <button className={s.reset_key} onClick={() => { setGroqKey(''); setHasKey(false) }}>Change API key</button>
      </div>

      <div className={s.type_row}>
        {ANALYSIS_TYPES.map(t => (
          <button key={t.id} className={`${s.type_card} ${type === t.id ? s.type_active : ''}`} onClick={() => setType(t.id)}>
            <div className={s.type_label}>{t.label}</div>
            <div className={s.type_desc}>{t.desc}</div>
          </button>
        ))}
      </div>

      <div className={s.grid}>
        <div className={s.input_col}>
          <Card padding={false}>
            <div className={s.card_header}>
              <span className={s.card_title}>Trade data input</span>
              <button className={s.autofill} onClick={autofill}>Auto-fill from journal</button>
            </div>
            <div className={s.card_body}>
              {error && <Alert type="error">{error}</Alert>}
              <Textarea
                placeholder={'Paste your trades manually, or click "Auto-fill from journal" above.\n\nExample:\n2026-04-12: BTC LONG | Entry: $83,200 | Exit: $84,420 | P&L: +$294 | Emotion: disciplined\n2026-04-11: ETH SHORT | Entry: $1,840 | Exit: $1,876 | P&L: -$140 | Emotion: impulsive'}
                value={input}
                onChange={e => setInput(e.target.value)}
                rows={10}
              />
              <div className={s.options_row}>
                <Select label="Emotional state today" value={emotion} onChange={e => setEmotion(e.target.value)}>
                  <option value="disciplined">Disciplined</option>
                  <option value="confident">Confident</option>
                  <option value="neutral">Neutral</option>
                  <option value="impulsive">Impulsive</option>
                  <option value="overconfident">Overconfident</option>
                  <option value="anxious">Anxious</option>
                  <option value="fearful">Fearful</option>
                </Select>
              </div>
              <Button variant="primary" size="lg" loading={loading} style={{ width: '100%' }} onClick={analyze}>
                {loading ? 'Analyzing…' : 'Run analysis'}
              </Button>
            </div>
          </Card>
        </div>

        <div className={s.output_col}>
          {!result && !loading && (
            <Card className={s.empty_card}>
              <div className={s.empty_state}>
                <div className={s.empty_icon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
                <div className={s.empty_title}>No analysis yet</div>
                <div className={s.empty_desc}>Select an analysis type, paste your trade data, and run the analysis to receive a detailed professional assessment.</div>
              </div>
            </Card>
          )}

          {loading && (
            <Card className={s.loading_card}>
              <div className={s.loading_inner}>
                <div className={s.loading_dots}><div /><div /><div /></div>
                <div className={s.loading_text}>Analyzing with Qwen QwQ-32B…</div>
                <div className={s.loading_sub}>This may take 10–20 seconds</div>
              </div>
            </Card>
          )}

          {result && !loading && (
            <div className={s.result_wrap}>
              {score && (
                <Card padding={false} className={s.score_card}>
                  <div className={s.score_inner}>
                    <div className={s.score_num} style={{ color: scoreColor }}>{score.num}<span className={s.score_denom}>/100</span></div>
                    <div className={s.score_right}>
                      <div className={s.score_title}>{score.title}</div>
                      <div className={s.score_bar_wrap}><div className={s.score_bar} style={{ width: `${score.num}%`, background: scoreColor }} /></div>
                      <div className={s.score_label}>Trader performance score</div>
                    </div>
                  </div>
                </Card>
              )}
              <Card padding={false}>
                <div className={s.card_header}>
                  <span className={s.card_title}>Analysis Report</span>
                  <span className={s.powered}>Qwen QwQ-32B · Groq</span>
                </div>
                <div className={s.result_body}>{formatResult(result)}</div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
