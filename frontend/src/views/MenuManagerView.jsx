import React, { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { Search, ClipboardList, Clock, Flame } from 'lucide-react'
import CategoryBar from '../components/pos/CategoryBar'
import StarRating from '../components/ui/StarRating'
import EmptyState from '../components/ui/EmptyState'

const SPICE_COLORS = ['', '#34D399', '#FBBF24', '#FB923C', '#EF4444']

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
              <th style={{ padding: 'var(--sp-4) var(--sp-5)', color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rating</th>
              <th style={{ padding: 'var(--sp-4) var(--sp-5)', color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Prep</th>
              <th style={{ padding: 'var(--sp-4) var(--sp-5)', color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tags</th>
              <th style={{ padding: 'var(--sp-4) var(--sp-5)', color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr
                key={item.id}
                className="menu-row"
              >
                <td style={{ padding: 'var(--sp-3) var(--sp-5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                    {/* Thumbnail */}
                    {item.image && (
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 'var(--radius-sm)',
                        backgroundImage: `url(${item.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        flexShrink: 0,
                        border: 'var(--border)',
                      }} />
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                        <div className={`veg-indicator ${item.isVeg !== false ? 'veg-indicator--veg' : 'veg-indicator--nonveg'}`} style={{ width: 12, height: 12 }} />
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                          {item.emoji && <span style={{ marginRight: '3px' }}>{item.emoji}</span>}
                          {item.name}
                        </span>
                        {item.isBestseller && (
                          <span style={{
                            background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
                            color: '#000',
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.55rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}>★ Best</span>
                        )}
                      </div>
                      {item.description && (
                        <div style={{
                          fontSize: '0.72rem',
                          color: 'var(--text-muted)',
                          marginTop: '2px',
                          maxWidth: '280px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td style={{ padding: 'var(--sp-3) var(--sp-5)' }}>
                  <span className="chip" style={{ cursor: 'default', fontSize: '0.72rem' }}>{item.category}</span>
                </td>
                <td style={{ padding: 'var(--sp-3) var(--sp-5)', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ₹{item.price}
                </td>
                <td style={{ padding: 'var(--sp-3) var(--sp-5)' }}>
                  {item.rating > 0 ? (
                    <StarRating rating={item.rating} count={item.reviewCount} size={11} />
                  ) : (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>—</span>
                  )}
                </td>
                <td style={{ padding: 'var(--sp-3) var(--sp-5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{item.prepTime || '—'}m</span>
                    {item.spiceLevel > 0 && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1px', marginLeft: '4px' }}>
                        {Array.from({ length: item.spiceLevel }, (_, i) => (
                          <Flame key={i} size={10} fill={SPICE_COLORS[item.spiceLevel]} color={SPICE_COLORS[item.spiceLevel]} strokeWidth={0} />
                        ))}
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ padding: 'var(--sp-3) var(--sp-5)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', maxWidth: '180px' }}>
                    {(item.tags || []).slice(0, 3).map(tag => (
                      <span key={tag} style={{
                        display: 'inline-flex',
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--brand-subtle)',
                        color: 'var(--brand)',
                        fontSize: '0.6rem',
                        fontWeight: 600,
                        border: '1px solid rgba(232,145,58,0.12)',
                      }}>
                        {tag}
                      </span>
                    ))}
                    {(!item.tags || item.tags.length === 0) && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>—</span>
                    )}
                  </div>
                </td>
                <td style={{ padding: 'var(--sp-3) var(--sp-5)', textAlign: 'center' }}>
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
                <td colSpan={7}>
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

