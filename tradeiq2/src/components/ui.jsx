import { useState } from 'react'
import s from './ui.module.css'

export function Badge({ variant = 'neutral', size = 'sm', children }) {
  return <span className={`${s.badge} ${s[`badge_${variant}`]} ${s[`badge_${size}`]}`}>{children}</span>
}

export function Button({ variant = 'primary', size = 'md', loading = false, disabled, children, className = '', ...rest }) {
  return (
    <button
      className={`${s.btn} ${s[`btn_${variant}`]} ${s[`btn_${size}`]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span className={s.btn_spinner} /> : null}
      {children}
    </button>
  )
}

export function Card({ children, className = '', padding = true, ...rest }) {
  return <div className={`${s.card} ${padding ? s.card_pad : ''} ${className}`} {...rest}>{children}</div>
}

export function Input({ label, error, hint, className = '', ...rest }) {
  return (
    <div className={s.field}>
      {label && <label className={s.label}>{label}</label>}
      <input className={`${s.input} ${error ? s.input_error : ''} ${className}`} {...rest} />
      {error && <span className={s.field_error}>{error}</span>}
      {hint && !error && <span className={s.field_hint}>{hint}</span>}
    </div>
  )
}

export function Select({ label, error, children, className = '', ...rest }) {
  return (
    <div className={s.field}>
      {label && <label className={s.label}>{label}</label>}
      <select className={`${s.select} ${error ? s.input_error : ''} ${className}`} {...rest}>
        {children}
      </select>
      {error && <span className={s.field_error}>{error}</span>}
    </div>
  )
}

export function Textarea({ label, error, className = '', ...rest }) {
  return (
    <div className={s.field}>
      {label && <label className={s.label}>{label}</label>}
      <textarea className={`${s.textarea} ${error ? s.input_error : ''} ${className}`} {...rest} />
      {error && <span className={s.field_error}>{error}</span>}
    </div>
  )
}

export function Stat({ label, value, change, changeType, sub }) {
  return (
    <div className={s.stat}>
      <div className={s.stat_label}>{label}</div>
      <div className={s.stat_value}>{value}</div>
      {change && <div className={`${s.stat_change} ${changeType === 'pos' ? s.stat_pos : changeType === 'neg' ? s.stat_neg : ''}`}>{change}</div>}
      {sub && <div className={s.stat_sub}>{sub}</div>}
    </div>
  )
}

export function Spinner({ size = 'md' }) {
  return <div className={`${s.spinner} ${s[`spinner_${size}`]}`} />
}

export function Divider({ label }) {
  return label
    ? <div className={s.divider_label}><span>{label}</span></div>
    : <div className={s.divider} />
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className={s.toggle_wrap}>
      <div className={`${s.toggle} ${checked ? s.toggle_on : ''}`} onClick={() => onChange(!checked)}>
        <div className={s.toggle_thumb} />
      </div>
      {label && <span className={s.toggle_label}>{label}</span>}
    </label>
  )
}

export function Tag({ children, onRemove }) {
  return (
    <span className={s.tag}>
      {children}
      {onRemove && <button className={s.tag_remove} onClick={onRemove}>×</button>}
    </span>
  )
}

export function Alert({ type = 'info', children }) {
  return <div className={`${s.alert} ${s[`alert_${type}`]}`}>{children}</div>
}

export function Empty({ title, description, action }) {
  return (
    <div className={s.empty}>
      <div className={s.empty_icon}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/>
        </svg>
      </div>
      <div className={s.empty_title}>{title}</div>
      {description && <div className={s.empty_desc}>{description}</div>}
      {action}
    </div>
  )
}
