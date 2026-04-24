import React from 'react';
import FilterSidebar from '../../components/FilterSidebar';
import RestaurantCard from '../../components/RestaurantCard';
import { CUISINES } from '../../constants';

function HomeView({
  search,
  setSearch,
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  sortBy,
  setSortBy,
  filteredRestaurants,
  openRestaurant,
  favorites,
  toggleFavorite
}) {
  const activeFilterCount = Object.values(filters).filter(v => Array.isArray(v) ? v.length > 0 : !!v).length;

  return (
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
  );
}

export default HomeView;
