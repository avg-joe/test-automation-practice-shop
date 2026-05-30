export type CategorySlug = 'electronics' | 'fashion' | 'home' | 'sports';

export interface Category {
  slug: CategorySlug;
  label: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { slug: 'electronics', label: 'Electronics', emoji: '📱' },
  { slug: 'fashion', label: 'Fashion', emoji: '👗' },
  { slug: 'home', label: 'Home & Living', emoji: '🏠' },
  { slug: 'sports', label: 'Sports', emoji: '⚽' },
];

export interface Product {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: CategorySlug;
  badge: 'Sale' | 'New' | 'Hot' | null;
  originalPrice: number | null;
}

export const ALL_PRODUCTS: Product[] = [
  // Electronics
  { id: '2', name: 'SoundMax Headphones', price: 149, emoji: '🎧', category: 'electronics', badge: null, originalPrice: null },
  { id: '4', name: 'SmartWatch Series 5', price: 199, emoji: '⌚', category: 'electronics', badge: null, originalPrice: null },
  { id: '5', name: 'Wireless Earbuds', price: 79, emoji: '🎵', category: 'electronics', badge: 'New', originalPrice: null },
  { id: '6', name: 'Portable Charger', price: 35, emoji: '🔋', category: 'electronics', badge: null, originalPrice: null },
  { id: '7', name: 'GamePad Pro', price: 59, emoji: '🎮', category: 'electronics', badge: null, originalPrice: null },
  { id: '8', name: 'Phone Case Ultra', price: 19, emoji: '📱', category: 'electronics', badge: null, originalPrice: null },
  // Fashion
  { id: '3', name: 'Urban Tote Bag', price: 65, emoji: '👜', category: 'fashion', badge: 'New', originalPrice: null },
  { id: '9', name: 'Classic Denim Jacket', price: 120, emoji: '🧥', category: 'fashion', badge: null, originalPrice: null },
  { id: '10', name: 'Sunglasses Elite', price: 95, emoji: '🕶️', category: 'fashion', badge: 'Sale', originalPrice: 130 },
  { id: '11', name: 'Leather Belt', price: 45, emoji: '👔', category: 'fashion', badge: null, originalPrice: null },
  { id: '12', name: 'Silk Scarf', price: 55, emoji: '🧣', category: 'fashion', badge: null, originalPrice: null },
  // Home & Living
  { id: '13', name: 'Scented Candle Set', price: 29, emoji: '🕯️', category: 'home', badge: null, originalPrice: null },
  { id: '14', name: 'Throw Blanket', price: 49, emoji: '🛋️', category: 'home', badge: 'New', originalPrice: null },
  { id: '15', name: 'Ceramic Mug Duo', price: 22, emoji: '☕', category: 'home', badge: null, originalPrice: null },
  { id: '16', name: 'Wall Art Print', price: 39, emoji: '🖼️', category: 'home', badge: null, originalPrice: null },
  { id: '17', name: 'Desk Organizer', price: 34, emoji: '📦', category: 'home', badge: 'Sale', originalPrice: 48 },
  // Sports
  { id: '1', name: 'Air Runner Pro', price: 89, emoji: '👟', category: 'sports', badge: 'Sale', originalPrice: 120 },
  { id: '18', name: 'Yoga Mat Premium', price: 42, emoji: '🧘', category: 'sports', badge: null, originalPrice: null },
  { id: '19', name: 'Water Bottle Pro', price: 25, emoji: '💧', category: 'sports', badge: null, originalPrice: null },
  { id: '20', name: 'Fitness Tracker', price: 69, emoji: '⌚', category: 'sports', badge: 'Hot', originalPrice: null },
  { id: '21', name: 'Resistance Bands', price: 18, emoji: '💪', category: 'sports', badge: null, originalPrice: null },
];

export const FEATURED_PRODUCTS = [
  { id: '1', name: 'Air Runner Pro', price: 89, emoji: '👟', category: 'Footwear', badge: 'Sale' as const, originalPrice: 120 },
  { id: '2', name: 'SoundMax Headphones', price: 149, emoji: '🎧', category: 'Electronics', badge: null, originalPrice: null },
  { id: '3', name: 'Urban Tote Bag', price: 65, emoji: '👜', category: 'Accessories', badge: 'New' as const, originalPrice: null },
  { id: '4', name: 'SmartWatch Series 5', price: 199, emoji: '⌚', category: 'Electronics', badge: null, originalPrice: null },
];

export const RECOMMENDED_PRODUCTS = [
  { id: 'rec-1', emoji: '🎮', name: 'GamePad Pro', price: 59 },
  { id: 'rec-2', emoji: '📱', name: 'Phone Case', price: 19 },
  { id: 'rec-3', emoji: '🔋', name: 'Power Bank', price: 45 },
  { id: 'rec-4', emoji: '🎵', name: 'BT Speaker', price: 79 },
];
