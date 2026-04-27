import React from 'react'
import { Star } from 'lucide-react'

export default function StarRating({ rating = 0, count = 0, size = 14, showCount = true }) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.25
  const stars = []

  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(
        <Star key={i} size={size} fill="#FBBF24" color="#FBBF24" strokeWidth={0} />
      )
    } else if (i === full && hasHalf) {
      stars.push(
        <span key={i} style={{ position: 'relative', display: 'inline-flex', width: size, height: size }}>
          <Star size={size} fill="none" color="var(--text-muted)" strokeWidth={1.5} style={{ position: 'absolute' }} />
          <span style={{ position: 'absolute', overflow: 'hidden', width: '50%' }}>
            <Star size={size} fill="#FBBF24" color="#FBBF24" strokeWidth={0} />
          </span>
        </span>
      )
    } else {
      stars.push(
        <Star key={i} size={size} fill="none" color="var(--text-muted)" strokeWidth={1.5} />
      )
    }
  }

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '3px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
        {stars}
      </div>
      {showCount && rating > 0 && (
        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 500, marginLeft: '2px' }}>
          {rating.toFixed(1)}{count > 0 ? ` (${count})` : ''}
        </span>
      )}
    </div>
  )
}
