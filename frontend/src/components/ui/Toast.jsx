import React, { useEffect, useState } from 'react'
import { useToast } from '../../store/useToast'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const ICONS = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
}

const COLORS = {
  success: { color: 'var(--success)', bg: 'var(--success-bg)', border: 'var(--success-border)' },
  error:   { color: 'var(--danger)',  bg: 'var(--danger-bg)',  border: 'var(--danger-border)'  },
  warning: { color: 'var(--warning)', bg: 'var(--warning-bg)', border: 'var(--warning-border)' },
  info:    { color: 'var(--info)',    bg: 'var(--info-bg)',    border: 'var(--info-border)'    },
}

function Toast({ id, type, message, duration = 3500 }) {
  const dismiss = useToast((s) => s.dismiss)
  const [progress, setProgress] = useState(100)

  // Shrink progress bar over duration
  useEffect(() => {
    const start = Date.now()
    const frame = () => {
      const pct = Math.max(0, 100 - ((Date.now() - start) / duration) * 100)
      setProgress(pct)
      if (pct > 0) requestAnimationFrame(frame)
    }
    const raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [duration])

  const Icon = ICONS[type] ?? Info
  const c = COLORS[type] ?? COLORS.info

  return (
    <div className="toast" role="alert" aria-live="polite">
      <div style={{
        background: 'var(--bg-elevated)',
        border: `1px solid ${c.border}`,
        borderRadius: 'var(--radius-md)',
        padding: 'var(--sp-3) var(--sp-4)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--sp-3)',
        boxShadow: 'var(--shadow-lg)',
        minWidth: 280,
        maxWidth: 380,
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>
        {/* Icon */}
        <div style={{ color: c.color, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <Icon size={18} />
        </div>

        {/* Message */}
        <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>
          {message}
        </span>

        {/* Dismiss */}
        <button
          onClick={() => dismiss(id)}
          style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center', flexShrink: 0 }}
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>

        {/* Progress bar */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0,
          height: 2,
          width: `${progress}%`,
          background: c.color,
          transition: 'width 100ms linear',
          borderRadius: '0 0 0 var(--radius-md)',
        }} />
      </div>
    </div>
  )
}

export default function ToastContainer() {
  const toasts = useToast((s) => s.toasts)

  if (toasts.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'var(--sp-6)',
        right: 'var(--sp-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-3)',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: 'all' }}>
          <Toast {...t} />
        </div>
      ))}
    </div>
  )
}
