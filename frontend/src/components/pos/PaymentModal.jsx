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

        {/* Payment Method Buttons — CSS hover via .payment-method-btn */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {PAYMENT_METHODS.map(method => {
            const Icon = method.icon
            return (
              <button
                key={method.id}
                onClick={() => placeOrder(method.id)}
                className="payment-method-btn"
              >
                <div style={{
                  width: 40, height: 40,
                  borderRadius: 'var(--radius-md)',
                  background: method.color + '18',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: method.color,
                  flexShrink: 0,
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
