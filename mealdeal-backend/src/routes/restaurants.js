import { Router } from 'express';
import {
  createRestaurant,
  getRestaurantById,
  getRestaurants,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/restaurantController.js';

const router = Router();

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', createRestaurant);

// Menu item management
router.post('/:id/menu', addMenuItem);
router.put('/:id/menu/:itemIndex', updateMenuItem);
router.delete('/:id/menu/:itemIndex', deleteMenuItem);

export default router;

