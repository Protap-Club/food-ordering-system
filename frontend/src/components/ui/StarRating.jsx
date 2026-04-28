import React from 'react'

// Pure-CSS star using unicode — zero alignment issues
export default function StarRating({ rating = 0, count = 0, size = 14, showCount = true }) {
  const stars = []

  for (let i = 0; i < 5; i++) {
    const fill = Math.max(0, Math.min(1, rating - i)) // 0, partial, or 1

    stars.push(
      <span
        key={i}
        style={{
          position: 'relative',
          display: 'inline-block',
          width: size,
          height: size,
          fontSize: size,
          lineHeight: `${size}px`,
          color: 'var(--text-muted)',
          userSelect: 'none',
        }}
      >
        {/* Empty star background */}
        <span style={{ position: 'absolute', inset: 0, textAlign: 'center' }}>★</span>
        {/* Filled portion clipped by width */}
        {fill > 0 && (
          <span style={{
            position: 'absolute',
            inset: 0,
            textAlign: 'center',
            color: '#FBBF24',
            overflow: 'hidden',
            width: `${fill * 100}%`,
          }}>★</span>
        )}
      </span>
    )
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 0 }}>
        {stars}
      </span>
      {showCount && rating > 0 && (
        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 500, marginLeft: '2px' }}>
          {rating.toFixed(1)}{count > 0 ? ` (${count})` : ''}
        </span>
      )}
    </div>
  )
}


