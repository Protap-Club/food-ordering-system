import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import { calculateBill } from '../../utils/invoice'

export default function PaymentModal() {
  const { activeOrder, paymentModalOpen, closePaymentModal, placeOrder } = useAppStore()

  if (!paymentModalOpen) return null

  const bill = calculateBill(activeOrder.items)

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--bg-panel)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        width: '400px',
        border: 'var(--border)',
        boxShadow: 'var(--shadow-float)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2>Select Payment</h2>
          <button onClick={closePaymentModal} style={{ color: 'var(--t-tertiary)', fontSize: '24px' }}>&times;</button>
        </div>

        <div style={{ 
          fontSize: '2em', 
          fontWeight: 'bold', 
          color: 'var(--c-orange)',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          ₹{bill.total}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button 
            onClick={() => placeOrder('UPI')}
            style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}
          >
            📱 UPI / QR
          </button>
          <button 
            onClick={() => placeOrder('Card')}
            style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}
          >
            💳 Card
          </button>
          <button 
            onClick={() => placeOrder('Cash')}
            style={{ padding: '16px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}
          >
            💵 Cash
          </button>
        </div>
      </div>
    </div>
  )
}
