import React, { useState, useRef } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { Clock, Plus, Flame, AlertTriangle, Leaf, Wheat } from 'lucide-react'
import TasteChip from '../ui/TasteChip'
import StarRating from '../ui/StarRating'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=400&h=300&fit=crop&q=80'

// Spice level config
const SPICE_COLORS = ['', '#34D399', '#FBBF24', '#FB923C', '#EF4444']
const SPICE_LABELS = ['', 'Mild', 'Medium', 'Hot', 'Extra Hot']

export default function MenuCard({ item }) {
  const addItemToOrder = useAppStore(state => state.addItemToOrder)
  const [imgError, setImgError] = useState(false)
  const cardRef = useRef(null)

  const imageUrl = (!imgError && item.image) ? item.image : FALLBACK_IMAGE
  const tasteProfiles = item.tasteProfile || []
  const tags = item.tags || []
  const allergens = item.allergens || []

  const handleAdd = () => {
    addItemToOrder(item)
    if (cardRef.current) {
      cardRef.current.classList.remove('cart-pulse')
      void cardRef.current.offsetWidth
      cardRef.current.classList.add('cart-pulse')
    }
  }

  if (!item.isAvailable) {
    return (
      <div className="glass-card menu-card menu-card--unavailable">
        <div className="menu-card__image" style={{ backgroundImage: `url(${imageUrl})` }}>
          <div className="menu-card__overlay" />
          <span className="menu-card__sold-out">Sold Out</span>
        </div>
        <div className="menu-card__body">
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
            {item.emoji && <span style={{ marginRight: '4px' }}>{item.emoji}</span>}
            {item.name}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 'var(--sp-1)' }}>
            Currently unavailable
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={cardRef}
      className="glass-card menu-card"
      onClick={handleAdd}
    >
      {/* ── Food Image ─────────────────────────────────────── */}
      <div className="menu-card__image" style={{ backgroundImage: `url(${imageUrl})` }}>
        <div className="menu-card__overlay" />

        {item.isBestseller && (
          <div className="menu-card__bestseller">★ Bestseller</div>
        )}

        <div style={{ position: 'absolute', top: 'var(--sp-2)', right: 'var(--sp-2)' }}>
          <div className={`veg-indicator ${item.isVeg !== false ? 'veg-indicator--veg' : 'veg-indicator--nonveg'}`} />
        </div>

        {/* Quick-add button — visible on hover via CSS */}
        <div className="menu-card__add-btn" aria-hidden="true">
          <Plus size={16} strokeWidth={3} />
        </div>
      </div>

      {/* ── Card Body ──────────────────────────────────────── */}
      <div className="menu-card__body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--sp-2)' }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3, flex: 1 }}>
            {item.emoji && <span style={{ marginRight: '4px' }}>{item.emoji}</span>}
            {item.name}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1rem',
            color: 'var(--brand)',
            whiteSpace: 'nowrap',
          }}>
            ₹{item.price}
          </div>
        </div>

        {item.description && (
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-tertiary)',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {item.description}
          </div>
        )}

        {/* Tags row */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
            {tags.slice(0, 3).map(tag => (
              <span key={tag} style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '1px 6px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--brand-subtle)',
                color: 'var(--brand)',
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                border: '1px solid rgba(232,145,58,0.12)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Taste profiles */}
        {tasteProfiles.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {tasteProfiles.slice(0, 3).map(taste => (
              <TasteChip key={taste} taste={taste} />
            ))}
          </div>
        )}

        {/* Info row: calories · portion · spice */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexWrap: 'wrap',
          fontSize: '0.68rem',
          color: 'var(--text-muted)',
        }}>
          {item.calories && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              🔥 {item.calories} kcal
            </span>
          )}
          {item.portionSize && (
            <span>· {item.portionSize}</span>
          )}
          {item.spiceLevel > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', marginLeft: '2px' }}>
              {Array.from({ length: item.spiceLevel }, (_, i) => (
                <Flame key={i} size={9} fill={SPICE_COLORS[item.spiceLevel]} color={SPICE_COLORS[item.spiceLevel]} strokeWidth={0} />
              ))}
            </span>
          )}
        </div>

        {/* Allergen warning */}
        {allergens.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '0.6rem',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
          }}>
            <AlertTriangle size={9} style={{ color: 'var(--warning)', flexShrink: 0 }} />
            {allergens.join(', ')}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          {item.rating > 0 ? (
            <StarRating rating={item.rating} count={item.reviewCount} size={12} />
          ) : (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>New</span>
          )}
          {item.prepTime && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
            }}>
              <Clock size={10} />
              {item.prepTime}m
            </span>
          )}
        </div>
      </div>

      {/* Hidden image for error detection */}
      <img src={imageUrl} alt="" style={{ display: 'none' }} onError={() => setImgError(true)} />
    </div>
  )
}

