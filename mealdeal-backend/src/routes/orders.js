import { Router } from 'express';
import { 
  createOrder, 
  getOrderByOrderId, 
  getAllOrders, 
  getOrdersByRestaurant,
  getOrdersByNGO 
} from '../controllers/orderController.js';

const router = Router();

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/restaurant/:restaurantId', getOrdersByRestaurant);
router.get('/ngo/:customerName', getOrdersByNGO);
router.get('/:orderId', getOrderByOrderId);

export default router;

