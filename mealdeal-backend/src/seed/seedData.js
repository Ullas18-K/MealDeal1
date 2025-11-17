import mongoose from 'mongoose';
import Restaurant from '../models/Restaurant.js';
import Review from '../models/Review.js';
import MenuItem from '../models/MenuItem.js';

const sampleRestaurants = [
  {
    name: 'Grand Meridian Hotel',
    slug: 'grand-meridian-hotel',
    cuisine: 'Multi-Cuisine • Continental • Indian',
    address: 'MG Road, Bangalore - 560001',
    phone: '+91 80 4567 8901',
    rating: 4.7,
    distance: 2.3,
    description: 'Upscale hotel offering premium buffet services with live counters and international cuisine selections.',
    tags: ['Buffet', 'Fine Dining', 'Veg Options', 'AC'],
    hero: {
      imageUrl: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=1200&q=80',
      gradientFrom: '#081c24',
      gradientTo: '#0f4d5c',
    },
  },
  {
    name: 'Sunrise Business Hotel',
    slug: 'sunrise-business-hotel',
    cuisine: 'South Indian • Continental',
    address: 'Indiranagar, Bangalore - 560038',
    phone: '+91 80 2345 6789',
    rating: 4.8,
    distance: 1.8,
    description: 'Business hotel known for fresh South Indian breakfast and international cuisine.',
    tags: ['Breakfast', 'South Indian', 'Coffee', 'WiFi'],
    hero: {
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      gradientFrom: '#1a1a2e',
      gradientTo: '#16213e',
    },
  },
  {
    name: 'Blue Orchid Residency',
    slug: 'blue-orchid-residency',
    cuisine: 'North Indian • Chinese • Bakery',
    address: 'Koramangala, Bangalore - 560095',
    phone: '+91 80 3456 7890',
    rating: 4.6,
    distance: 3.5,
    description: 'Modern hotel with diverse menu including Indian, Chinese, and fresh bakery items.',
    tags: ['Bakery', 'North Indian', 'Chinese', 'Desserts'],
    hero: {
      imageUrl: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80',
      gradientFrom: '#0f2027',
      gradientTo: '#2c5364',
    },
  },
  {
    name: 'The Royal Palace Hotel',
    slug: 'the-royal-palace-hotel',
    cuisine: 'Mughlai • Tandoor • North Indian',
    address: 'Whitefield, Bangalore - 560066',
    phone: '+91 80 4567 1234',
    rating: 4.9,
    distance: 8.2,
    description: 'Heritage hotel specializing in authentic Mughlai cuisine and tandoor specialties.',
    tags: ['Mughlai', 'Tandoor', 'Luxury', 'Heritage'],
    hero: {
      imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
      gradientFrom: '#4b1248',
      gradientTo: '#f0c27b',
    },
  },
  {
    name: 'Green Leaf Garden Restaurant',
    slug: 'green-leaf-garden-restaurant',
    cuisine: 'Pure Veg • Healthy • Organic',
    address: 'HSR Layout, Bangalore - 560102',
    phone: '+91 80 5678 9012',
    rating: 4.5,
    distance: 2.8,
    description: 'Health-conscious restaurant offering organic and farm-fresh vegetarian meals.',
    tags: ['Pure Veg', 'Organic', 'Healthy', 'Salads'],
    hero: {
      imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80',
      gradientFrom: '#134e5e',
      gradientTo: '#71b280',
    },
  },
];

// Menu items data for each restaurant
const restaurantMenuItems = {
  'Grand Meridian Hotel': [
    {
      name: 'Premium Veg Thali',
      description: 'Complete meal with 4 curries, rice, roti, salad, and dessert',
      price: 180,
      isVeg: true,
      spiceLevel: 'medium',
      category: 'Main Course',
      tags: ['Thali', 'Popular'],
      quantity: 50,
      prepTime: 25,
      imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Butter Chicken with Naan',
      description: 'Rich and creamy butter chicken served with butter naan',
      price: 220,
      isVeg: false,
      spiceLevel: 'mild',
      category: 'Main Course',
      tags: ['North Indian', 'Bestseller'],
      quantity: 40,
      prepTime: 30,
      imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Paneer Tikka Masala',
      description: 'Grilled cottage cheese in rich tomato gravy',
      price: 190,
      isVeg: true,
      spiceLevel: 'medium',
      category: 'Main Course',
      tags: ['Paneer', 'Popular'],
      quantity: 35,
      prepTime: 25,
      imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Biryani (Veg/Chicken)',
      description: 'Aromatic basmati rice with spices and your choice of protein',
      price: 210,
      isVeg: false,
      spiceLevel: 'hot',
      category: 'Rice',
      tags: ['Biryani', 'Signature'],
      quantity: 30,
      prepTime: 35,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Pasta Alfredo',
      description: 'Creamy white sauce pasta with vegetables',
      price: 170,
      isVeg: true,
      spiceLevel: 'mild',
      category: 'Continental',
      tags: ['Italian', 'Continental'],
      quantity: 25,
      prepTime: 20,
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80',
    },
  ],
  'Sunrise Business Hotel': [
    {
      name: 'Masala Dosa',
      description: 'Crispy rice crepe with spiced potato filling, served with sambar and chutney',
      price: 80,
      isVeg: true,
      spiceLevel: 'medium',
      category: 'Breakfast',
      tags: ['South Indian', 'Breakfast'],
      quantity: 60,
      prepTime: 15,
      imageUrl: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Idli Vada Combo',
      description: '3 soft idlis and 1 vada with sambar and chutneys',
      price: 70,
      isVeg: true,
      spiceLevel: 'mild',
      category: 'Breakfast',
      tags: ['South Indian', 'Healthy'],
      quantity: 50,
      prepTime: 10,
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Filter Coffee',
      description: 'Traditional South Indian filter coffee',
      price: 40,
      isVeg: true,
      spiceLevel: 'mild',
      category: 'Beverages',
      tags: ['Beverage', 'Must Try'],
      quantity: 100,
      prepTime: 5,
      imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Rava Upma',
      description: 'Semolina cooked with vegetables and spices',
      price: 60,
      isVeg: true,
      spiceLevel: 'medium',
      category: 'Breakfast',
      tags: ['Breakfast', 'Light'],
      quantity: 40,
      prepTime: 12,
      imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Continental Breakfast Platter',
      description: 'Toast, eggs, sausage, hash browns, and fruits',
      price: 250,
      isVeg: false,
      spiceLevel: 'mild',
      category: 'Breakfast',
      tags: ['Continental', 'Breakfast'],
      quantity: 20,
      prepTime: 20,
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    },
  ],
  'Blue Orchid Residency': [
    {
      name: 'Dal Makhani with Roti',
      description: 'Creamy black lentils with butter roti',
      price: 160,
      isVeg: true,
      spiceLevel: 'mild',
      category: 'Main Course',
      tags: ['North Indian', 'Comfort Food'],
      quantity: 45,
      prepTime: 25,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Veg Hakka Noodles',
      description: 'Stir-fried noodles with mixed vegetables',
      price: 140,
      isVeg: true,
      spiceLevel: 'medium',
      category: 'Chinese',
      tags: ['Chinese', 'Popular'],
      quantity: 35,
      prepTime: 18,
      imageUrl: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Chicken Manchurian',
      description: 'Crispy chicken in spicy Indo-Chinese sauce',
      price: 190,
      isVeg: false,
      spiceLevel: 'hot',
      category: 'Chinese',
      tags: ['Chinese', 'Spicy'],
      quantity: 30,
      prepTime: 22,
      imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Chocolate Truffle Cake (Slice)',
      description: 'Rich chocolate cake with chocolate ganache',
      price: 100,
      isVeg: true,
      spiceLevel: 'mild',
      category: 'Dessert',
      tags: ['Dessert', 'Bakery'],
      quantity: 25,
      prepTime: 5,
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Garlic Bread',
      description: 'Toasted bread with garlic butter and herbs',
      price: 90,
      isVeg: true,
      spiceLevel: 'mild',
      category: 'Starters',
      tags: ['Starter', 'Italian'],
      quantity: 40,
      prepTime: 10,
      imageUrl: 'https://images.unsplash.com/photo-1573140401552-7df8feb1c2f4?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Paneer Fried Rice',
      description: 'Fried rice with paneer cubes and vegetables',
      price: 150,
      isVeg: true,
      spiceLevel: 'medium',
      category: 'Rice',
      tags: ['Chinese', 'Rice'],
      quantity: 38,
      prepTime: 20,
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
    },
  ],
  'The Royal Palace Hotel': [
    {
      name: 'Tandoori Chicken (Half)',
      description: 'Marinated chicken cooked in traditional tandoor',
      price: 280,
      isVeg: false,
      spiceLevel: 'medium',
      category: 'Tandoor',
      tags: ['Tandoor', 'Signature'],
      quantity: 25,
      prepTime: 40,
      imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Paneer Tikka',
      description: 'Marinated cottage cheese grilled to perfection',
      price: 200,
      isVeg: true,
      spiceLevel: 'medium',
      category: 'Starters',
      tags: ['Tandoor', 'Starter'],
      quantity: 30,
      prepTime: 25,
      imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Mutton Rogan Josh',
      description: 'Aromatic mutton curry in rich Kashmiri spices',
      price: 320,
      isVeg: false,
      spiceLevel: 'hot',
      category: 'Main Course',
      tags: ['Mughlai', 'Premium'],
      quantity: 15,
      prepTime: 45,
      imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Veg Biryani',
      description: 'Fragrant basmati rice with vegetables and spices',
      price: 180,
      isVeg: true,
      spiceLevel: 'medium',
      category: 'Rice',
      tags: ['Biryani', 'Rice'],
      quantity: 35,
      prepTime: 30,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Naan Basket',
      description: 'Assorted naans - butter, garlic, and plain',
      price: 120,
      isVeg: true,
      spiceLevel: 'mild',
      category: 'Breads',
      tags: ['Bread', 'Side'],
      quantity: 50,
      prepTime: 15,
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    },
  ],
  'Green Leaf Garden Restaurant': [
    {
      name: 'Green Salad Bowl',
      description: 'Fresh mixed greens with olive oil dressing',
      price: 120,
      isVeg: true,
      spiceLevel: 'mild',
      category: 'Salads',
      tags: ['Salad', 'Healthy'],
      quantity: 30,
      prepTime: 10,
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Quinoa Buddha Bowl',
      description: 'Quinoa with roasted vegetables and tahini',
      price: 220,
      isVeg: true,
      spiceLevel: 'mild',
      category: 'Main Course',
      tags: ['Healthy', 'Superfood'],
      quantity: 25,
      prepTime: 20,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Multigrain Roti Meal',
      description: 'Multigrain rotis with dal and vegetables',
      price: 150,
      isVeg: true,
      spiceLevel: 'medium',
      category: 'Main Course',
      tags: ['Healthy', 'Thali'],
      quantity: 40,
      prepTime: 22,
      imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Vegetable Stir Fry',
      description: 'Mixed vegetables in light seasoning',
      price: 140,
      isVeg: true,
      spiceLevel: 'mild',
      category: 'Main Course',
      tags: ['Healthy', 'Light'],
      quantity: 35,
      prepTime: 15,
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Fresh Fruit Platter',
      description: 'Seasonal fruits with honey drizzle',
      price: 100,
      isVeg: true,
      spiceLevel: 'mild',
      category: 'Dessert',
      tags: ['Dessert', 'Healthy'],
      quantity: 20,
      prepTime: 8,
      imageUrl: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Brown Rice Khichdi',
      description: 'Nutritious rice and lentil porridge',
      price: 110,
      isVeg: true,
      spiceLevel: 'mild',
      category: 'Main Course',
      tags: ['Comfort', 'Healthy'],
      quantity: 30,
      prepTime: 25,
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a0b3b7ef1143?auto=format&fit=crop&w=600&q=80',
    },
  ],
};

const sampleReviews = [
  {
    userName: 'Rajesh Kumar',
    rating: 5,
    comment: 'Excellent food quality and portions were very generous. The staff was courteous and helpful. Highly recommend for bulk orders!',
  },
  {
    userName: 'Priya Sharma',
    rating: 4,
    comment: 'Good variety in the menu. Food was fresh and well-packed. Delivery was on time.',
  },
  {
    userName: 'Mohammed Ali',
    rating: 5,
    comment: 'Amazing taste and hygiene standards. We ordered for 50 people and everyone loved it!',
  },
  {
    userName: 'Sneha Patel',
    rating: 4,
    comment: 'Great service and quality food. The spice level was perfect. Will order again.',
  },
  {
    userName: 'Arun Reddy',
    rating: 5,
    comment: 'Consistently good quality. We have been regular customers for 6 months now.',
  },
  {
    userName: 'Lakshmi Iyer',
    rating: 4,
    comment: 'Very authentic flavors. Packaging could be improved but food was excellent.',
  },
  {
    userName: 'Vikram Singh',
    rating: 5,
    comment: 'Best hotel for bulk catering in Bangalore! Professional service and delicious food.',
  },
  {
    userName: 'Anjali Menon',
    rating: 5,
    comment: 'Fresh ingredients and great presentation. Perfect for our NGO events.',
  },
  {
    userName: 'Karthik Gowda',
    rating: 4,
    comment: 'Good value for money. Quality is maintained even for large orders.',
  },
  {
    userName: 'Divya Nair',
    rating: 5,
    comment: 'Excellent coordination and timely delivery. Food was still warm when it reached us.',
  },
];

async function seedData() {
  try {
    console.log('🌱 Starting to seed restaurant data...');

    // Clear existing data
    await Restaurant.deleteMany({});
    await Review.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('✓ Cleared existing data');

    // Insert restaurants
    const restaurants = await Restaurant.insertMany(sampleRestaurants);
    console.log(`✓ Inserted ${restaurants.length} restaurants`);

    // Insert menu items for each restaurant
    let totalMenuItems = 0;
    for (const restaurant of restaurants) {
      const menuItemsData = restaurantMenuItems[restaurant.name];
      if (menuItemsData) {
        const menuItemsWithRestaurantId = menuItemsData.map(item => ({
          ...item,
          restaurantId: restaurant._id,
        }));
        await MenuItem.insertMany(menuItemsWithRestaurantId);
        totalMenuItems += menuItemsWithRestaurantId.length;
      }
    }
    console.log(`✓ Inserted ${totalMenuItems} menu items`);

    // Add reviews for each restaurant
    let totalReviews = 0;
    for (const restaurant of restaurants) {
      // Add 3-5 reviews per restaurant
      const numReviews = Math.floor(Math.random() * 3) + 3;
      const restaurantReviews = [];

      for (let i = 0; i < numReviews; i++) {
        const review = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
        restaurantReviews.push({
          restaurantId: restaurant._id,
          userId: `user-${Date.now()}-${i}`,
          userName: review.userName,
          rating: review.rating,
          comment: review.comment,
          helpful: Math.floor(Math.random() * 10),
        });
      }

      await Review.insertMany(restaurantReviews);
      totalReviews += restaurantReviews.length;

      // Update restaurant rating
      const avgRating =
        restaurantReviews.reduce((sum, r) => sum + r.rating, 0) / restaurantReviews.length;
      await Restaurant.findByIdAndUpdate(restaurant._id, {
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: restaurantReviews.length,
      });
    }

    console.log(`✓ Inserted ${totalReviews} reviews`);
    console.log('✨ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

export default seedData;
