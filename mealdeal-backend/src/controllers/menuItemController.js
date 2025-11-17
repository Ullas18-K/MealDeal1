import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';

// Get all menu items for a restaurant
export const getMenuItemsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { available } = req.query;

    const filter = { restaurantId };
    if (available !== undefined) {
      filter.available = available === 'true';
    }

    const menuItems = await MenuItem.find(filter).sort({ createdAt: -1 });

    res.json({
      menuItems,
      count: menuItems.length,
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({
      message: 'Failed to fetch menu items',
      error: error.message,
    });
  }
};

// Get single menu item
export const getMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findById(id).populate('restaurantId', 'name cuisine');

    if (!menuItem) {
      return res.status(404).json({
        message: 'Menu item not found',
      });
    }

    res.json({ menuItem });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({
      message: 'Failed to fetch menu item',
      error: error.message,
    });
  }
};

// Create menu item
export const createMenuItem = async (req, res) => {
  try {
    const {
      restaurantId,
      name,
      description,
      price,
      imageUrl,
      isVeg,
      spiceLevel,
      category,
      tags,
      quantity,
      prepTime,
    } = req.body;

    // Validate required fields
    if (!restaurantId || !name || !price) {
      return res.status(400).json({
        message: 'Missing required fields: restaurantId, name, and price are required',
      });
    }

    // Verify restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        message: 'Restaurant not found',
      });
    }

    const menuItem = new MenuItem({
      restaurantId,
      name,
      description,
      price,
      imageUrl,
      isVeg,
      spiceLevel,
      category,
      tags,
      quantity,
      prepTime,
    });

    await menuItem.save();

    res.status(201).json({
      message: 'Menu item created successfully',
      menuItem,
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(400).json({
      message: 'Failed to create menu item',
      error: error.message,
    });
  }
};

// Update menu item
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        message: 'Menu item not found',
      });
    }

    res.json({
      message: 'Menu item updated successfully',
      menuItem,
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(400).json({
      message: 'Failed to update menu item',
      error: error.message,
    });
  }
};

// Delete menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findByIdAndDelete(id);

    if (!menuItem) {
      return res.status(404).json({
        message: 'Menu item not found',
      });
    }

    res.json({
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({
      message: 'Failed to delete menu item',
      error: error.message,
    });
  }
};

// Toggle menu item availability
export const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({
        message: 'Menu item not found',
      });
    }

    menuItem.available = !menuItem.available;
    await menuItem.save();

    res.json({
      message: `Menu item ${menuItem.available ? 'marked as available' : 'marked as unavailable'}`,
      menuItem,
    });
  } catch (error) {
    console.error('Error toggling availability:', error);
    res.status(500).json({
      message: 'Failed to toggle availability',
      error: error.message,
    });
  }
};

// Get all menu items (admin)
export const getAllMenuItems = async (req, res) => {
  try {
    const { page = 1, limit = 50, available } = req.query;

    const filter = {};
    if (available !== undefined) {
      filter.available = available === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const menuItems = await MenuItem.find(filter)
      .populate('restaurantId', 'name cuisine address')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await MenuItem.countDocuments(filter);

    res.json({
      menuItems,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching all menu items:', error);
    res.status(500).json({
      message: 'Failed to fetch menu items',
      error: error.message,
    });
  }
};
