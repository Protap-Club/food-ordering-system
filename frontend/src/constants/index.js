export const MOCK_RESTAURANTS = [
  { _id: '1', name: 'Spice Garden', cuisine: ['Indian', 'North Indian'], image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', rating: 4.6, reviewCount: 234, priceRange: '$$', deliveryTime: { min: 25, max: 35 }, deliveryFee: 30, tags: ['vegan-friendly', 'halal'], isOpen: true, featured: true },
  { _id: '2', name: 'Dragon Palace', cuisine: ['Chinese', 'Asian'], image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400', rating: 4.3, reviewCount: 187, priceRange: '$$$', deliveryTime: { min: 30, max: 45 }, deliveryFee: 40, tags: ['gluten-free options'], isOpen: true, featured: false },
  { _id: '3', name: 'Pizza Maestro', cuisine: ['Italian', 'Pizza'], image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', rating: 4.8, reviewCount: 512, priceRange: '$$', deliveryTime: { min: 20, max: 30 }, deliveryFee: 25, tags: ['vegetarian-friendly'], isOpen: true, featured: true },
  { _id: '4', name: 'Burger Junction', cuisine: ['American', 'Burgers'], image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', rating: 4.1, reviewCount: 98, priceRange: '$', deliveryTime: { min: 15, max: 25 }, deliveryFee: 20, tags: [], isOpen: true, featured: false },
  { _id: '5', name: 'Sushi Zen', cuisine: ['Japanese', 'Sushi'], image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', rating: 4.9, reviewCount: 341, priceRange: '$$$$', deliveryTime: { min: 35, max: 50 }, deliveryFee: 60, tags: ['gluten-free options'], isOpen: false, featured: true },
  { _id: '6', name: 'Taco Fiesta', cuisine: ['Mexican', 'Tacos'], image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', rating: 4.4, reviewCount: 156, priceRange: '$', deliveryTime: { min: 20, max: 30 }, deliveryFee: 15, tags: ['vegetarian-friendly'], isOpen: true, featured: false },
];

export const MOCK_MENU = {
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

export const CUISINES = ['Indian', 'Chinese', 'Italian', 'American', 'Japanese', 'Mexican', 'Thai', 'Mediterranean'];
export const DIETARY = ['vegan', 'vegetarian', 'gluten-free', 'halal', 'dairy-free'];

export const FALLBACK_RESTAURANT_IMAGE = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600';
