import React from 'react'

export default function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--sp-16) var(--sp-8)',
      textAlign: 'center',
      gap: 'var(--sp-4)',
      animation: 'fadeIn var(--duration-slow) ease both',
    }}>
      {Icon && (
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 'var(--radius-xl)',
          background: 'var(--brand-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--brand)',
        }}>
          <Icon size={28} strokeWidth={1.5} />
        </div>
      )}
      <div>
        <h4 style={{ color: 'var(--text-secondary)', marginBottom: 'var(--sp-1)' }}>{title}</h4>
        {subtitle && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 280, margin: '0 auto' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
