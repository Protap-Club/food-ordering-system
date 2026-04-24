import React from 'react'
import { useAppStore } from '../store/useAppStore'

export default function TablesView() {
  const { tables, setView, setSelectedTable, setOrderType } = useAppStore()

  const handleTableClick = (table) => {
    setSelectedTable(table.id)
    setOrderType('Dine In')
    setView('pos')
  }

  const getTableColor = (status) => {
    if (status === 'free') return 'var(--s-success)'
    if (status === 'occupied') return 'var(--s-warning)'
    if (status === 'bill_requested') return 'var(--s-danger)'
    return 'var(--bg-elevated)'
  }

  // Group by floor
  const floors = [...new Set(tables.map(t => t.floor))]

  return (
    <div style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginBottom: '24px' }}>Table Management</h2>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {floors.map(floor => (
          <div key={floor}>
            <h3 style={{ marginBottom: '16px', color: 'var(--t-secondary)' }}>{floor} Floor</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '16px'
            }}>
              {tables.filter(t => t.floor === floor).map(table => (
                <button
                  key={table.id}
                  onClick={() => handleTableClick(table)}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: `2px solid ${getTableColor(table.status)}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'transform 0.1s ease',
                  }}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{table.number}</div>
                  <div style={{ 
                    color: getTableColor(table.status),
                    fontSize: '0.85em',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {table.status.replace('_', ' ')}
                  </div>
                  <div style={{ color: 'var(--t-tertiary)', fontSize: '0.75em' }}>
                    Seats: {table.capacity}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
