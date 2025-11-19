import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { RESTAURANT_API_URL } from '@/utils/auth';

// Types
type DonationStatus = 'Available' | 'Accepted' | 'Completed';
type FoodType = 'Veg' | 'Non-Veg';

type HotelPartner = {
  _id: string;
  name: string;
  cuisine: string;
  rating?: number;
  averageRating?: number;
  totalReviews?: number;
  mealsServed?: number;
  distance?: number;
  lastDonation?: string;
  hero?: {
    imageUrl?: string;
  };
  reviewSnippet?: string;
  description?: string;
};

interface DonationReview {
  rating: number;
  comment: string;
  createdAt: string;
}

interface Donation {
  id: string;
  foodType: FoodType;
  quantity: string;
  pickupTime: string;
  location: string;
  status: DonationStatus;
  distance: number; // in km
  review?: DonationReview;
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

const partnerHotels: HotelPartner[] = [
  {
    _id: 'h1',
    name: 'Sunrise Business Hotel',
    cuisine: 'South Indian • Continental',
    rating: 4.8,
    averageRating: 4.8,
    mealsServed: 4200,
    distance: 2.4,
    lastDonation: 'Today • 120 veg thalis',
    hero: {
      imageUrl:
        'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=800&q=80',
    },
    totalReviews: 320,
    description: 'Portions were generous and still warm when we picked them up.',
    reviewSnippet: '"Portions were generous and still warm when we picked them up."',
  },
  {
    _id: 'h2',
    name: 'Gardenia Plaza Suites',
    cuisine: 'Pan Asian • Indian',
    rating: 4.6,
    averageRating: 4.6,
    mealsServed: 3100,
    distance: 3.8,
    lastDonation: 'Yesterday • 85 mixed meals',
    hero: {
      imageUrl:
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
    },
    totalReviews: 210,
    description: 'Fresh salads and mains, kids loved the fruits!',
    reviewSnippet: '"Fresh salads and mains, kids loved the fruits!"',
  },
  {
    _id: 'h3',
    name: 'Blue Orchid Residency',
    cuisine: 'North Indian • Bakery',
    rating: 4.9,
    averageRating: 4.9,
    mealsServed: 5100,
    distance: 1.9,
    lastDonation: 'Today • 60 breakfast boxes',
    hero: {
      imageUrl:
        'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=800&q=80',
    },
    totalReviews: 450,
    description: 'Consistently hygienic packaging and on-time handover.',
    reviewSnippet: '"Consistently hygienic packaging and on-time handover."',
  },
];

export default function NGOHomeScreen() {
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>(initialDonations);
  const [partnerHotels, setPartnerHotels] = useState<HotelPartner[]>([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  
  // Filter states
  const [selectedFoodType, setSelectedFoodType] = useState<'All' | FoodType>('All');
  const [selectedDistance, setSelectedDistance] = useState<number>(10); // km
  const [selectedTime, setSelectedTime] = useState<'All' | 'Now' | 'Later'>('All');

  // Load partner hotels from API
  const loadPartnerHotels = useCallback(async () => {
    try {
      setHotelsLoading(true);
      const response = await fetch(RESTAURANT_API_URL);
      const data = await response.json();
      setPartnerHotels(data.restaurants || []);
    } catch (error) {
      console.error('Failed to load partner hotels', error);
    } finally {
      setHotelsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPartnerHotels();
  }, [loadPartnerHotels]);

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
    const donationToReview = donations.find(donation => donation.id === id) ?? null;
    setDonations(prevDonations =>
      prevDonations.map(donation =>
        donation.id === id ? { ...donation, status: 'Completed' as DonationStatus } : donation
      )
    );
    setSelectedDonation(donationToReview);
    setReviewForm({ rating: 0, comment: '' });
    setReviewModalVisible(true);
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
  const reviewedDonations = donations.filter(donation => donation.review);

  const handleStarPress = (rating: number) => {
    setReviewForm(prev => ({ ...prev, rating }));
  };

  const handleSubmitReview = () => {
    if (!selectedDonation) {
      return;
    }

    if (reviewForm.rating === 0) {
      Alert.alert('Rating Required', 'Please rate the food before submitting.');
      return;
    }

    setDonations(prevDonations =>
      prevDonations.map(donation =>
        donation.id === selectedDonation.id
          ? {
              ...donation,
              review: {
                rating: reviewForm.rating,
                comment: reviewForm.comment.trim(),
                createdAt: new Date().toISOString(),
              },
            }
          : donation
      )
    );

    setReviewModalVisible(false);
    setSelectedDonation(null);
    setReviewForm({ rating: 0, comment: '' });
  };

  const handleSkipReview = () => {
    setReviewModalVisible(false);
    setSelectedDonation(null);
    setReviewForm({ rating: 0, comment: '' });
  };

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
            {donation.review && (
              <View style={styles.reviewPill}>
                <Ionicons name="star" size={14} color="#FFA500" />
                <Text style={styles.reviewPillText}>{donation.review.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#03040f', '#0b1226', '#111f3e']} style={styles.backgroundGradient} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>Welcome, Volunteer 👋</Text>
            <Text style={styles.subText}>Find nearby meals and make a difference today.</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#9BE5C2" />
          </TouchableOpacity>
        </View>

        {/* Stats Banner */}
        <View style={styles.statsBanner}>
          <Text style={styles.statsIcon}>🍱</Text>
          <Text style={styles.statsText}>
            {availableDonations.length} meals available near you
          </Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <Ionicons name="refresh-outline" size={20} color="#9BE5C2" />
          </TouchableOpacity>
        </View>

        {/* Orders Button */}
        <TouchableOpacity 
          style={styles.ordersButton}
          onPress={() => router.push('/ngo/orders')}
        >
          <Ionicons name="receipt-outline" size={22} color="#041018" />
          <Text style={styles.ordersButtonText}>View My Orders</Text>
          <Ionicons name="arrow-forward" size={18} color="#041018" />
        </TouchableOpacity>

        {/* Trusted Hotels */}
        <View style={styles.partnerSection}>
          <View style={styles.partnerHeader}>
            <Text style={styles.partnerTitle}>Trusted Hotel Partners</Text>
            <Text style={styles.partnerSubtitle}>Curated kitchens with verified reviews</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {hotelsLoading ? (
              <View style={styles.partnerLoadingContainer}>
                <ActivityIndicator color="#3FAE49" size="small" />
                <Text style={styles.partnerLoadingText}>Loading hotels...</Text>
              </View>
            ) : partnerHotels.length === 0 ? (
              <Text style={styles.noHotelsText}>No partner hotels available</Text>
            ) : (
              partnerHotels.map(hotel => (
                <TouchableOpacity
                  key={hotel._id}
                  style={styles.partnerCard}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/ngo/restaurant/${hotel._id}`)}
                >
                  <Image 
                    source={{ uri: hotel.hero?.imageUrl || 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=800&q=80' }} 
                    style={styles.partnerImage} 
                  />
                  <View style={styles.partnerBadge}>
                    <Ionicons name="star" size={14} color="#FFD166" />
                    <Text style={styles.partnerBadgeText}>
                      {(hotel.averageRating || hotel.rating || 4.5).toFixed(1)}
                    </Text>
                  </View>
                  <View style={styles.partnerInfo}>
                    <Text style={styles.partnerName}>{hotel.name}</Text>
                    <Text style={styles.partnerCuisine}>{hotel.cuisine}</Text>
                    <View style={styles.partnerMetaRow}>
                      {hotel.distance !== undefined && (
                        <>
                          <Ionicons name="location-outline" size={14} color="#3FAE49" />
                          <Text style={styles.partnerMetaText}>{hotel.distance} km away</Text>
                        </>
                      )}
                      {hotel.totalReviews !== undefined && hotel.totalReviews > 0 && (
                        <>
                          <Ionicons name="chatbox-outline" size={14} color="#3FAE49" />
                          <Text style={styles.partnerMetaText}>{hotel.totalReviews} reviews</Text>
                        </>
                      )}
                    </View>
                    {hotel.description && (
                      <Text style={styles.partnerReview} numberOfLines={2}>"{hotel.description}"</Text>
                    )}
                    <TouchableOpacity 
                      style={styles.viewMenuButton}
                      onPress={() => router.push(`/ngo/restaurant/${hotel._id}`)}
                    >
                      <Text style={styles.viewMenuText}>View Menu</Text>
                      <Ionicons name="arrow-forward" size={14} color="#3FAE49" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
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
          <View style={styles.section}>
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

        {reviewedDonations.length > 0 && (
          <View style={[styles.section, styles.lastSection]}>
            <Text style={styles.sectionTitle}>Community Feedback</Text>
            {reviewedDonations.map(donation => (
              <View key={`${donation.id}-review`} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewFood}>
                    {donation.foodType} • {donation.quantity}
                  </Text>
                  <View style={styles.ratingRow}>
                    {[1, 2, 3, 4, 5].map(value => (
                      <Ionicons
                        key={`${donation.id}-rating-${value}`}
                        name={
                          donation.review && value <= Math.round(donation.review.rating)
                            ? 'star'
                            : 'star-outline'
                        }
                        size={16}
                        color="#FFA500"
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewLocation}>📍 {donation.location}</Text>
                {donation.review?.comment ? (
                  <Text style={styles.reviewComment}>{donation.review.comment}</Text>
                ) : (
                  <Text style={styles.reviewCommentMuted}>No comment provided.</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={reviewModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Review this meal</Text>
            {selectedDonation && (
              <Text style={styles.modalSubtitle}>
                {selectedDonation.foodType} • {selectedDonation.quantity}
              </Text>
            )}

            <View style={styles.modalRatingRow}>
              {[1, 2, 3, 4, 5].map(value => (
                <TouchableOpacity
                  key={`modal-star-${value}`}
                  onPress={() => handleStarPress(value)}
                  style={styles.modalStarButton}
                >
                  <Ionicons
                    name={value <= reviewForm.rating ? 'star' : 'star-outline'}
                    size={32}
                    color="#FFA500"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Share feedback about freshness, quality, etc."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={reviewForm.comment}
              onChangeText={text => setReviewForm(prev => ({ ...prev, comment: text }))}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalSecondaryButton} onPress={handleSkipReview}>
                <Text style={styles.modalSecondaryText}>Not now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalPrimaryButton} onPress={handleSubmitReview}>
                <Text style={styles.modalPrimaryText}>Submit review</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03040f',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
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
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: '#9BE5C2',
    lineHeight: 20,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(155, 229, 194, 0.1)',
    borderRadius: 8,
  },
  statsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(155, 229, 194, 0.15)',
    marginHorizontal: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(155, 229, 194, 0.3)',
  },
  statsIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  statsText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#9BE5C2',
  },
  refreshButton: {
    padding: 4,
  },
  partnerSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  partnerHeader: {
    marginBottom: 12,
  },
  partnerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  partnerSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  partnerCard: {
    width: 260,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  partnerImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  partnerBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  partnerBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  partnerInfo: {
    padding: 14,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  partnerCuisine: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  partnerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  partnerMetaText: {
    fontSize: 12,
    color: '#3FAE49',
    marginRight: 6,
  },
  partnerDonation: {
    fontSize: 12,
    color: '#333',
    marginTop: 10,
    fontWeight: '600',
  },
  partnerReview: {
    fontSize: 12,
    color: '#555',
    marginTop: 6,
    fontStyle: 'italic',
  },
  partnerLoadingContainer: {
    padding: 40,
    alignItems: 'center',
    gap: 12,
  },
  partnerLoadingText: {
    color: '#666',
    fontSize: 13,
  },
  noHotelsText: {
    color: '#666',
    fontSize: 14,
    padding: 20,
  },
  viewMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(63,174,73,0.1)',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  viewMenuText: {
    color: '#3FAE49',
    fontSize: 12,
    fontWeight: '600',
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
    gap: 8,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  ordersButton: {
    backgroundColor: '#9BE5C2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#9BE5C2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  ordersButtonText: {
    color: '#041018',
    fontSize: 16,
    fontWeight: '700',
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
  reviewPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  reviewPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFA500',
  },
  reviewCard: {
    backgroundColor: '#F9FBF9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E4F2E4',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewFood: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  reviewLocation: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  reviewComment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  reviewCommentMuted: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalRatingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  modalStarButton: {
    padding: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalSecondaryButton: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSecondaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  modalPrimaryButton: {
    flex: 1,
    backgroundColor: '#3FAE49',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
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