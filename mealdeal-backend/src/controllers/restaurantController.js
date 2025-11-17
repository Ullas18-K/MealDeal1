import Restaurant from '../models/Restaurant.js';

export const getRestaurants = async (req, res) => {
  try {
    const { search } = req.query;
    const filters = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { cuisine: { $regex: search, $options: 'i' } },
            { tags: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const restaurants = await Restaurant.find(filters).sort({ rating: -1 });
    res.json({ restaurants });
  } catch (error) {
    console.error('Error fetching restaurants', error);
    res.status(500).json({ message: 'Unable to fetch restaurants' });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({ restaurant });
  } catch (error) {
    console.error('Error fetching restaurant', error);
    res.status(500).json({ message: 'Unable to fetch restaurant' });
  }
};

export const createRestaurant = async (req, res) => {
  try {
    const payload = req.body;
    const restaurant = await Restaurant.create(payload);
    res.status(201).json({ restaurant });
  } catch (error) {
    console.error('Error creating restaurant', error);
    res.status(400).json({ message: 'Unable to create restaurant', error: error.message });
  }
};

// Add menu item to restaurant
export const addMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = req.body;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    restaurant.menu.push(menuItem);
    await restaurant.save();

    res.status(201).json({
      message: 'Menu item added successfully',
      restaurant,
    });
  } catch (error) {
    console.error('Error adding menu item', error);
    res.status(400).json({ message: 'Unable to add menu item', error: error.message });
  }
};

// Update menu item
export const updateMenuItem = async (req, res) => {
  try {
    const { id, itemIndex } = req.params;
    const updates = req.body;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const index = parseInt(itemIndex);
    if (index < 0 || index >= restaurant.menu.length) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    restaurant.menu[index] = { ...restaurant.menu[index], ...updates };
    await restaurant.save();

    res.json({
      message: 'Menu item updated successfully',
      restaurant,
    });
  } catch (error) {
    console.error('Error updating menu item', error);
    res.status(400).json({ message: 'Unable to update menu item', error: error.message });
  }
};

// Delete menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const { id, itemIndex } = req.params;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const index = parseInt(itemIndex);
    if (index < 0 || index >= restaurant.menu.length) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    restaurant.menu.splice(index, 1);
    await restaurant.save();

    res.json({
      message: 'Menu item deleted successfully',
      restaurant,
    });
  } catch (error) {
    console.error('Error deleting menu item', error);
    res.status(400).json({ message: 'Unable to delete menu item', error: error.message });
  }
};
