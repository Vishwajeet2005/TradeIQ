import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Simulated user DB in localStorage (replace with real backend)
function getUsers() {
  try { return JSON.parse(localStorage.getItem('tiq_users') || '[]') } catch { return [] }
}
function saveUsers(users) { localStorage.setItem('tiq_users', JSON.stringify(users)) }
function getSession() {
  try { return JSON.parse(localStorage.getItem('tiq_session') || 'null') } catch { return null }
}
function saveSession(s) { localStorage.setItem('tiq_session', JSON.stringify(s)) }
function clearSession() { localStorage.removeItem('tiq_session') }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSession)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function clearError() { setError('') }

  async function register({ name, email, password }) {
    setLoading(true); setError('')
    await new Promise(r => setTimeout(r, 600))
    const users = getUsers()
    if (users.find(u => u.email === email)) {
      setError('An account with this email already exists.')
      setLoading(false); return false
    }
    // Never store plain passwords in production — use bcrypt + real backend
    const newUser = { id: Date.now().toString(), name, email, passwordHash: btoa(password), createdAt: new Date().toISOString() }
    saveUsers([...users, newUser])
    const session = { id: newUser.id, name: newUser.name, email: newUser.email }
    saveSession(session)
    setUser(session)
    setLoading(false)
    return true
  }

  async function login({ email, password }) {
    setLoading(true); setError('')
    await new Promise(r => setTimeout(r, 600))
    const users = getUsers()
    const found = users.find(u => u.email === email && u.passwordHash === btoa(password))
    if (!found) {
      setError('Invalid email or password.')
      setLoading(false); return false
    }
    const session = { id: found.id, name: found.name, email: found.email }
    saveSession(session)
    setUser(session)
    setLoading(false)
    return true
  }

  function logout() {
    clearSession()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }
