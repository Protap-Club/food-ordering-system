import React from 'react'
import MenuPanel from '../components/pos/MenuPanel'
import OrderPanel from '../components/pos/OrderPanel'
import PaymentModal from '../components/pos/PaymentModal'
import InvoiceModal from '../components/pos/InvoiceModal'

export default function POSView() {
  return (
    <div className="pos-layout">
      {/* Left: Menu */}
      <div className="pos-menu-pane">
        <MenuPanel />
      </div>

      {/* Right: Order Panel */}
      <div className="pos-order-pane">
        <OrderPanel />
      </div>

      {/* Modals */}
      <PaymentModal />
      <InvoiceModal />
    </div>
  )
}
