import React from 'react'
import { useAppStore } from '../store/useAppStore'

export default function StaffLayout({ children }) {
  const { currentView, setView } = useAppStore()

  const navItems = [
    { id: 'pos', icon: '🛒', label: 'POS' },
    { id: 'kds', icon: '🍳', label: 'Kitchen' },
    { id: 'tables', icon: '🪑', label: 'Tables' },
    { id: 'menu', icon: '📋', label: 'Menu' },
    { id: 'reports', icon: '📊', label: 'Reports' },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Sidebar Navigation */}
      <nav style={{
        width: '80px',
        backgroundColor: 'var(--bg-panel)',
        borderRight: 'var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 0',
        gap: '24px'
      }}>
        {/* Brand/Logo */}
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: 'var(--c-orange)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--t-primary)',
          fontWeight: 'bold',
          fontFamily: 'var(--font-display)',
          fontSize: '24px',
          marginBottom: '24px'
        }}>
          C
        </div>

        {/* Nav Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
          {navItems.map(item => {
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                title={item.label}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--c-orange-light)' : 'transparent',
                  color: isActive ? 'var(--c-orange)' : 'var(--t-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  border: isActive ? '1px solid var(--c-orange)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--t-primary)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--t-secondary)'
                }}
              >
                {item.icon}
              </button>
            )
          })}
        </div>

        {/* User Profile / Settings (stub) */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          cursor: 'pointer'
        }}>
          👤
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, backgroundColor: 'var(--bg-base)', overflow: 'hidden' }}>
        {children}
      </main>
    </div>
  )
}
