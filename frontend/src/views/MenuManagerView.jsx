import React, { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import CategoryBar from '../components/pos/CategoryBar'

export default function MenuManagerView() {
  const { menuItems, activeCategory, toggleItemAvailability } = useAppStore()
  const [search, setSearch] = useState('')

  const items = menuItems.filter(item => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Menu Management</h2>
        <input 
          type="text" 
          placeholder="Search items..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: 'var(--radius-xl)', width: '300px' }}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <CategoryBar />
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: 'var(--border)', color: 'var(--t-secondary)' }}>
              <th style={{ padding: '16px 8px' }}>Item</th>
              <th style={{ padding: '16px 8px' }}>Category</th>
              <th style={{ padding: '16px 8px' }}>Price</th>
              <th style={{ padding: '16px 8px', textAlign: 'center' }}>Available</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom: 'var(--border-light)' }}>
                <td style={{ padding: '16px 8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.5em' }}>{item.emoji}</span>
                  <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                </td>
                <td style={{ padding: '16px 8px', color: 'var(--t-secondary)' }}>{item.category}</td>
                <td style={{ padding: '16px 8px' }}>₹{item.price}</td>
                <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                  <button
                    onClick={() => toggleItemAvailability(item.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-xl)',
                      backgroundColor: item.isAvailable ? 'var(--s-success-bg)' : 'var(--s-danger-bg)',
                      color: item.isAvailable ? 'var(--s-success)' : 'var(--s-danger)',
                      fontWeight: 'bold',
                      minWidth: '120px'
                    }}
                  >
                    {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
