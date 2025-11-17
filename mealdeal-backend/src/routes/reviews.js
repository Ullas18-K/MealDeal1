import express from 'express';
import * as reviewController from '../controllers/reviewController.js';

const router = express.Router();

// Create a new review
router.post('/', reviewController.createReview);

// Get reviews for a specific restaurant
router.get('/restaurant/:restaurantId', reviewController.getRestaurantReviews);

// Update a review
router.put('/:reviewId', reviewController.updateReview);

// Delete a review
router.delete('/:reviewId', reviewController.deleteReview);

// Mark review as helpful
router.post('/:reviewId/helpful', reviewController.markReviewHelpful);

export default router;
