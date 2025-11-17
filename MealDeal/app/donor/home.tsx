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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getAccessToken, getUser, clearAuthData, API_URL } from '@/utils/auth';

interface DonationForm {
  foodType: string;
  quantity: string;
  pickupTime: string;
  location: string;
}

interface DonationHistoryItem {
  id: string;
  foodType: string;
  quantity: string;
  status: 'Pending Pickup' | 'Completed';
  date: string;
}

export default function DonorHome() {
  const [form, setForm] = useState<DonationForm>({
    foodType: '',
    quantity: '',
    pickupTime: '',
    location: '',
  });

  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    loadUserProfile();
  }, []);

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
            <Text style={styles.subText}>Let's help reduce food waste today!</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#333333" />
          </TouchableOpacity>
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
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
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