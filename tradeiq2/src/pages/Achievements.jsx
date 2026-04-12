import { Card, Stat } from '../components/ui'
import s from './Achievements.module.css'

const ACHIEVEMENTS = [
  { id: 1, name: '7-Day Streak', desc: 'Logged trades 7 days consecutively', earned: true, xp: 200 },
  { id: 2, name: 'First Profitable Day', desc: 'Closed a day with positive P&L', earned: true, xp: 100 },
  { id: 3, name: 'Data Discipline', desc: 'Logged 25 or more trades with notes', earned: true, xp: 150 },
  { id: 4, name: 'Emotionally Aware', desc: 'Tracked emotion on 10+ consecutive trades', earned: true, xp: 120 },
  { id: 5, name: 'Setup Specialist', desc: 'Executed 5 trades from the same setup with 60%+ win rate', earned: true, xp: 180 },
  { id: 6, name: 'Risk Manager', desc: 'Maintained positive R:R across 10 trades', earned: true, xp: 160 },
  { id: 7, name: '30-Day Streak', desc: 'Logged trades for 30 consecutive days', earned: false, xp: 500 },
  { id: 8, name: 'Precision Trader', desc: '$10,000+ cumulative P&L', earned: false, xp: 400 },
  { id: 9, name: 'AI Practitioner', desc: 'Completed 20 AI analysis sessions', earned: false, xp: 300 },
  { id: 10, name: 'Century Trader', desc: 'Logged 100 trades with complete data', earned: false, xp: 350 },
  { id: 11, name: 'Iron Discipline', desc: 'Zero impulsive trades for 30 consecutive days', earned: false, xp: 450 },
  { id: 12, name: 'Prediction Analyst', desc: 'Generated 50 AI market analyses', earned: false, xp: 250 },
]

const LEVELS = [
  { level: 1, title: 'Novice', xp: 0 },
  { level: 2, title: 'Apprentice', xp: 250 },
  { level: 3, title: 'Trader', xp: 600 },
  { level: 4, title: 'Tactician', xp: 1100 },
  { level: 5, title: 'Strategist', xp: 1800 },
  { level: 6, title: 'Analyst', xp: 2700 },
  { level: 7, title: 'Veteran', xp: 3800 },
  { level: 8, title: 'Expert', xp: 5200 },
  { level: 9, title: 'Master', xp: 7000 },
  { level: 10, title: 'Elite', xp: 10000 },
]

export default function Achievements({ stats }) {
  const earned = ACHIEVEMENTS.filter(a => a.earned)
  const locked = ACHIEVEMENTS.filter(a => !a.earned)
  const totalXp = earned.reduce((s, a) => s + a.xp, 0)
  const currentLevel = LEVELS.filter(l => l.xp <= totalXp).at(-1)
  const nextLevel = LEVELS.find(l => l.xp > totalXp)
  const progress = nextLevel ? ((totalXp - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)) * 100 : 100

  return (
    <div className={s.page}>
      <div className={s.topbar}>
        <div>
          <h1 className={s.title}>Progress</h1>
          <p className={s.sub}>{earned.length} of {ACHIEVEMENTS.length} achievements unlocked</p>
        </div>
      </div>

      <div className={s.grid}>
        <div className={s.left}>
          <div className={s.section_label}>Unlocked</div>
          <div className={s.achievements_grid}>
            {earned.map(a => (
              <Card key={a.id} padding={false} className={s.achievement}>
                <div className={s.ach_check}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className={s.ach_body}>
                  <div className={s.ach_name}>{a.name}</div>
                  <div className={s.ach_desc}>{a.desc}</div>
                </div>
                <div className={s.ach_xp}>+{a.xp} XP</div>
              </Card>
            ))}
          </div>

          <div className={s.section_label} style={{ marginTop: 24 }}>Locked</div>
          <div className={s.achievements_grid}>
            {locked.map(a => (
              <Card key={a.id} padding={false} className={`${s.achievement} ${s.achievement_locked}`}>
                <div className={s.ach_lock}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div className={s.ach_body}>
                  <div className={s.ach_name}>{a.name}</div>
                  <div className={s.ach_desc}>{a.desc}</div>
                </div>
                <div className={s.ach_xp_locked}>{a.xp} XP</div>
              </Card>
            ))}
          </div>
        </div>

        <div className={s.right}>
          <Card padding={false}>
            <div className={s.card_header}><span className={s.card_title}>Current Level</span></div>
            <div className={s.level_display}>
              <div className={s.level_num}>{currentLevel?.level}</div>
              <div className={s.level_right}>
                <div className={s.level_title}>{currentLevel?.title}</div>
                <div className={s.level_bar_wrap}>
                  <div className={s.level_bar_fill} style={{ width: `${progress}%` }} />
                </div>
                <div className={s.level_sub}>
                  {nextLevel ? `${totalXp - currentLevel.xp} / ${nextLevel.xp - currentLevel.xp} XP to Level ${nextLevel.level}` : 'Maximum level reached'}
                </div>
              </div>
            </div>
          </Card>

          <Card padding={false}>
            <div className={s.card_header}><span className={s.card_title}>XP Breakdown</span></div>
            <div className={s.xp_list}>
              <div className={s.xp_item}><span className={s.xp_action}>Log a trade</span><span className={s.xp_val}>+80 XP</span></div>
              <div className={s.xp_item}><span className={s.xp_action}>Win a trade</span><span className={s.xp_val}>+50 XP</span></div>
              <div className={s.xp_item}><span className={s.xp_action}>Log with full notes</span><span className={s.xp_val}>+30 XP</span></div>
              <div className={s.xp_item}><span className={s.xp_action}>Daily streak bonus</span><span className={s.xp_val}>+25 XP</span></div>
              <div className={s.xp_item}><span className={s.xp_action}>Run AI analysis</span><span className={s.xp_val}>+40 XP</span></div>
              <div className={s.xp_item}><span className={s.xp_action}>Generate prediction</span><span className={s.xp_val}>+35 XP</span></div>
            </div>
          </Card>

          <Card padding={false}>
            <div className={s.card_header}><span className={s.card_title}>Level Roadmap</span></div>
            <div className={s.roadmap}>
              {LEVELS.map((l) => {
                const done = stats.level > l.level
                const current = stats.level === l.level
                return (
                  <div key={l.level} className={`${s.roadmap_row} ${current ? s.roadmap_current : ''} ${done ? s.roadmap_done : ''}`}>
                    <div className={s.roadmap_dot}>{done ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> : l.level}</div>
                    <div className={s.roadmap_info}>
                      <span className={s.roadmap_name}>Level {l.level} — {l.title}</span>
                      <span className={s.roadmap_xp}>{l.xp.toLocaleString()} XP</span>
                    </div>
                    {current && <div className={s.current_badge}>Current</div>}
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
