import React from 'react'
import { useAppStore } from '../store/useAppStore'

export default function ReportsView() {
  const orders = useAppStore(state => state.orders)

  // Filter for today's orders
  const today = new Date().toDateString()
  const todaysOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today)

  const totalRevenue = todaysOrders.reduce((sum, o) => sum + o.total, 0)
  
  // Payment Breakdown
  const paymentStats = {
    UPI: todaysOrders.filter(o => o.paymentMethod === 'UPI').length,
    Card: todaysOrders.filter(o => o.paymentMethod === 'Card').length,
    Cash: todaysOrders.filter(o => o.paymentMethod === 'Cash').length,
  }

  // Top Items
  const itemCounts = {}
  todaysOrders.forEach(o => {
    o.items.forEach(item => {
      itemCounts[item.name] = (itemCounts[item.name] || 0) + item.qty
    })
  })
  
  const topItems = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginBottom: '24px' }}>End of Day Summary</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Key Metrics */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          border: 'var(--border)'
        }}>
          <h3 style={{ color: 'var(--t-secondary)', marginBottom: '16px' }}>Today's Revenue</h3>
          <div style={{ fontSize: '3em', fontWeight: 'bold', color: 'var(--c-orange)' }}>
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div style={{ color: 'var(--t-tertiary)', marginTop: '8px' }}>
            From {todaysOrders.length} orders
          </div>
        </div>

        {/* Payment Breakdown */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          border: 'var(--border)'
        }}>
          <h3 style={{ color: 'var(--t-secondary)', marginBottom: '16px' }}>Payment Methods</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>UPI / QR</span>
              <span style={{ fontWeight: 'bold' }}>{paymentStats.UPI} orders</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Card</span>
              <span style={{ fontWeight: 'bold' }}>{paymentStats.Card} orders</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Cash</span>
              <span style={{ fontWeight: 'bold' }}>{paymentStats.Cash} orders</span>
            </div>
          </div>
        </div>

        {/* Top Items */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          border: 'var(--border)',
          gridColumn: '1 / -1'
        }}>
          <h3 style={{ color: 'var(--t-secondary)', marginBottom: '16px' }}>Top Selling Items</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {topItems.map(([name, qty], i) => (
              <div key={name} style={{
                backgroundColor: 'var(--bg-elevated)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ color: 'var(--t-secondary)', fontSize: '0.8em', marginBottom: '4px' }}>#{i + 1}</div>
                  <div style={{ fontWeight: 'bold' }}>{name}</div>
                </div>
                <div style={{ fontSize: '1.2em', color: 'var(--c-orange)', fontWeight: 'bold' }}>
                  {qty}
                </div>
              </div>
            ))}
            {topItems.length === 0 && (
              <div style={{ color: 'var(--t-tertiary)' }}>No items sold yet.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
