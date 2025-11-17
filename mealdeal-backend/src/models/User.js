import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    avatar: { type: String, default: null },
    role: { 
      type: String, 
      enum: ['donor', 'ngo'], 
      required: true,
      lowercase: true 
    },
    refreshToken: { type: String, default: null }
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

export default User;