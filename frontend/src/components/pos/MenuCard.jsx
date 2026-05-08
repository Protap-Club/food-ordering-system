import React, { useState, useRef } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { Clock, Plus, Flame, AlertTriangle, Leaf, Wheat } from 'lucide-react'
import TasteChip from '../ui/TasteChip'
import StarRating from '../ui/StarRating'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=400&h=300&fit=crop&q=80'
const IMAGE_FIXES = {
  'Irani Chai': {
    image: 'https://images.pexels.com/photos/13377433/pexels-photo-13377433.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    oldPrefix: 'https://images.unsplash.com/photo-1563639234920-11f4085c0243',
  },
  'Dalgona Coffee': {
    image: 'https://images.pexels.com/photos/4116728/pexels-photo-4116728.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    oldPrefix: 'https://images.unsplash.com/photo-1612543073770-3c0a37a3ee5e',
  },
  'Fresh Lime Soda': {
    image: 'https://images.pexels.com/photos/9996446/pexels-photo-9996446.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    oldPrefix: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed514',
  },
  'Rose Sharbat': {
    image: 'https://images.pexels.com/photos/17379723/pexels-photo-17379723.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    oldPrefix: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
  },
  'Vada Pav': {
    image: 'https://images.pexels.com/photos/15017417/pexels-photo-15017417.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    oldPrefix: 'https://images.unsplash.com/photo-1606491956689-2ea866880049',
  },
  'Bread Pakora': {
    image: 'https://images.pexels.com/photos/30174012/pexels-photo-30174012.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    oldPrefix: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b',
  },
  'Aloo Chaat': {
    image: 'https://images.pexels.com/photos/16171917/pexels-photo-16171917.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    oldPrefix: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086',
  },
  'Rajma Chawal': {
    image: 'https://images.pexels.com/photos/12737912/pexels-photo-12737912.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    oldPrefix: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
  },
  'Chole Bhature': {
    image: 'https://images.pexels.com/photos/11818239/pexels-photo-11818239.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    oldPrefix: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027',
  },
  'Gulab Jamun': {
    image: 'https://images.pexels.com/photos/11887844/pexels-photo-11887844.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    oldPrefix: 'https://images.unsplash.com/photo-1666190073498-d8a92cba26c8',
  },
  'Matka Kulfi': {
    image: 'https://images.pexels.com/photos/29699512/pexels-photo-29699512.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    oldPrefix: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57',
  },
}

// Spice level config
const SPICE_COLORS = ['', '#34D399', '#FBBF24', '#FB923C', '#EF4444']
const SPICE_LABELS = ['', 'Mild', 'Medium', 'Hot', 'Extra Hot']

export default function MenuCard({ item }) {
  const addItemToOrder = useAppStore(state => state.addItemToOrder)
  const [imgError, setImgError] = useState(false)
  const cardRef = useRef(null)

  const itemImage = item.image || item.imageUrl
  const imageFix = IMAGE_FIXES[item.name]
  const resolvedImage = imageFix && (!itemImage || itemImage.startsWith(imageFix.oldPrefix))
    ? imageFix.image
    : itemImage
  const imageUrl = (!imgError && resolvedImage) ? resolvedImage : FALLBACK_IMAGE
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

