// Menu data extracted from restaurant photographs
// Items marked needs_review: true have unclear/partially-visible prices

export interface ProductVariant {
  id: string
  label: string
  price: number
}

export interface Product {
  id: string
  category: string
  name: string
  description: string
  image?: string
  variants: ProductVariant[]
  needs_review?: boolean
  tags?: string[]
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  display_order: number
}

export const CATEGORIES: Category[] = [
  { id: 'pizza', name: 'Pizza', slug: 'pizza', icon: '🍕', display_order: 1 },
  { id: 'burger', name: 'Burgers', slug: 'burger', icon: '🍔', display_order: 2 },
  { id: 'fries', name: 'Fries & Momos', slug: 'fries', icon: '🍟', display_order: 3 },
  { id: 'sandwich', name: 'Sandwich', slug: 'sandwich', icon: '🥪', display_order: 4 },
  { id: 'wings', name: 'Wings & Nuggets', slug: 'wings', icon: '🍗', display_order: 5 },
  { id: 'pasta', name: 'Pasta', slug: 'pasta', icon: '🍝', display_order: 6 },
  { id: 'wrap', name: 'Wraps & Rolls', slug: 'wrap', icon: '🌯', display_order: 7 },
  { id: 'broast', name: 'Broast', slug: 'broast', icon: '🍖', display_order: 8 },
  { id: 'soup', name: 'Soup', slug: 'soup', icon: '🍲', display_order: 9 },
  { id: 'drinks', name: 'Cold Drinks', slug: 'drinks', icon: '🥤', display_order: 10 },
]

export const PRODUCTS: Product[] = [
  // ───────────────── PIZZA ─────────────────
  {
    id: 'pizza-ah-special',
    category: 'pizza',
    name: 'AH Special Pizza',
    description: "Al Haider's signature pizza loaded with premium toppings — our most popular choice.",
    variants: [
      { id: 'pizza-ah-special-sm', label: 'Small', price: 650 },
      { id: 'pizza-ah-special-md', label: 'Medium', price: 1200 },
      { id: 'pizza-ah-special-lg', label: 'Large', price: 1650 },
    ],
    tags: ['bestseller'],
  },
  {
    id: 'pizza-kabab-crust',
    category: 'pizza',
    name: 'Kabab Crust Pizza',
    description: 'Juicy kabab stuffed into the crust, topped with fresh vegetables and special sauce.',
    variants: [
      { id: 'pizza-kabab-sm', label: 'Small', price: 550 },
      { id: 'pizza-kabab-md', label: 'Medium', price: 1100 },
      { id: 'pizza-kabab-lg', label: 'Large', price: 1550 },
    ],
  },
  {
    id: 'pizza-crown-crust',
    category: 'pizza',
    name: 'Crown Crust Pizza',
    description: 'Royal crown-style stuffed crust with a choice of fillings and rich toppings.',
    variants: [
      { id: 'pizza-crown-sm', label: 'Small', price: 500 },
      { id: 'pizza-crown-md', label: 'Medium', price: 1200 },
      { id: 'pizza-crown-lg', label: 'Large', price: 1600 },
    ],
  },
  {
    id: 'pizza-turkish',
    category: 'pizza',
    name: 'Turkish Pizza',
    description: 'Turkish-style flatbread pizza with seasoned meat, vegetables, and herbs.',
    variants: [
      { id: 'pizza-turkish-sm', label: 'Small', price: 500 },
      { id: 'pizza-turkish-md', label: 'Medium', price: 1000 },
      { id: 'pizza-turkish-lg', label: 'Large', price: 1500 },
    ],
  },
  {
    id: 'pizza-cheese-lover',
    category: 'pizza',
    name: 'Cheese Lover Pizza',
    description: 'A dream for cheese lovers — loaded with multiple cheese varieties on every slice.',
    variants: [
      { id: 'pizza-cheese-sm', label: 'Small', price: 600 },
      { id: 'pizza-cheese-md', label: 'Medium', price: 1000 },
      { id: 'pizza-cheese-lg', label: 'Large', price: 1300 },
    ],
    tags: ['popular'],
  },
  {
    id: 'pizza-chicken-bbq',
    category: 'pizza',
    name: 'Chicken BBQ Pizza',
    description: 'Smoky BBQ sauce base with tender grilled chicken chunks and caramelised onions.',
    variants: [
      { id: 'pizza-bbq-sm', label: 'Small', price: 550 },
      { id: 'pizza-bbq-md', label: 'Medium', price: 1100 },
      { id: 'pizza-bbq-lg', label: 'Large', price: 1500 },
    ],
    tags: ['popular'],
  },
  {
    id: 'pizza-chicken-fajita',
    category: 'pizza',
    name: 'Chicken Fajita Pizza',
    description: 'Marinated fajita chicken, bell peppers, and jalapeños on a creamy fajita sauce.',
    variants: [
      { id: 'pizza-fajita-sm', label: 'Small', price: 600 },
      { id: 'pizza-fajita-md', label: 'Medium', price: 1100 },
      { id: 'pizza-fajita-lg', label: 'Large', price: 1500 },
    ],
    tags: ['spicy'],
  },
  {
    id: 'pizza-calzone',
    category: 'pizza',
    name: 'Calzone',
    description: 'Folded Italian-style pizza filled with seasoned chicken, cheese, and vegetables.',
    variants: [
      { id: 'pizza-calzone-sm', label: 'Small', price: 600 },
      { id: 'pizza-calzone-md', label: 'Medium', price: 1000 },
      { id: 'pizza-calzone-lg', label: 'Large', price: 1500 },
    ],
    needs_review: true,
  },
  {
    id: 'pizza-creamy-melt',
    category: 'pizza',
    name: 'Creamy Melt Pizza',
    description: 'Rich cream sauce base with mozzarella and a blend of premium toppings.',
    variants: [
      { id: 'pizza-creamy-sm', label: 'Small', price: 600 },
      { id: 'pizza-creamy-md', label: 'Medium', price: 1300 },
    ],
    needs_review: true,
  },
  {
    id: 'pizza-paproni',
    category: 'pizza',
    name: 'Paproni Pizza',
    description: 'Generously loaded with paproni slices on a classic tomato and mozzarella base.',
    variants: [
      { id: 'pizza-paproni-sm', label: 'Small', price: 500 },
      { id: 'pizza-paproni-md', label: 'Medium', price: 1000 },
      { id: 'pizza-paproni-lg', label: 'Large', price: 1300 },
    ],
  },
  {
    id: 'pizza-vegetable',
    category: 'pizza',
    name: 'Vegetable Pizza',
    description: 'Fresh garden vegetables on tomato sauce and melted mozzarella.',
    variants: [
      { id: 'pizza-veg-sm', label: 'Small', price: 550 },
      { id: 'pizza-veg-md', label: 'Medium', price: 1000 },
      { id: 'pizza-veg-lg', label: 'Large', price: 1500 },
    ],
  },
  {
    id: 'pizza-chicken-supreme',
    category: 'pizza',
    name: 'Chicken Supreme Pizza',
    description: 'Supreme combination of grilled chicken, mushrooms, peppers, and olives.',
    variants: [
      { id: 'pizza-supreme-sm', label: 'Small', price: 500 },
      { id: 'pizza-supreme-md', label: 'Medium', price: 1000 },
      { id: 'pizza-supreme-lg', label: 'Large', price: 1300 },
    ],
    tags: ['popular'],
  },
  {
    id: 'pizza-chicken-lover',
    category: 'pizza',
    name: 'Chicken Lover Pizza',
    description: 'Double the chicken, double the flavour — perfect for protein lovers.',
    variants: [
      { id: 'pizza-clover-sm', label: 'Small', price: 600 },
      { id: 'pizza-clover-md', label: 'Medium', price: 1300 },
    ],
    needs_review: true,
  },
  {
    id: 'pizza-hot-spicy',
    category: 'pizza',
    name: 'Hot & Spicy Pizza',
    description: 'Fiery blend of chilli chicken, jalapeños, and hot sauce for heat seekers.',
    variants: [
      { id: 'pizza-hot-sm', label: 'Small', price: 550 },
      { id: 'pizza-hot-md', label: 'Medium', price: 1500 },
    ],
    needs_review: true,
    tags: ['spicy'],
  },
  {
    id: 'pizza-family-special',
    category: 'pizza',
    name: 'Family Special Pizza',
    description: 'The perfect family feast — XL size with a generous mix of premium toppings.',
    variants: [
      { id: 'pizza-family-sm', label: 'Small', price: 500 },
      { id: 'pizza-family-md', label: 'Medium', price: 1300 },
      { id: 'pizza-family-xl', label: 'XL', price: 2000 },
    ],
    tags: ['family'],
  },

  // ───────────────── BURGERS ─────────────────
  {
    id: 'burger-zinger',
    category: 'burger',
    name: 'Zinger Burger',
    description: 'Crispy fried chicken fillet with lettuce, mayo, and special sauce in a soft bun.',
    variants: [{ id: 'burger-zinger-reg', label: 'Regular', price: 350 }],
    tags: ['bestseller'],
  },
  {
    id: 'burger-zinger-special',
    category: 'burger',
    name: 'Zinger Special Burger',
    description: 'Upgraded zinger with extra toppings, cheese, and AH special sauce.',
    variants: [{ id: 'burger-zinger-special-reg', label: 'Regular', price: 450 }],
    tags: ['popular'],
  },
  {
    id: 'burger-double-decker',
    category: 'burger',
    name: 'Double Decker Burger',
    description: 'Two layers of crispy chicken with lettuce, tomato, and creamy sauce.',
    variants: [{ id: 'burger-dd-reg', label: 'Regular', price: 350 }],
  },
  {
    id: 'burger-tower',
    category: 'burger',
    name: 'Tower Burger',
    description: 'A towering stack of chicken, cheese, veggies, and signature sauces.',
    variants: [{ id: 'burger-tower-reg', label: 'Regular', price: 500 }],
    tags: ['popular'],
  },
  {
    id: 'burger-patty',
    category: 'burger',
    name: 'Patty Burger',
    description: 'Classic grilled chicken patty burger with fresh vegetables and mayo.',
    variants: [{ id: 'burger-patty-reg', label: 'Regular', price: 300 }],
  },
  {
    id: 'burger-crunchy',
    category: 'burger',
    name: 'Crunchy Burger',
    description: 'Extra-crispy coated chicken with crunchy slaw and chipotle sauce.',
    variants: [{ id: 'burger-crunchy-reg', label: 'Regular', price: 350 }],
  },
  {
    id: 'burger-beef-patty',
    category: 'burger',
    name: 'Beef Patty Burger',
    description: 'Juicy beef patty with caramelised onions, pickles, mustard, and ketchup.',
    variants: [{ id: 'burger-beef-reg', label: 'Regular', price: 350 }],
  },
  {
    id: 'burger-lava',
    category: 'burger',
    name: 'Lava Burger',
    description: 'The ultimate burger — oozing molten cheese inside a premium chicken fillet.',
    variants: [{ id: 'burger-lava-reg', label: 'Regular', price: 700 }],
    tags: ['premium', 'popular'],
  },

  // ───────────────── FRIES & MOMOS ─────────────────
  {
    id: 'fries-loaded',
    category: 'fries',
    name: 'Loaded Fries',
    description: 'Crispy fries smothered with cheese sauce, chicken, jalapeños, and sauces.',
    variants: [{ id: 'fries-loaded-reg', label: 'Regular', price: 800 }],
    tags: ['popular'],
  },
  {
    id: 'fries-pizza',
    category: 'fries',
    name: 'Pizza Fries',
    description: 'Fries topped with pizza sauce, mozzarella, and your choice of toppings.',
    variants: [{ id: 'fries-pizza-reg', label: 'Regular', price: 350 }],
  },
  {
    id: 'fries-regular',
    category: 'fries',
    name: 'Regular Fries',
    description: 'Golden, lightly salted classic fries.',
    variants: [{ id: 'fries-regular-reg', label: 'Regular', price: 250 }],
  },
  {
    id: 'fries-large',
    category: 'fries',
    name: 'Large Fries',
    description: 'A larger portion of our golden classic fries.',
    variants: [{ id: 'fries-large-reg', label: 'Large', price: 400 }],
  },
  {
    id: 'momos',
    category: 'fries',
    name: 'Momos',
    description: 'Steamed/fried dumplings filled with spiced chicken, served with dipping sauce.',
    variants: [
      { id: 'momos-6', label: '6 Pieces', price: 250 },
      { id: 'momos-12', label: '12 Pieces', price: 500 },
    ],
  },

  // ───────────────── SANDWICH ─────────────────
  {
    id: 'sandwich-cheesy',
    category: 'sandwich',
    name: 'Cheesy Sandwich',
    description: 'Grilled chicken and layers of cheese in toasted bread with special sauce.',
    variants: [{ id: 'sandwich-cheesy-reg', label: 'Regular', price: 700 }],
    tags: ['popular'],
  },
  {
    id: 'sandwich-cheesy-stick',
    category: 'sandwich',
    name: 'Cheesy Sticks',
    description: 'Crispy golden mozzarella-filled sticks served with marinara sauce.',
    variants: [{ id: 'sandwich-stick-reg', label: 'Regular', price: 1200 }],
  },

  // ───────────────── WINGS & NUGGETS ─────────────────
  {
    id: 'wings-hot',
    category: 'wings',
    name: 'Hot Wings',
    description: 'Classic crispy chicken wings coated in fiery hot sauce.',
    variants: [
      { id: 'wings-hot-5', label: '5 Pieces', price: 300 },
      { id: 'wings-hot-10', label: '10 Pieces', price: 600 },
    ],
    tags: ['spicy'],
  },
  {
    id: 'wings-bbq',
    category: 'wings',
    name: 'BBQ Wings',
    description: 'Smoky, sticky BBQ glazed wings — perfectly caramelised.',
    variants: [
      { id: 'wings-bbq-5', label: '5 Pieces', price: 350 },
      { id: 'wings-bbq-10', label: '10 Pieces', price: 700 },
    ],
    tags: ['bestseller'],
  },
  {
    id: 'wings-buffalo',
    category: 'wings',
    name: 'Buffalo Wings',
    description: 'Tangy and spicy classic Buffalo-style wings with blue cheese dip.',
    variants: [
      { id: 'wings-buffalo-5', label: '5 Pieces', price: 350 },
      { id: 'wings-buffalo-10', label: '10 Pieces', price: 700 },
    ],
    tags: ['spicy'],
  },
  {
    id: 'wings-peri-peri',
    category: 'wings',
    name: 'Peri Peri Wings',
    description: 'Marinated in Portuguese Peri Peri spices — bold, smoky, and spicy.',
    variants: [
      { id: 'wings-pp-5', label: '5 Pieces', price: 300 },
      { id: 'wings-pp-10', label: '10 Pieces', price: 650 },
    ],
    tags: ['spicy'],
  },
  {
    id: 'nuggets',
    category: 'wings',
    name: 'Chicken Nuggets',
    description: 'Crispy golden nuggets, lightly seasoned and great with dipping sauce.',
    variants: [
      { id: 'nuggets-5', label: '5 Pieces', price: 300 },
      { id: 'nuggets-10', label: '10 Pieces', price: 500 },
    ],
    tags: ['popular'],
  },

  // ───────────────── PASTA ─────────────────
  {
    id: 'pasta-alfredo',
    category: 'pasta',
    name: 'Alfredo Pasta',
    description: 'Creamy Alfredo sauce with tender pasta and grilled chicken strips.',
    variants: [{ id: 'pasta-alfredo-reg', label: 'Regular', price: 700 }],
    tags: ['popular'],
  },
  {
    id: 'pasta-crunchy',
    category: 'pasta',
    name: 'Crunchy Pasta',
    description: 'Crispy topped pasta bake with a rich, flavourful sauce and crunchy breadcrumbs.',
    variants: [{ id: 'pasta-crunchy-reg', label: 'Regular', price: 750 }],
  },

  // ───────────────── WRAPS & ROLLS ─────────────────
  {
    id: 'wrap-zinger',
    category: 'wrap',
    name: 'Zinger Wrap',
    description: 'Crispy zinger fillet wrapped in a soft tortilla with slaw and sauces.',
    variants: [{ id: 'wrap-zinger-reg', label: 'Regular', price: 380 }],
    tags: ['popular'],
  },
  {
    id: 'wrap-chicken',
    category: 'wrap',
    name: 'Chicken Wrap',
    description: 'Grilled chicken with salad, cheese, and garlic mayo in a warm wrap.',
    variants: [{ id: 'wrap-chicken-reg', label: 'Regular', price: 450 }],
  },
  {
    id: 'roll-turkish',
    category: 'wrap',
    name: 'Turkish Roll',
    description: 'Turkish-seasoned chicken in a rolled flatbread with onions and sauces.',
    variants: [{ id: 'roll-turkish-reg', label: 'Regular', price: 400 }],
  },
  {
    id: 'roll-jumbo',
    category: 'wrap',
    name: 'Jumbo Roll',
    description: 'Oversized roll packed with chicken, fries, cheese, and special sauce.',
    variants: [{ id: 'roll-jumbo-reg', label: 'Regular', price: 500 }],
  },
  {
    id: 'roll-behari',
    category: 'wrap',
    name: 'Behari Roll',
    description: 'Marinated Behari-style chicken wrapped in a soft paratha with chutney.',
    variants: [{ id: 'roll-behari-reg', label: 'Regular', price: 650 }],
    tags: ['popular'],
  },
  {
    id: 'roll-arabic',
    category: 'wrap',
    name: 'Arabic Roll',
    description: 'Arabic-style shawarma roll with garlic sauce, pickles, and grilled chicken.',
    variants: [{ id: 'roll-arabic-reg', label: 'Regular', price: 650 }],
  },

  // ───────────────── BROAST ─────────────────
  {
    id: 'broast-full',
    category: 'broast',
    name: 'Full Broast',
    description: 'A whole broasted chicken — crispy on the outside, juicy inside. Serves 3–4.',
    variants: [{ id: 'broast-full-reg', label: 'Full', price: 1450 }],
    tags: ['family'],
  },
  {
    id: 'broast-half',
    category: 'broast',
    name: 'Half Broast',
    description: 'Half a broasted chicken. Perfect for two.',
    variants: [{ id: 'broast-half-reg', label: 'Half', price: 750 }],
    tags: ['popular'],
  },
  {
    id: 'broast-steam',
    category: 'broast',
    name: 'Steam Broast',
    description: 'Steamed then broasted for extra juiciness and a lighter, crispy finish.',
    variants: [{ id: 'broast-steam-reg', label: 'Full', price: 1200 }],
  },
  {
    id: 'broast-piece',
    category: 'broast',
    name: 'Broast 1 Piece',
    description: 'Single piece of perfectly broasted chicken.',
    variants: [{ id: 'broast-piece-reg', label: '1 Piece', price: 200 }],
  },

  // ───────────────── SOUP ─────────────────
  {
    id: 'soup-special',
    category: 'soup',
    name: 'Special Soup',
    description: "Chef's special hearty soup with mixed vegetables and tender chicken.",
    variants: [
      { id: 'soup-special-sm', label: 'Small', price: 350 },
      { id: 'soup-special-lg', label: 'Large', price: 700 },
    ],
  },
  {
    id: 'soup-chicken-corn',
    category: 'soup',
    name: 'Chicken Corn Soup',
    description: 'Classic Chinese-style chicken corn soup — thick, comforting, and delicious.',
    variants: [
      { id: 'soup-corn-sm', label: 'Small', price: 300 },
      { id: 'soup-corn-lg', label: 'Large', price: 550 },
    ],
    tags: ['popular'],
  },
  {
    id: 'soup-hot-sour',
    category: 'soup',
    name: 'Hot & Sour Soup',
    description: 'A tangy, hot, and flavourful soup with vegetables and chicken.',
    variants: [
      { id: 'soup-hs-sm', label: 'Small', price: 250 },
      { id: 'soup-hs-lg', label: 'Large', price: 500 },
    ],
    tags: ['spicy'],
  },

  // ───────────────── DRINKS ─────────────────
  {
    id: 'drink-mint-margarita',
    category: 'drinks',
    name: 'Mint Margarita',
    description: 'Refreshing chilled mint drink with lime and sugar.',
    variants: [{ id: 'drink-mm-reg', label: 'Regular', price: 200 }],
    tags: ['popular'],
  },
  {
    id: 'drink-other',
    category: 'drinks',
    name: 'Other Beverages',
    description: 'Ask staff for available cold drinks and beverages.',
    variants: [{ id: 'drink-other-reg', label: 'Regular', price: 0 }],
    needs_review: true,
  },
]

export const FEATURED_PRODUCTS = [
  'pizza-ah-special',
  'burger-lava',
  'wings-bbq',
  'broast-half',
  'pasta-alfredo',
  'roll-behari',
]

export const POPULAR_CATEGORIES = ['pizza', 'burger', 'wings', 'broast']
