import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import s from './Layout.module.css'

const NAV = [
  {
    to: '/', label: 'Overview', end: true,
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  },
  {
    to: '/journal', label: 'Journal',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>
  },
  {
    to: '/analysis', label: 'AI Analysis',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
  },
  {
    to: '/predictions', label: 'Predictions',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  },
  {
    to: '/achievements', label: 'Progress',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
  },
]

export default function Layout({ children, stats }) {
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()

  return (
    <div className={s.app}>
      <aside className={s.sidebar}>
        <div className={s.logo}>
          <div className={s.logo_mark}>TIQ</div>
          <div>
            <div className={s.logo_name}>TradeIQ</div>
            <div className={s.logo_sub}>Professional Journal</div>
          </div>
        </div>

        <nav className={s.nav}>
          <div className={s.nav_section_label}>Navigation</div>
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `${s.nav_item} ${isActive ? s.nav_active : ''}`}
            >
              <span className={s.nav_icon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={s.sidebar_footer}>
          <div className={s.xp_section}>
            <div className={s.xp_row}>
              <span className={s.xp_level}>Level {stats?.level ?? 1}</span>
              <span className={s.xp_pts}>{stats?.xp ?? 0} XP</span>
            </div>
            <div className={s.xp_track}>
              <div className={s.xp_fill} style={{ width: `${Math.min(100, ((stats?.xp ?? 0) / 2000) * 100)}%` }} />
            </div>
          </div>

          <div className={s.user_row}>
            <div className={s.user_avatar}>{user?.name?.[0]?.toUpperCase() ?? 'U'}</div>
            <div className={s.user_info}>
              <div className={s.user_name}>{user?.name}</div>
              <div className={s.user_email}>{user?.email}</div>
            </div>
          </div>

          <div className={s.footer_actions}>
            <button className={s.action_btn} onClick={toggle} title={theme === 'light' ? 'Dark mode' : 'Light mode'}>
              {theme === 'light'
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
              }
              {theme === 'light' ? 'Dark mode' : 'Light mode'}
            </button>
            <button className={s.action_btn} onClick={logout}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className={s.main}>{children}</main>
    </div>
  )
}
