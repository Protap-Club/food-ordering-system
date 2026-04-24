import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import CategoryBar from './CategoryBar'
import MenuCard from './MenuCard'

export default function MenuPanel() {
  const { searchQuery, setSearchQuery, getFilteredItems } = useAppStore()
  const filteredItems = getFilteredItems()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      gap: '24px',
    }}>
      {/* Search Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Menu</h2>
        <input 
          type="text" 
          placeholder="Search items..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: 'var(--radius-xl)',
            width: '250px'
          }}
        />
      </div>

      <CategoryBar />

      {/* Grid */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
        alignContent: 'start',
        paddingRight: '8px'
      }}>
        {filteredItems.map(item => (
          <MenuCard key={item.id} item={item} />
        ))}
        {filteredItems.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--t-tertiary)' }}>
            No items found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  )
}
