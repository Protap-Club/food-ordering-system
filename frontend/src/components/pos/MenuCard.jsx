import React, { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { Clock, Plus } from 'lucide-react'
import TasteChip from '../ui/TasteChip'
import StarRating from '../ui/StarRating'

// Curated fallback food images by category keywords
const FALLBACK_IMAGES = {
  default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=80',
}

function getFallbackImage(item) {
  if (item.image) return item.image
  return FALLBACK_IMAGES.default
}

export default function MenuCard({ item }) {
  const addItemToOrder = useAppStore(state => state.addItemToOrder)
  const [isHovered, setIsHovered] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const imageUrl = imgError ? FALLBACK_IMAGES.default : getFallbackImage(item)
  const tasteProfiles = item.tasteProfile || []

  const handleAdd = () => {
    addItemToOrder(item)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 400)
  }

  if (!item.isAvailable) {
    return (
      <div className="glass-card" style={{
        opacity: 0.5,
        cursor: 'not-allowed',
        overflow: 'hidden',
        filter: 'grayscale(0.6)',
        position: 'relative',
      }}>
        {/* Image */}
        <div style={{
          height: 140,
          background: `url(${imageUrl}) center/cover no-repeat`,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, transparent 30%, var(--bg-panel) 100%)',
          }} />
          <div style={{
            position: 'absolute', top: 'var(--sp-2)', right: 'var(--sp-2)',
            background: 'var(--danger)',
            color: 'white',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.65rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Sold Out
          </div>
        </div>
        <div style={{ padding: 'var(--sp-3) var(--sp-4) var(--sp-4)' }}>
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
      className="glass-card"
      onClick={handleAdd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
        transform: justAdded ? 'scale(0.96)' : isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered ? 'var(--shadow-lg)' : justAdded ? 'var(--shadow-glow)' : undefined,
        borderColor: justAdded ? 'var(--brand)' : isHovered ? 'rgba(255,255,255,0.1)' : undefined,
        transition: 'all var(--duration-normal) var(--ease-out)',
        willChange: 'transform',
      }}
    >
      {/* ── Food Image ───────────────────────────────────────── */}
      <div style={{
        height: 150,
        background: `url(${imageUrl}) center/cover no-repeat`,
        position: 'relative',
        transition: 'transform 0.4s ease',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        overflow: 'hidden',
      }}>
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 40%, var(--bg-panel) 100%)',
        }} />

        {/* Bestseller badge */}
        {item.isBestseller && (
          <div style={{
            position: 'absolute', top: 'var(--sp-2)', left: 'var(--sp-2)',
            background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
            color: '#000',
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.6rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            boxShadow: '0 2px 8px rgba(251, 191, 36, 0.4)',
          }}>
            ★ Bestseller
          </div>
        )}

        {/* Veg / Non-Veg indicator */}
        <div style={{
          position: 'absolute', top: 'var(--sp-2)', right: 'var(--sp-2)',
        }}>
          <div className={`veg-indicator ${item.isVeg !== false ? 'veg-indicator--veg' : 'veg-indicator--nonveg'}`} />
        </div>

        {/* Quick add button */}
        <div style={{
          position: 'absolute', bottom: 'var(--sp-2)', right: 'var(--sp-2)',
          width: 32, height: 32,
          borderRadius: 'var(--radius-full)',
          background: 'var(--brand)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 4px 12px rgba(232, 145, 58, 0.4)',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'scale(1)' : 'scale(0.8)',
          transition: 'all var(--duration-normal) var(--ease-spring)',
        }}>
          <Plus size={16} strokeWidth={3} />
        </div>
      </div>

      {/* ── Card Body ────────────────────────────────────────── */}
      <div style={{ padding: 'var(--sp-3) var(--sp-4) var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
        {/* Title + Price */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--sp-2)' }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3, flex: 1, color: 'var(--text-primary)' }}>
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

        {/* Description */}
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

        {/* Taste Chips */}
        {tasteProfiles.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {tasteProfiles.slice(0, 3).map(taste => (
              <TasteChip key={taste} taste={taste} />
            ))}
          </div>
        )}

        {/* Bottom row: Rating + Prep time */}
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

      {/* Error handler for broken images */}
      <img
        src={imageUrl}
        alt=""
        style={{ display: 'none' }}
        onError={() => setImgError(true)}
      />
    </div>
  )
}
