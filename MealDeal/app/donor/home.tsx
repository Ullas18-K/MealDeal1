import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getAccessToken, getUser, clearAuthData, API_URL, RESTAURANT_API_URL, MENUITEM_API_URL } from '@/utils/auth';

interface DonationForm {
  foodType: string;
  quantity: string;
  pickupTime: string;
  location: string;
}

interface MenuItemForm {
  restaurantId: string;
  name: string;
  description: string;
  price: string;
  category: string;
  isVeg: boolean;
  spiceLevel: 'mild' | 'medium' | 'hot';
  quantity: string;
  prepTime: string;
}

interface DonationHistoryItem {
  id: string;
  foodType: string;
  quantity: string;
  status: 'Pending Pickup' | 'Completed';
  date: string;
}

interface Restaurant {
  _id: string;
  name: string;
}

export default function DonorHome() {
  const [form, setForm] = useState<DonationForm>({
    foodType: '',
    quantity: '',
    pickupTime: '',
    location: '',
  });

  const [menuForm, setMenuForm] = useState<MenuItemForm>({
    restaurantId: '',
    name: '',
    description: '',
    price: '',
    category: 'Main Course',
    isVeg: true,
    spiceLevel: 'medium',
    quantity: '10',
    prepTime: '20',
  });

  const [userName, setUserName] = useState<string>('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [submittingMenuItem, setSubmittingMenuItem] = useState(false);

  useEffect(() => {
    loadUserProfile();
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoadingRestaurants(true);
      const response = await fetch(RESTAURANT_API_URL);
      const data = await response.json();
      
      // Handle different response formats
      const restaurantList = Array.isArray(data) ? data : (data.restaurants || []);
      setRestaurants(restaurantList);
      
      if (restaurantList.length > 0) {
        setMenuForm(prev => ({ ...prev, restaurantId: restaurantList[0]._id }));
      }
    } catch (error) {
      console.error('Failed to load restaurants', error);
      setRestaurants([]); // Set empty array on error
    } finally {
      setLoadingRestaurants(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const token = await getAccessToken();
      const user = await getUser();

      if (!token || !user) {
        // No auth, redirect to login
        router.replace('/donor');
        return;
      }

      setUserName(user.name);

      // Example: Fetch profile from backend with JWT
      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Profile loaded:', data.user);
      } else if (response.status === 401) {
        // Token expired, logout
        Alert.alert('Session Expired', 'Please login again', [
          {
            text: 'OK',
            onPress: async () => {
              await clearAuthData();
              router.replace('/donor');
            },
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await getAccessToken();
              
              // Call logout API
              if (token) {
                await fetch(`${API_URL}/logout`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                });
              }

              // Clear local auth data
              await clearAuthData();
              router.replace('/donor');
            } catch (error) {
              console.error('Logout error:', error);
              await clearAuthData();
              router.replace('/donor');
            }
          },
        },
      ]
    );
  };

  const [history, setHistory] = useState<DonationHistoryItem[]>([
    {
      id: '1',
      foodType: 'Rice & Curry',
      quantity: '5 kg',
      status: 'Completed',
      date: '2025-10-25',
    },
    {
      id: '2',
      foodType: 'Fresh Vegetables',
      quantity: '3 kg',
      status: 'Pending Pickup',
      date: '2025-10-27',
    },
    {
      id: '3',
      foodType: 'Bread & Pastries',
      quantity: '2 kg',
      status: 'Pending Pickup',
      date: '2025-10-28',
    },
  ]);

  const handleInputChange = (field: keyof DonationForm, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleMenuItemChange = (field: keyof MenuItemForm, value: string | boolean) => {
    setMenuForm({ ...menuForm, [field]: value });
  };

  const handleSubmitMenuItem = async () => {
    if (!menuForm.restaurantId || !menuForm.name || !menuForm.price) {
      Alert.alert('Missing Information', 'Please fill in restaurant, name, and price');
      return;
    }

    const payload = {
      restaurantId: menuForm.restaurantId,
      name: menuForm.name,
      description: menuForm.description,
      price: Number(menuForm.price),
      category: menuForm.category,
      isVeg: menuForm.isVeg,
      spiceLevel: menuForm.spiceLevel,
      quantity: Number(menuForm.quantity) || 10,
      prepTime: Number(menuForm.prepTime) || 20,
    };

    try {
      setSubmittingMenuItem(true);
      console.log('Submitting menu item:', payload);
      console.log('API URL:', MENUITEM_API_URL);
      
      const response = await fetch(MENUITEM_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add menu item');
      }

      Alert.alert('Success', 'Menu item added successfully!');
      
      // Reset form but keep restaurant selection
      setMenuForm({
        restaurantId: menuForm.restaurantId,
        name: '',
        description: '',
        price: '',
        category: 'Main Course',
        isVeg: true,
        spiceLevel: 'medium',
        quantity: '10',
        prepTime: '20',
      });
    } catch (error: any) {
      console.error('Error adding menu item:', error);
      Alert.alert('Error', error.message || 'Failed to add menu item');
    } finally {
      setSubmittingMenuItem(false);
    }
  };

  const handleSubmit = () => {
    if (!form.foodType || !form.quantity || !form.pickupTime || !form.location) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    console.log('New Donation Submitted:', form);
    
    // Add to history
    const newDonation: DonationHistoryItem = {
      id: Date.now().toString(),
      foodType: form.foodType,
      quantity: form.quantity,
      status: 'Pending Pickup',
      date: new Date().toISOString().split('T')[0],
    };
    
    setHistory([newDonation, ...history]);
    
    // Reset form
    setForm({
      foodType: '',
      quantity: '',
      pickupTime: '',
      location: '',
    });
    
    Alert.alert('Success', 'Donation added successfully!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome, {userName || 'Donor'} 👋</Text>
            <Text style={styles.subText}>Manage your restaurant menu items!</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#333333" />
          </TouchableOpacity>
        </View>

        {/* Add Menu Item Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="restaurant" size={24} color="#3FAE49" />
            <Text style={styles.cardTitle}>Add Menu Item</Text>
          </View>

          <View style={styles.inputContainer}>
            {/* Restaurant Selection */}
            <View style={styles.inputWrapper}>
              <Ionicons name="business-outline" size={20} color="#3FAE49" style={styles.inputIcon} />
              {loadingRestaurants ? (
                <ActivityIndicator color="#3FAE49" />
              ) : restaurants.length === 0 ? (
                <Text style={styles.input}>No restaurants available</Text>
              ) : (
                <ScrollView horizontal style={styles.restaurantSelector} showsHorizontalScrollIndicator={false}>
                  {restaurants.map((restaurant) => (
                    <TouchableOpacity
                      key={restaurant._id}
                      style={[
                        styles.restaurantChip,
                        menuForm.restaurantId === restaurant._id && styles.restaurantChipActive,
                      ]}
                      onPress={() => handleMenuItemChange('restaurantId', restaurant._id)}
                    >
                      <Text
                        style={[
                          styles.restaurantChipText,
                          menuForm.restaurantId === restaurant._id && styles.restaurantChipTextActive,
                        ]}
                      >
                        {restaurant.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="fast-food-outline" size={20} color="#3FAE49" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Item Name (e.g., Butter Chicken)"
                value={menuForm.name}
                onChangeText={(value) => handleMenuItemChange('name', value)}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="document-text-outline" size={20} color="#3FAE49" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={menuForm.description}
                onChangeText={(value) => handleMenuItemChange('description', value)}
                placeholderTextColor="#999"
                multiline
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="cash-outline" size={20} color="#3FAE49" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Price (₹)"
                value={menuForm.price}
                onChangeText={(value) => handleMenuItemChange('price', value)}
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="list-outline" size={20} color="#3FAE49" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Category (e.g., Main Course)"
                value={menuForm.category}
                onChangeText={(value) => handleMenuItemChange('category', value)}
                placeholderTextColor="#999"
              />
            </View>

            {/* Veg/Non-Veg Toggle */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Vegetarian:</Text>
              <View style={styles.toggleButtons}>
                <TouchableOpacity
                  style={[styles.toggleButton, menuForm.isVeg && styles.toggleButtonActive]}
                  onPress={() => handleMenuItemChange('isVeg', true)}
                >
                  <Text style={[styles.toggleButtonText, menuForm.isVeg && styles.toggleButtonTextActive]}>
                    Veg
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, !menuForm.isVeg && styles.toggleButtonActive]}
                  onPress={() => handleMenuItemChange('isVeg', false)}
                >
                  <Text style={[styles.toggleButtonText, !menuForm.isVeg && styles.toggleButtonTextActive]}>
                    Non-Veg
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Spice Level */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Spice Level:</Text>
              <View style={styles.toggleButtons}>
                {['mild', 'medium', 'hot'].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[styles.toggleButton, menuForm.spiceLevel === level && styles.toggleButtonActive]}
                    onPress={() => handleMenuItemChange('spiceLevel', level)}
                  >
                    <Text
                      style={[
                        styles.toggleButtonText,
                        menuForm.spiceLevel === level && styles.toggleButtonTextActive,
                      ]}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="calculator-outline" size={20} color="#3FAE49" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Available Quantity"
                value={menuForm.quantity}
                onChangeText={(value) => handleMenuItemChange('quantity', value)}
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="time-outline" size={20} color="#3FAE49" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Prep Time (minutes)"
                value={menuForm.prepTime}
                onChangeText={(value) => handleMenuItemChange('prepTime', value)}
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, submittingMenuItem && styles.submitButtonDisabled]}
              onPress={handleSubmitMenuItem}
              disabled={submittingMenuItem}
            >
              {submittingMenuItem ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Add Menu Item</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Add Donation Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="add-circle" size={24} color="#3FAE49" />
            <Text style={styles.cardTitle}>Add New Donation</Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="fast-food-outline" size={20} color="#3FAE49" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Food Type (e.g., Rice, Vegetables)"
                value={form.foodType}
                onChangeText={(value) => handleInputChange('foodType', value)}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="scale-outline" size={20} color="#3FAE49" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Quantity (e.g., 5 kg)"
                value={form.quantity}
                onChangeText={(value) => handleInputChange('quantity', value)}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="time-outline" size={20} color="#3FAE49" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Pickup Time (e.g., 2 PM - 4 PM)"
                value={form.pickupTime}
                onChangeText={(value) => handleInputChange('pickupTime', value)}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={20} color="#3FAE49" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Location (e.g., 123 Main St)"
                value={form.location}
                onChangeText={(value) => handleInputChange('location', value)}
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity style={styles.uploadButton}>
              <Ionicons name="image-outline" size={20} color="#3FAE49" />
              <Text style={styles.uploadButtonText}>Upload Image (Optional)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit Donation</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Donation History Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="time-outline" size={24} color="#3FAE49" />
            <Text style={styles.cardTitle}>Donation History</Text>
          </View>

          {history.length === 0 ? (
            <Text style={styles.emptyText}>No donations yet</Text>
          ) : (
            history.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyLeft}>
                  <Ionicons name="fast-food-outline" size={24} color="#3FAE49" />
                </View>
                <View style={styles.historyMiddle}>
                  <Text style={styles.historyFoodType}>{item.foodType}</Text>
                  <Text style={styles.historyQuantity}>{item.quantity}</Text>
                  <Text style={styles.historyDate}>{item.date}</Text>
                </View>
                <View style={styles.historyRight}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: item.status === 'Completed' ? '#3FAE49' : '#FFA500' },
                    ]}
                  >
                    <Ionicons
                      name={item.status === 'Completed' ? 'checkmark-circle-outline' : 'time-outline'}
                      size={14}
                      color="#FFFFFF"
                    />
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#E8F5E9',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: '#666666',
  },
  logoutButton: {
    padding: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 8,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 8,
  },
  inputContainer: {
    gap: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333333',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    marginTop: 4,
  },
  uploadButtonText: {
    fontSize: 15,
    color: '#3FAE49',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#3FAE49',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#8BC34A',
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  restaurantSelector: {
    flex: 1,
  },
  restaurantChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  restaurantChipActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#3FAE49',
  },
  restaurantChipText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  restaurantChipTextActive: {
    color: '#3FAE49',
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  toggleLabel: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
  },
  toggleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  toggleButtonActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#3FAE49',
  },
  toggleButtonText: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  toggleButtonTextActive: {
    color: '#3FAE49',
    fontWeight: '600',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 12,
  },
  historyLeft: {
    marginRight: 12,
  },
  historyMiddle: {
    flex: 1,
  },
  historyFoodType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  historyQuantity: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 12,
    color: '#999999',
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999999',
    fontSize: 14,
    paddingVertical: 20,
  },
});