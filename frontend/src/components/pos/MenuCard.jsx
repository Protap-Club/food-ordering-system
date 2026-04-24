import React, { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'

export default function MenuCard({ item }) {
  const addItemToOrder = useAppStore(state => state.addItemToOrder)
  const [isHovered, setIsHovered] = useState(false)

  if (!item.isAvailable) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        opacity: 0.5,
        cursor: 'not-allowed',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ fontSize: '24px' }}>{item.emoji}</div>
        <div>
          <div style={{ fontWeight: 'bold' }}>{item.name}</div>
          <div style={{ color: 'var(--s-danger)', fontSize: '0.85em' }}>Out of Stock</div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => addItemToOrder(item)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered ? 'var(--bg-elevated)' : 'var(--bg-surface)',
        border: isHovered ? '1px solid var(--c-orange)' : '1px solid transparent',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative'
      }}
    >
      {item.isBestseller && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          backgroundColor: 'var(--s-warning-bg)',
          color: 'var(--s-warning)',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.75em',
          fontWeight: 'bold'
        }}>
          Best
        </div>
      )}
      
      <div style={{ fontSize: '32px' }}>{item.emoji}</div>
      
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{item.name}</div>
        <div style={{ color: 'var(--t-tertiary)', fontSize: '0.85em', marginTop: '4px' }}>
          {item.description}
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto'
      }}>
        <span style={{ color: 'var(--c-orange)', fontWeight: 'bold' }}>
          ₹{item.price}
        </span>
        <span style={{ 
          color: 'var(--s-success)',
          fontSize: '0.8em',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
        </span>
      </div>
    </div>
  )
}
