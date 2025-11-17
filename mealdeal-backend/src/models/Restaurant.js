import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    imageUrl: { type: String, default: '' },
    isVeg: { type: Boolean, default: true },
    spiceLevel: { type: String, enum: ['mild', 'medium', 'hot'], default: 'mild' },
    tags: [{ type: String }],
  },
  { _id: false }
);

const RestaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    cuisine: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, default: '' },
    rating: { type: Number, default: 4.5 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    distance: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    minOrder: { type: Number, default: 0 },
    description: { type: String, default: '' },
    tags: [{ type: String }],
    hero: {
      imageUrl: { type: String, default: '' },
      gradientFrom: { type: String, default: '#081c24' },
      gradientTo: { type: String, default: '#0f4d5c' },
    },
    gallery: [{ type: String }],
    menu: [MenuItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Restaurant', RestaurantSchema);

