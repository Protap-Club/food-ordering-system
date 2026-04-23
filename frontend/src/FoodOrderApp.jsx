import React, { useState, useEffect, useCallback } from 'react';
import './FoodOrderApp.css';
import api from './api';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_RESTAURANTS = [
  { _id: '1', name: 'Spice Garden', cuisine: ['Indian', 'North Indian'], image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', rating: 4.6, reviewCount: 234, priceRange: '$$', deliveryTime: { min: 25, max: 35 }, deliveryFee: 30, tags: ['vegan-friendly', 'halal'], isOpen: true, featured: true },
  { _id: '2', name: 'Dragon Palace', cuisine: ['Chinese', 'Asian'], image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400', rating: 4.3, reviewCount: 187, priceRange: '$$$', deliveryTime: { min: 30, max: 45 }, deliveryFee: 40, tags: ['gluten-free options'], isOpen: true, featured: false },
  { _id: '3', name: 'Pizza Maestro', cuisine: ['Italian', 'Pizza'], image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', rating: 4.8, reviewCount: 512, priceRange: '$$', deliveryTime: { min: 20, max: 30 }, deliveryFee: 25, tags: ['vegetarian-friendly'], isOpen: true, featured: true },
  { _id: '4', name: 'Burger Junction', cuisine: ['American', 'Burgers'], image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', rating: 4.1, reviewCount: 98, priceRange: '$', deliveryTime: { min: 15, max: 25 }, deliveryFee: 20, tags: [], isOpen: true, featured: false },
  { _id: '5', name: 'Sushi Zen', cuisine: ['Japanese', 'Sushi'], image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', rating: 4.9, reviewCount: 341, priceRange: '$$$$', deliveryTime: { min: 35, max: 50 }, deliveryFee: 60, tags: ['gluten-free options'], isOpen: false, featured: true },
  { _id: '6', name: 'Taco Fiesta', cuisine: ['Mexican', 'Tacos'], image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', rating: 4.4, reviewCount: 156, priceRange: '$', deliveryTime: { min: 20, max: 30 }, deliveryFee: 15, tags: ['vegetarian-friendly'], isOpen: true, featured: false },
];

const MOCK_MENU = {
  '1': [
    { _id: 'm1', name: 'Butter Chicken', price: 280, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300', category: 'Main Course', dietary: ['gluten-free'], spiceLevel: 2, rating: 4.7, reviewCount: 89 },
    { _id: 'm2', name: 'Paneer Tikka', price: 220, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?w=300', category: 'Starters', dietary: ['vegetarian', 'gluten-free'], spiceLevel: 2, rating: 4.5, reviewCount: 67 },
    { _id: 'm3', name: 'Dal Makhani', price: 180, image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=300', category: 'Main Course', dietary: ['vegetarian', 'vegan'], spiceLevel: 1, rating: 4.6, reviewCount: 54 },
    { _id: 'm4', name: 'Garlic Naan', price: 50, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300', category: 'Breads', dietary: ['vegetarian'], spiceLevel: 0, rating: 4.4, reviewCount: 112 },
  ],
  '3': [
    { _id: 'm5', name: 'Margherita Pizza', price: 320, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300', category: 'Pizza', dietary: ['vegetarian'], spiceLevel: 0, rating: 4.8, reviewCount: 200 },
    { _id: 'm6', name: 'Pepperoni Pizza', price: 380, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300', category: 'Pizza', dietary: [], spiceLevel: 1, rating: 4.7, reviewCount: 178 },
  ],
};

const CUISINES = ['Indian', 'Chinese', 'Italian', 'American', 'Japanese', 'Mexican', 'Thai', 'Mediterranean'];
const DIETARY = ['vegan', 'vegetarian', 'gluten-free', 'halal', 'dairy-free'];

const FALLBACK_RESTAURANT_IMAGE = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600';

const isMongoId = (id) => /^[a-f\d]{24}$/i.test(String(id || ''));

const normalizeRestaurant = (restaurant) => ({
  ...restaurant,
  _id: restaurant._id || restaurant.id,
  name: restaurant.name || 'Unnamed Restaurant',
  cuisine: Array.isArray(restaurant.cuisine) ? restaurant.cuisine : [],
  image: restaurant.image || restaurant.coverImage || FALLBACK_RESTAURANT_IMAGE,
  rating: Number(restaurant.rating) || 0,
  reviewCount: Number(restaurant.reviewCount) || 0,
  priceRange: restaurant.priceRange || '$$',
  deliveryTime: {
    min: Number(restaurant.deliveryTime?.min) || 25,
    max: Number(restaurant.deliveryTime?.max) || 35,
  },
  deliveryFee: Number(restaurant.deliveryFee) || 0,
  tags: Array.isArray(restaurant.tags) ? restaurant.tags : [],
  isOpen: restaurant.isOpen ?? true,
  featured: Boolean(restaurant.featured),
});

// ─── Utility ──────────────────────────────────────────────────────────────────
const Stars = ({ rating, size = 14 }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="stars" style={{ fontSize: size }}>
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
};

const SpiceIndicator = ({ level }) => (
  <span className="spice">
    {['🌶️'].fill('🌶️', 0, level).join('')}
    {Array(3 - level).fill('○').join('')}
  </span>
);

const DietaryBadge = ({ tag }) => {
  const colors = { vegan: '#2d7a44', vegetarian: '#5a8a3c', 'gluten-free': '#7a6c2d', halal: '#2d5a7a', 'dairy-free': '#7a2d5a' };
  return <span className="dietary-badge" style={{ background: colors[tag] || '#555' }}>{tag}</span>;
};

// ─── Components ───────────────────────────────────────────────────────────────
function RestaurantCard({ restaurant, onOpen, isFavorite, onToggleFavorite }) {
  return (
    <div className={`restaurant-card ${!restaurant.isOpen ? 'closed' : ''}`} onClick={() => restaurant.isOpen && onOpen(restaurant)}>
      <div className="card-image-wrap">
        <img src={restaurant.image} alt={restaurant.name} />
        {restaurant.featured && <span className="badge featured">Featured</span>}
        {!restaurant.isOpen && <div className="closed-overlay">Closed</div>}
        <button className={`fav-btn ${isFavorite ? 'active' : ''}`} onClick={e => { e.stopPropagation(); onToggleFavorite(restaurant._id); }}>
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="card-body">
        <div className="card-top">
          <h3>{restaurant.name}</h3>
          <span className="price-range">{restaurant.priceRange}</span>
        </div>
        <p className="cuisines">{restaurant.cuisine.join(' · ')}</p>
        <div className="card-meta">
          <span className="rating-wrap"><Stars rating={restaurant.rating} /> <b>{restaurant.rating}</b> ({restaurant.reviewCount})</span>
          <span className="delivery-info">🕐 {restaurant.deliveryTime.min}-{restaurant.deliveryTime.max} min</span>
          <span className="delivery-fee">₹{restaurant.deliveryFee} delivery</span>
        </div>
        <div className="tags">
          {restaurant.tags.slice(0, 2).map(t => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>
    </div>
  );
}

function FilterSidebar({ filters, setFilters, onClose }) {
  const toggle = (key, val) => {
    const current = filters[key] || [];
    setFilters(f => ({ ...f, [key]: current.includes(val) ? current.filter(x => x !== val) : [...current, val] }));
  };
  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h3>Filters</h3>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>

      <div className="filter-section">
        <h4>Cuisine</h4>
        <div className="filter-chips">
          {CUISINES.map(c => (
            <button key={c} className={`chip ${(filters.cuisine || []).includes(c) ? 'active' : ''}`} onClick={() => toggle('cuisine', c)}>{c}</button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="filter-chips">
          {['$', '$$', '$$$', '$$$$'].map(p => (
            <button key={p} className={`chip ${(filters.priceRange || []).includes(p) ? 'active' : ''}`} onClick={() => toggle('priceRange', p)}>{p}</button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Minimum Rating</h4>
        <input type="range" min="0" max="5" step="0.5" value={filters.minRating || 0}
          onChange={e => setFilters(f => ({ ...f, minRating: parseFloat(e.target.value) }))} />
        <span className="range-value">{filters.minRating || 0}★ & above</span>
      </div>

      <div className="filter-section">
        <h4>Dietary</h4>
        <div className="filter-chips">
          {DIETARY.map(d => (
            <button key={d} className={`chip ${(filters.dietary || []).includes(d) ? 'active' : ''}`} onClick={() => toggle('dietary', d)}>{d}</button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Open Now</h4>
        <label className="toggle-label">
          <input type="checkbox" checked={filters.openNow || false}
            onChange={e => setFilters(f => ({ ...f, openNow: e.target.checked }))} />
          <span className="toggle-slider" /> Show only open restaurants
        </label>
      </div>

      <button className="btn-clear" onClick={() => setFilters({})}>Clear All Filters</button>
    </div>
  );
}

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

function RestaurantModal({ restaurant, menu: apiMenu, reviews: apiReviews, onClose, onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [dietaryFilter, setDietaryFilter] = useState([]);
  const [activeTab, setActiveTab] = useState('menu');
  const menuSource = apiMenu?.length ? apiMenu : (MOCK_MENU[restaurant._id] || []);
  const menu = menuSource.map(item => ({
    ...item,
    _id: item._id || item.id,
    name: item.name || 'Menu item',
    price: Number(item.price) || 0,
    image: item.image || FALLBACK_RESTAURANT_IMAGE,
    category: item.category || 'Menu',
    dietary: Array.isArray(item.dietary) ? item.dietary : [],
    spiceLevel: Number(item.spiceLevel) || 0,
    rating: Number(item.rating) || 0,
    reviewCount: Number(item.reviewCount) || 0,
  }));
  const categories = ['All', ...new Set(menu.map(m => m.category))];
  const filtered = menu.filter(item =>
    (activeCategory === 'All' || item.category === activeCategory) &&
    (dietaryFilter.length === 0 || dietaryFilter.every(d => item.dietary.includes(d)))
  );
  const reviews = apiReviews?.length ? apiReviews.map(review => ({
    author: review.author?.name || 'FoodRush customer',
    rating: review.rating,
    body: review.body || review.title || 'No review text provided.',
    helpful: review.helpful?.length || 0,
    date: review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently',
  })) : [
    { author: 'Priya S.', rating: 5, body: 'Absolutely loved the food! Delivery was super fast and everything was hot.', helpful: 12, date: '2 days ago' },
    { author: 'Rahul M.', rating: 4, body: 'Great taste but slightly spicy. Would recommend the paneer dishes.', helpful: 7, date: '1 week ago' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-cover" style={{ backgroundImage: `url(${restaurant.image})` }}>
          <button className="modal-close" onClick={onClose}>✕</button>
          <div className="modal-cover-info">
            <h2>{restaurant.name}</h2>
            <p>{restaurant.cuisine.join(' · ')} · {restaurant.priceRange} · {restaurant.deliveryTime.min}-{restaurant.deliveryTime.max} min</p>
            <div className="modal-rating"><Stars rating={restaurant.rating} size={16} /> <b>{restaurant.rating}</b> ({restaurant.reviewCount} reviews)</div>
          </div>
        </div>

        <div className="modal-tabs">
          {['menu', 'reviews', 'info'].map(tab => (
            <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'menu' && (
          <div className="modal-body">
            <div className="menu-controls">
              <div className="category-tabs">
                {categories.map(c => (
                  <button key={c} className={`cat-tab ${activeCategory === c ? 'active' : ''}`} onClick={() => setActiveCategory(c)}>{c}</button>
                ))}
              </div>
              <div className="diet-filters">
                {DIETARY.slice(0, 3).map(d => (
                  <button key={d} className={`chip small ${dietaryFilter.includes(d) ? 'active' : ''}`}
                    onClick={() => setDietaryFilter(f => f.includes(d) ? f.filter(x => x !== d) : [...f, d])}>{d}</button>
                ))}
              </div>
            </div>
            <div className="menu-grid">
              {filtered.map(item => (
                <div key={item._id} className="menu-item">
                  <img src={item.image} alt={item.name} />
                  <div className="mi-body">
                    <div className="mi-top">
                      <h4>{item.name}</h4>
                      <span className="mi-price">₹{item.price}</span>
                    </div>
                    <div className="mi-meta">
                      <Stars rating={item.rating} size={12} />
                      <span>({item.reviewCount})</span>
                      {item.spiceLevel > 0 && <SpiceIndicator level={item.spiceLevel} />}
                    </div>
                    <div className="mi-dietary">
                      {item.dietary.map(d => <DietaryBadge key={d} tag={d} />)}
                    </div>
                    <button className="btn-add" onClick={() => onAddToCart({ ...item, restaurantId: restaurant._id, restaurantName: restaurant.name })}>
                      + Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="modal-body">
            <div className="review-summary">
              <div className="big-rating">{restaurant.rating}</div>
              <Stars rating={restaurant.rating} size={24} />
              <p>{restaurant.reviewCount} reviews</p>
            </div>
            {reviews.map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-top">
                  <span className="reviewer">{r.author}</span>
                  <Stars rating={r.rating} />
                  <span className="review-date">{r.date}</span>
                </div>
                <p className="review-body">{r.body}</p>
                <div className="review-footer">
                  <button className="helpful-btn">👍 Helpful ({r.helpful})</button>
                  <button className="share-btn" onClick={() => navigator.share?.({ title: restaurant.name, text: r.body })}>📤 Share</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="modal-body">
            <div className="info-grid">
              <div><h4>Delivery</h4><p>₹{restaurant.deliveryFee} · {restaurant.deliveryTime.min}-{restaurant.deliveryTime.max} min</p></div>
              <div><h4>Status</h4><p>{restaurant.isOpen ? '🟢 Open' : '🔴 Closed'}</p></div>
              <div><h4>Cuisine</h4><p>{restaurant.cuisine.join(', ')}</p></div>
              <div><h4>Tags</h4><p>{restaurant.tags.join(', ') || 'None'}</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function FoodOrderApp() {
  const [view, setView] = useState('home'); // home | orders | favorites | profile | admin
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [restaurants, setRestaurants] = useState(MOCK_RESTAURANTS);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedReviews, setSelectedReviews] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [user] = useState({ name: 'Arjun Patel', wallet: 500, loyaltyPoints: 125, role: 'customer' });

  useEffect(() => {
    let isMounted = true;

    const fetchRestaurants = async () => {
      try {
        const { data } = await api.get('/restaurants');
        const nextRestaurants = Array.isArray(data?.restaurants) ? data.restaurants : [];

        if (isMounted && nextRestaurants.length > 0) {
          setRestaurants(nextRestaurants.map(normalizeRestaurant));
        }
      } catch (error) {
        if (isMounted) {
          setRestaurants(MOCK_RESTAURANTS);
        }
      }
    };

    fetchRestaurants();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRestaurants = restaurants.filter(r => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.cuisine.join().toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.cuisine?.length && !r.cuisine.some(c => filters.cuisine.includes(c))) return false;
    if (filters.priceRange?.length && !filters.priceRange.includes(r.priceRange)) return false;
    if (filters.minRating && r.rating < filters.minRating) return false;
    if (filters.openNow && !r.isOpen) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'delivery') return a.deliveryTime.min - b.deliveryTime.min;
    if (sortBy === 'price') return a.deliveryFee - b.deliveryFee;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) return prev.map(i => i._id === item._id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const updateQty = (id, qty) => {
    if (qty <= 0) setCart(prev => prev.filter(i => i._id !== id));
    else setCart(prev => prev.map(i => i._id === id ? { ...i, qty } : i));
  };

  const toggleFavorite = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const openRestaurant = useCallback(async (restaurant) => {
    setSelectedRestaurant(restaurant);
    setSelectedMenu(null);
    setSelectedReviews(null);

    if (!isMongoId(restaurant._id)) return;

    try {
      const { data } = await api.get(`/restaurants/${restaurant._id}`);
      setSelectedRestaurant(normalizeRestaurant(data.restaurant || restaurant));
      setSelectedMenu(Array.isArray(data.menu) ? data.menu : []);
      setSelectedReviews(Array.isArray(data.reviews) ? data.reviews : []);
    } catch (error) {
      setSelectedMenu(null);
      setSelectedReviews(null);
    }
  }, []);

  const placeOrder = async ({ address, paymentMethod } = {}) => {
    const restaurantId = cart[0]?.restaurantId;
    const token = localStorage.getItem('foodrush_token');

    if (token && restaurantId && isMongoId(restaurantId)) {
      try {
        await api.post('/orders', {
          restaurantId,
          items: cart.map(item => ({
            menuItemId: item._id,
            qty: item.qty,
            customizations: item.customizations || [],
          })),
          deliveryAddress: address,
          paymentMethod,
        });
      } catch (error) {
        console.warn('FoodRush order API request failed; showing local confirmation.', error);
      }
    }

    setCheckoutOpen(false);
    setCart([]);
    setOrderSuccess(true);
  };

  const activeFilterCount = Object.values(filters).filter(v => Array.isArray(v) ? v.length > 0 : !!v).length;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo" onClick={() => setView('home')}>
            <span className="logo-icon">🍜</span>
            <span>FoodRush</span>
          </div>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input placeholder="Search restaurants, cuisines, dishes..." value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch('')} className="clear-search">✕</button>}
          </div>
          <nav className="nav">
            <button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>Home</button>
            <button className={view === 'orders' ? 'active' : ''} onClick={() => setView('orders')}>Orders</button>
            <button className={view === 'favorites' ? 'active' : ''} onClick={() => setView('favorites')}>❤️ Saved</button>
          </nav>
          <div className="header-right">
            <button className="cart-btn" onClick={() => setCartOpen(true)}>
              🛒 {cart.reduce((s, i) => s + i.qty, 0) > 0 && <span className="cart-badge">{cart.reduce((s, i) => s + i.qty, 0)}</span>}
            </button>
            <div className="user-chip" onClick={() => setView('profile')}>
              <div className="avatar">{user.name[0]}</div>
              <span>{user.name.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        {view === 'home' && (
          <>
            {/* Hero */}
            <section className="hero">
              <div className="hero-content">
                <h1>Food that <span className="hero-accent">Feeds</span> your soul</h1>
                <p>Order from the best restaurants around you with advanced filters, real reviews & fast delivery</p>
                <div className="hero-stats">
                  <div><b>200+</b><span>Restaurants</span></div>
                  <div><b>30 min</b><span>Avg Delivery</span></div>
                  <div><b>4.7★</b><span>Avg Rating</span></div>
                </div>
              </div>
            </section>

            {/* Cuisine Quick Filters */}
            <section className="quick-filters">
              {CUISINES.map(c => (
                <button key={c} className={`cuisine-btn ${(filters.cuisine || []).includes(c) ? 'active' : ''}`}
                  onClick={() => {
                    const current = filters.cuisine || [];
                    setFilters(f => ({ ...f, cuisine: current.includes(c) ? current.filter(x => x !== c) : [...current, c] }));
                  }}>
                  {c}
                </button>
              ))}
            </section>

            {/* Toolbar */}
            <div className="toolbar">
              <div className="toolbar-left">
                <button className={`filter-toggle ${activeFilterCount > 0 ? 'has-filters' : ''}`} onClick={() => setShowFilters(!showFilters)}>
                  ⚙️ Filters {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
                </button>
                <span className="results-count">{filteredRestaurants.length} restaurants</span>
              </div>
              <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="rating">Top Rated</option>
                <option value="delivery">Fastest Delivery</option>
                <option value="price">Lowest Delivery Fee</option>
              </select>
            </div>

            {/* Body */}
            <div className="body-layout">
              {showFilters && (
                <aside className="sidebar-wrap">
                  <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => setShowFilters(false)} />
                </aside>
              )}
              <div className={`restaurant-grid ${showFilters ? 'with-sidebar' : ''}`}>
                {filteredRestaurants.length === 0 ? (
                  <div className="empty-state">
                    <span>🍽️</span>
                    <h3>No restaurants found</h3>
                    <p>Try adjusting your filters or search query</p>
                    <button onClick={() => { setFilters({}); setSearch(''); }}>Clear All</button>
                  </div>
                ) : filteredRestaurants.map(r => (
                  <RestaurantCard key={r._id} restaurant={r}
                    onOpen={openRestaurant}
                    isFavorite={favorites.includes(r._id)}
                    onToggleFavorite={toggleFavorite} />
                ))}
              </div>
            </div>
          </>
        )}

        {view === 'orders' && (
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
        )}

        {view === 'favorites' && (
          <div className="orders-view">
            <h2>Saved Restaurants ❤️</h2>
            {favorites.length === 0 ? (
              <div className="empty-state"><span>💔</span><h3>No saved restaurants yet</h3><p>Tap the heart on any restaurant to save it</p></div>
            ) : (
              <div className="restaurant-grid">
                {restaurants.filter(r => favorites.includes(r._id)).map(r => (
                  <RestaurantCard key={r._id} restaurant={r} onOpen={openRestaurant} isFavorite={true} onToggleFavorite={toggleFavorite} />
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'profile' && (
          <div className="profile-view">
            <div className="profile-card">
              <div className="profile-avatar">{user.name[0]}</div>
              <h2>{user.name}</h2>
              <div className="profile-stats">
                <div><b>₹{user.wallet}</b><span>Wallet</span></div>
                <div><b>{user.loyaltyPoints}</b><span>Points</span></div>
                <div><b>12</b><span>Orders</span></div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <div onClick={e => e.stopPropagation()}>
            <Cart cart={cart} onUpdateQty={updateQty} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} onClose={() => setCartOpen(false)} />
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedRestaurant && <RestaurantModal restaurant={selectedRestaurant} menu={selectedMenu} reviews={selectedReviews} onClose={() => setSelectedRestaurant(null)} onAddToCart={item => { addToCart(item); setSelectedRestaurant(null); }} />}
      {checkoutOpen && <CheckoutModal cart={cart} onClose={() => setCheckoutOpen(false)} onPlaceOrder={placeOrder} />}
      {orderSuccess && <OrderSuccess onClose={() => { setOrderSuccess(false); setView('home'); }} />}
    </div>
  );
}
