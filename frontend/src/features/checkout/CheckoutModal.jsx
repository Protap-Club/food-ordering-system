import React, { useState } from 'react';

function CheckoutModal({ cart, onClose, onPlaceOrder }) {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [address, setAddress] = useState({ street: '', city: 'Vadodara', zip: '' });
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + 30 + Math.round(subtotal * 0.05);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal checkout-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="checkout-title">Checkout</h2>
        <div className="checkout-steps">
          {['Address', 'Payment', 'Review'].map((s, i) => (
            <span key={s} className={`step ${step >= i + 1 ? 'active' : ''}`}>{i + 1}. {s}</span>
          ))}
        </div>

        {step === 1 && (
          <div className="checkout-section">
            <h3>Delivery Address</h3>
            <input placeholder="Street address" value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} className="input" />
            <input placeholder="City" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} className="input" />
            <input placeholder="ZIP code" value={address.zip} onChange={e => setAddress(a => ({ ...a, zip: e.target.value }))} className="input" />
            <button className="btn-primary" onClick={() => setStep(2)}>Continue →</button>
          </div>
        )}

        {step === 2 && (
          <div className="checkout-section">
            <h3>Payment Method</h3>
            {[['card', '💳 Credit / Debit Card'], ['wallet', '👛 Wallet Balance'], ['cod', '💵 Cash on Delivery']].map(([val, label]) => (
              <label key={val} className={`payment-option ${paymentMethod === val ? 'selected' : ''}`}>
                <input type="radio" value={val} checked={paymentMethod === val} onChange={() => setPaymentMethod(val)} />
                {label}
              </label>
            ))}
            <button className="btn-primary" onClick={() => setStep(3)}>Continue →</button>
          </div>
        )}

        {step === 3 && (
          <div className="checkout-section">
            <h3>Order Summary</h3>
            {cart.map(item => (
              <div key={item._id} className="summary-row">
                <span>{item.name} × {item.qty}</span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}
            <hr />
            <div className="summary-row"><span>Delivery</span><span>₹30</span></div>
            <div className="summary-row"><span>Tax (5%)</span><span>₹{Math.round(subtotal * 0.05)}</span></div>
            <div className="summary-row total-row"><span>Total</span><span>₹{total}</span></div>
            <button className="btn-primary" onClick={() => onPlaceOrder({ address, paymentMethod, total })}>Place Order ✓</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;
