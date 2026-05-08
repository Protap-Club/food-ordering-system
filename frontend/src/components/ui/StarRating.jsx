import React from 'react'
import { Star } from 'lucide-react'

// Pure-CSS star using unicode — zero alignment issues
export default function StarRating({ rating = 0, count = 0, size = 14, showCount = true }) {
  const full = Math.floor(rating)
  const fraction = parseFloat((rating - full).toFixed(2))  // e.g. 0.2 for 4.2, 0.5 for 4.5
  const hasPartial = fraction > 0
  const stars = []
  const starColor = '#FBBF24'
  const emptyStarColor = 'var(--text-muted)'
  const starBoxStyle = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
    flex: `0 0 ${size}px`,
    lineHeight: 0,
    verticalAlign: 'middle',
  }
  const starOverlayStyle = {
    position: 'absolute',
    inset: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(
        <span key={i} style={starBoxStyle}>
          <Star size={size} fill={starColor} color={starColor} strokeWidth={0} />
        </span>
      )
    } else if (i === full && hasPartial) {
      const clipRight = Math.round((1 - fraction) * 100)  // e.g. 80% clipped for 0.2 fraction
      stars.push(
        <span key={i} style={starBoxStyle}>
          {/* Empty outline star — background */}
          <span style={starOverlayStyle}>
            <Star size={size} fill="none" color={emptyStarColor} strokeWidth={1.5} />
          </span>
          {/* Filled star — clipped based on exact fractional fill percentage */}
          <span style={{ ...starOverlayStyle, clipPath: `inset(0 ${clipRight}% 0 0)` }}>
            <Star size={size} fill={starColor} color={starColor} strokeWidth={0} />
          </span>
        </span>
      )
    } else {
      stars.push(
        <span key={i} style={starBoxStyle}>
          <Star size={size} fill="none" color={emptyStarColor} strokeWidth={1.5} />
        </span>
      )
    }
  }

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '3px',
      lineHeight: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1px', lineHeight: 0 }}>
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


