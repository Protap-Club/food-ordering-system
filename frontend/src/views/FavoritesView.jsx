import React from 'react';
import RestaurantCard from '../components/RestaurantCard';

function FavoritesView({ restaurants, favorites, openRestaurant, toggleFavorite }) {
  return (
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
  );
}

export default FavoritesView;
