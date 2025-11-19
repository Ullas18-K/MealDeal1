import { nanoid } from 'nanoid';
import Order from '../models/Order.js';
import Restaurant from '../models/Restaurant.js';

const ORDER_PREFIX = 'MD';

const generateOrderId = () => {
  const suffix = nanoid(6).toUpperCase();
  return `${ORDER_PREFIX}-${suffix}`;
};

export const createOrder = async (req, res) => {
  try {
    const { restaurantId, items, customerName, customerPhone, pickupTime, notes } = req.body;

    if (!restaurantId || !items?.length) {
      return res.status(400).json({ message: 'Restaurant and items are required' });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderPayload = {
      orderId: generateOrderId(),
      restaurant: restaurant._id,
      items,
      totalAmount,
      customerName,
      customerPhone,
      pickupTime,
      notes,
    };

    const order = await Order.create(orderPayload);
    res.status(201).json({ order });
  } catch (error) {
    console.error('Error creating order', error);
    res.status(400).json({ message: 'Unable to create order', error: error.message });
  }
};

export const getOrderByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId }).populate('restaurant', 'name cuisine');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Error fetching order', error);
    res.status(500).json({ message: 'Unable to fetch order' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('restaurant', 'name cuisine location')
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error('Error fetching all orders', error);
    res.status(500).json({ message: 'Unable to fetch orders' });
  }
};

export const getOrdersByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const orders = await Order.find({ restaurant: restaurantId })
      .populate('restaurant', 'name cuisine location')
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error('Error fetching restaurant orders', error);
    res.status(500).json({ message: 'Unable to fetch restaurant orders' });
  }
};

export const getOrdersByNGO = async (req, res) => {
  try {
    const { customerName } = req.params;
    const decodedName = decodeURIComponent(customerName);
    
    console.log('Fetching orders for NGO:', decodedName);
    
    // Case-insensitive search for customer name
    const orders = await Order.find({ 
      customerName: { $regex: new RegExp(`^${decodedName}$`, 'i') } 
    })
      .populate('restaurant', 'name cuisine location')
      .sort({ createdAt: -1 });

    console.log(`Found ${orders.length} orders for ${decodedName}`);
    res.json({ orders });
  } catch (error) {
    console.error('Error fetching NGO orders', error);
    res.status(500).json({ message: 'Unable to fetch NGO orders' });
  }
};
