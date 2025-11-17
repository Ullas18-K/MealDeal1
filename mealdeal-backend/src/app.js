import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import restaurantRoutes from './routes/restaurants.js';
import orderRoutes from './routes/orders.js';
import reviewRoutes from './routes/reviews.js';
import menuItemRoutes from './routes/menuitems.js';
import seedData from './seed/seedData.js';

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:19006';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Allow all origins in development
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB & seed defaults
connectDB()
  .then(() => seedData())
  .catch((error) => console.error('✗ Failed to seed data', error.message));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/menuitems', menuItemRoutes);

app.get('/api/health', (req, res) => res.json({ message: 'Server is running' }));

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

app.listen(PORT, () => {
  console.log(`✓ Server running on PORT:${PORT}`);
});