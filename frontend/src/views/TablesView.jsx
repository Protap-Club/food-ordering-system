import React from 'react'
import { useAppStore } from '../store/useAppStore'
import { Users, Armchair } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'

export default function TablesView() {
  const { tables, setView, setSelectedTable, setOrderType } = useAppStore()

  const handleTableClick = (table) => {
    setSelectedTable(table.id)
    setOrderType('Dine In')
    setView('pos')
  }

  const getStatusConfig = (status) => {
    if (status === 'free') return { color: 'var(--success)', bg: 'var(--success-bg)', border: 'var(--success-border)', label: 'Free' }
    if (status === 'occupied') return { color: 'var(--warning)', bg: 'var(--warning-bg)', border: 'var(--warning-border)', label: 'Occupied' }
    if (status === 'bill_requested') return { color: 'var(--danger)', bg: 'var(--danger-bg)', border: 'var(--danger-border)', label: 'Bill Requested' }
    return { color: 'var(--text-tertiary)', bg: 'var(--bg-surface)', border: 'var(--border-color)', label: status }
  }

  // Group by floor
  const floors = [...new Set(tables.map(t => t.floor))]

  // Summary counts
  const freeTables = tables.filter(t => t.status === 'free').length
  const occupiedTables = tables.filter(t => t.status === 'occupied').length

  return (
    <div style={{ padding: 'var(--sp-8)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ marginBottom: '2px' }}>Table Management</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
            {freeTables} free · {occupiedTables} occupied · {tables.length} total
          </span>
        </div>
      </div>

      {/* Floor sections */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)' }}>
        {floors.map(floor => (
          <div key={floor}>
            <h4 style={{
              marginBottom: 'var(--sp-4)',
              color: 'var(--text-tertiary)',
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontWeight: 600,
            }}>
              {floor} Floor
            </h4>
            <div className="stagger-children" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 'var(--sp-4)',
            }}>
              {tables.filter(t => t.floor === floor).map(table => {
                const sc = getStatusConfig(table.status)
                return (
                  <button
                    key={table.id}
                    onClick={() => handleTableClick(table)}
                    className="glass-card"
                    style={{
                      padding: 'var(--sp-5) var(--sp-4)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 'var(--sp-2)',
                      cursor: 'pointer',
                      borderColor: sc.border,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.8rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      lineHeight: 1,
                    }}>
                      {table.number}
                    </div>
                    <span className="badge" style={{
                      background: sc.bg,
                      color: sc.color,
                      border: `1px solid ${sc.border}`,
                      fontSize: '0.6rem',
                    }}>
                      {sc.label}
                    </span>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                    }}>
                      <Users size={12} />
                      {table.capacity}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
        {tables.length === 0 && (
          <EmptyState
            icon={Armchair}
            title="No tables configured"
            subtitle="Add tables from the backend to get started."
          />
        )}
      </div>
    </div>
  )
}
