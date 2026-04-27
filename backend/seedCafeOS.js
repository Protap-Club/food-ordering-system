require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const Table = require('./models/Table');
const Order = require('./models/Order');

// ─────────────────────────────────────────────────────────────────────────────
// MENU ITEMS
// New fields added vs original:
//   ingredients[]     — shown in item detail modal
//   allergens[]       — dairy | gluten | nuts | soy | egg | none
//   calories          — kcal per serving
//   portionSize       — human-readable serving description
//   spiceLevel        — 0 none · 1 mild · 2 medium · 3 hot
//   isJain            — no root vegetables / onion / garlic
//   isGlutenFree
//   tags[]            — discovery chips: seasonal · chef's pick · monsoon special · etc.
//   customisations[]  — upsell add-ons shown at cart time
//   gstRate           — 5 for food · 18 for beverages (Indian GST rules)
// ─────────────────────────────────────────────────────────────────────────────

const MENU_ITEMS = [

  // ══════════════════════════════════════════════
  //  CHAI
  // ══════════════════════════════════════════════
  {
    name: "Masala Chai",
    category: "Chai",
    price: 60,
    description: "Bold CTC tea simmered with cardamom, ginger & cinnamon — the OG Indian chai.",
    isAvailable: true,
    isBestseller: true,
    isVeg: true,
    isJain: true,
    isGlutenFree: true,
    tasteProfile: ["spicy", "creamy"],
    spiceLevel: 2,
    prepTime: 5,
    portionSize: "200 ml",
    calories: 120,
    gstRate: 18,
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop&q=80",
    rating: 4.8,
    reviewCount: 124,
    emoji: "🍵",
    tags: ["all-day", "staff favourite"],
    ingredients: [
      "CTC tea leaves", "full cream milk", "green cardamom",
      "fresh ginger", "cinnamon", "sugar"
    ],
    allergens: ["dairy"],
    customisations: [
      { label: "Less sugar",    price: 0 },
      { label: "No sugar",      price: 0 },
      { label: "Extra ginger",  price: 5 },
      { label: "Jaggery instead of sugar", price: 5 },
    ],
  },

  {
    name: "Sulaimani",
    category: "Chai",
    price: 70,
    description: "Fragrant Malabar black tea with lemon and a hint of mint. Zero milk, pure soul.",
    isAvailable: true,
    isBestseller: false,
    isVeg: true,
    isJain: true,
    isGlutenFree: true,
    tasteProfile: ["tangy", "refreshing"],
    spiceLevel: 0,
    prepTime: 4,
    portionSize: "200 ml",
    calories: 15,
    gstRate: 18,
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop&q=80",
    rating: 4.2,
    reviewCount: 31,
    emoji: "🫖",
    tags: ["light", "no-dairy"],
    ingredients: [
      "Malabar black tea leaves", "lemon juice", "fresh mint leaves",
      "cardamom", "cloves", "sugar"
    ],
    allergens: [],
    customisations: [
      { label: "Less sweet",  price: 0 },
      { label: "Extra lemon", price: 0 },
    ],
  },

  {
    name: "Kashmiri Kahwa",
    category: "Chai",
    price: 90,
    description: "Green tea brewed with saffron, almonds, and aromatic spices from the valley.",
    isAvailable: true,
    isBestseller: false,
    isVeg: true,
    isJain: true,
    isGlutenFree: true,
    tasteProfile: ["mild", "sweet"],
    spiceLevel: 0,
    prepTime: 7,
    portionSize: "180 ml",
    calories: 45,
    gstRate: 18,
    image: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&h=300&fit=crop&q=80",
    rating: 4.5,
    reviewCount: 47,
    emoji: "🫖",
    tags: ["seasonal", "wellness", "no-dairy"],
    ingredients: [
      "Kashmiri green tea leaves", "saffron strands", "blanched almonds",
      "green cardamom", "cinnamon", "cloves", "honey"
    ],
    allergens: ["nuts"],
    customisations: [
      { label: "Extra saffron", price: 15 },
      { label: "No nuts",       price: 0  },
    ],
  },

  {
    name: "Irani Chai",
    category: "Chai",
    price: 65,
    description: "Hyderabadi-style milky chai with a caramelised sweetness. Pairs perfectly with Osmania biscuits.",
    isAvailable: true,
    isBestseller: false,
    isVeg: true,
    isJain: true,
    isGlutenFree: true,
    tasteProfile: ["creamy", "sweet"],
    spiceLevel: 0,
    prepTime: 6,
    portionSize: "200 ml",
    calories: 150,
    gstRate: 18,
    image: "https://images.unsplash.com/photo-1563639234920-11f4085c0243?w=400&h=300&fit=crop&q=80",
    rating: 4.0,
    reviewCount: 18,
    emoji: "🍵",
    tags: ["slow-brew"],
    ingredients: [
      "CTC tea leaves", "full cream milk", "condensed milk",
      "cardamom", "sugar"
    ],
    allergens: ["dairy"],
    customisations: [
      { label: "Less sweet",      price: 0 },
      { label: "Extra condensed milk", price: 10 },
    ],
  },

  {
    name: "Tandai Chai",
    category: "Chai",
    price: 85,
    description: "A Delhi original — creamy chai infused with rose, fennel, and our house tandai blend.",
    isAvailable: true,
    isBestseller: false,
    isVeg: true,
    isJain: true,
    isGlutenFree: true,
    tasteProfile: ["sweet", "floral", "creamy"],
    spiceLevel: 0,
    prepTime: 7,
    portionSize: "200 ml",
    calories: 160,
    gstRate: 18,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&q=80",
    rating: 4.6,
    reviewCount: 29,
    emoji: "🌹",
    tags: ["seasonal", "chef's pick", "delhi special"],
    ingredients: [
      "CTC tea leaves", "full cream milk", "rose petals",
      "fennel seeds", "melon seeds", "black pepper",
      "cardamom", "sugar"
    ],
    allergens: ["dairy", "nuts"],
    customisations: [
      { label: "Less sweet", price: 0 },
    ],
  },

  // ══════════════════════════════════════════════
  //  COFFEE
  // ══════════════════════════════════════════════
  {
    name: "Espresso",
    category: "Coffee",
    price: 80,
    description: "Double-shot single-origin espresso — intense, clean, no compromises.",
    isAvailable: true,
    isBestseller: false,
    isVeg: true,
    isJain: true,
    isGlutenFree: true,
    tasteProfile: ["bitter", "smoky"],
    spiceLevel: 0,
    prepTime: 3,
    portionSize: "60 ml",
    calories: 10,
    gstRate: 18,
    image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop&q=80",
    rating: 4.3,
    reviewCount: 52,
    emoji: "☕",
    tags: ["quick", "no-dairy"],
    ingredients: [
      "single-origin Arabica coffee beans (double shot)"
    ],
    allergens: [],
    customisations: [
      { label: "Single shot",  price: -20 },
      { label: "Triple shot",  price: 20  },
    ],
  },

  {
    name: "Cappuccino",
    category: "Coffee",
    price: 130,
    description: "Velvety steamed milk over a rich espresso base, topped with silky microfoam.",
    isAvailable: true,
    isBestseller: true,
    isVeg: true,
    isJain: true,
    isGlutenFree: true,
    tasteProfile: ["creamy", "bitter"],
    spiceLevel: 0,
    prepTime: 5,
    portionSize: "250 ml",
    calories: 130,
    gstRate: 18,
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop&q=80",
    rating: 4.7,
    reviewCount: 89,
    emoji: "☕",
    tags: ["all-day", "staff favourite"],
    ingredients: [
      "double-shot espresso", "full cream milk", "microfoam"
    ],
    allergens: ["dairy"],
    customisations: [
      { label: "Oat milk",       price: 30 },
      { label: "Soy milk",       price: 20 },
      { label: "Extra shot",     price: 25 },
      { label: "Decaf",          price: 0  },
      { label: "Cinnamon dusting", price: 0 },
    ],
  },

  {
    name: "Cold Brew",
    category: "Coffee",
    price: 160,
    description: "20-hour cold-steeped coffee concentrate served over ice. Smooth, never bitter.",
    isAvailable: true,
    isBestseller: false,
    isVeg: true,
    isJain: true,
    isGlutenFree: true,
    tasteProfile: ["refreshing", "bitter"],
    spiceLevel: 0,
    prepTime: 2,
    portionSize: "300 ml",
    calories: 20,
    gstRate: 18,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop&q=80",
    rating: 4.4,
    reviewCount: 36,
    emoji: "🧊",
    tags: ["summer", "no-dairy"],
    ingredients: [
      "coarsely ground Arabica beans", "filtered cold water", "ice"
    ],
    allergens: [],
    customisations: [
      { label: "Add cream",         price: 20 },
      { label: "Add vanilla syrup", price: 15 },
    ],
  },

  {
    name: "Café Latte",
    category: "Coffee",
    price: 140,
    description: "Espresso melted into steamed milk — creamy, comforting, latte art included.",
    isAvailable: true,
    isBestseller: false,
    isVeg: true,
    isJain: true,
    isGlutenFree: true,
    tasteProfile: ["creamy", "mild"],
    spiceLevel: 0,
    prepTime: 5,
    portionSize: "300 ml",
    calories: 190,
    gstRate: 18,
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=300&fit=crop&q=80",
    rating: 4.1,
    reviewCount: 28,
    emoji: "☕",
    tags: ["all-day"],
    ingredients: [
      "double-shot espresso", "full cream milk", "latte art foam"
    ],
    allergens: ["dairy"],
    customisations: [
      { label: "Oat milk",          price: 30 },
      { label: "Soy milk",          price: 20 },
      { label: "Hazelnut syrup",    price: 20 },
      { label: "Caramel syrup",     price: 20 },
      { label: "Vanilla syrup",     price: 20 },
      { label: "Extra shot",        price: 25 },
      { label: "Decaf",             price: 0  },
    ],
  },

  {
    name: "Dalgona Coffee",
    category: "Coffee",
    price: 150,
    description: "Whipped instant coffee cloud over chilled milk. The internet sensation, done right.",
    isAvailable: true,
    isBestseller: false,
    isVeg: true,
    isJain: true,
    isGlutenFree: true,
    tasteProfile: ["sweet", "creamy", "bitter"],
    spiceLevel: 0,
    prepTime: 6,
    portionSize: "300 ml",
    calories: 210,
    gstRate: 18,
    image: "https://images.unsplash.com/photo-1612543073770-3c0a37a3ee5e?w=400&h=300&fit=crop&q=80",
    rating: 4.3,
    reviewCount: 44,
    emoji: "☕",
    tags: ["trending", "summer"],
    ingredients: [
      "instant coffee", "sugar", "hot water (for whipping)",
      "chilled full cream milk", "ice"
    ],
    allergens: ["dairy"],
    customisations: [
      { label: "Less sweet",   price: 0  },
      { label: "Oat milk",     price: 30 },
    ],
  },

  // ══════════════════════════════════════════════
  //  COLD DRINKS
  // ══════════════════════════════════════════════
  {
    name: "Fresh Lime Soda",
    category: "Cold Drinks",
    price: 70,
    description: "Freshly squeezed lime with sparkling soda — sweet or salty, your call.",
    isAvailable: true,
    isBestseller: false,
    isVeg: true,
    isJain: true,
    isGlutenFree: true,
    tasteProfile: ["tangy", "refreshing"],
    spiceLevel: 0,
    prepTime: 3,
    portionSize: "300 ml",
    calories: 40,
    gstRate: 18,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed514?w=400&h=300&fit=crop&q=80",
    rating: 4.0,
    reviewCount: 22,
    emoji: "🥤",
    tags: ["summer", "no-dairy", "light"],
    ingredients: [
      "fresh lime juice", "sparkling soda water", "sugar syrup", "salt", "ice"
    ],
    allergens: [],
    customisations: [
      { label: "Sweet",       price: 0 },
      { label: "Salty",       price: 0 },
      { label: "Sweet & salty", price: 0 },
      { label: "Extra lime",  price: 5 },
    ],
  },

  {
    name: "Mango Lassi",
    category: "Cold Drinks",
    price: 100,
    description: "Thick Alphonso mango blended with chilled yogurt and a touch of cardamom.",
    isAvailable: true,
    isBestseller: true,
    isVeg: true,
    isJain: true,
    isGlutenFree: true,
    tasteProfile: ["sweet", "creamy"],
    spiceLevel: 0,
    prepTime: 4,
    portionSize: "300 ml",
    calories: 230,
    gstRate: 18,
    image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=300&fit=crop&q=80",
    rating: 4.6,
    reviewCount: 73,
    emoji: "🥭",
    tags: ["summer", "staff favourite"],
    ingredients: [
      "Alphonso mango pulp", "fresh curd", "full cream milk",
      "cardamom powder", "sugar", "ice"
    ],
    allergens: ["dairy"],
    customisations: [
      { label: "Less sweet",   price: 0  },
      { label: "No sugar",     price: 0  },
      { label: "Extra mango",  price: 20 },
    ],
  },

  {
    name: "Virgin Mojito",
    category: "Cold Drinks",
    price: 120,
    description: "Muddled mint and lime with crushed ice and sparkling water. Summer in a glass.",
    isAvailable: true,
    isBestseller: false,
    isVeg: true,
    isJain: true,
    isGlutenFree: true,
    tasteProfile: ["refreshing", "sweet"],
    spiceLevel: 0,
    prepTime: 5,
    portionSize: "350 ml",
    calories: 60,
    gstRate: 18,
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop&q=80",
    rating: 4.3,
    reviewCount: 41,
    emoji: "🍃",
    tags: ["summer", "no-dairy"],
    ingredients: [
      "fresh mint leaves", "lime juice", "sugar syrup",
      "sparkling water", "crushed ice"
    ],
    allergens: [],
    customisations: [
      { label: "Less sweet",         price: 0  },
      { label: "Add blue curacao",   price: 20 },
      { label: "Add rose syrup",     price: 15 },
    ],
  },

  {
    name: "Rose Sharbat",
    category: "Cold Drinks",
    price: 80,
    description: "Classic Old Delhi rose syrup with chilled milk and a sprinkle of basil seeds. Nostalgic and gorgeous.",
    isAvailable: true,
    isBestseller: false,
    isVeg: true,
    isJain: true,
    isGlutenFree: true,
    tasteProfile: ["sweet", "floral"],
    spiceLevel: 0,
    prepTime: 3,
    portionSize: "300 ml",
    calories: 180,
    gstRate: 18,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80",
    rating: 4.4,
    reviewCount: 33,
    emoji: "🌹",
    tags: ["delhi special", "seasonal", "summer"],
    ingredients: [
      "rose syrup (Rooh Afza)", "chilled milk", "basil seeds (sabja)", "ice"
    ],
    allergens: ["dairy"],
    customisations: [
      { label: "Water base (no milk)", price: 0  },
      { label: "Extra rose syrup",     price: 10 },
    ],
  },

  // ══════════════════════════════════════════════
  //  SNACKS
  // ══════════════════════════════════════════════
  {
    name: "Vada Pav",
    category: "Snacks",
    price: 50,
    description: "Mumbai's #1 street food — spiced potato fritter in a fluffy pav with chutneys.",
    isAvailable: true,
    isBestseller: true,
    isVeg: true,
    isJain: false,
    isGlutenFree: false,
    tasteProfile: ["spicy", "crispy"],
    spiceLevel: 2,
    prepTime: 8,
    portionSize: "1 piece",
    calories: 290,
    gstRate: 5,
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400&h=300&fit=crop&q=80",
    rating: 4.5,
    reviewCount: 97,
    emoji: "🍔",
    tags: ["street food", "quick bite"],
    ingredients: [
      "potato (boiled & mashed)", "gram flour batter", "garlic chutney",
      "tamarind chutney", "green chilli chutney", "pav (bread roll)",
      "mustard seeds", "turmeric", "oil"
    ],
    allergens: ["gluten"],
    customisations: [
      { label: "Extra chutney",   price: 0 },
      { label: "Extra spicy",     price: 0 },
      { label: "No garlic chutney", price: 0 },
    ],
  },

  {
    name: "Paneer Tikka Toast",
    category: "Snacks",
    price: 120,
    description: "Smoky tandoori paneer chunks on buttery toasted bread with mint chutney.",
    isAvailable: true,
    isBestseller: false,
    isVeg: true,
    isJain: false,
    isGlutenFree: false,
    tasteProfile: ["smoky", "spicy"],
    spiceLevel: 2,
    prepTime: 12,
    portionSize: "2 pieces",
    calories: 340,
    gstRate: 5,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&q=80",
    rating: 4.2,
    reviewCount: 33,
    emoji: "🍞",
    tags: ["chef's pick"],
    ingredients: [
      "paneer (cottage cheese)", "hung curd marinade", "tandoori masala",
      "red chilli", "butter", "white bread", "mint chutney",
      "onion", "capsicum", "lemon"
    ],
    allergens: ["dairy", "gluten"],
    customisations: [
      { label: "Brown bread",    price: 0  },
      { label: "Extra paneer",   price: 30 },
      { label: "Less spicy",     price: 0  },
    ],
  },

  {
    name: "Chicken Patty Bun",
    category: "Snacks",
    price: 140,
    description: "Herb-crusted chicken patty with sriracha mayo, pickled onion, and lettuce.",
    isAvailable: true,
    isBestseller: false,
    isVeg: false,
    isJain: false,
    isGlutenFree: false,
    tasteProfile: ["crispy", "spicy"],
    spiceLevel: 2,
    prepTime: 10,
    portionSize: "1 piece",
    calories: 420,
    gstRate: 5,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&q=80",
    rating: 4.1,
    reviewCount: 27,
    emoji: "🥙",
    tags: ["non-veg"],
    ingredients: [
      "chicken mince", "breadcrumbs", "mixed herbs", "sriracha mayo",
      "pickled red onion", "iceberg lettuce", "brioche bun", "egg"
    ],
    allergens: ["gluten", "egg"],
    customisations: [
      { label: "Extra spicy",     price: 0  },
      { label: "Add cheese slice", price: 20 },
      { label: "No onion",        price: 0  },
    ],
  },

  {
    name: "Samosa (2 pc)",
    category: "Snacks",
    price: 40,
    description: "Flaky golden parcels stuffed with spiced potato and peas. Served with tamarind.",
    isAvailable: true,
    isBestseller: false,
    isVeg: true,
    isJain: false,
    isGlutenFree: false,
    tasteProfile: ["crispy", "spicy"],
    spiceLevel: 2,
    prepTime: 6,
    portionSize: "2 pieces",
    calories: 250,
    gstRate: 5,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop&q=80",
    rating: 4.3,
    reviewCount: 56,
    emoji: "🔺",
    tags: ["quick bite", "street food"],
    ingredients: [
      "refined flour (maida)", "potato", "green peas", "cumin seeds",
      "coriander", "garam masala", "green chilli", "oil", "tamarind chutney"
    ],
    allergens: ["gluten"],
    customisations: [
      { label: "Extra tamarind chutney", price: 0 },
      { label: "Add green chutney",      price: 0 },
      { label: "Extra spicy",            price: 0 },
    ],
  },

  {
    name: "Bread Pakora",
    category: "Snacks",
    price: 60,
    description: "Gram-flour battered bread stuffed with paneer and potato. A monsoon classic.",
    isAvailable: false,
    isBestseller: false,
    isVeg: true,
    isJain: false,
    isGlutenFree: false,
    tasteProfile: ["crispy", "mild"],
    spiceLevel: 1,
    prepTime: 8,
    portionSize: "2 pieces",
    calories: 310,
    gstRate: 5,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&q=80",
    rating: 3.9,
    reviewCount: 14,
    emoji: "🟡",
    tags: ["monsoon special"],
    ingredients: [
      "white bread", "gram flour (besan)", "potato filling",
      "paneer", "green chilli", "coriander", "chaat masala", "oil"
    ],
    allergens: ["gluten", "dairy"],
    customisations: [],
  },

  {
    name: "Aloo Chaat",
    category: "Snacks",
    price: 80,
    description: "Crispy fried potatoes tossed with tangy chutneys, yogurt, and chaat masala. Pure Delhi.",
    isAvailable: true,
    isBestseller: false,
    isVeg: true,
    isJain: false,
    isGlutenFree: true,
    tasteProfile: ["tangy", "spicy", "crispy"],
    spiceLevel: 2,
    prepTime: 7,
    portionSize: "1 bowl",
    calories: 280,
    gstRate: 5,
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop&q=80",
    rating: 4.5,
    reviewCount: 61,
    emoji: "🥔",
    tags: ["delhi special", "street food", "bestseller"],
    ingredients: [
      "baby potatoes (boiled & fried)", "tamarind chutney", "green chutney",
      "whisked yogurt", "chaat masala", "red chilli powder",
      "pomegranate seeds", "fresh coriander", "onion"
    ],
    allergens: ["dairy"],
    customisations: [
      { label: "No yogurt (vegan)", price: 0 },
      { label: "Extra chutney",     price: 0 },
      { label: "Extra spicy",       price: 0 },
    ],
  },

  // ══════════════════════════════════════════════
  //  MEALS
  // ══════════════════════════════════════════════
  {
    name: "Rajma Chawal",
    category: "Meals",
    price: 179,
    description: "Creamy kidney bean curry slow-cooked with tomatoes, served with steamed rice.",
    isAvailable: true,
    isBestseller: true,
    isVeg: true,
    isJain: false,
    isGlutenFree: true,
    tasteProfile: ["creamy", "mild"],
    spiceLevel: 1,
    prepTime: 15,
    portionSize: "1 plate (serves 1)",
    calories: 520,
    gstRate: 5,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&q=80",
    rating: 4.7,
    reviewCount: 112,
    emoji: "🍛",
    tags: ["comfort food", "delhi special", "staff favourite"],
    ingredients: [
      "red kidney beans (rajma)", "basmati rice", "onion", "tomato",
      "ginger-garlic paste", "rajma masala", "butter", "cream",
      "cumin seeds", "bay leaf", "coriander"
    ],
    allergens: ["dairy"],
    customisations: [
      { label: "Extra rice",   price: 20 },
      { label: "Extra rajma",  price: 30 },
      { label: "No onion-garlic (Jain-style)", price: 0 },
    ],
  },

  {
    name: "Chole Bhature",
    category: "Meals",
    price: 159,
    description: "Spicy chickpea curry with fluffy deep-fried bhature. Punjabi soul food.",
    isAvailable: true,
    isBestseller: false,
    isVeg: true,
    isJain: false,
    isGlutenFree: false,
    tasteProfile: ["spicy", "crispy"],
    spiceLevel: 2,
    prepTime: 12,
    portionSize: "2 bhature + curry",
    calories: 680,
    gstRate: 5,
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=300&fit=crop&q=80",
    rating: 4.4,
    reviewCount: 68,
    emoji: "🫓",
    tags: ["heavy", "sunday special"],
    ingredients: [
      "white chickpeas (chole)", "refined flour (bhature)", "yogurt",
      "onion", "tomato", "ginger-garlic paste", "chole masala",
      "tamarind", "pomegranate powder", "oil"
    ],
    allergens: ["gluten", "dairy"],
    customisations: [
      { label: "Extra bhature (+1 pc)", price: 30 },
      { label: "Extra chole",           price: 30 },
      { label: "Less spicy",            price: 0  },
    ],
  },

  {
    name: "Chicken Biryani",
    category: "Meals",
    price: 259,
    description: "Dum-cooked basmati with tender marinated chicken, saffron, and crispy onions.",
    isAvailable: true,
    isBestseller: true,
    isVeg: false,
    isJain: false,
    isGlutenFree: true,
    tasteProfile: ["spicy", "smoky"],
    spiceLevel: 2,
    prepTime: 20,
    portionSize: "1 plate (serves 1)",
    calories: 720,
    gstRate: 5,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop&q=80",
    rating: 4.9,
    reviewCount: 156,
    emoji: "🍗",
    tags: ["non-veg", "chef's pick", "bestseller"],
    ingredients: [
      "aged basmati rice", "chicken (bone-in)", "hung curd marinade",
      "saffron", "crispy fried onions", "ghee", "whole spices",
      "biryani masala", "mint leaves", "rose water"
    ],
    allergens: ["dairy"],
    customisations: [
      { label: "Raita add-on",   price: 30 },
      { label: "Salan add-on",   price: 30 },
      { label: "Extra spicy",    price: 0  },
      { label: "Less spicy",     price: 0  },
    ],
  },

  {
    name: "Dal Makhani + Roti",
    category: "Meals",
    price: 189,
    description: "Slow-simmered black lentils finished with cream and butter. Comfort in a bowl.",
    isAvailable: true,
    isBestseller: false,
    isVeg: true,
    isJain: false,
    isGlutenFree: false,
    tasteProfile: ["creamy", "smoky"],
    spiceLevel: 1,
    prepTime: 15,
    portionSize: "1 bowl + 2 rotis",
    calories: 590,
    gstRate: 5,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&q=80",
    rating: 4.5,
    reviewCount: 84,
    emoji: "🫕",
    tags: ["comfort food", "slow-cooked"],
    ingredients: [
      "whole black lentils (urad dal)", "red kidney beans", "butter",
      "cream", "tomato puree", "ginger-garlic paste", "cumin",
      "garam masala", "whole wheat roti"
    ],
    allergens: ["dairy", "gluten"],
    customisations: [
      { label: "Extra roti (+1 pc)", price: 15 },
      { label: "Extra dal",          price: 30 },
      { label: "Butter naan instead of roti", price: 20 },
    ],
  },

  {
    name: "Paneer Butter Masala + Naan",
    category: "Meals",
    price: 219,
    description: "Velvety tomato-cashew gravy with soft paneer cubes. Delhi's ultimate comfort meal.",
    isAvailable: true,
    isBestseller: false,
    isVeg: true,
    isJain: false,
    isGlutenFree: false,
    tasteProfile: ["creamy", "mild", "sweet"],
    spiceLevel: 1,
    prepTime: 15,
    portionSize: "1 bowl + 1 naan",
    calories: 640,
    gstRate: 5,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop&q=80",
    rating: 4.6,
    reviewCount: 91,
    emoji: "🧀",
    tags: ["comfort food", "bestseller", "crowd pleaser"],
    ingredients: [
      "paneer", "tomato puree", "cashew paste", "butter", "cream",
      "onion", "ginger-garlic paste", "kasuri methi",
      "garam masala", "sugar", "butter naan"
    ],
    allergens: ["dairy", "gluten", "nuts"],
    customisations: [
      { label: "Extra naan (+1 pc)", price: 25 },
      { label: "Roti instead of naan", price: -10 },
      { label: "Extra gravy",         price: 30  },
      { label: "Extra spicy",         price: 0   },
    ],
  },

  // ══════════════════════════════════════════════
  //  DESSERTS
  // ══════════════════════════════════════════════
  {
    name: "Gulab Jamun",
    category: "Desserts",
    price: 70,
    description: "Soft milk-solid dumplings soaked in cardamom-rose sugar syrup. Pure indulgence.",
    isAvailable: true,
    isBestseller: false,
    isVeg: true,
    isJain: true,
    isGlutenFree: false,
    tasteProfile: ["sweet", "creamy"],
    spiceLevel: 0,
    prepTime: 3,
    portionSize: "2 pieces",
    calories: 250,
    gstRate: 5,
    image: "https://images.unsplash.com/photo-1666190073498-d8a92cba26c8?w=400&h=300&fit=crop&q=80",
    rating: 4.4,
    reviewCount: 45,
    emoji: "🟤",
    tags: ["traditional", "festive"],
    ingredients: [
      "khoya (dried milk solids)", "refined flour", "cardamom",
      "rose water", "sugar syrup", "ghee"
    ],
    allergens: ["dairy", "gluten"],
    customisations: [
      { label: "Warm (heated)",     price: 0 },
      { label: "With vanilla ice cream", price: 40 },
    ],
  },

  {
    name: "Matka Kulfi",
    category: "Desserts",
    price: 90,
    description: "Traditional slow-churned kulfi with pistachios, set in earthen clay pots.",
    isAvailable: true,
    isBestseller: true,
    isVeg: true,
    isJain: true,
    isGlutenFree: true,
    tasteProfile: ["sweet", "creamy"],
    spiceLevel: 0,
    prepTime: 2,
    portionSize: "1 matka (~120 ml)",
    calories: 200,
    gstRate: 5,
    image: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400&h=300&fit=crop&q=80",
    rating: 4.6,
    reviewCount: 62,
    emoji: "🍦",
    tags: ["traditional", "summer", "staff favourite"],
    ingredients: [
      "full cream milk (reduced)", "sugar", "cardamom",
      "pistachios", "saffron", "rose water"
    ],
    allergens: ["dairy", "nuts"],
    customisations: [
      { label: "Mango kulfi",   price: 10 },
      { label: "Rose kulfi",    price: 10 },
      { label: "Extra falooda", price: 20 },
    ],
  },

  {
    name: "Chocolate Brownie",
    category: "Desserts",
    price: 110,
    description: "Warm, gooey dark chocolate brownie with a crackly top. Served with vanilla ice cream.",
    isAvailable: true,
    isBestseller: false,
    isVeg: true,
    isJain: true,
    isGlutenFree: false,
    tasteProfile: ["sweet", "bitter"],
    spiceLevel: 0,
    prepTime: 5,
    portionSize: "1 slice + 1 scoop ice cream",
    calories: 380,
    gstRate: 5,
    image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=300&fit=crop&q=80",
    rating: 4.3,
    reviewCount: 39,
    emoji: "🍫",
    tags: ["indulgent", "crowd pleaser"],
    ingredients: [
      "dark chocolate (70%)", "butter", "eggs", "refined flour",
      "caster sugar", "cocoa powder", "vanilla extract",
      "vanilla ice cream"
    ],
    allergens: ["dairy", "gluten", "egg"],
    customisations: [
      { label: "No ice cream",       price: -20 },
      { label: "Double ice cream",   price: 30  },
      { label: "Add hot fudge",      price: 25  },
      { label: "Add chocolate sauce", price: 20 },
    ],
  },

  {
    name: "Phirni",
    category: "Desserts",
    price: 85,
    description: "Creamy coarsely-ground rice pudding chilled in earthen bowls, flavoured with saffron and rose.",
    isAvailable: true,
    isBestseller: false,
    isVeg: true,
    isJain: true,
    isGlutenFree: true,
    tasteProfile: ["sweet", "floral", "creamy"],
    spiceLevel: 0,
    prepTime: 2,
    portionSize: "1 shikora (~150 ml)",
    calories: 220,
    gstRate: 5,
    image: "https://images.unsplash.com/photo-1571748982800-fa51082c2224?w=400&h=300&fit=crop&q=80",
    rating: 4.4,
    reviewCount: 27,
    emoji: "🍚",
    tags: ["traditional", "delhi special", "gluten-free"],
    ingredients: [
      "full cream milk", "coarsely ground rice", "sugar",
      "saffron", "rose water", "cardamom", "pistachios", "almonds"
    ],
    allergens: ["dairy", "nuts"],
    customisations: [
      { label: "No nuts", price: 0 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TABLES
// New fields added vs original:
//   qrCodeUrl     — unique per-table scan-to-order URL
//   isReserved    — live reservation flag
//   reservedUntil — ISO timestamp (null if free)
//   section       — indoor | outdoor | private-room | rooftop
//   hasCharger    — USB/power point at the table
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = process.env.APP_BASE_URL || 'https://cafeos.app';

const TABLES = [
  // Ground floor — indoor
  { number: 1,  floor: 'Ground', section: 'indoor',       capacity: 2,  status: 'free', isReserved: false, reservedUntil: null, hasCharger: false, qrCodeUrl: `${BASE_URL}/menu?table=1` },
  { number: 2,  floor: 'Ground', section: 'indoor',       capacity: 2,  status: 'free', isReserved: false, reservedUntil: null, hasCharger: true,  qrCodeUrl: `${BASE_URL}/menu?table=2` },
  { number: 3,  floor: 'Ground', section: 'indoor',       capacity: 4,  status: 'free', isReserved: false, reservedUntil: null, hasCharger: false, qrCodeUrl: `${BASE_URL}/menu?table=3` },
  { number: 4,  floor: 'Ground', section: 'indoor',       capacity: 4,  status: 'free', isReserved: false, reservedUntil: null, hasCharger: true,  qrCodeUrl: `${BASE_URL}/menu?table=4` },
  // Ground floor — outdoor
  { number: 5,  floor: 'Ground', section: 'outdoor',      capacity: 6,  status: 'free', isReserved: false, reservedUntil: null, hasCharger: false, qrCodeUrl: `${BASE_URL}/menu?table=5` },
  { number: 6,  floor: 'Ground', section: 'outdoor',      capacity: 8,  status: 'free', isReserved: false, reservedUntil: null, hasCharger: false, qrCodeUrl: `${BASE_URL}/menu?table=6` },

  // First floor — indoor
  { number: 11, floor: 'First',  section: 'indoor',       capacity: 2,  status: 'free', isReserved: false, reservedUntil: null, hasCharger: true,  qrCodeUrl: `${BASE_URL}/menu?table=11` },
  { number: 12, floor: 'First',  section: 'indoor',       capacity: 2,  status: 'free', isReserved: false, reservedUntil: null, hasCharger: true,  qrCodeUrl: `${BASE_URL}/menu?table=12` },
  { number: 13, floor: 'First',  section: 'indoor',       capacity: 4,  status: 'free', isReserved: false, reservedUntil: null, hasCharger: false, qrCodeUrl: `${BASE_URL}/menu?table=13` },
  { number: 14, floor: 'First',  section: 'indoor',       capacity: 4,  status: 'free', isReserved: false, reservedUntil: null, hasCharger: false, qrCodeUrl: `${BASE_URL}/menu?table=14` },
  // First floor — rooftop
  { number: 15, floor: 'First',  section: 'rooftop',      capacity: 6,  status: 'free', isReserved: false, reservedUntil: null, hasCharger: false, qrCodeUrl: `${BASE_URL}/menu?table=15` },
  { number: 16, floor: 'First',  section: 'rooftop',      capacity: 8,  status: 'free', isReserved: false, reservedUntil: null, hasCharger: false, qrCodeUrl: `${BASE_URL}/menu?table=16` },
  // Private room
  { number: 20, floor: 'First',  section: 'private-room', capacity: 12, status: 'free', isReserved: false, reservedUntil: null, hasCharger: true,  qrCodeUrl: `${BASE_URL}/menu?table=20` },
];

// ─────────────────────────────────────────────────────────────────────────────
// SEEDER
// ─────────────────────────────────────────────────────────────────────────────

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cafeos';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    await MenuItem.deleteMany({});
    await Table.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared old MenuItems, Tables, and Orders');

    await MenuItem.insertMany(MENU_ITEMS);
    console.log(`✅ Inserted ${MENU_ITEMS.length} Menu Items across ${[...new Set(MENU_ITEMS.map(i => i.category))].length} categories`);

    await Table.insertMany(TABLES);
    console.log(`✅ Inserted ${TABLES.length} Tables (${[...new Set(TABLES.map(t => t.section))].join(', ')})`);

    const vegCount    = MENU_ITEMS.filter(i => i.isVeg).length;
    const nonVegCount = MENU_ITEMS.filter(i => !i.isVeg).length;
    const jainCount   = MENU_ITEMS.filter(i => i.isJain).length;
    const gfCount     = MENU_ITEMS.filter(i => i.isGlutenFree).length;
    console.log(`\n📊 Menu breakdown:`);
    console.log(`   🟢 Veg: ${vegCount}  🔴 Non-veg: ${nonVegCount}`);
    console.log(`   🟤 Jain-friendly: ${jainCount}  🌾 Gluten-free: ${gfCount}`);
    console.log(`   ⭐ Bestsellers: ${MENU_ITEMS.filter(i => i.isBestseller).length}`);
    console.log(`   ❌ Currently unavailable: ${MENU_ITEMS.filter(i => !i.isAvailable).length}`);
    console.log('\n🎉 CafeOS Database Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();