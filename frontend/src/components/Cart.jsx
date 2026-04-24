import React from 'react';

function Cart({ cart, onUpdateQty, onCheckout, onClose }) {
  const total = cart.reduce((s, item) => s + item.price * item.qty, 0);
  return (
    <div className="cart-panel">
      <div className="cart-header">
        <h3>Your Cart 🛒</h3>
        <button onClick={onClose}>✕</button>
      </div>
      {cart.length === 0 ? (
        <div className="cart-empty">
          <span>🍽️</span>
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="ci-info">
                  <span className="ci-name">{item.name}</span>
                  <span className="ci-price">₹{item.price}</span>
                </div>
                <div className="qty-control">
                  <button onClick={() => onUpdateQty(item._id, item.qty - 1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => onUpdateQty(item._id, item.qty + 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-footer">
            <div className="cart-total">
              <span>Subtotal</span><span>₹{total}</span>
            </div>
            <div className="cart-total">
              <span>Delivery</span><span>₹30</span>
            </div>
            <div className="cart-total grand">
              <span>Total</span><span>₹{total + 30}</span>
            </div>
            <button className="btn-checkout" onClick={onCheckout}>Proceed to Checkout →</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
