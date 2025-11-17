import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mealdeal-dev';
    await mongoose.connect(mongoUri, {
      // mongoose options are fine without properties that ESM complains about
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('✗ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

export default connectDB;