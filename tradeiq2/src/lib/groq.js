const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'qwen-qwq-32b' // Qwen on Groq

// Store key in localStorage (user provides it on first use)
export function getGroqKey() { return localStorage.getItem('tiq_groq_key') || '' }
export function setGroqKey(k) { localStorage.setItem('tiq_groq_key', k) }
export function hasGroqKey() { return !!getGroqKey() }

export async function groqChat(messages, systemPrompt, { temperature = 0.7, maxTokens = 1200 } = {}) {
  const key = getGroqKey()
  if (!key) throw new Error('NO_KEY')

  const payload = {
    model: MODEL,
    max_tokens: maxTokens,
    temperature,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
  }

  const res = await fetch(GROQ_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Groq API error ${res.status}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}
