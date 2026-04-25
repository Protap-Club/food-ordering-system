import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import { calculateBill } from '../../utils/invoice'
import { ShoppingBag, Minus, Plus, Trash2, Pause, CreditCard, X } from 'lucide-react'
import EmptyState from '../ui/EmptyState'

export default function OrderPanel() {
  const {
    activeOrder,
    setOrderType,
    setCustomerInfo,
    updateItemQty,
    removeItemFromOrder,
    clearActiveOrder,
    holdActiveOrder,
    openPaymentModal
  } = useAppStore()

  const bill = calculateBill(activeOrder.items)
  const isOrderEmpty = activeOrder.items.length === 0

  return (
    <div className="glass-panel" style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ padding: 'var(--sp-5)', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-3)' }}>
          <h3 style={{ fontSize: '1.05rem' }}>Current Order</h3>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            {['Dine In', 'Takeaway'].map(type => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={activeOrder.type === type ? 'chip chip-active' : 'chip'}
                style={{ fontSize: '0.8rem' }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
          <input
            type="text"
            placeholder="Customer Name (opt)"
            value={activeOrder.customerName}
            onChange={(e) => setCustomerInfo(e.target.value, activeOrder.customerMobile)}
            style={{ flex: 1, padding: 'var(--sp-2) var(--sp-3)', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
          />
          {activeOrder.type === 'Dine In' && (
            <div style={{
              padding: 'var(--sp-2) var(--sp-3)',
              background: 'var(--brand-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--brand)',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: '1px solid rgba(232,145,58,0.15)',
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
            }}>
              {activeOrder.tableNumber ? `Table ${activeOrder.tableNumber}` : 'No Table'}
            </div>
          )}
        </div>
      </div>

      {/* ── Item List ──────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--sp-4) var(--sp-5)' }}>
        {isOrderEmpty ? (
          <EmptyState
            icon={ShoppingBag}
            title="No items yet"
            subtitle="Tap items from the menu to add them to this order."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {activeOrder.items.map((item, index) => (
              <div
                key={item.itemId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--sp-3)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: 'var(--border)',
                  animation: `fadeInUp var(--duration-slow) var(--ease-out) both`,
                  animationDelay: `${index * 30}ms`,
                }}
              >
                {/* Item info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {item.name}
                  </div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginTop: '1px' }}>
                    ₹{item.price} each
                  </div>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', flexShrink: 0 }}>
                  {/* Qty Stepper */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-sm)',
                    border: 'var(--border)',
                  }}>
                    <button
                      onClick={() => updateItemQty(item.itemId, item.qty - 1)}
                      style={{
                        padding: 'var(--sp-1) var(--sp-2)',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{
                      width: 24,
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateItemQty(item.itemId, item.qty + 1)}
                      style={{
                        padding: 'var(--sp-1) var(--sp-2)',
                        color: 'var(--brand)',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Line total */}
                  <div style={{
                    width: 56,
                    textAlign: 'right',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-display)',
                  }}>
                    ₹{item.price * item.qty}
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeItemFromOrder(item.itemId)}
                    style={{
                      color: 'var(--danger)',
                      padding: 'var(--sp-1)',
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: 'var(--radius-xs)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-bg)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Bill Summary & Actions ─────────────────────────── */}
      <div style={{
        padding: 'var(--sp-5)',
        borderTop: '1px solid var(--glass-border)',
        background: 'var(--glass-highlight)',
      }}>
        {/* Subtotal + Tax */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-2)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <span>Subtotal</span>
          <span>₹{bill.subtotal}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-3)', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
          <span>GST (5%)</span>
          <span>₹{bill.gst}</span>
        </div>

        <div className="divider" style={{ margin: 'var(--sp-3) 0' }} />

        {/* Total */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 'var(--sp-5)',
          fontFamily: 'var(--font-display)',
          fontSize: '1.5rem',
          fontWeight: 800,
          color: 'var(--brand)',
          letterSpacing: '-0.02em',
        }}>
          <span>Total</span>
          <span>₹{bill.total}</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
          <button
            className="btn btn-ghost"
            onClick={clearActiveOrder}
            disabled={isOrderEmpty}
            style={{ justifyContent: 'center' }}
          >
            <X size={16} /> Clear
          </button>
          <button
            className="btn"
            onClick={holdActiveOrder}
            disabled={isOrderEmpty}
            style={{
              background: 'var(--warning-bg)',
              color: 'var(--warning)',
              border: '1px solid var(--warning-border)',
              justifyContent: 'center',
            }}
          >
            <Pause size={16} /> Hold
          </button>
          <button
            className="btn btn-success btn-lg"
            onClick={openPaymentModal}
            disabled={isOrderEmpty}
            style={{ gridColumn: '1 / -1', justifyContent: 'center' }}
          >
            <CreditCard size={18} /> Pay & Place Order
          </button>
        </div>
      </div>
    </div>
  )
}
