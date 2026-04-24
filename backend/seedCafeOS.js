require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const Table = require('./models/Table');
const Order = require('./models/Order');

// Use the exact mock data from frontend
const MENU_ITEMS = [
  { name: "Masala Chai", category: "Chai", price: 60, isAvailable: true, isBestseller: true, emoji: "🍵" },
  { name: "Sulaimani", category: "Chai", price: 70, isAvailable: true, isBestseller: false, emoji: "🫖" },
  { name: "Kashmiri Kahwa", category: "Chai", price: 90, isAvailable: true, isBestseller: false, emoji: "🫖" },
  { name: "Irani Chai", category: "Chai", price: 65, isAvailable: true, isBestseller: false, emoji: "🍵" },
  { name: "Espresso", category: "Coffee", price: 80, isAvailable: true, isBestseller: false, emoji: "☕" },
  { name: "Cappuccino", category: "Coffee", price: 130, isAvailable: true, isBestseller: true, emoji: "☕" },
  { name: "Cold Brew", category: "Coffee", price: 160, isAvailable: true, isBestseller: false, emoji: "🧊" },
  { name: "Café Latte", category: "Coffee", price: 140, isAvailable: true, isBestseller: false, emoji: "☕" },
  { name: "Fresh Lime Soda", category: "Cold Drinks", price: 70, isAvailable: true, isBestseller: false, emoji: "🥤" },
  { name: "Mango Lassi", category: "Cold Drinks", price: 100, isAvailable: true, isBestseller: true, emoji: "🥭" },
  { name: "Virgin Mojito", category: "Cold Drinks", price: 120, isAvailable: true, isBestseller: false, emoji: "🍃" },
  { name: "Vada Pav", category: "Snacks", price: 50, isAvailable: true, isBestseller: true, emoji: "🍔" },
  { name: "Paneer Tikka Toast", category: "Snacks", price: 120, isAvailable: true, isBestseller: false, emoji: "🍞" },
  { name: "Chicken Patty Bun", category: "Snacks", price: 140, isAvailable: true, isBestseller: false, emoji: "🥙" },
  { name: "Samosa (2 pc)", category: "Snacks", price: 40, isAvailable: true, isBestseller: false, emoji: "🔺" },
  { name: "Bread Pakora", category: "Snacks", price: 60, isAvailable: false, isBestseller: false, emoji: "🟡" },
  { name: "Rajma Chawal", category: "Meals", price: 179, isAvailable: true, isBestseller: true, emoji: "🍛" },
  { name: "Chole Bhature", category: "Meals", price: 159, isAvailable: true, isBestseller: false, emoji: "🫓" },
  { name: "Chicken Biryani", category: "Meals", price: 259, isAvailable: true, isBestseller: true, emoji: "🍗" },
  { name: "Dal Makhani + Roti", category: "Meals", price: 189, isAvailable: true, isBestseller: false, emoji: "🫕" },
  { name: "Gulab Jamun", category: "Desserts", price: 70, isAvailable: true, isBestseller: false, emoji: "🟤" },
  { name: "Matka Kulfi", category: "Desserts", price: 90, isAvailable: true, isBestseller: true, emoji: "🍦" },
  { name: "Chocolate Brownie", category: "Desserts", price: 110, isAvailable: true, isBestseller: false, emoji: "🍫" },
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
