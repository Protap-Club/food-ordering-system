import React, { useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { useToast } from '../store/useToast'
import { IndianRupee, ShoppingBag, TrendingUp, CreditCard, Smartphone, Banknote, Trophy, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'
import EmptyState from '../components/ui/EmptyState'

const PAYMENT_COLORS = {
  UPI: '#A78BFA',
  Card: '#60A5FA',
  Cash: '#34D399',
}

const PAYMENT_ICONS = {
  UPI: Smartphone,
  Card: CreditCard,
  Cash: Banknote,
}

// Animates a number from 0 → target over ~800ms using rAF
function useCountUp(target) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (target === 0) { setValue(0); return }
    const duration = 800
    const start = performance.now()
    let raf
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return value
}

function StatCard({ label, rawValue, prefix = '', color, bgColor, Icon }) {
  const animated = useCountUp(rawValue)
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="stat-label">{label}</div>
          <div className="stat-value" style={{ color, marginTop: 'var(--sp-2)' }}>
            {prefix}{animated.toLocaleString('en-IN')}
          </div>
        </div>
        <div style={{
          width: 44, height: 44,
          borderRadius: 'var(--radius-md)',
          background: bgColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color,
        }}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  )
}

export default function ReportsView() {
  const orders = useAppStore(state => state.orders)
  const showToast = useToast(s => s.showToast)

  // Filter for today's orders
  const today = new Date().toDateString()
  const todaysOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today)

  const totalRevenue = todaysOrders.reduce((sum, o) => sum + o.total, 0)
  const avgOrderValue = todaysOrders.length > 0 ? Math.round(totalRevenue / todaysOrders.length) : 0

  // Payment Breakdown
  const paymentData = ['UPI', 'Card', 'Cash'].map(method => ({
    name: method,
    value: todaysOrders.filter(o => o.payment?.method === method).length,
    revenue: todaysOrders.filter(o => o.payment?.method === method).reduce((s, o) => s + o.total, 0),
  }))

  // Top Items
  const itemCounts = {}
  todaysOrders.forEach(o => {
    o.items.forEach(item => {
      itemCounts[item.name] = (itemCounts[item.name] || 0) + item.qty
    })
  })

  const topItems = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, qty]) => ({ name, qty }))

  return (
    <div style={{ padding: 'var(--sp-8)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-6)' }}>
        <h2 style={{ marginBottom: '2px' }}>Daily Report</h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
        {/* ── Stat Cards Row — animated counters ──────────── */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-5)' }}>
          <StatCard
            label="Today's Revenue"
            rawValue={totalRevenue}
            prefix="₹"
            color="var(--brand)"
            bgColor="var(--brand-subtle)"
            Icon={IndianRupee}
          />
          <StatCard
            label="Total Orders"
            rawValue={todaysOrders.length}
            color="var(--info)"
            bgColor="var(--info-bg)"
            Icon={ShoppingBag}
          />
          <StatCard
            label="Avg. Order Value"
            rawValue={avgOrderValue}
            prefix="₹"
            color="var(--success)"
            bgColor="var(--success-bg)"
            Icon={TrendingUp}
          />
        </div>

        {/* ── Charts Row ────────────────────────────────── */}
        <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-5)' }}>
          {/* Payment Breakdown */}
          <div className="glass-card" style={{ padding: 'var(--sp-6)' }}>
            <h4 style={{ marginBottom: 'var(--sp-5)', color: 'var(--text-secondary)' }}>Payment Methods</h4>
            {todaysOrders.length > 0 ? (
              <>
                <div style={{ height: 180, marginBottom: 'var(--sp-4)' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentData.filter(d => d.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {paymentData.filter(d => d.value > 0).map(entry => (
                          <Cell key={entry.name} fill={PAYMENT_COLORS[entry.name]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                  {paymentData.map(method => {
                    const Icon = PAYMENT_ICONS[method.name]
                    return (
                      <div key={method.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                          <div style={{
                            width: 8, height: 8,
                            borderRadius: '50%',
                            background: PAYMENT_COLORS[method.name],
                          }} />
                          <Icon size={14} style={{ color: 'var(--text-tertiary)' }} />
                          <span style={{ fontSize: '0.85rem' }}>{method.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{method.value} orders</span>
                          <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}>₹{method.revenue.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No orders yet today
              </div>
            )}
          </div>

          {/* Top Items Bar Chart */}
          <div className="glass-card" style={{ padding: 'var(--sp-6)' }}>
            <h4 style={{ marginBottom: 'var(--sp-5)', color: 'var(--text-secondary)' }}>Top Selling Items</h4>
            {topItems.length > 0 ? (
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topItems} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={100}
                      tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'var(--bg-hover)' }}
                      contentStyle={{
                        background: 'var(--bg-panel)',
                        border: 'var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        color: 'var(--text-primary)',
                      }}
                      formatter={(value) => [`${value} sold`, 'Qty']}
                    />
                    <Bar dataKey="qty" radius={[0, 6, 6, 0]} barSize={20}>
                      {topItems.map((entry, i) => (
                        <Cell key={entry.name} fill={i === 0 ? 'var(--brand)' : 'var(--bg-elevated)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                icon={Trophy}
                title="No sales data"
                subtitle="Top items will appear here after orders."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
