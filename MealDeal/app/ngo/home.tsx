import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Types
type DonationStatus = 'Available' | 'Accepted' | 'Completed';
type FoodType = 'Veg' | 'Non-Veg';

interface Donation {
  id: string;
  foodType: FoodType;
  quantity: string;
  pickupTime: string;
  location: string;
  status: DonationStatus;
  distance: number; // in km
}

// Mock Data
const initialDonations: Donation[] = [
  {
    id: '1',
    foodType: 'Veg',
    quantity: '20 meals',
    pickupTime: 'Available Now',
    location: 'Indiranagar, Bangalore',
    status: 'Available',
    distance: 1.5,
  },
  {
    id: '2',
    foodType: 'Non-Veg',
    quantity: '15 meals',
    pickupTime: 'Today, 6:00 PM',
    location: 'Koramangala, Bangalore',
    status: 'Available',
    distance: 3.2,
  },
  {
    id: '3',
    foodType: 'Veg',
    quantity: '30 meals',
    pickupTime: 'Today, 7:00 PM',
    location: 'Whitefield, Bangalore',
    status: 'Available',
    distance: 8.5,
  },
  {
    id: '4',
    foodType: 'Veg',
    quantity: '10 meals',
    pickupTime: 'Available Now',
    location: 'HSR Layout, Bangalore',
    status: 'Available',
    distance: 2.1,
  },
];

export default function NGOHomeScreen() {
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>(initialDonations);
  
  // Filter states
  const [selectedFoodType, setSelectedFoodType] = useState<'All' | FoodType>('All');
  const [selectedDistance, setSelectedDistance] = useState<number>(10); // km
  const [selectedTime, setSelectedTime] = useState<'All' | 'Now' | 'Later'>('All');

  // Handle logout
  const handleLogout = () => {
    router.replace('/ngo');
  };

  // Handle accepting donation
  const handleAcceptDonation = (id: string) => {
    setDonations(prevDonations =>
      prevDonations.map(donation =>
        donation.id === id ? { ...donation, status: 'Accepted' as DonationStatus } : donation
      )
    );
  };

  // Handle marking as received
  const handleMarkReceived = (id: string) => {
    setDonations(prevDonations =>
      prevDonations.map(donation =>
        donation.id === id ? { ...donation, status: 'Completed' as DonationStatus } : donation
      )
    );
  };

  // Handle refresh
  const handleRefresh = () => {
    setDonations(initialDonations);
  };

  // Filter donations
  const filteredDonations = donations.filter(donation => {
    const foodTypeMatch = selectedFoodType === 'All' || donation.foodType === selectedFoodType;
    const distanceMatch = donation.distance <= selectedDistance;
    const timeMatch = 
      selectedTime === 'All' ||
      (selectedTime === 'Now' && donation.pickupTime.includes('Available Now')) ||
      (selectedTime === 'Later' && !donation.pickupTime.includes('Available Now'));
    
    return foodTypeMatch && distanceMatch && timeMatch;
  });

  // Get available and accepted donations
  const availableDonations = filteredDonations.filter(d => d.status === 'Available');
  const acceptedDonations = filteredDonations.filter(d => d.status === 'Accepted');
  const completedDonations = filteredDonations.filter(d => d.status === 'Completed');

  // Get status color
  const getStatusColor = (status: DonationStatus) => {
    switch (status) {
      case 'Available':
        return '#3FAE49';
      case 'Accepted':
        return '#FFA500';
      case 'Completed':
        return '#4CAF50';
      default:
        return '#999';
    }
  };

  // Render donation card
  const renderDonationCard = (donation: Donation) => (
    <View key={donation.id} style={styles.donationCard}>
      <View style={styles.cardHeader}>
        <View style={styles.foodTypeContainer}>
          <Text style={styles.foodIcon}>🍛</Text>
          <Text style={styles.foodType}>{donation.foodType}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(donation.status) }]}>
          <Text style={styles.statusText}>{donation.status}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Ionicons name="restaurant-outline" size={18} color="#666" />
          <Text style={styles.infoText}>{donation.quantity}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={18} color="#666" />
          <Text style={styles.infoText}>{donation.pickupTime}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.infoText}>{donation.location}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={18} color="#666" />
          <Text style={styles.infoText}>{donation.distance} km away</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        {donation.status === 'Available' && (
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAcceptDonation(donation.id)}
          >
            <Text style={styles.acceptButtonText}>Accept Donation</Text>
          </TouchableOpacity>
        )}

        {donation.status === 'Accepted' && (
          <TouchableOpacity
            style={styles.receivedButton}
            onPress={() => handleMarkReceived(donation.id)}
          >
            <Text style={styles.receivedButtonText}>Mark as Received</Text>
          </TouchableOpacity>
        )}

        {donation.status === 'Completed' && (
          <View style={styles.completedContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.completedText}>Received</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>Welcome, Volunteer 👋</Text>
            <Text style={styles.subText}>Find nearby meals and make a difference today.</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Stats Banner */}
        <View style={styles.statsBanner}>
          <Text style={styles.statsIcon}>🍱</Text>
          <Text style={styles.statsText}>
            {availableDonations.length} meals available near you
          </Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <Ionicons name="refresh-outline" size={20} color="#3FAE49" />
          </TouchableOpacity>
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={40} color="#999" />
          <Text style={styles.mapText}>Map View Placeholder</Text>
          <Text style={styles.mapSubtext}>Integration with react-native-maps coming soon</Text>
        </View>

        {/* Filter Bar */}
        <View style={styles.filterBar}>
          <Text style={styles.filterTitle}>Filters</Text>
          
          {/* Food Type Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Food Type</Text>
            <View style={styles.filterButtons}>
              {(['All', 'Veg', 'Non-Veg'] as const).map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterButton,
                    selectedFoodType === type && styles.filterButtonActive,
                  ]}
                  onPress={() => setSelectedFoodType(type)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedFoodType === type && styles.filterButtonTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Distance Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Distance</Text>
            <View style={styles.filterButtons}>
              {[2, 5, 10].map(distance => (
                <TouchableOpacity
                  key={distance}
                  style={[
                    styles.filterButton,
                    selectedDistance === distance && styles.filterButtonActive,
                  ]}
                  onPress={() => setSelectedDistance(distance)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedDistance === distance && styles.filterButtonTextActive,
                    ]}
                  >
                    {distance} km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Pickup Time</Text>
            <View style={styles.filterButtons}>
              {(['All', 'Now', 'Later'] as const).map(time => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.filterButton,
                    selectedTime === time && styles.filterButtonActive,
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedTime === time && styles.filterButtonTextActive,
                    ]}
                  >
                    {time === 'Now' ? 'Available Now' : time === 'Later' ? 'Later Today' : time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Nearby Donations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearby Donations</Text>
          {availableDonations.length > 0 ? (
            availableDonations.map(donation => renderDonationCard(donation))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No donations match your filters</Text>
            </View>
          )}
        </View>

        {/* Accepted Donations */}
        {acceptedDonations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Accepted Donations</Text>
            {acceptedDonations.map(donation => renderDonationCard(donation))}
          </View>
        )}

        {/* Completed Donations */}
        {completedDonations.length > 0 && (
          <View style={[styles.section, styles.lastSection]}>
            <Text style={styles.sectionTitle}>Completed Today</Text>
            {completedDonations.map(donation => (
              <View key={donation.id} style={styles.completedCard}>
                <View style={styles.completedCardContent}>
                  <Text style={styles.completedCardIcon}>🍛</Text>
                  <View style={styles.completedCardInfo}>
                    <Text style={styles.completedCardTitle}>
                      {donation.foodType} • {donation.quantity}
                    </Text>
                    <Text style={styles.completedCardLocation}>📍 {donation.location}</Text>
                  </View>
                </View>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              </View>
            ))}
          </View>
        )}
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
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  logoutButton: {
    padding: 8,
  },
  statsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    marginHorizontal: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  statsIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  statsText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  refreshButton: {
    padding: 4,
  },
  mapPlaceholder: {
    height: 180,
    backgroundColor: '#F2F2F2',
    marginHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  mapText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 8,
  },
  mapSubtext: {
    fontSize: 12,
    color: '#BBB',
    marginTop: 4,
  },
  filterBar: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterButtonActive: {
    backgroundColor: '#3FAE49',
    borderColor: '#3FAE49',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  lastSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  donationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  foodTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  foodType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardContent: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  cardActions: {
    marginTop: 8,
  },
  acceptButton: {
    backgroundColor: '#3FAE49',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  receivedButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  receivedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 8,
  },
  completedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  completedCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  completedCardIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  completedCardInfo: {
    flex: 1,
  },
  completedCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  completedCardLocation: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
});