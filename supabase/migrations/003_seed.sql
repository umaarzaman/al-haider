-- ============================================================
-- AL HAIDER FAST FOOD — Seed Data
-- Migration: 003_seed.sql
-- ============================================================
-- NOTE: Items marked with needs_review = true have unclear
-- prices from the menu photograph. Please verify in the
-- admin dashboard before going live.
-- ============================================================

-- ──────────────────────────────────────
-- CATEGORIES
-- ──────────────────────────────────────
insert into categories (id, name, slug, icon, display_order) values
  ('pizza',    'Pizza',          'pizza',     '🍕', 1),
  ('burger',   'Burgers',        'burger',    '🍔', 2),
  ('fries',    'Fries & Momos',  'fries',     '🍟', 3),
  ('sandwich', 'Sandwich',       'sandwich',  '🥪', 4),
  ('wings',    'Wings & Nuggets','wings',     '🍗', 5),
  ('pasta',    'Pasta',          'pasta',     '🍝', 6),
  ('wrap',     'Wraps & Rolls',  'wrap',      '🌯', 7),
  ('broast',   'Broast',         'broast',    '🍖', 8),
  ('soup',     'Soup',           'soup',      '🍲', 9),
  ('drinks',   'Cold Drinks',    'drinks',    '🥤', 10)
on conflict (id) do nothing;

-- ──────────────────────────────────────
-- PRODUCTS + VARIANTS (pizza)
-- ──────────────────────────────────────
insert into products (id, category_id, name, slug, description, tags) values
  ('pizza-ah-special',    'pizza', 'AH Special Pizza',    'ah-special-pizza',    'Al Haider''s signature pizza loaded with premium toppings.', array['bestseller']),
  ('pizza-kabab-crust',   'pizza', 'Kabab Crust Pizza',   'kabab-crust-pizza',   'Juicy kabab stuffed into the crust with fresh vegetables.', '{}'),
  ('pizza-crown-crust',   'pizza', 'Crown Crust Pizza',   'crown-crust-pizza',   'Royal crown-style stuffed crust with rich toppings.', '{}'),
  ('pizza-turkish',       'pizza', 'Turkish Pizza',       'turkish-pizza',       'Turkish-style flatbread pizza with seasoned meat and herbs.', '{}'),
  ('pizza-cheese-lover',  'pizza', 'Cheese Lover Pizza',  'cheese-lover-pizza',  'Loaded with multiple cheese varieties on every slice.', array['popular']),
  ('pizza-chicken-bbq',   'pizza', 'Chicken BBQ Pizza',   'chicken-bbq-pizza',   'Smoky BBQ sauce with grilled chicken and caramelised onions.', array['popular']),
  ('pizza-chicken-fajita','pizza', 'Chicken Fajita Pizza','chicken-fajita-pizza', 'Marinated fajita chicken, bell peppers, and jalapeños.', array['spicy']),
  ('pizza-calzone',       'pizza', 'Calzone',             'calzone',             'Folded Italian-style pizza with chicken, cheese, and vegetables.', '{}'),
  ('pizza-creamy-melt',   'pizza', 'Creamy Melt Pizza',   'creamy-melt-pizza',   'Rich cream sauce with mozzarella and premium toppings.', '{}'),
  ('pizza-paproni',       'pizza', 'Paproni Pizza',       'paproni-pizza',       'Generously loaded with paproni on classic tomato base.', '{}'),
  ('pizza-vegetable',     'pizza', 'Vegetable Pizza',     'vegetable-pizza',     'Fresh garden vegetables on tomato sauce and mozzarella.', '{}'),
  ('pizza-chicken-supreme','pizza','Chicken Supreme Pizza','chicken-supreme-pizza','Supreme chicken, mushrooms, peppers, and olives.', array['popular']),
  ('pizza-chicken-lover', 'pizza', 'Chicken Lover Pizza', 'chicken-lover-pizza', 'Double chicken for protein lovers.', '{}'),
  ('pizza-hot-spicy',     'pizza', 'Hot & Spicy Pizza',   'hot-spicy-pizza',     'Fiery chilli chicken, jalapeños, and hot sauce.', array['spicy']),
  ('pizza-family-special','pizza', 'Family Special Pizza','family-special-pizza','XL family feast with premium mixed toppings.', array['family'])
on conflict (id) do nothing;

-- Pizza variants
insert into product_variants (id, product_id, label, price, is_default, sort_order) values
  ('pizza-ah-special-sm',     'pizza-ah-special',     'Small',  650,  false, 0),
  ('pizza-ah-special-md',     'pizza-ah-special',     'Medium', 1200, true,  1),
  ('pizza-ah-special-lg',     'pizza-ah-special',     'Large',  1650, false, 2),
  ('pizza-kabab-sm',          'pizza-kabab-crust',    'Small',  550,  false, 0),
  ('pizza-kabab-md',          'pizza-kabab-crust',    'Medium', 1100, true,  1),
  ('pizza-kabab-lg',          'pizza-kabab-crust',    'Large',  1550, false, 2),
  ('pizza-crown-sm',          'pizza-crown-crust',    'Small',  500,  false, 0),
  ('pizza-crown-md',          'pizza-crown-crust',    'Medium', 1200, true,  1),
  ('pizza-crown-lg',          'pizza-crown-crust',    'Large',  1600, false, 2),
  ('pizza-turkish-sm',        'pizza-turkish',        'Small',  500,  false, 0),
  ('pizza-turkish-md',        'pizza-turkish',        'Medium', 1000, true,  1),
  ('pizza-turkish-lg',        'pizza-turkish',        'Large',  1500, false, 2),
  ('pizza-cheese-sm',         'pizza-cheese-lover',   'Small',  600,  false, 0),
  ('pizza-cheese-md',         'pizza-cheese-lover',   'Medium', 1000, true,  1),
  ('pizza-cheese-lg',         'pizza-cheese-lover',   'Large',  1300, false, 2),
  ('pizza-bbq-sm',            'pizza-chicken-bbq',    'Small',  550,  false, 0),
  ('pizza-bbq-md',            'pizza-chicken-bbq',    'Medium', 1100, true,  1),
  ('pizza-bbq-lg',            'pizza-chicken-bbq',    'Large',  1500, false, 2),
  ('pizza-fajita-sm',         'pizza-chicken-fajita', 'Small',  600,  false, 0),
  ('pizza-fajita-md',         'pizza-chicken-fajita', 'Medium', 1100, true,  1),
  ('pizza-fajita-lg',         'pizza-chicken-fajita', 'Large',  1500, false, 2),
  ('pizza-calzone-sm',        'pizza-calzone',        'Small',  600,  false, 0),
  ('pizza-calzone-md',        'pizza-calzone',        'Medium', 1000, true,  1),
  ('pizza-calzone-lg',        'pizza-calzone',        'Large',  1500, false, 2),
  ('pizza-creamy-sm',         'pizza-creamy-melt',    'Small',  600,  false, 0),
  ('pizza-creamy-md',         'pizza-creamy-melt',    'Medium', 1300, true,  1),
  ('pizza-paproni-sm',        'pizza-paproni',        'Small',  500,  false, 0),
  ('pizza-paproni-md',        'pizza-paproni',        'Medium', 1000, true,  1),
  ('pizza-paproni-lg',        'pizza-paproni',        'Large',  1300, false, 2),
  ('pizza-veg-sm',            'pizza-vegetable',      'Small',  550,  false, 0),
  ('pizza-veg-md',            'pizza-vegetable',      'Medium', 1000, true,  1),
  ('pizza-veg-lg',            'pizza-vegetable',      'Large',  1500, false, 2),
  ('pizza-supreme-sm',        'pizza-chicken-supreme','Small',  500,  false, 0),
  ('pizza-supreme-md',        'pizza-chicken-supreme','Medium', 1000, true,  1),
  ('pizza-supreme-lg',        'pizza-chicken-supreme','Large',  1300, false, 2),
  ('pizza-clover-sm',         'pizza-chicken-lover',  'Small',  600,  false, 0),
  ('pizza-clover-md',         'pizza-chicken-lover',  'Medium', 1300, true,  1),
  ('pizza-hot-sm',            'pizza-hot-spicy',      'Small',  550,  false, 0),
  ('pizza-hot-md',            'pizza-hot-spicy',      'Medium', 1500, true,  1),
  ('pizza-family-sm',         'pizza-family-special', 'Small',  500,  false, 0),
  ('pizza-family-md',         'pizza-family-special', 'Medium', 1300, true,  1),
  ('pizza-family-xl',         'pizza-family-special', 'XL',     2000, false, 2)
on conflict (id) do nothing;

-- Burgers
insert into products (id, category_id, name, slug, description, tags) values
  ('burger-zinger',        'burger', 'Zinger Burger',        'zinger-burger',        'Crispy fried chicken fillet with lettuce, mayo, and special sauce.', array['bestseller']),
  ('burger-zinger-special','burger', 'Zinger Special Burger','zinger-special-burger', 'Upgraded zinger with extra toppings, cheese, and AH special sauce.', array['popular']),
  ('burger-double-decker', 'burger', 'Double Decker Burger', 'double-decker-burger',  'Two layers of crispy chicken with lettuce, tomato, and creamy sauce.', '{}'),
  ('burger-tower',         'burger', 'Tower Burger',         'tower-burger',          'A towering stack of chicken, cheese, veggies, and signature sauces.', array['popular']),
  ('burger-patty',         'burger', 'Patty Burger',         'patty-burger',          'Classic grilled chicken patty with fresh vegetables and mayo.', '{}'),
  ('burger-crunchy',       'burger', 'Crunchy Burger',       'crunchy-burger',        'Extra-crispy coated chicken with crunchy slaw and chipotle sauce.', '{}'),
  ('burger-beef-patty',    'burger', 'Beef Patty Burger',    'beef-patty-burger',     'Juicy beef patty with caramelised onions, pickles, mustard, and ketchup.', '{}'),
  ('burger-lava',          'burger', 'Lava Burger',          'lava-burger',           'Oozing molten cheese inside a premium chicken fillet.', array['premium','popular'])
on conflict (id) do nothing;

insert into product_variants (id, product_id, label, price, is_default, sort_order) values
  ('burger-zinger-reg',         'burger-zinger',         'Regular', 350, true, 0),
  ('burger-zinger-special-reg', 'burger-zinger-special', 'Regular', 450, true, 0),
  ('burger-dd-reg',             'burger-double-decker',  'Regular', 350, true, 0),
  ('burger-tower-reg',          'burger-tower',          'Regular', 500, true, 0),
  ('burger-patty-reg',          'burger-patty',          'Regular', 300, true, 0),
  ('burger-crunchy-reg',        'burger-crunchy',        'Regular', 350, true, 0),
  ('burger-beef-reg',           'burger-beef-patty',     'Regular', 350, true, 0),
  ('burger-lava-reg',           'burger-lava',           'Regular', 700, true, 0)
on conflict (id) do nothing;

-- Fries & Momos
insert into products (id, category_id, name, slug, description, tags) values
  ('fries-loaded',  'fries', 'Loaded Fries',  'loaded-fries',  'Crispy fries smothered with cheese sauce, chicken, and jalapeños.', array['popular']),
  ('fries-pizza',   'fries', 'Pizza Fries',   'pizza-fries',   'Fries topped with pizza sauce and mozzarella.', '{}'),
  ('fries-regular', 'fries', 'Regular Fries', 'regular-fries', 'Golden, lightly salted classic fries.', '{}'),
  ('fries-large',   'fries', 'Large Fries',   'large-fries',   'A larger portion of our golden classic fries.', '{}'),
  ('momos',         'fries', 'Momos',         'momos',         'Steamed/fried dumplings filled with spiced chicken.', '{}')
on conflict (id) do nothing;

insert into product_variants (id, product_id, label, price, is_default, sort_order) values
  ('fries-loaded-reg',  'fries-loaded',  'Regular', 800, true, 0),
  ('fries-pizza-reg',   'fries-pizza',   'Regular', 350, true, 0),
  ('fries-regular-reg', 'fries-regular', 'Regular', 250, true, 0),
  ('fries-large-reg',   'fries-large',   'Large',   400, true, 0),
  ('momos-6',           'momos',         '6 Pieces',250, true, 0),
  ('momos-12',          'momos',         '12 Pieces',500, false, 1)
on conflict (id) do nothing;

-- Sandwich
insert into products (id, category_id, name, slug, description, tags) values
  ('sandwich-cheesy',      'sandwich', 'Cheesy Sandwich', 'cheesy-sandwich', 'Grilled chicken and cheese in toasted bread with special sauce.', array['popular']),
  ('sandwich-cheesy-stick','sandwich', 'Cheesy Sticks',   'cheesy-sticks',   'Crispy golden mozzarella-filled sticks with marinara sauce.', '{}')
on conflict (id) do nothing;

insert into product_variants (id, product_id, label, price, is_default, sort_order) values
  ('sandwich-cheesy-reg', 'sandwich-cheesy',       'Regular', 700,  true, 0),
  ('sandwich-stick-reg',  'sandwich-cheesy-stick', 'Regular', 1200, true, 0)
on conflict (id) do nothing;

-- Wings & Nuggets
insert into products (id, category_id, name, slug, description, tags) values
  ('wings-hot',      'wings', 'Hot Wings',       'hot-wings',       'Classic crispy wings in fiery hot sauce.', array['spicy']),
  ('wings-bbq',      'wings', 'BBQ Wings',       'bbq-wings',       'Smoky, sticky BBQ glazed wings.', array['bestseller']),
  ('wings-buffalo',  'wings', 'Buffalo Wings',   'buffalo-wings',   'Tangy and spicy classic Buffalo-style wings.', array['spicy']),
  ('wings-peri-peri','wings', 'Peri Peri Wings', 'peri-peri-wings', 'Portuguese Peri Peri spiced wings — bold and smoky.', array['spicy']),
  ('nuggets',        'wings', 'Chicken Nuggets', 'chicken-nuggets', 'Crispy golden nuggets with dipping sauce.', array['popular'])
on conflict (id) do nothing;

insert into product_variants (id, product_id, label, price, is_default, sort_order) values
  ('wings-hot-5',    'wings-hot',       '5 Pieces',  300, true,  0),
  ('wings-hot-10',   'wings-hot',       '10 Pieces', 600, false, 1),
  ('wings-bbq-5',    'wings-bbq',       '5 Pieces',  350, true,  0),
  ('wings-bbq-10',   'wings-bbq',       '10 Pieces', 700, false, 1),
  ('wings-buffalo-5','wings-buffalo',   '5 Pieces',  350, true,  0),
  ('wings-buffalo-10','wings-buffalo',  '10 Pieces', 700, false, 1),
  ('wings-pp-5',     'wings-peri-peri', '5 Pieces',  300, true,  0),
  ('wings-pp-10',    'wings-peri-peri', '10 Pieces', 650, false, 1),
  ('nuggets-5',      'nuggets',         '5 Pieces',  300, true,  0),
  ('nuggets-10',     'nuggets',         '10 Pieces', 500, false, 1)
on conflict (id) do nothing;

-- Pasta
insert into products (id, category_id, name, slug, description, tags) values
  ('pasta-alfredo', 'pasta', 'Alfredo Pasta',  'alfredo-pasta',  'Creamy Alfredo sauce with pasta and grilled chicken.', array['popular']),
  ('pasta-crunchy', 'pasta', 'Crunchy Pasta',  'crunchy-pasta',  'Crispy topped pasta bake with rich sauce and breadcrumbs.', '{}')
on conflict (id) do nothing;

insert into product_variants (id, product_id, label, price, is_default, sort_order) values
  ('pasta-alfredo-reg', 'pasta-alfredo', 'Regular', 700, true, 0),
  ('pasta-crunchy-reg', 'pasta-crunchy', 'Regular', 750, true, 0)
on conflict (id) do nothing;

-- Wraps & Rolls
insert into products (id, category_id, name, slug, description, tags) values
  ('wrap-zinger',   'wrap', 'Zinger Wrap',   'zinger-wrap',   'Crispy zinger fillet in soft tortilla with slaw and sauces.', array['popular']),
  ('wrap-chicken',  'wrap', 'Chicken Wrap',  'chicken-wrap',  'Grilled chicken with salad, cheese, and garlic mayo.', '{}'),
  ('roll-turkish',  'wrap', 'Turkish Roll',  'turkish-roll',  'Turkish-seasoned chicken in flatbread with onions and sauces.', '{}'),
  ('roll-jumbo',    'wrap', 'Jumbo Roll',    'jumbo-roll',    'Oversized roll with chicken, fries, cheese, and special sauce.', '{}'),
  ('roll-behari',   'wrap', 'Behari Roll',   'behari-roll',   'Marinated Behari-style chicken in soft paratha with chutney.', array['popular']),
  ('roll-arabic',   'wrap', 'Arabic Roll',   'arabic-roll',   'Arabic-style shawarma roll with garlic sauce and pickles.', '{}')
on conflict (id) do nothing;

insert into product_variants (id, product_id, label, price, is_default, sort_order) values
  ('wrap-zinger-reg',  'wrap-zinger',  'Regular', 380, true, 0),
  ('wrap-chicken-reg', 'wrap-chicken', 'Regular', 450, true, 0),
  ('roll-turkish-reg', 'roll-turkish', 'Regular', 400, true, 0),
  ('roll-jumbo-reg',   'roll-jumbo',   'Regular', 500, true, 0),
  ('roll-behari-reg',  'roll-behari',  'Regular', 650, true, 0),
  ('roll-arabic-reg',  'roll-arabic',  'Regular', 650, true, 0)
on conflict (id) do nothing;

-- Broast
insert into products (id, category_id, name, slug, description, tags) values
  ('broast-full',  'broast', 'Full Broast',    'full-broast',    'Whole broasted chicken. Serves 3–4.', array['family']),
  ('broast-half',  'broast', 'Half Broast',    'half-broast',    'Half broasted chicken. Perfect for two.', array['popular']),
  ('broast-steam', 'broast', 'Steam Broast',   'steam-broast',   'Steamed then broasted for extra juiciness.', '{}'),
  ('broast-piece', 'broast', 'Broast 1 Piece', 'broast-1-piece', 'Single piece of perfectly broasted chicken.', '{}')
on conflict (id) do nothing;

insert into product_variants (id, product_id, label, price, is_default, sort_order) values
  ('broast-full-reg',  'broast-full',  'Full',    1450, true, 0),
  ('broast-half-reg',  'broast-half',  'Half',    750,  true, 0),
  ('broast-steam-reg', 'broast-steam', 'Full',    1200, true, 0),
  ('broast-piece-reg', 'broast-piece', '1 Piece', 200,  true, 0)
on conflict (id) do nothing;

-- Soup
insert into products (id, category_id, name, slug, description, tags) values
  ('soup-special',      'soup', 'Special Soup',        'special-soup',        'Chef''s special soup with mixed vegetables and chicken.', '{}'),
  ('soup-chicken-corn', 'soup', 'Chicken Corn Soup',   'chicken-corn-soup',   'Classic Chinese-style chicken corn soup.', array['popular']),
  ('soup-hot-sour',     'soup', 'Hot & Sour Soup',     'hot-sour-soup',       'Tangy, hot, and flavourful soup with vegetables and chicken.', array['spicy'])
on conflict (id) do nothing;

insert into product_variants (id, product_id, label, price, is_default, sort_order) values
  ('soup-special-sm', 'soup-special',      'Small', 350, true,  0),
  ('soup-special-lg', 'soup-special',      'Large', 700, false, 1),
  ('soup-corn-sm',    'soup-chicken-corn', 'Small', 300, true,  0),
  ('soup-corn-lg',    'soup-chicken-corn', 'Large', 550, false, 1),
  ('soup-hs-sm',      'soup-hot-sour',     'Small', 250, true,  0),
  ('soup-hs-lg',      'soup-hot-sour',     'Large', 500, false, 1)
on conflict (id) do nothing;

-- Drinks
insert into products (id, category_id, name, slug, description, tags, needs_review) values
  ('drink-mint-margarita', 'drinks', 'Mint Margarita',    'mint-margarita',    'Refreshing chilled mint drink with lime and sugar.', array['popular'], false),
  ('drink-other',          'drinks', 'Other Beverages',   'other-beverages',   'Ask staff for available cold drinks and beverages.', '{}', true)
on conflict (id) do nothing;

insert into product_variants (id, product_id, label, price, is_default, sort_order) values
  ('drink-mm-reg',    'drink-mint-margarita', 'Regular', 200, true, 0),
  ('drink-other-reg', 'drink-other',          'Regular', 0,   true, 0)
on conflict (id) do nothing;

-- Mark needs_review products
update products set needs_review = true
where id in ('pizza-calzone','pizza-creamy-melt','pizza-chicken-lover','pizza-hot-spicy');
