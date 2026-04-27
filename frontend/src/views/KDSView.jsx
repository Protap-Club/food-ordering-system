import React from 'react'
import { useAppStore } from '../store/useAppStore'
import { ChefHat } from 'lucide-react'
import KDSCard from '../components/kds/KDSCard'
import EmptyState from '../components/ui/EmptyState'

export default function KDSView() {
  const orders = useAppStore(state => state.orders)

  // Filter out done orders for KDS, sort by oldest first
  const activeOrders = orders
    .filter(o => o.status !== 'done')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  const statusCounts = {
    new: activeOrders.filter(o => o.status === 'new').length,
    preparing: activeOrders.filter(o => o.status === 'preparing').length,
    ready: activeOrders.filter(o => o.status === 'ready').length,
  }

  return (
    <div style={{ padding: 'var(--sp-8)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ marginBottom: '2px' }}>Kitchen Display</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
            {activeOrders.length} active order{activeOrders.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
          {statusCounts.new > 0 && (
            <span className="badge badge-danger">{statusCounts.new} New</span>
          )}
          {statusCounts.preparing > 0 && (
            <span className="badge badge-warning">{statusCounts.preparing} Preparing</span>
          )}
          {statusCounts.ready > 0 && (
            <span className="badge badge-success">{statusCounts.ready} Ready</span>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="stagger-children" style={{
        flex: 1,
        overflowY: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--sp-5)',
        alignContent: 'start',
        paddingBottom: 'var(--sp-4)',
      }}>
        {activeOrders.map(order => (
          <KDSCard key={order.id} order={order} />
        ))}
        {activeOrders.length === 0 && (
          <div style={{ gridColumn: '1 / -1' }}>
            <EmptyState
              icon={ChefHat}
              title="Kitchen is caught up!"
              subtitle="No active orders right now. Time for a coffee break."
            />
          </div>
        )}
      </div>
    </div>
  )
}
