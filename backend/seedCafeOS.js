require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const Table = require('./models/Table');
const Order = require('./models/Order');

// Use the exact mock data from frontend
const MENU_ITEMS = [
  // ── Chai ──────────────────────────────────────────
  { name: "Masala Chai", category: "Chai", price: 60, description: "Bold CTC tea simmered with cardamom, ginger & cinnamon — the OG Indian chai.", isAvailable: true, isBestseller: true, isVeg: true, tasteProfile: ["spicy", "creamy"], prepTime: 5, image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop&q=80", rating: 4.8, reviewCount: 124, emoji: "🍵" },
  { name: "Sulaimani", category: "Chai", price: 70, description: "Fragrant Malabar black tea with lemon and a hint of mint. Zero milk, pure soul.", isAvailable: true, isBestseller: false, isVeg: true, tasteProfile: ["tangy", "refreshing"], prepTime: 4, image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop&q=80", rating: 4.2, reviewCount: 31, emoji: "🫖" },
  { name: "Kashmiri Kahwa", category: "Chai", price: 90, description: "Green tea brewed with saffron, almonds, and aromatic spices from the valley.", isAvailable: true, isBestseller: false, isVeg: true, tasteProfile: ["mild", "sweet"], prepTime: 7, image: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&h=300&fit=crop&q=80", rating: 4.5, reviewCount: 47, emoji: "🫖" },
  { name: "Irani Chai", category: "Chai", price: 65, description: "Hyderabadi-style milky chai with a caramelised sweetness. Pairs perfectly with Osmania biscuits.", isAvailable: true, isBestseller: false, isVeg: true, tasteProfile: ["creamy", "sweet"], prepTime: 6, image: "https://images.unsplash.com/photo-1563639234920-11f4085c0243?w=400&h=300&fit=crop&q=80", rating: 4.0, reviewCount: 18, emoji: "🍵" },

  // ── Coffee ────────────────────────────────────────
  { name: "Espresso", category: "Coffee", price: 80, description: "Double-shot single-origin espresso — intense, clean, no compromises.", isAvailable: true, isBestseller: false, isVeg: true, tasteProfile: ["bitter", "smoky"], prepTime: 3, image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop&q=80", rating: 4.3, reviewCount: 52, emoji: "☕" },
  { name: "Cappuccino", category: "Coffee", price: 130, description: "Velvety steamed milk over a rich espresso base, topped with silky microfoam.", isAvailable: true, isBestseller: true, isVeg: true, tasteProfile: ["creamy", "bitter"], prepTime: 5, image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop&q=80", rating: 4.7, reviewCount: 89, emoji: "☕" },
  { name: "Cold Brew", category: "Coffee", price: 160, description: "20-hour cold-steeped coffee concentrate served over ice. Smooth, never bitter.", isAvailable: true, isBestseller: false, isVeg: true, tasteProfile: ["refreshing", "bitter"], prepTime: 2, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop&q=80", rating: 4.4, reviewCount: 36, emoji: "🧊" },
  { name: "Café Latte", category: "Coffee", price: 140, description: "Espresso melted into steamed milk — creamy, comforting, latte art included.", isAvailable: true, isBestseller: false, isVeg: true, tasteProfile: ["creamy", "mild"], prepTime: 5, image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=300&fit=crop&q=80", rating: 4.1, reviewCount: 28, emoji: "☕" },

  // ── Cold Drinks ───────────────────────────────────
  { name: "Fresh Lime Soda", category: "Cold Drinks", price: 70, description: "Freshly squeezed lime with sparkling soda — sweet or salty, your call.", isAvailable: true, isBestseller: false, isVeg: true, tasteProfile: ["tangy", "refreshing"], prepTime: 3, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed514?w=400&h=300&fit=crop&q=80", rating: 4.0, reviewCount: 22, emoji: "🥤" },
  { name: "Mango Lassi", category: "Cold Drinks", price: 100, description: "Thick Alphonso mango blended with chilled yogurt and a touch of cardamom.", isAvailable: true, isBestseller: true, isVeg: true, tasteProfile: ["sweet", "creamy"], prepTime: 4, image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=300&fit=crop&q=80", rating: 4.6, reviewCount: 73, emoji: "🥭" },
  { name: "Virgin Mojito", category: "Cold Drinks", price: 120, description: "Muddled mint and lime with crushed ice and sparkling water. Summer in a glass.", isAvailable: true, isBestseller: false, isVeg: true, tasteProfile: ["refreshing", "sweet"], prepTime: 5, image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop&q=80", rating: 4.3, reviewCount: 41, emoji: "🍃" },

  // ── Snacks ────────────────────────────────────────
  { name: "Vada Pav", category: "Snacks", price: 50, description: "Mumbai's #1 street food — spiced potato fritter in a fluffy pav with chutneys.", isAvailable: true, isBestseller: true, isVeg: true, tasteProfile: ["spicy", "crispy"], prepTime: 8, image: "https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400&h=300&fit=crop&q=80", rating: 4.5, reviewCount: 97, emoji: "🍔" },
  { name: "Paneer Tikka Toast", category: "Snacks", price: 120, description: "Smoky tandoori paneer chunks on buttery toasted bread with mint chutney.", isAvailable: true, isBestseller: false, isVeg: true, tasteProfile: ["smoky", "spicy"], prepTime: 12, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&q=80", rating: 4.2, reviewCount: 33, emoji: "🍞" },
  { name: "Chicken Patty Bun", category: "Snacks", price: 140, description: "Herb-crusted chicken patty with sriracha mayo, pickled onion, and lettuce.", isAvailable: true, isBestseller: false, isVeg: false, tasteProfile: ["crispy", "spicy"], prepTime: 10, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&q=80", rating: 4.1, reviewCount: 27, emoji: "🥙" },
  { name: "Samosa (2 pc)", category: "Snacks", price: 40, description: "Flaky golden parcels stuffed with spiced potato and peas. Served with tamarind.", isAvailable: true, isBestseller: false, isVeg: true, tasteProfile: ["crispy", "spicy"], prepTime: 6, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&q=80", rating: 4.3, reviewCount: 56, emoji: "🔺" },
  { name: "Bread Pakora", category: "Snacks", price: 60, description: "Gram-flour battered bread stuffed with paneer and potato. A monsoon classic.", isAvailable: false, isBestseller: false, isVeg: true, tasteProfile: ["crispy", "mild"], prepTime: 8, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&q=80", rating: 3.9, reviewCount: 14, emoji: "🟡" },

  // ── Meals ─────────────────────────────────────────
  { name: "Rajma Chawal", category: "Meals", price: 179, description: "Creamy kidney bean curry slow-cooked with tomatoes, served with steamed rice.", isAvailable: true, isBestseller: true, isVeg: true, tasteProfile: ["creamy", "mild"], prepTime: 15, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&q=80", rating: 4.7, reviewCount: 112, emoji: "🍛" },
  { name: "Chole Bhature", category: "Meals", price: 159, description: "Spicy chickpea curry with fluffy deep-fried bhature. Punjabi soul food.", isAvailable: true, isBestseller: false, isVeg: true, tasteProfile: ["spicy", "crispy"], prepTime: 12, image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=300&fit=crop&q=80", rating: 4.4, reviewCount: 68, emoji: "🫓" },
  { name: "Chicken Biryani", category: "Meals", price: 259, description: "Dum-cooked basmati with tender marinated chicken, saffron, and crispy onions.", isAvailable: true, isBestseller: true, isVeg: false, tasteProfile: ["spicy", "smoky"], prepTime: 20, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop&q=80", rating: 4.9, reviewCount: 156, emoji: "🍗" },
  { name: "Dal Makhani + Roti", category: "Meals", price: 189, description: "Slow-simmered black lentils finished with cream and butter. Comfort in a bowl.", isAvailable: true, isBestseller: false, isVeg: true, tasteProfile: ["creamy", "smoky"], prepTime: 15, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&q=80", rating: 4.5, reviewCount: 84, emoji: "🫕" },

  // ── Desserts ──────────────────────────────────────
  { name: "Gulab Jamun", category: "Desserts", price: 70, description: "Soft milk-solid dumplings soaked in cardamom-rose sugar syrup. Pure indulgence.", isAvailable: true, isBestseller: false, isVeg: true, tasteProfile: ["sweet", "creamy"], prepTime: 3, image: "https://images.unsplash.com/photo-1666190073498-d8a92cba26c8?w=400&h=300&fit=crop&q=80", rating: 4.4, reviewCount: 45, emoji: "🟤" },
  { name: "Matka Kulfi", category: "Desserts", price: 90, description: "Traditional slow-churned kulfi with pistachios, set in earthen clay pots.", isAvailable: true, isBestseller: true, isVeg: true, tasteProfile: ["sweet", "creamy"], prepTime: 2, image: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400&h=300&fit=crop&q=80", rating: 4.6, reviewCount: 62, emoji: "🍦" },
  { name: "Chocolate Brownie", category: "Desserts", price: 110, description: "Warm, gooey dark chocolate brownie with a crackly top. Served with vanilla ice cream.", isAvailable: true, isBestseller: false, isVeg: true, tasteProfile: ["sweet", "bitter"], prepTime: 5, image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=300&fit=crop&q=80", rating: 4.3, reviewCount: 39, emoji: "🍫" },
];

const TABLES = [
  { number: 1, floor: 'Ground', capacity: 2, status: 'free' },
  { number: 2, floor: 'Ground', capacity: 2, status: 'free' },
  { number: 3, floor: 'Ground', capacity: 4, status: 'free' },
  { number: 4, floor: 'Ground', capacity: 4, status: 'free' },
  { number: 5, floor: 'Ground', capacity: 6, status: 'free' },
  { number: 6, floor: 'Ground', capacity: 8, status: 'free' },
  { number: 11, floor: 'First', capacity: 2, status: 'free' },
  { number: 12, floor: 'First', capacity: 2, status: 'free' },
  { number: 13, floor: 'First', capacity: 4, status: 'free' },
  { number: 14, floor: 'First', capacity: 4, status: 'free' },
  { number: 15, floor: 'First', capacity: 6, status: 'free' },
  { number: 16, floor: 'First', capacity: 8, status: 'free' },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodrush';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear old data
    await MenuItem.deleteMany({});
    await Table.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️ Cleared old MenuItems, Tables, and Orders');

    // Insert new data
    await MenuItem.insertMany(MENU_ITEMS);
    console.log(`✅ Inserted ${MENU_ITEMS.length} Menu Items`);

    await Table.insertMany(TABLES);
    console.log(`✅ Inserted ${TABLES.length} Tables`);

    console.log('🎉 CafeOS Database Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
