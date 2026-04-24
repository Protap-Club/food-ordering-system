import { FALLBACK_RESTAURANT_IMAGE } from '../constants';

export const isMongoId = (id) => /^[a-f\d]{24}$/i.test(String(id || ''));

export const normalizeRestaurant = (restaurant) => ({
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
