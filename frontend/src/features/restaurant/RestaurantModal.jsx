import React, { useState } from 'react';
import Stars from '../../components/Stars';
import SpiceIndicator from '../../components/SpiceIndicator';
import DietaryBadge from '../../components/DietaryBadge';
import { MOCK_MENU, DIETARY, FALLBACK_RESTAURANT_IMAGE } from '../../constants';

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

export default RestaurantModal;
