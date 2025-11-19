import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    notes: { type: String },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    pickupTime: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'pending',
    },
    acceptedBy: { type: String }, // NGO name who accepted the order
    acceptedAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Order', OrderSchema);

