import React from 'react'
import { useAppStore } from '../store/useAppStore'
import KDSCard from '../components/kds/KDSCard'

export default function KDSView() {
  const orders = useAppStore(state => state.orders)

  // Filter out done orders for KDS, sort by oldest first
  const activeOrders = orders
    .filter(o => o.status !== 'done')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  return (
    <div style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Kitchen Display System</h2>
        <div style={{ color: 'var(--t-secondary)' }}>
          Active Orders: {activeOrders.length}
        </div>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
        alignContent: 'start',
      }}>
        {activeOrders.map(order => (
          <KDSCard key={order.id} order={order} />
        ))}
        {activeOrders.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--t-tertiary)', padding: '64px' }}>
            No active orders. Kitchen is caught up! 🍳
          </div>
        )}
      </div>
    </div>
  )
}
