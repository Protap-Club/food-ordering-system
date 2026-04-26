import React from 'react'
import { Flame, Droplets, Cookie, Wind, Leaf, Sparkles, CloudRain, Soup } from 'lucide-react'

const TASTE_CONFIG = {
  spicy:  { icon: Flame,      color: '#FF6B6B', bg: 'rgba(255,107,107,0.12)', label: 'Spicy' },
  salty:  { icon: Droplets,   color: '#60A5FA', bg: 'rgba(96,165,250,0.12)',  label: 'Salty' },
  sweet:  { icon: Cookie,     color: '#FBBF24', bg: 'rgba(251,191,36,0.12)',  label: 'Sweet' },
  sour:   { icon: CloudRain,  color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', label: 'Sour' },
  creamy: { icon: Soup,       color: '#FDE68A', bg: 'rgba(253,230,138,0.12)', label: 'Creamy' },
  crispy: { icon: Sparkles,   color: '#D97706', bg: 'rgba(217,119,6,0.12)',   label: 'Crispy' },
  mild:   { icon: Leaf,       color: '#34D399', bg: 'rgba(52,211,153,0.12)',  label: 'Mild' },
  smoky:  { icon: Wind,       color: '#9CA3AF', bg: 'rgba(156,163,175,0.12)', label: 'Smoky' },
  tangy:      { icon: Droplets,   color: '#F472B6', bg: 'rgba(244,114,182,0.12)', label: 'Tangy' },
  bitter:     { icon: Wind,       color: '#78716C', bg: 'rgba(120,113,108,0.12)', label: 'Bitter' },
  refreshing: { icon: Leaf,       color: '#2DD4BF', bg: 'rgba(45,212,191,0.12)',  label: 'Refreshing' },
  umami:      { icon: Sparkles,   color: '#FB923C', bg: 'rgba(251,146,60,0.12)',  label: 'Umami' },
  soft:       { icon: Cookie,     color: '#FCA5A5', bg: 'rgba(252,165,165,0.12)', label: 'Soft' },
}

export default function TasteChip({ taste }) {
  const config = TASTE_CONFIG[taste]
  if (!config) return null

  const Icon = config.icon

  return (
    <span
      title={config.label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        padding: '2px 7px',
        borderRadius: 'var(--radius-full)',
        background: config.bg,
        color: config.color,
        fontSize: '0.65rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        border: `1px solid ${config.color}22`,
        transition: 'transform var(--duration-fast) ease',
        cursor: 'default',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      <Icon size={10} strokeWidth={2.5} />
      {config.label}
    </span>
  )
}

export { TASTE_CONFIG }
