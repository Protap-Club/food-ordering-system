import React, { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '../store/useAppStore'
import {
  ShoppingCart, ChefHat, Armchair, ClipboardList, BarChart3,
  Sun, Moon, Menu, X,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'pos',     icon: ShoppingCart,  label: 'POS' },
  { id: 'kds',     icon: ChefHat,       label: 'Kitchen' },
  { id: 'tables',  icon: Armchair,      label: 'Tables' },
  { id: 'menu',    icon: ClipboardList, label: 'Menu' },
  { id: 'reports', icon: BarChart3,     label: 'Reports' },
]

const VIEW_TITLES = {
  pos: 'Point of Sale', kds: 'Kitchen Display', tables: 'Table Management',
  menu: 'Menu Manager', reports: 'Reports & Analytics',
}

function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ textAlign: 'center', padding: '0 var(--sp-2)' }}>
      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
        {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>
        {time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
      </div>
    </div>
  )
}

function NavList({ currentView, onNavigate, showLabels = true }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', width: '100%', padding: '0 var(--sp-3)' }}>
      {NAV_ITEMS.map(item => {
        const isActive = currentView === item.id
        const Icon = item.icon
        return (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            onClick={() => onNavigate(item.id)}
            title={item.label}
            className={`nav-item${isActive ? ' nav-item--active' : ''}`}
            style={showLabels ? { flexDirection: 'row', justifyContent: 'flex-start', gap: 'var(--sp-4)', paddingLeft: 'var(--sp-4)', height: 56 } : {}}
          >
            <div className="nav-active-pill" aria-hidden="true" />
            <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
            {showLabels ? (
              <span style={{ fontWeight: isActive ? 700 : 500, fontSize: '0.95rem' }}>{item.label}</span>
            ) : (
              <span style={{ fontSize: '0.6rem', fontWeight: isActive ? 700 : 500, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                {item.label}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default function StaffLayout({ children }) {
  const { currentView, setView } = useAppStore()
  const [theme, setTheme] = useState(() => localStorage.getItem('cafeos-theme') || 'dark')
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('cafeos-theme', theme)
  }, [theme])

  // Close drawer on route change
  const handleNavigate = useCallback((viewId) => {
    setView(viewId)
    setDrawerOpen(false)
  }, [setView])

  // Close drawer on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setDrawerOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg-root)', position: 'relative' }}>

      {/* ── Ambient Visual Layer ── */}
      <div className="ambient-layer" aria-hidden="true">
        <div className="ambient-orb ambient-orb--primary" />
        <div className="ambient-orb ambient-orb--secondary" />
        <div className="ambient-orb ambient-orb--accent" />
      </div>

      {/* ── Desktop Sidebar ─────────────────────────────────── */}
      <nav
        className="glass desktop-sidebar"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <div className="sidebar-brand">C</div>

        <LiveClock />
        <div className="sidebar-divider" />

        {/* Nav — icon+label stacked (desktop) */}
        <div style={{ flex: 1, width: '100%' }}>
          <NavList currentView={currentView} onNavigate={handleNavigate} showLabels={false} />
        </div>

        {/* Bottom actions */}
        <div className="sidebar-bottom">
          <div className="sidebar-divider" style={{ marginBottom: 'var(--sp-2)' }} />
          <button onClick={toggleTheme} title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'} className="icon-btn">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="staff-avatar" role="button" tabIndex={0} title="Staff profile">S</div>
        </div>
      </nav>

      {/* ── Mobile Header ───────────────────────────────────── */}
      <header className="mobile-header glass">
        <button
          className="hamburger-btn"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation"
          aria-expanded={drawerOpen}
        >
          <Menu size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
          <div className="mobile-brand">C</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
            {VIEW_TITLES[currentView]}
          </span>
        </div>

        <button onClick={toggleTheme} className="icon-btn" style={{ width: 40, height: 40 }}
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      {/* ── Mobile Drawer Backdrop ──────────────────────────── */}
      {drawerOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Drawer ───────────────────────────────────── */}
      <div className={`mobile-drawer glass${drawerOpen ? ' mobile-drawer--open' : ''}`} role="dialog" aria-modal="true" aria-label="Navigation">
        {/* Drawer header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            <div className="sidebar-brand" style={{ margin: 0 }}>C</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>CafeOS</span>
          </div>
          <button className="icon-btn" onClick={() => setDrawerOpen(false)} style={{ width: 36, height: 36 }} aria-label="Close navigation">
            <X size={20} />
          </button>
        </div>

        {/* Drawer nav — full labels */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--sp-4) 0' }}>
          <NavList currentView={currentView} onNavigate={handleNavigate} showLabels={true} />
        </div>

        {/* Drawer footer */}
        <div className="drawer-footer">
          <div className="staff-avatar" style={{ width: 36, height: 36, fontSize: '0.8rem' }}>S</div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Staff</span>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────── */}
      <main className="app-main">
        <div key={currentView} className="animate-viewEnter" style={{ height: '100%' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
