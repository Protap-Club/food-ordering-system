import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import { Search, UtensilsCrossed } from 'lucide-react'
import CategoryBar from './CategoryBar'
import MenuCard from './MenuCard'
import EmptyState from '../ui/EmptyState'

export default function MenuPanel() {
  const { searchQuery, setSearchQuery, getFilteredItems } = useAppStore()
  const filteredItems = getFilteredItems()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      gap: 'var(--sp-5)',
    }}>
      {/* Search Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--sp-4)' }}>
        <div>
          <h2 style={{ marginBottom: '2px' }}>Menu</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
            {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
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
            id="menu-search"
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: 'var(--sp-3) var(--sp-4) var(--sp-3) 36px',
              borderRadius: 'var(--radius-full)',
              width: '260px',
              background: 'var(--bg-surface)',
              border: 'var(--border)',
              fontSize: '0.85rem',
            }}
          />
        </div>
      </div>

      <CategoryBar />

      {/* Menu Grid */}
      <div className="stagger-children" style={{
        flex: 1,
        overflowY: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gridAutoRows: 'min-content',
        gap: 'var(--sp-4)',
        alignContent: 'start',
        paddingRight: 'var(--sp-2)',
        paddingBottom: 'var(--sp-4)',
      }}>
        {filteredItems.map(item => (
          <MenuCard key={item.id} item={item} />
        ))}
        {filteredItems.length === 0 && (
          <div style={{ gridColumn: '1 / -1' }}>
            <EmptyState
              icon={UtensilsCrossed}
              title="No items found"
              subtitle={searchQuery ? `No results for "${searchQuery}"` : 'Try selecting a different category'}
            />
          </div>
        )}
      </div>
    </div>
  )
}
