import React, { useEffect, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { Clock, ChevronRight } from 'lucide-react'

export default function KDSCard({ order }) {
  const updateOrderStatus = useAppStore(state => state.updateOrderStatus)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const start = new Date(order.createdAt).getTime()
    const updateElapsed = () => setElapsed(Math.floor((Date.now() - start) / 60000))
    updateElapsed()
    const timer = setInterval(updateElapsed, 10000)
    return () => clearInterval(timer)
  }, [order.createdAt])

  const getStatusConfig = () => {
    if (order.status === 'new') return { color: 'var(--danger)', bg: 'var(--danger-bg)', border: 'var(--danger)', label: 'NEW', dotClass: 'status-dot-danger' }
    if (order.status === 'preparing') return { color: 'var(--warning)', bg: 'var(--warning-bg)', border: 'var(--warning)', label: 'PREPARING', dotClass: 'status-dot-warning' }
    if (order.status === 'ready') return { color: 'var(--success)', bg: 'var(--success-bg)', border: 'var(--success)', label: 'READY', dotClass: 'status-dot-success' }
    return { color: 'var(--text-tertiary)', bg: 'var(--bg-surface)', border: 'var(--border-color)', label: 'DONE', dotClass: '' }
  }

  const getNextStatusAction = () => {
    if (order.status === 'new') return { label: 'Start Preparing', next: 'preparing' }
    if (order.status === 'preparing') return { label: 'Mark Ready', next: 'ready' }
    if (order.status === 'ready') return { label: 'Complete Order', next: 'done' }
    return null
  }

  const status = getStatusConfig()
  const action = getNextStatusAction()
  const isUrgent = elapsed > 15

  return (
    <div className="glass-card" style={{
      borderColor: status.border,
      borderWidth: 2,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: isUrgent && order.status !== 'ready' ? 'pulseDanger 2s ease infinite' : undefined,
    }}>
      {/* Header */}
      <div style={{
        padding: 'var(--sp-4)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: status.bg,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}>
            {order.token}
          </div>
          <span className="badge" style={{
            background: status.bg,
            color: status.color,
            border: `1px solid ${status.border}`,
          }}>
            <span className={`status-dot ${status.dotClass}`} style={{ width: 6, height: 6 }} />
            {status.label}
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: isUrgent ? 'var(--danger)' : 'var(--text-secondary)',
        }}>
          <Clock size={14} />
          {elapsed}m
        </div>
      </div>

      {/* Order type */}
      <div style={{
        padding: 'var(--sp-2) var(--sp-4)',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: 'var(--brand)',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        {order.type}{order.tableNumber && ` · Table ${order.tableNumber}`}
      </div>

      {/* Items */}
      <div style={{
        flex: 1,
        padding: 'var(--sp-3) var(--sp-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-2)',
      }}>
        {order.items.map(item => (
          <div key={item.itemId} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--sp-3)',
            fontSize: '0.9rem',
          }}>
            <span style={{
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: 'var(--brand)',
              minWidth: 28,
            }}>
              {item.qty}×
            </span>
            <span style={{ fontWeight: 500 }}>{item.name}</span>
          </div>
        ))}
      </div>

      {/* Action button */}
      {action && (
        <button
          onClick={() => updateOrderStatus(order.id, action.next)}
          className="kds-action-btn"
          style={{
            background: status.color,
            color: 'var(--text-inverse)',
          }}
        >
          {action.label}
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  )
}
