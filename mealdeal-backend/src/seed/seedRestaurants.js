import Restaurant from '../models/Restaurant.js';

const defaultRestaurants = [
  {
    name: 'Sunrise Business Hotel',
    slug: 'sunrise-business-hotel',
    cuisine: 'South Indian • Continental',
    address: '12 Residency Road, Bengaluru',
    phone: '+91 8045671234',
    rating: 4.8,
    distance: 2.4,
    deliveryFee: 0,
    minOrder: 0,
    tags: ['Corporate Partner', 'Veg Friendly', 'Bulk Ready'],
    hero: {
      imageUrl: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=1200&q=80',
      gradientFrom: '#0f172a',
      gradientTo: '#1e293b',
    },
    gallery: [
      'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80',
    ],
    menu: [
      {
        name: 'Mini Millet Bowls',
        description: 'Foxtail millet with sautéed vegetables and protein option.',
        price: 120,
        imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        spiceLevel: 'mild',
        tags: ['protein-rich', 'gluten-free'],
      },
      {
        name: 'Heritage Thali',
        description: '12-dish seasonal thali served in compostable trays.',
        price: 180,
        imageUrl: 'https://images.unsplash.com/photo-1608039829574-699dc09c7259?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        spiceLevel: 'medium',
        tags: ['signature', 'bulk'],
      },
    ],
  },
  {
    name: 'Gardenia Plaza Suites',
    slug: 'gardenia-plaza-suites',
    cuisine: 'Pan Asian • Indian',
    address: '55 Ulsoor Road, Bengaluru',
    phone: '+91 8042218899',
    rating: 4.6,
    distance: 3.8,
    tags: ['Halal-friendly', 'Kids menu'],
    hero: {
      imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80',
      gradientFrom: '#0f172a',
      gradientTo: '#312e81',
    },
    gallery: [
      'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1000&q=80',
    ],
    menu: [
      {
        name: 'Steamed Bao Trays',
        description: 'Bao buns with smoked mushroom filling and chilli crunch.',
        price: 150,
        imageUrl: 'https://images.unsplash.com/photo-1508717272800-9fff97da7e8f?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        spiceLevel: 'medium',
        tags: ['asian', 'handheld'],
      },
      {
        name: 'Wellness Bento',
        description: 'Balanced box with stir fry, jasmine rice, crunchy salad.',
        price: 200,
        imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        spiceLevel: 'mild',
        tags: ['low-sodium', 'diet friendly'],
      },
    ],
  },
  {
    name: 'Blue Orchid Residency',
    slug: 'blue-orchid-residency',
    cuisine: 'North Indian • Bakery',
    address: '88 Lavelle Road, Bengaluru',
    phone: '+91 8048762211',
    rating: 4.9,
    distance: 1.9,
    tags: ['Breakfast pro', 'Bakery'],
    hero: {
      imageUrl: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&q=80',
      gradientFrom: '#0a192f',
      gradientTo: '#1f2933',
    },
    gallery: [
      'https://images.unsplash.com/photo-1548940740-204726a19be3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=1000&q=80',
    ],
    menu: [
      {
        name: 'Sunrise Breakfast Box',
        description: 'Multigrain breads, almond butter, seasonal fruits.',
        price: 130,
        imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        spiceLevel: 'mild',
        tags: ['breakfast', 'kids'],
      },
      {
        name: 'Heritage Bread Basket',
        description: '48-hour fermented breads with artisanal spreads.',
        price: 160,
        imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        spiceLevel: 'mild',
        tags: ['bakery', 'vegan options'],
      },
    ],
  },
];

const seedRestaurants = async () => {
  const restaurantCount = await Restaurant.countDocuments();
  if (restaurantCount > 0) {
    return;
  }

  await Restaurant.insertMany(defaultRestaurants);
  console.log('🍽️ Seeded default restaurants');
};

export default seedRestaurants;

