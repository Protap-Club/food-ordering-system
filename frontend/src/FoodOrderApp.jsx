import React, { useState, useEffect, useCallback } from 'react';
import api from './api';
import { MOCK_RESTAURANTS } from './constants';
import { normalizeRestaurant, isMongoId } from './utils/helpers';

import Cart from './components/Cart';
import RestaurantModal from './features/restaurant/RestaurantModal';
import CheckoutModal from './features/checkout/CheckoutModal';
import OrderSuccess from './features/checkout/OrderSuccess';

import HomeView from './features/home/HomeView';
import OrdersView from './views/OrdersView';
import FavoritesView from './views/FavoritesView';
import ProfileView from './views/ProfileView';

export default function FoodOrderApp() {
  const [view, setView] = useState('home'); // home | orders | favorites | profile
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
          <HomeView
            search={search}
            setSearch={setSearch}
            filters={filters}
            setFilters={setFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filteredRestaurants={filteredRestaurants}
            openRestaurant={openRestaurant}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        )}
        {view === 'orders' && <OrdersView />}
        {view === 'favorites' && <FavoritesView restaurants={restaurants} favorites={favorites} openRestaurant={openRestaurant} toggleFavorite={toggleFavorite} />}
        {view === 'profile' && <ProfileView user={user} />}
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
