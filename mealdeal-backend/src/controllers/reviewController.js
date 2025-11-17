import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';
import mongoose from 'mongoose';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { restaurantId, userId, userName, orderId, rating, comment } = req.body;

    // Validate required fields
    if (!restaurantId || !userId || !userName || !rating) {
      return res.status(400).json({
        message: 'Missing required fields: restaurantId, userId, userName, and rating are required',
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Rating must be between 1 and 5',
      });
    }

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        message: 'Restaurant not found',
      });
    }

    // Create the review
    const review = new Review({
      restaurantId,
      userId,
      userName,
      orderId,
      rating,
      comment,
    });

    await review.save();

    // Update restaurant average rating
    await updateRestaurantRating(restaurantId);

    res.status(201).json({
      message: 'Review created successfully',
      review,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      message: 'Failed to create review',
      error: error.message,
    });
  }
};

// Get reviews for a specific restaurant
export const getRestaurantReviews = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { page = 1, limit = 10, sort = 'newest' } = req.query;

    // Validate restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        message: 'Restaurant not found',
      });
    }

    // Determine sort order
    let sortOption = { createdAt: -1 }; // newest first
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'highest') {
      sortOption = { rating: -1, createdAt: -1 };
    } else if (sort === 'lowest') {
      sortOption = { rating: 1, createdAt: -1 };
    } else if (sort === 'helpful') {
      sortOption = { helpful: -1, createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ restaurantId })
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const totalReviews = await Review.countDocuments({ restaurantId });

    // Calculate rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { restaurantId: restaurant._id } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    ratingDistribution.forEach((item) => {
      distribution[item._id] = item.count;
    });

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReviews / parseInt(limit)),
        totalReviews,
        limit: parseInt(limit),
      },
      ratingDistribution: distribution,
      averageRating: restaurant.averageRating || 0,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      message: 'Failed to fetch reviews',
      error: error.message,
    });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        message: 'Review not found',
      });
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          message: 'Rating must be between 1 and 5',
        });
      }
      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();

    // Update restaurant average rating
    await updateRestaurantRating(review.restaurantId);

    res.json({
      message: 'Review updated successfully',
      review,
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      message: 'Failed to update review',
      error: error.message,
    });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        message: 'Review not found',
      });
    }

    const restaurantId = review.restaurantId;
    await Review.findByIdAndDelete(reviewId);

    // Update restaurant average rating
    await updateRestaurantRating(restaurantId);

    res.json({
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      message: 'Failed to delete review',
      error: error.message,
    });
  }
};

// Mark review as helpful
export const markReviewHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        message: 'Review not found',
      });
    }

    res.json({
      message: 'Review marked as helpful',
      review,
    });
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    res.status(500).json({
      message: 'Failed to mark review as helpful',
      error: error.message,
    });
  }
};

// Helper function to update restaurant average rating
async function updateRestaurantRating(restaurantId) {
  try {
    // Convert restaurantId to ObjectId for aggregation
    const restaurantObjectId = new mongoose.Types.ObjectId(restaurantId);
    
    const result = await Review.aggregate([
      { $match: { restaurantId: restaurantObjectId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const averageRating = result.length > 0 ? result[0].averageRating : 0;
    const totalReviews = result.length > 0 ? result[0].totalReviews : 0;

    await Restaurant.findByIdAndUpdate(restaurantId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews,
    });
    
    console.log(`Updated restaurant ${restaurantId} - Average: ${averageRating}, Total: ${totalReviews}`);
  } catch (error) {
    console.error('Error updating restaurant rating:', error);
  }
}
