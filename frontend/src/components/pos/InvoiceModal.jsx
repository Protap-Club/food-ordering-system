import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import { printInvoice } from '../../utils/print'
import { Printer, X, CheckCircle } from 'lucide-react'

export default function InvoiceModal() {
  const { invoiceModalOpen, currentInvoice, closeInvoiceModal } = useAppStore()

  if (!invoiceModalOpen || !currentInvoice) return null

  return (
    <div className="modal-overlay" onClick={closeInvoiceModal}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 380,
          animation: 'scaleIn var(--duration-normal) var(--ease-spring)',
        }}
      >
        {/* ── Receipt Card (white receipt paper) ────────────── */}
        <div id="invoice-receipt" style={{
          background: '#FEFEFE',
          color: '#1A1A1A',
          borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
          padding: 'var(--sp-8) var(--sp-6)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          lineHeight: 1.6,
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--sp-5)' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#1A1A1A',
              marginBottom: '2px',
            }}>
              CAFE OS
            </div>
            <div style={{ color: '#888', fontSize: '0.72rem' }}>Connaught Place, New Delhi</div>
            <div style={{ color: '#888', fontSize: '0.72rem' }}>GSTIN: 07AABCU9603R1ZX</div>
          </div>

          {/* Token + Meta */}
          <div style={{
            borderTop: '1px dashed #DDD',
            borderBottom: '1px dashed #DDD',
            padding: 'var(--sp-3) 0',
            textAlign: 'center',
            marginBottom: 'var(--sp-4)',
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1A1A1A', letterSpacing: '0.05em' }}>
              {currentInvoice.token}
            </div>
            <div style={{ color: '#888', fontSize: '0.72rem', marginTop: '2px' }}>
              {currentInvoice.type}{currentInvoice.tableNumber && ` · Table ${currentInvoice.tableNumber}`}
            </div>
            <div style={{ color: '#AAA', fontSize: '0.68rem', marginTop: '2px' }}>
              {new Date(currentInvoice.createdAt).toLocaleString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </div>
          </div>

          {/* Items */}
          <div style={{ marginBottom: 'var(--sp-4)' }}>
            {/* Column headers */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: 'var(--sp-1)',
              borderBottom: '1px solid #EEE',
              marginBottom: 'var(--sp-2)',
              fontSize: '0.68rem',
              color: '#AAA',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontWeight: 600,
            }}>
              <span>Item</span>
              <span>Amt</span>
            </div>
            {currentInvoice.items.map(item => (
              <div key={item.itemId} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: 'var(--sp-1) 0',
              }}>
                <span style={{ color: '#444' }}>
                  <span style={{ fontWeight: 700, color: '#1A1A1A' }}>{item.qty}</span>
                  <span style={{ color: '#CCC', margin: '0 4px' }}>×</span>
                  {item.name}
                </span>
                <span style={{ fontWeight: 600, color: '#1A1A1A' }}>
                  {(item.qty * item.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ borderTop: '1px dashed #DDD', paddingTop: 'var(--sp-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', marginBottom: '2px' }}>
              <span>Subtotal</span>
              <span>{Number(currentInvoice.subtotal).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.75rem', marginBottom: '2px' }}>
              <span>CGST (2.5%)</span>
              <span>{Number(currentInvoice.cgst).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.75rem', marginBottom: 'var(--sp-3)' }}>
              <span>SGST (2.5%)</span>
              <span>{Number(currentInvoice.sgst).toFixed(2)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 800,
              fontSize: '1.2rem',
              borderTop: '2px solid #1A1A1A',
              paddingTop: 'var(--sp-2)',
            }}>
              <span>TOTAL</span>
              <span>₹{Number(currentInvoice.total).toFixed(2)}</span>
            </div>
          </div>

          {/* Payment method */}
          <div style={{
            textAlign: 'center',
            marginTop: 'var(--sp-5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--sp-2)',
            color: '#22C55E',
            fontSize: '0.78rem',
            fontWeight: 600,
          }}>
            <CheckCircle size={14} />
            Paid via {currentInvoice.paymentMethod}
          </div>
        </div>

        {/* ── Action Buttons (dark bar below receipt) ──────── */}
        <div style={{
          display: 'flex',
          gap: 0,
          borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
          overflow: 'hidden',
        }}>
          <button
            onClick={printInvoice}
            style={{
              flex: 1,
              padding: 'var(--sp-4)',
              background: 'var(--brand)',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--sp-2)',
              border: 'none',
              borderRadius: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)' }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)' }}
          >
            <Printer size={16} /> Print
          </button>
          <button
            onClick={closeInvoiceModal}
            style={{
              flex: 1,
              padding: 'var(--sp-4)',
              background: 'var(--bg-panel)',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--sp-2)',
              border: 'none',
              borderRadius: 0,
              borderLeft: '1px solid var(--border-color)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-panel)' }}
          >
            <X size={16} /> Close
          </button>
        </div>
      </div>
    </div>
  )
}
