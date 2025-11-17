import { Router } from 'express';
import { createOrder, getOrderByOrderId } from '../controllers/orderController.js';

const router = Router();

router.post('/', createOrder);
router.get('/:orderId', getOrderByOrderId);

export default router;

