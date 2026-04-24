import React from 'react';

const SpiceIndicator = ({ level }) => (
  <span className="spice">
    {['🌶️'].fill('🌶️', 0, level).join('')}
    {Array(3 - level).fill('○').join('')}
  </span>
);

export default SpiceIndicator;
