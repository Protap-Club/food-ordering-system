import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import { calculateBill } from '../../utils/invoice'
import { X, Smartphone, CreditCard, Banknote } from 'lucide-react'

const PAYMENT_METHODS = [
  { id: 'UPI',  icon: Smartphone,  label: 'UPI / QR',  color: '#A78BFA' },
  { id: 'Card', icon: CreditCard,  label: 'Card',       color: '#60A5FA' },
  { id: 'Cash', icon: Banknote,    label: 'Cash',       color: '#34D399' },
]

export default function PaymentModal() {
  const { activeOrder, paymentModalOpen, closePaymentModal, placeOrder } = useAppStore()

  if (!paymentModalOpen) return null

  const bill = calculateBill(activeOrder.items)

  return (
    <div className="modal-overlay" onClick={closePaymentModal}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ width: 400, padding: 'var(--sp-8)' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-6)' }}>
          <h2 style={{ fontSize: '1.2rem' }}>Select Payment</h2>
          <button
            onClick={closePaymentModal}
            className="btn-icon"
            style={{ color: 'var(--text-tertiary)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-full)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Total */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'var(--sp-8)',
          padding: 'var(--sp-5)',
          background: 'var(--brand-subtle)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(232,145,58,0.1)',
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 'var(--sp-1)', fontWeight: 500 }}>
            Amount to pay
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.5rem',
            fontWeight: 800,
            color: 'var(--brand)',
            letterSpacing: '-0.03em',
          }}>
            ₹{bill.total}
          </div>
        </div>

        {/* Payment Method Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {PAYMENT_METHODS.map(method => {
            const Icon = method.icon
            return (
              <button
                key={method.id}
                onClick={() => placeOrder(method.id)}
                style={{
                  padding: 'var(--sp-4) var(--sp-5)',
                  background: 'var(--bg-surface)',
                  border: 'var(--border)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-4)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  transition: 'all var(--duration-normal) var(--ease-out)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--bg-hover)'
                  e.currentTarget.style.borderColor = method.color + '44'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = `0 4px 16px ${method.color}22`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--bg-surface)'
                  e.currentTarget.style.borderColor = 'var(--border-color)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  width: 40, height: 40,
                  borderRadius: 'var(--radius-md)',
                  background: method.color + '18',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: method.color,
                }}>
                  <Icon size={20} />
                </div>
                {method.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
