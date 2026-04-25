import React, { useState, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import {
  ShoppingCart,
  ChefHat,
  Armchair,
  ClipboardList,
  BarChart3,
  Settings,
  Sun,
  Moon,
  LogOut,
  Clock
} from 'lucide-react'

const navItems = [
  { id: 'pos',     icon: ShoppingCart,  label: 'POS' },
  { id: 'kds',     icon: ChefHat,       label: 'Kitchen' },
  { id: 'tables',  icon: Armchair,      label: 'Tables' },
  { id: 'menu',    icon: ClipboardList, label: 'Menu' },
  { id: 'reports', icon: BarChart3,     label: 'Reports' },
]

function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  return (
    <div style={{ textAlign: 'center', padding: '0 var(--sp-2)' }}>
      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
        {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>
        {time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
      </div>
    </div>
  )
}

export default function StaffLayout({ children }) {
  const { currentView, setView } = useAppStore()
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('cafeos-theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('cafeos-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg-root)' }}>
      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <nav className="glass" style={{
        width: 'var(--sidebar-width)',
        minWidth: 'var(--sidebar-width)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'var(--sp-5) 0',
        gap: 'var(--sp-3)',
        borderRight: '1px solid var(--glass-border)',
        zIndex: 10,
        transition: 'width var(--duration-normal) ease',
      }}>
        {/* Brand Logo */}
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, var(--brand) 0%, #C6793A 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '1.4rem',
          color: 'white',
          boxShadow: '0 4px 16px rgba(232, 145, 58, 0.35)',
          marginBottom: 'var(--sp-2)',
          flexShrink: 0,
          letterSpacing: '-0.03em',
        }}>
          C
        </div>

        {/* Live Clock */}
        <LiveClock />

        <div style={{ width: '60%', height: 1, background: 'var(--border-color)', margin: 'var(--sp-1) 0' }} />

        {/* Nav Items */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-2)',
          flex: 1,
          width: '100%',
          padding: '0 var(--sp-3)',
        }}>
          {navItems.map(item => {
            const isActive = currentView === item.id
            const Icon = item.icon
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setView(item.id)}
                title={item.label}
                style={{
                  width: '100%',
                  height: 52,
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--brand-light)' : 'transparent',
                  color: isActive ? 'var(--brand)' : 'var(--text-tertiary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '3px',
                  border: isActive ? '1px solid rgba(232, 145, 58, 0.2)' : '1px solid transparent',
                  position: 'relative',
                  transition: 'all var(--duration-normal) var(--ease-out)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-primary)'
                    e.currentTarget.style.background = 'var(--bg-hover)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-tertiary)'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: -12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 3,
                    height: 24,
                    borderRadius: '0 3px 3px 0',
                    background: 'var(--brand)',
                    boxShadow: '0 0 8px rgba(232, 145, 58, 0.5)',
                  }} />
                )}
                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                <span style={{
                  fontSize: '0.6rem',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                }}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Bottom Actions */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-2)',
          alignItems: 'center',
          width: '100%',
          padding: '0 var(--sp-3)',
        }}>
          <div style={{ width: '60%', height: 1, background: 'var(--border-color)', marginBottom: 'var(--sp-1)' }} />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              width: '100%',
              height: 40,
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-tertiary)',
              background: 'transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--bg-hover)'
              e.currentTarget.style.color = 'var(--warning)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--text-tertiary)'
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Staff Avatar */}
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--brand-light) 0%, var(--bg-elevated) 100%)',
            border: '2px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--brand)',
            cursor: 'pointer',
            transition: 'all var(--duration-normal) ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--brand)'
            e.currentTarget.style.boxShadow = 'var(--shadow-glow)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border-color)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          >
            S
          </div>
        </div>
      </nav>

      {/* ── Main Content ──────────────────────────────────────────── */}
      <main style={{
        flex: 1,
        background: 'var(--bg-base)',
        overflow: 'hidden',
        transition: 'background var(--duration-slow) ease',
      }}>
        {children}
      </main>
    </div>
  )
}
