import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    spiceLevel: {
      type: String,
      enum: ['mild', 'medium', 'hot'],
      default: 'mild',
    },
    category: {
      type: String,
      default: 'Main Course',
    },
    tags: [{ type: String }],
    available: {
      type: Boolean,
      default: true,
    },
    quantity: {
      type: String,
      default: '',
    },
    prepTime: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
menuItemSchema.index({ restaurantId: 1, available: 1 });

export default mongoose.model('MenuItem', menuItemSchema);
