import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Button, Input, Alert, Divider } from '../components/ui'
import s from './Auth.module.css'

export default function Auth() {
  const { login, register, loading, error, clearError } = useAuth()
  const { theme, toggle } = useTheme()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [localError, setLocalError] = useState('')

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); clearError(); setLocalError('') }

  async function handleSubmit(e) {
    e.preventDefault()
    setLocalError('')
    if (mode === 'register') {
      if (!form.name.trim()) return setLocalError('Name is required.')
      if (!form.email.includes('@')) return setLocalError('Enter a valid email.')
      if (form.password.length < 6) return setLocalError('Password must be at least 6 characters.')
      if (form.password !== form.confirm) return setLocalError('Passwords do not match.')
      await register({ name: form.name.trim(), email: form.email.trim().toLowerCase(), password: form.password })
    } else {
      if (!form.email || !form.password) return setLocalError('All fields are required.')
      await login({ email: form.email.trim().toLowerCase(), password: form.password })
    }
  }

  const displayError = localError || error

  return (
    <div className={s.page}>
      <div className={s.theme_toggle} onClick={toggle} title="Toggle theme">
        {theme === 'light'
          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        }
      </div>

      <div className={s.panel}>
        <div className={s.brand}>
          <div className={s.brand_mark}>TIQ</div>
          <div>
            <div className={s.brand_name}>TradeIQ</div>
            <div className={s.brand_sub}>Professional Crypto Journal</div>
          </div>
        </div>

        <div className={s.tabs}>
          <button className={`${s.tab} ${mode === 'login' ? s.tab_active : ''}`} onClick={() => { setMode('login'); setLocalError(''); clearError() }}>Sign in</button>
          <button className={`${s.tab} ${mode === 'register' ? s.tab_active : ''}`} onClick={() => { setMode('register'); setLocalError(''); clearError() }}>Create account</button>
        </div>

        <form className={s.form} onSubmit={handleSubmit}>
          {displayError && <Alert type="error">{displayError}</Alert>}

          {mode === 'register' && (
            <Input label="Full name" type="text" placeholder="Alex Johnson" value={form.name} onChange={e => set('name', e.target.value)} autoFocus />
          )}

          <Input label="Email address" type="email" placeholder="alex@example.com" value={form.email} onChange={e => set('email', e.target.value)} autoFocus={mode === 'login'} />

          <Input label="Password" type="password" placeholder={mode === 'register' ? 'At least 6 characters' : 'Your password'} value={form.password} onChange={e => set('password', e.target.value)} />

          {mode === 'register' && (
            <Input label="Confirm password" type="password" placeholder="Repeat password" value={form.confirm} onChange={e => set('confirm', e.target.value)} />
          )}

          <Button type="submit" variant="primary" size="xl" loading={loading} style={{ width: '100%', marginTop: 4 }}>
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </Button>
        </form>

        <p className={s.legal}>
          By continuing, you agree to our terms of service and privacy policy.
          Your data is stored locally on your device.
        </p>
      </div>
    </div>
  )
}
