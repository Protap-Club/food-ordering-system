import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import { printInvoice } from '../../utils/print'

export default function InvoiceModal() {
  const { invoiceModalOpen, currentInvoice, closeInvoiceModal } = useAppStore()

  if (!invoiceModalOpen || !currentInvoice) return null

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
        backgroundColor: '#fff',
        color: '#000',
        borderRadius: 'var(--radius-lg)',
        width: '380px',
        padding: '32px',
        fontFamily: 'monospace' // Receipt style
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', margin: 0 }}>CAFE OS</h2>
          <div>Connaught Place, New Delhi</div>
          <div>GSTIN: 07AABCU9603R1ZX</div>
          <div style={{ margin: '16px 0', borderTop: '1px dashed #ccc', borderBottom: '1px dashed #ccc', padding: '8px 0' }}>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{currentInvoice.token}</div>
            <div>{currentInvoice.type} {currentInvoice.tableNumber && `- Table ${currentInvoice.tableNumber}`}</div>
            <div>Date: {new Date(currentInvoice.createdAt).toLocaleString()}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {currentInvoice.items.map(item => (
            <div key={item.itemId} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{item.qty} x {item.name}</span>
              <span>{item.qty * item.price}</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px dashed #ccc', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal</span>
            <span>{currentInvoice.subtotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>CGST (2.5%)</span>
            <span>{currentInvoice.cgst}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>SGST (2.5%)</span>
            <span>{currentInvoice.sgst}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2em', marginTop: '8px' }}>
            <span>TOTAL</span>
            <span>₹{currentInvoice.total}</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px', color: '#666' }}>
          Payment: {currentInvoice.paymentMethod}
        </div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
          <button 
            onClick={printInvoice}
            style={{ flex: 1, padding: '12px', backgroundColor: 'var(--c-orange)', color: '#fff', borderRadius: 'var(--radius-sm)', fontWeight: 'bold' }}
          >
            Print
          </button>
          <button 
            onClick={closeInvoiceModal}
            style={{ flex: 1, padding: '12px', backgroundColor: '#eee', color: '#333', borderRadius: 'var(--radius-sm)' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
