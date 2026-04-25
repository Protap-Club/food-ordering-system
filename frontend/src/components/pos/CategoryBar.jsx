import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import { LayoutGrid } from 'lucide-react'

const CATEGORY_EMOJI = {
  'All': null,
  'Starters': '🥗',
  'Main Course': '🍛',
  'Breads': '🫓',
  'Rice': '🍚',
  'Beverages': '🥤',
  'Desserts': '🍰',
  'Sides': '🥘',
  'Soups': '🍲',
  'Salads': '🥬',
  'Pizza': '🍕',
  'Pasta': '🍝',
  'Burgers': '🍔',
  'Sandwiches': '🥪',
  'Coffee': '☕',
  'Snacks': '🍿',
}

export default function CategoryBar() {
  const { categories, activeCategory, setActiveCategory } = useAppStore()

  return (
    <div style={{
      display: 'flex',
      gap: 'var(--sp-2)',
      overflowX: 'auto',
      paddingBottom: 'var(--sp-2)',
    }}>
      {categories.map(cat => {
        const isActive = activeCategory === cat
        const emoji = CATEGORY_EMOJI[cat]
        return (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={isActive ? 'chip chip-active' : 'chip'}
            style={{
              padding: 'var(--sp-2) var(--sp-4)',
              fontSize: '0.8rem',
              gap: 'var(--sp-1)',
            }}
          >
            {cat === 'All' ? (
              <LayoutGrid size={13} strokeWidth={2} />
            ) : emoji ? (
              <span style={{ fontSize: '0.9em' }}>{emoji}</span>
            ) : null}
            {cat}
          </button>
        )
      })}
    </div>
  )
}
