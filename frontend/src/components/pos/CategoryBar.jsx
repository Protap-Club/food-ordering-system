import React from 'react'
import { useAppStore } from '../../store/useAppStore'

export default function CategoryBar() {
  const { categories, activeCategory, setActiveCategory } = useAppStore()

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      overflowX: 'auto',
      paddingBottom: '8px',
      borderBottom: 'var(--border)'
    }}>
      {categories.map(cat => {
        const isActive = activeCategory === cat
        return (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: isActive ? 'var(--c-orange)' : 'var(--bg-elevated)',
              color: isActive ? '#fff' : 'var(--t-secondary)',
              whiteSpace: 'nowrap',
              fontWeight: 500,
            }}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
