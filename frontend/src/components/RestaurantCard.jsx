import React from 'react';
import Stars from './Stars';

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

export default RestaurantCard;
