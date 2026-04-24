import React, { useEffect, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'

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

  const getStatusColor = () => {
    if (order.status === 'new') return 'var(--s-danger)'
    if (order.status === 'preparing') return 'var(--s-warning)'
    if (order.status === 'ready') return 'var(--s-success)'
    return 'var(--t-tertiary)'
  }

  const getNextStatusAction = () => {
    if (order.status === 'new') return { label: 'Start Preparing', next: 'preparing' }
    if (order.status === 'preparing') return { label: 'Mark Ready', next: 'ready' }
    if (order.status === 'ready') return { label: 'Complete Order', next: 'done' }
    return null
  }

  const action = getNextStatusAction()

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-md)',
      border: `2px solid ${getStatusColor()}`,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      opacity: order.status === 'done' ? 0.6 : 1
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{order.token}</div>
        <div style={{ 
          color: elapsed > 15 ? 'var(--s-danger)' : 'var(--t-secondary)',
          fontWeight: 'bold'
        }}>
          {elapsed} min
        </div>
      </div>

      <div style={{ color: 'var(--c-orange)', fontWeight: 'bold' }}>
        {order.type} {order.tableNumber && `- Table ${order.tableNumber}`}
      </div>

      <div style={{ flex: 1, borderTop: 'var(--border-light)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {order.items.map(item => (
          <div key={item.itemId} style={{ display: 'flex', gap: '12px' }}>
            <span style={{ fontWeight: 'bold', width: '24px' }}>{item.qty}x</span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>

      {action && (
        <button 
          onClick={() => updateOrderStatus(order.id, action.next)}
          style={{
            padding: '12px',
            backgroundColor: getStatusColor(),
            color: '#000',
            fontWeight: 'bold',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
