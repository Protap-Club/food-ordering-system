import React from 'react';
import { CUISINES, DIETARY } from '../constants';

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

export default FilterSidebar;
