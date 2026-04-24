import React from 'react';

function OrderSuccess({ order, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal success-modal">
        <div className="success-icon">🎉</div>
        <h2>Order Placed!</h2>
        <p>Your order has been confirmed and is being prepared.</p>
        <div className="order-id">Order #ORD{Math.random().toString(36).slice(2, 8).toUpperCase()}</div>
        <div className="eta">🕐 Estimated delivery: 30-40 minutes</div>
        <div className="tracking-steps">
          {['Order Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'].map((s, i) => (
            <div key={s} className={`track-step ${i === 0 ? 'done' : ''}`}>
              <div className="track-dot" />
              <span>{s}</span>
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={onClose}>Back to Home</button>
      </div>
    </div>
  );
}

export default OrderSuccess;
