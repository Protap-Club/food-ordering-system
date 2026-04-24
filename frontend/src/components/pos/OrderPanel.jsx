import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import { calculateBill } from '../../utils/invoice'

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
    <div style={{
      backgroundColor: 'var(--bg-panel)',
      borderRadius: 'var(--radius-lg)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      border: 'var(--border)'
    }}>
      {/* Header & Order Type */}
      <div style={{ padding: '24px', borderBottom: 'var(--border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3>Current Order</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setOrderType('Dine In')}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: activeOrder.type === 'Dine In' ? 'var(--c-orange)' : 'var(--bg-elevated)',
                fontSize: '0.85em'
              }}
            >
              Dine In
            </button>
            <button 
              onClick={() => setOrderType('Takeaway')}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: activeOrder.type === 'Takeaway' ? 'var(--c-orange)' : 'var(--bg-elevated)',
                fontSize: '0.85em'
              }}
            >
              Takeaway
            </button>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            placeholder="Customer Name (opt)" 
            value={activeOrder.customerName}
            onChange={(e) => setCustomerInfo(e.target.value, activeOrder.customerMobile)}
            style={{ flex: 1, padding: '8px' }}
          />
          {activeOrder.type === 'Dine In' && (
            <div style={{
              padding: '8px 12px',
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--c-orange)',
              fontWeight: 'bold'
            }}>
              {activeOrder.tableNumber ? `Table ${activeOrder.tableNumber}` : 'No Table'}
            </div>
          )}
        </div>
      </div>

      {/* Item List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {isOrderEmpty ? (
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--t-tertiary)',
            textAlign: 'center'
          }}>
            Add items from the menu<br/>to start a new order.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeOrder.items.map(item => (
              <div key={item.itemId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                  <div style={{ color: 'var(--t-secondary)', fontSize: '0.85em' }}>₹{item.price} each</div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                    <button onClick={() => updateItemQty(item.itemId, item.qty - 1)} style={{ padding: '4px 12px', color: 'var(--t-secondary)' }}>-</button>
                    <span style={{ width: '20px', textAlign: 'center', fontWeight: 'bold' }}>{item.qty}</span>
                    <button onClick={() => updateItemQty(item.itemId, item.qty + 1)} style={{ padding: '4px 12px', color: 'var(--c-orange)' }}>+</button>
                  </div>
                  <div style={{ width: '60px', textAlign: 'right', fontWeight: 'bold' }}>
                    ₹{item.price * item.qty}
                  </div>
                  <button onClick={() => removeItemFromOrder(item.itemId)} style={{ color: 'var(--s-danger)', padding: '4px' }}>
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bill Summary & Actions */}
      <div style={{ padding: '24px', borderTop: 'var(--border-light)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--t-secondary)' }}>
          <span>Subtotal</span>
          <span>₹{bill.subtotal}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--t-secondary)', fontSize: '0.85em' }}>
          <span>GST (5%)</span>
          <span>₹{bill.gst}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1.5em', fontWeight: 'bold', color: 'var(--c-orange)' }}>
          <span>Total</span>
          <span>₹{bill.total}</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button 
            onClick={clearActiveOrder}
            disabled={isOrderEmpty}
            style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', opacity: isOrderEmpty ? 0.5 : 1 }}
          >
            Clear
          </button>
          <button 
            onClick={holdActiveOrder}
            disabled={isOrderEmpty}
            style={{ padding: '16px', backgroundColor: 'var(--s-warning-bg)', color: 'var(--s-warning)', borderRadius: 'var(--radius-md)', opacity: isOrderEmpty ? 0.5 : 1 }}
          >
            Hold Order
          </button>
          <button 
            onClick={openPaymentModal}
            disabled={isOrderEmpty}
            style={{ gridColumn: '1 / -1', padding: '16px', backgroundColor: 'var(--s-success)', color: '#000', borderRadius: 'var(--radius-md)', fontWeight: 'bold', opacity: isOrderEmpty ? 0.5 : 1 }}
          >
            Pay & Place Order
          </button>
        </div>
      </div>
    </div>
  )
}
