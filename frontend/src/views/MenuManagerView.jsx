import React, { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { Search, ClipboardList } from 'lucide-react'
import CategoryBar from '../components/pos/CategoryBar'
import EmptyState from '../components/ui/EmptyState'

export default function MenuManagerView() {
  const { menuItems, activeCategory, toggleItemAvailability } = useAppStore()
  const [search, setSearch] = useState('')

  const items = menuItems.filter(item => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const availableCount = menuItems.filter(i => i.isAvailable).length

  return (
    <div style={{ padding: 'var(--sp-8)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--sp-4)' }}>
        <div>
          <h2 style={{ marginBottom: '2px' }}>Menu Management</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
            {availableCount} of {menuItems.length} items available
          </span>
        </div>
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 'var(--sp-3)',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: 'var(--sp-3) var(--sp-4) var(--sp-3) 36px',
              borderRadius: 'var(--radius-full)',
              width: '280px',
              fontSize: '0.85rem',
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: 'var(--sp-5)' }}>
        <CategoryBar />
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ flex: 1, overflowY: 'auto', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{
              borderBottom: '1px solid var(--glass-border)',
              position: 'sticky',
              top: 0,
              background: 'var(--bg-panel)',
              zIndex: 1,
            }}>
              <th style={{ padding: 'var(--sp-4) var(--sp-5)', color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Item</th>
              <th style={{ padding: 'var(--sp-4) var(--sp-5)', color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Category</th>
              <th style={{ padding: 'var(--sp-4) var(--sp-5)', color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Price</th>
              <th style={{ padding: 'var(--sp-4) var(--sp-5)', color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr
                key={item.id}
                style={{
                  borderBottom: '1px solid var(--glass-border)',
                  transition: 'background var(--duration-fast) ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <td style={{ padding: 'var(--sp-4) var(--sp-5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                    <div className={`veg-indicator ${item.isVeg !== false ? 'veg-indicator--veg' : 'veg-indicator--nonveg'}`} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</span>
                  </div>
                </td>
                <td style={{ padding: 'var(--sp-4) var(--sp-5)' }}>
                  <span className="chip" style={{ cursor: 'default', fontSize: '0.72rem' }}>{item.category}</span>
                </td>
                <td style={{ padding: 'var(--sp-4) var(--sp-5)', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ₹{item.price}
                </td>
                <td style={{ padding: 'var(--sp-4) var(--sp-5)', textAlign: 'center' }}>
                  <div
                    className="toggle-track"
                    data-active={item.isAvailable}
                    onClick={() => toggleItemAvailability(item.id)}
                    title={item.isAvailable ? 'In Stock — click to mark unavailable' : 'Out of Stock — click to mark available'}
                  >
                    <div className="toggle-thumb" />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4}>
                  <EmptyState
                    icon={ClipboardList}
                    title="No items found"
                    subtitle={search ? `No results for "${search}"` : 'Try a different category'}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
