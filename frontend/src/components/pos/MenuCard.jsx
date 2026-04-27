import React, { useState, useRef } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { Clock, Plus } from 'lucide-react'
import TasteChip from '../ui/TasteChip'
import StarRating from '../ui/StarRating'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=80'

export default function MenuCard({ item }) {
  const addItemToOrder = useAppStore(state => state.addItemToOrder)
  const [imgError, setImgError] = useState(false)
  const cardRef = useRef(null)

  const imageUrl = (!imgError && item.image) ? item.image : FALLBACK_IMAGE
  const tasteProfiles = item.tasteProfile || []

  const handleAdd = () => {
    addItemToOrder(item)
    // Trigger CSS cart pulse on the card
    if (cardRef.current) {
      cardRef.current.classList.remove('cart-pulse')
      // Force reflow so re-adding the class re-triggers the animation
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
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</div>
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

        {tasteProfiles.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {tasteProfiles.slice(0, 3).map(taste => (
              <TasteChip key={taste} taste={taste} />
            ))}
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
