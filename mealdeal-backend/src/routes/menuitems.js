import express from 'express';
import {
  getAllMenuItems,
  getMenuItemsByRestaurant,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
} from '../controllers/menuItemController.js';

const router = express.Router();

// Public routes
router.get('/restaurant/:restaurantId', getMenuItemsByRestaurant);
router.get('/all', getAllMenuItems);
router.get('/:id', getMenuItem);

// Menu item management routes (TODO: Add authentication)
router.post('/', createMenuItem);
router.put('/:id', updateMenuItem);
router.delete('/:id', deleteMenuItem);
router.patch('/:id/toggle-availability', toggleAvailability);

export default router;
