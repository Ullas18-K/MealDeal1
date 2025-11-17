import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { ComponentProps } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { RESTAURANT_API_URL } from '@/utils/auth';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

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
  rating?: number;
  distance?: number;
  tags?: string[];
  hero?: {
    imageUrl?: string;
    gradientFrom?: string;
    gradientTo?: string;
  };
  menu: MenuItem[];
  description?: string;
};

const heroHighlights: { label: string; value: string; icon: IoniconName }[] = [
  { label: 'Meals served', value: '18,240', icon: 'restaurant-outline' },
  { label: 'Food saved', value: '32 tons', icon: 'leaf-outline' },
  { label: 'Hotels onboarded', value: '42', icon: 'business-outline' },
];

export default function MarketplaceScreen() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);

  const loadRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(RESTAURANT_API_URL);
      const data = await response.json();
      setRestaurants(data.restaurants ?? []);
    } catch (error) {
      console.error('Failed to load restaurants', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  const activeMenuItem = useMemo(() => {
    if (!selectedRestaurant?.menu?.length) return null;
    return selectedRestaurant.menu[selectedMenuIndex] ?? selectedRestaurant.menu[0];
  }, [selectedRestaurant, selectedMenuIndex]);

  const openMenuSheet = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setSelectedMenuIndex(0);
  };

  const closeMenuSheet = () => {
    setSelectedRestaurant(null);
  };

  const handleLoginRedirect = () => {
    router.push('/ngo');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#03040f', '#0b1226', '#111f3e']} style={styles.backgroundGradient} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroEyebrow}>Curated hotel kitchens</Text>
              <Text style={styles.heroTitle}>Professionally plated meals on standby</Text>
            </View>
            <TouchableOpacity style={styles.roleSwitcher} onPress={() => router.push('/role')}>
              <Ionicons name="person-outline" size={18} color="#fff" />
              <Text style={styles.roleText}>Select role</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.heroSubtitle}>
            Every confirmed order is batch-tracked and quality checked before leaving the hotel kitchen.
          </Text>

          <View style={styles.heroStats}>
            {heroHighlights.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Ionicons name={stat.icon} size={20} color="#9BE5C2" />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Signature hotel partners</Text>
            <Text style={styles.sectionSubtitle}>Verified menus updated twice a day</Text>
          </View>
          <TouchableOpacity style={styles.sectionAction} onPress={loadRestaurants}>
            <Text style={styles.sectionActionText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color="#9BE5C2" />
            <Text style={styles.loadingText}>Fetching curated restaurants…</Text>
          </View>
        ) : (
          restaurants.map((restaurant) => (
            <TouchableOpacity key={restaurant._id} activeOpacity={0.9} onPress={() => openMenuSheet(restaurant)}>
              <ImageBackground
                source={{ uri: restaurant.hero?.imageUrl || 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80' }}
                imageStyle={styles.restaurantImage}
                style={styles.restaurantCard}
              >
                <LinearGradient colors={['rgba(0,0,0,0.7)', 'rgba(10,15,30,0.6)']} style={styles.restaurantOverlay} />
                <View style={styles.restaurantContent}>
                  <View style={styles.restaurantMeta}>
                    <Text style={styles.restaurantTitle}>{restaurant.name}</Text>
                    <View style={styles.ratingPill}>
                      <Ionicons name="star" size={14} color="#FFE066" />
                      <Text style={styles.ratingText}>{restaurant.rating?.toFixed(1) ?? '4.8'}</Text>
                    </View>
                  </View>
                  <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
                  <Text style={styles.restaurantTags}>
                    {restaurant.distance ? `${restaurant.distance} km • ` : ''}
                    {restaurant.tags?.slice(0, 2).join(' • ')}
                  </Text>
                  <View style={styles.menuPreview}>
                    {(restaurant.menu ?? []).slice(0, 2).map((item) => (
                      <View key={item.name} style={styles.menuChip}>
                        <Text style={styles.menuChipText}>{item.name}</Text>
                        <Text style={styles.menuPrice}>₹{item.price}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardFooterText}>Tap to view available menu items</Text>
                    <Ionicons name="arrow-forward" size={18} color="#9BE5C2" />
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal visible={!!selectedRestaurant} animationType="slide" transparent onRequestClose={closeMenuSheet}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalEyebrow}>Menu from</Text>
                <Text style={styles.modalTitle}>{selectedRestaurant?.name}</Text>
              </View>
              <TouchableOpacity style={styles.modalClose} onPress={closeMenuSheet}>
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {selectedRestaurant && (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.menuCarousel}>
                  {(selectedRestaurant.menu ?? []).map((item, index) => {
                    const isActive = index === selectedMenuIndex;
                    return (
                      <TouchableOpacity
                        key={`${item.name}-${index}`}
                        style={[styles.carouselCard, isActive && styles.carouselCardActive]}
                        onPress={() => setSelectedMenuIndex(index)}
                      >
                        <Text style={styles.carouselTitle}>{item.name}</Text>
                        <Text style={styles.carouselDescription}>{item.description}</Text>
                        <Text style={styles.carouselPrice}>₹{item.price}</Text>
                        <View style={styles.carouselTags}>
                          <Text style={styles.carouselTag}>{item.spiceLevel ?? 'mild'}</Text>
                          {item.isVeg && <Text style={styles.carouselTag}>veg</Text>}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <View style={styles.loginPrompt}>
                  <Ionicons name="information-circle-outline" size={24} color="#9BE5C2" />
                  <Text style={styles.loginPromptText}>
                    To place orders and access exclusive benefits, please log in to your account.
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleLoginRedirect}
                >
                  <Text style={styles.submitText}>Login to explore</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </TouchableOpacity>
              </>
            )}
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
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
    gap: 24,
  },
  heroCard: {
    backgroundColor: 'rgba(7, 12, 28, 0.8)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    flexWrap: 'wrap',
  },
  heroEyebrow: {
    color: '#9BE5C2',
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 6,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 30,
  },
  heroSubtitle: {
    color: '#c8d0e7',
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
  },
  roleSwitcher: {
    backgroundColor: 'rgba(155,229,194,0.15)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(155,229,194,0.3)',
    minWidth: 120,
    justifyContent: 'center',
  },
  roleText: {
    color: '#9BE5C2',
    fontSize: 13,
    fontWeight: '700',
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    color: '#a3acc4',
    fontSize: 12,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: '#8890a6',
    marginTop: 4,
    fontSize: 13,
  },
  sectionAction: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  sectionActionText: {
    color: '#9BE5C2',
    fontWeight: '600',
    fontSize: 12,
  },
  loadingState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  loadingText: {
    color: '#a3acc4',
    marginTop: 14,
  },
  restaurantCard: {
    height: 220,
    borderRadius: 26,
    overflow: 'hidden',
    marginBottom: 18,
  },
  restaurantImage: {
    borderRadius: 26,
  },
  restaurantOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 26,
  },
  restaurantContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  restaurantMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
    paddingRight: 12,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ratingText: {
    color: '#FFE066',
    fontWeight: '700',
  },
  restaurantCuisine: {
    color: '#dbe2ff',
    marginTop: 6,
    fontSize: 14,
  },
  restaurantTags: {
    color: '#a6b0d6',
    marginTop: 4,
    fontSize: 13,
  },
  menuPreview: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  menuChip: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  menuChipText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  menuPrice: {
    color: '#9BE5C2',
    marginTop: 4,
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardFooterText: {
    color: '#c8d0e7',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#050c1a',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  menuCarousel: {
    marginBottom: 16,
  },
  carouselCard: {
    width: 220,
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  carouselCardActive: {
    borderColor: '#9BE5C2',
    backgroundColor: 'rgba(155,229,194,0.08)',
  },
  carouselTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  carouselDescription: {
    color: '#a6b0d6',
    marginTop: 6,
    fontSize: 13,
  },
  carouselPrice: {
    color: '#9BE5C2',
    marginTop: 12,
    fontWeight: '700',
  },
  carouselTags: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  carouselTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 11,
    color: '#9BE5C2',
    borderWidth: 1,
    borderColor: 'rgba(155,229,194,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  loginPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(155,229,194,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(155,229,194,0.2)',
  },
  loginPromptText: {
    color: '#c8d0e7',
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#2CC28A',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  submitText: {
    color: '#041018',
    fontSize: 16,
    fontWeight: '700',
  },
});
