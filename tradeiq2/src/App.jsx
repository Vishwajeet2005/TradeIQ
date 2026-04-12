import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Auth from './pages/Auth'
import Overview from './pages/Overview'
import Journal from './pages/Journal'
import Analysis from './pages/Analysis'
import Predictions from './pages/Predictions'
import Achievements from './pages/Achievements'
import { useTrades } from './lib/store'

function AppRoutes() {
  const { user } = useAuth()
  const { trades, addTrade, deleteTrade, updateTrade, stats } = useTrades(user?.id)
  if (!user) return <Auth />
  return (
    <Layout stats={stats}>
      <Routes>
        <Route path="/" element={<Overview trades={trades} stats={stats} onAdd={addTrade} />} />
        <Route path="/journal" element={<Journal trades={trades} onAdd={addTrade} onDelete={deleteTrade} />} />
        <Route path="/analysis" element={<Analysis trades={trades} stats={stats} />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/achievements" element={<Achievements stats={stats} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
