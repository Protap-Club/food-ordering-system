import React from 'react';

const DietaryBadge = ({ tag }) => {
  const colors = { vegan: '#2d7a44', vegetarian: '#5a8a3c', 'gluten-free': '#7a6c2d', halal: '#2d5a7a', 'dairy-free': '#7a2d5a' };
  return <span className="dietary-badge" style={{ background: colors[tag] || '#555' }}>{tag}</span>;
};

export default DietaryBadge;
