import React, { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ORDER_API_URL, RESTAURANT_API_URL, MENUITEM_API_URL, REVIEW_API_URL } from '@/utils/auth';

type MenuItem = {
  _id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isVeg?: boolean;
  spiceLevel?: 'mild' | 'medium' | 'hot';
  tags?: string[];
};

type Restaurant = {
  _id: string;
  name: string;
  cuisine: string;
  address?: string;
  phone?: string;
  rating?: number;
  averageRating?: number;
  totalReviews?: number;
  distance?: number;
  tags?: string[];
  description?: string;
  hero?: {
    imageUrl?: string;
    gradientFrom?: string;
    gradientTo?: string;
  };
};

type Review = {
  _id: string;
  userName: string;
  rating: number;
  comment?: string;
  helpful: number;
  createdAt: string;
};

export default function RestaurantDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerPhone: '',
    pickupTime: 'Today, 7:30 PM',
    quantity: '25',
    notes: '',
  });

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
    userName: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const loadRestaurant = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${RESTAURANT_API_URL}/${id}`);
      const data = await response.json();
      console.log('Restaurant API response:', data);
      // Backend returns { restaurant: {...} }
      setRestaurant(data.restaurant || data);
    } catch (error) {
      console.error('Failed to load restaurant', error);
      Alert.alert('Error', 'Failed to load restaurant details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadMenuItems = useCallback(async () => {
    try {
      const response = await fetch(`${MENUITEM_API_URL}/restaurant/${id}`);
      const data = await response.json();
      setMenuItems(data.menuItems || []);
    } catch (error) {
      console.error('Failed to load menu items', error);
    }
  }, [id]);

  const loadReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const response = await fetch(`${REVIEW_API_URL}/restaurant/${id}?limit=20`);
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Failed to load reviews', error);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadRestaurant();
      loadMenuItems();
      loadReviews();
    }
  }, [id, loadRestaurant, loadMenuItems, loadReviews]);

  const handleOrderItem = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setOrderForm({
      customerName: '',
      customerPhone: '',
      pickupTime: 'Today, 7:30 PM',
      quantity: '25',
      notes: '',
    });
    setShowOrderModal(true);
  };

  const handleSubmitOrder = async () => {
    if (!restaurant || !selectedMenuItem) return;

    if (!orderForm.customerName || !orderForm.customerPhone) {
      Alert.alert('Error', 'Please add contact details to proceed.');
      return;
    }

    const quantity = Math.max(1, Number(orderForm.quantity) || 1);

    const payload = {
      restaurantId: restaurant._id,
      customerName: orderForm.customerName,
      customerPhone: orderForm.customerPhone,
      pickupTime: orderForm.pickupTime,
      notes: orderForm.notes,
      items: [
        {
          name: selectedMenuItem.name,
          quantity,
          price: selectedMenuItem.price,
          notes: orderForm.notes,
        },
      ],
    };

    try {
      setSubmitting(true);
      console.log('Submitting order:', payload);
      console.log('Order API URL:', ORDER_API_URL);
      
      const response = await fetch(ORDER_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('Order response status:', response.status);
      const data = await response.json();
      console.log('Order response data:', data);
      if (!response.ok) {
        throw new Error(data.message || 'Unable to place order');
      }

      setLastOrderId(data.order._id);
      setShowOrderModal(false);
      
      Alert.alert(
        'Order Placed!',
        `Order ${data.order.orderId} confirmed. Would you like to leave a review?`,
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Review Now', onPress: () => openReviewModal() },
        ]
      );
    } catch (error: any) {
      console.error('Error placing order:', error);
      Alert.alert('Error', error.message || 'Something went wrong. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  const openReviewModal = () => {
    setReviewForm({
      rating: 5,
      comment: '',
      userName: orderForm.customerName || '',
    });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!restaurant) return;

    if (!reviewForm.userName) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    const payload = {
      restaurantId: restaurant._id,
      userId: 'user-' + Date.now(),
      userName: reviewForm.userName,
      orderId: lastOrderId,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    };

    try {
      setSubmitting(true);
      console.log('Submitting review:', payload);
      console.log('Review API URL:', REVIEW_API_URL);
      
      const response = await fetch(REVIEW_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('Review response status:', response.status);
      const data = await response.json();
      console.log('Review response data:', data);
      if (!response.ok) {
        throw new Error(data.message || 'Unable to submit review');
      }

      Alert.alert('Success', 'Thank you for your review!');
      setShowReviewModal(false);
      loadReviews();
      loadRestaurant();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, size = 16, color = '#FFD700') => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : star - 0.5 <= rating ? 'star-half' : 'star-outline'}
            size={size}
            color={color}
          />
        ))}
      </View>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0 || diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient colors={['#03040f', '#0b1226', '#111f3e']} style={styles.backgroundGradient} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9BE5C2" />
          <Text style={styles.loadingText}>Loading restaurant details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient colors={['#03040f', '#0b1226', '#111f3e']} style={styles.backgroundGradient} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#9BE5C2" />
          <Text style={styles.errorText}>Restaurant not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#03040f', '#0b1226', '#111f3e']} style={styles.backgroundGradient} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restaurant Details</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <ImageBackground
          source={{
            uri: restaurant.hero?.imageUrl || 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80',
          }}
          style={styles.heroImage}
          imageStyle={styles.heroImageStyle}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
            style={styles.heroGradient}
          />
        </ImageBackground>

        {/* Restaurant Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <View style={styles.infoHeaderLeft}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.ratingText}>
                {restaurant.averageRating?.toFixed(1) || restaurant.rating?.toFixed(1) || '4.5'}
              </Text>
            </View>
          </View>

          {restaurant.totalReviews !== undefined && restaurant.totalReviews > 0 && (
            <Text style={styles.reviewCount}>{restaurant.totalReviews} reviews</Text>
          )}

          {restaurant.description && (
            <Text style={styles.description}>{restaurant.description}</Text>
          )}

          <View style={styles.detailsRow}>
            {restaurant.address && (
              <View style={styles.detailItem}>
                <Ionicons name="location-outline" size={18} color="#9BE5C2" />
                <Text style={styles.detailText}>{restaurant.address}</Text>
              </View>
            )}
            {restaurant.phone && (
              <View style={styles.detailItem}>
                <Ionicons name="call-outline" size={18} color="#9BE5C2" />
                <Text style={styles.detailText}>{restaurant.phone}</Text>
              </View>
            )}
            {restaurant.distance && (
              <View style={styles.detailItem}>
                <Ionicons name="navigate-outline" size={18} color="#9BE5C2" />
                <Text style={styles.detailText}>{restaurant.distance} km away</Text>
              </View>
            )}
          </View>

          {restaurant.tags && restaurant.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {restaurant.tags.slice(0, 4).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Menu Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Menu Items</Text>
          <Text style={styles.sectionSubtitle}>
            {menuItems.length} items available
          </Text>

          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <View key={item._id || index} style={styles.menuCard}>
                <View style={styles.menuCardHeader}>
                  <View style={styles.menuCardInfo}>
                    <View style={styles.menuNameRow}>
                      {item.isVeg && (
                        <View style={styles.vegBadge}>
                          <View style={styles.vegDot} />
                        </View>
                      )}
                      <Text style={styles.menuItemName}>{item.name}</Text>
                    </View>
                    <Text style={styles.menuItemDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                    <View style={styles.menuItemFooter}>
                      <Text style={styles.menuItemPrice}>₹{item.price}</Text>
                      {item.spiceLevel && (
                        <View style={styles.spiceBadge}>
                          <Ionicons name="flame-outline" size={12} color="#FF6B6B" />
                          <Text style={styles.spiceText}>{item.spiceLevel}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.orderButton}
                  onPress={() => handleOrderItem(item)}
                >
                  <Text style={styles.orderButtonText}>Order</Text>
                  <Ionicons name="add-circle" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <View>
              <Text style={styles.sectionTitle}>Customer Reviews</Text>
              <Text style={styles.sectionSubtitle}>
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </Text>
            </View>
            <TouchableOpacity style={styles.writeReviewButton} onPress={openReviewModal}>
              <Ionicons name="create-outline" size={18} color="#9BE5C2" />
              <Text style={styles.writeReviewText}>Write Review</Text>
            </TouchableOpacity>
          </View>

          {reviewsLoading ? (
            <View style={styles.reviewsLoading}>
              <ActivityIndicator color="#9BE5C2" />
              <Text style={styles.loadingText}>Loading reviews...</Text>
            </View>
          ) : reviews.length === 0 ? (
            <View style={styles.noReviews}>
              <Ionicons name="chatbox-outline" size={40} color="#8890a6" />
              <Text style={styles.noReviewsText}>No reviews yet</Text>
              <Text style={styles.noReviewsSubtext}>Be the first to review this restaurant!</Text>
            </View>
          ) : (
            <View style={styles.reviewsList}>
              {reviews.map((review) => (
                <View key={review._id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerInfo}>
                      <View style={styles.reviewerAvatar}>
                        <Text style={styles.reviewerInitial}>
                          {review.userName.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.reviewerName}>{review.userName}</Text>
                        <Text style={styles.reviewDate}>{formatDate(review.createdAt)}</Text>
                      </View>
                    </View>
                    {renderStars(review.rating, 14)}
                  </View>
                  {review.comment && (
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                  )}
                  {review.helpful > 0 && (
                    <View style={styles.reviewFooter}>
                      <Ionicons name="thumbs-up-outline" size={14} color="#8890a6" />
                      <Text style={styles.helpfulText}>{review.helpful} found this helpful</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Order Modal */}
      <Modal visible={showOrderModal} animationType="slide" transparent onRequestClose={() => setShowOrderModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalEyebrow}>Place Order</Text>
                <Text style={styles.modalTitle}>{selectedMenuItem?.name}</Text>
              </View>
              <TouchableOpacity style={styles.modalClose} onPress={() => setShowOrderModal(false)}>
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.formRow}>
                <TextInput
                  placeholder="Contact name"
                  placeholderTextColor="#8890a6"
                  style={styles.input}
                  value={orderForm.customerName}
                  onChangeText={(customerName) => setOrderForm((prev) => ({ ...prev, customerName }))}
                />
                <TextInput
                  placeholder="Phone"
                  placeholderTextColor="#8890a6"
                  style={styles.input}
                  keyboardType="phone-pad"
                  value={orderForm.customerPhone}
                  onChangeText={(customerPhone) => setOrderForm((prev) => ({ ...prev, customerPhone }))}
                />
              </View>

              <View style={styles.formRow}>
                <TextInput
                  placeholder="Pickup time"
                  placeholderTextColor="#8890a6"
                  style={styles.input}
                  value={orderForm.pickupTime}
                  onChangeText={(pickupTime) => setOrderForm((prev) => ({ ...prev, pickupTime }))}
                />
                <TextInput
                  placeholder="Quantity"
                  placeholderTextColor="#8890a6"
                  style={styles.input}
                  keyboardType="numeric"
                  value={orderForm.quantity}
                  onChangeText={(quantity) => setOrderForm((prev) => ({ ...prev, quantity }))}
                />
              </View>

              <TextInput
                placeholder="Special instructions (optional)"
                placeholderTextColor="#8890a6"
                style={[styles.input, styles.notesInput]}
                multiline
                numberOfLines={3}
                value={orderForm.notes}
                onChangeText={(notes) => setOrderForm((prev) => ({ ...prev, notes }))}
              />

              <TouchableOpacity
                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                onPress={handleSubmitOrder}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.submitText}>Confirm Order</Text>
                    <Ionicons name="checkmark-circle" size={18} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Review Modal */}
      <Modal visible={showReviewModal} animationType="slide" transparent onRequestClose={() => setShowReviewModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalEyebrow}>Leave a Review</Text>
                <Text style={styles.modalTitle}>{restaurant.name}</Text>
              </View>
              <TouchableOpacity style={styles.modalClose} onPress={() => setShowReviewModal(false)}>
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <TextInput
                placeholder="Your name"
                placeholderTextColor="#8890a6"
                style={styles.input}
                value={reviewForm.userName}
                onChangeText={(userName) => setReviewForm((prev) => ({ ...prev, userName }))}
              />

              <Text style={styles.ratingLabel}>Your Rating</Text>
              <View style={styles.ratingSelector}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                  >
                    <Ionicons
                      name={star <= reviewForm.rating ? 'star' : 'star-outline'}
                      size={36}
                      color="#FFD700"
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                placeholder="Share your experience (optional)"
                placeholderTextColor="#8890a6"
                style={[styles.input, styles.notesInput]}
                multiline
                numberOfLines={4}
                value={reviewForm.comment}
                onChangeText={(comment) => setReviewForm((prev) => ({ ...prev, comment }))}
              />

              <TouchableOpacity
                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                onPress={handleSubmitReview}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.submitText}>Submit Review</Text>
                    <Ionicons name="send" size={18} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#03040f',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#a3acc4',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#2CC28A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    marginTop: 20,
  },
  backButtonText: {
    color: '#041018',
    fontSize: 16,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroImage: {
    width: '100%',
    height: 240,
  },
  heroImageStyle: {
    resizeMode: 'cover',
  },
  heroGradient: {
    flex: 1,
  },
  infoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoHeaderLeft: {
    flex: 1,
    paddingRight: 16,
  },
  restaurantName: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
  },
  cuisine: {
    color: '#9BE5C2',
    fontSize: 16,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,215,0,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '700',
  },
  reviewCount: {
    color: '#8890a6',
    fontSize: 14,
    marginBottom: 12,
  },
  description: {
    color: '#c8d0e7',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  detailsRow: {
    gap: 12,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: '#c8d0e7',
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(155,229,194,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(155,229,194,0.2)',
  },
  tagText: {
    color: '#9BE5C2',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: '#8890a6',
    fontSize: 14,
    marginBottom: 16,
  },
  menuGrid: {
    gap: 16,
  },
  menuCard: {
    backgroundColor: 'rgba(7, 12, 28, 0.6)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  menuCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  menuCardInfo: {
    flex: 1,
  },
  menuNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  vegBadge: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  menuItemName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  menuItemDescription: {
    color: '#a6b0d6',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  menuItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemPrice: {
    color: '#9BE5C2',
    fontSize: 18,
    fontWeight: '700',
  },
  spiceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,107,107,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  spiceText: {
    color: '#FF6B6B',
    fontSize: 11,
    textTransform: 'capitalize',
  },
  orderButton: {
    backgroundColor: '#2CC28A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(155,229,194,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(155,229,194,0.3)',
  },
  writeReviewText: {
    color: '#9BE5C2',
    fontSize: 13,
    fontWeight: '600',
  },
  reviewsLoading: {
    padding: 40,
    alignItems: 'center',
    gap: 12,
  },
  noReviews: {
    padding: 40,
    alignItems: 'center',
    gap: 12,
  },
  noReviewsText: {
    color: '#c8d0e7',
    fontSize: 16,
    fontWeight: '600',
  },
  noReviewsSubtext: {
    color: '#8890a6',
    fontSize: 14,
  },
  reviewsList: {
    gap: 16,
  },
  reviewCard: {
    backgroundColor: 'rgba(7, 12, 28, 0.6)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2CC28A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewerInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  reviewerName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  reviewDate: {
    color: '#8890a6',
    fontSize: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    color: '#c8d0e7',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helpfulText: {
    color: '#8890a6',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#050c1a',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalEyebrow: {
    color: '#9BE5C2',
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: 2,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    fontSize: 14,
  },
  notesInput: {
    height: 90,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  ratingLabel: {
    color: '#c8d0e7',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 12,
  },
  ratingSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#2CC28A',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
