import React from 'react';

function OrdersView() {
  return (
    <div className="orders-view">
      <h2>Your Orders</h2>
      <div className="order-card">
        <div className="order-header">
          <span className="order-rest">🍕 Pizza Maestro</span>
          <span className="order-status delivered">Delivered</span>
        </div>
        <p>Margherita Pizza × 2, Pepperoni Pizza × 1</p>
        <div className="order-footer">
          <span>₹1,080 · 2 days ago</span>
          <button className="btn-reorder">Reorder</button>
        </div>
      </div>
    </div>
  );
}

export default OrdersView;
