import React from 'react'
import MenuPanel from '../components/pos/MenuPanel'
import OrderPanel from '../components/pos/OrderPanel'
import PaymentModal from '../components/pos/PaymentModal'
import InvoiceModal from '../components/pos/InvoiceModal'

export default function POSView() {
  return (
    <div style={{ 
      display: 'flex', 
      height: '100%', 
      padding: '24px', 
      gap: '24px' 
    }}>
      {/* Left side: Menu */}
      <div style={{ flex: '1 1 65%', height: '100%' }}>
        <MenuPanel />
      </div>

      {/* Right side: Order Panel */}
      <div style={{ flex: '0 0 35%', minWidth: '350px', height: '100%' }}>
        <OrderPanel />
      </div>

      {/* Modals */}
      <PaymentModal />
      <InvoiceModal />
    </div>
  )
}
