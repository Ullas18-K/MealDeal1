import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ORDER_API_URL } from '../../utils/auth';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderId: string;
  restaurant: {
    _id: string;
    name: string;
    cuisine: string;
    location: string;
  };
  items: OrderItem[];
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  pickupTime: string;
  status: string;
  notes?: string;
  createdAt: string;
}

const DonorOrders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // TODO: Replace with actual restaurant IDs from donor's profile
  // For now, fetching all orders (donors can see all orders for their restaurants)
  
  const fetchOrders = async () => {
    try {
      // Fetch all orders - in production, filter by donor's restaurant IDs
      const response = await fetch(`${ORDER_API_URL}`);
      const data = await response.json();
      console.log('Fetched donor orders:', data);
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'confirmed':
        return '#2196F3';
      case 'preparing':
        return '#9C27B0';
      case 'ready':
        return '#4CAF50';
      case 'completed':
        return '#607D8B';
      case 'cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
        <Text style={styles.loadingText}>Loading accepted orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accepted Orders</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6347']} />
        }
      >
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>
              NGOs haven't placed any orders from your restaurants yet
            </Text>
          </View>
        ) : (
          orders.map((order) => (
            <View key={order._id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.orderId}>{order.orderId}</Text>
                  <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                  <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
                </View>
              </View>

              {order.restaurant && (
                <View style={styles.restaurantSection}>
                  <Text style={styles.restaurantName}>{order.restaurant.name}</Text>
                  <Text style={styles.restaurantInfo}>
                    {order.restaurant.cuisine} • {order.restaurant.location}
                  </Text>
                </View>
              )}

              {order.restaurant && <View style={styles.divider} />}

              <View style={styles.ngoSection}>
                <Text style={styles.sectionTitle}>Ordered by NGO:</Text>
                <View style={styles.ngoDetails}>
                  <View style={styles.ngoRow}>
                    <Text style={styles.ngoLabel}>Name:</Text>
                    <Text style={styles.ngoValue}>{order.customerName}</Text>
                  </View>
                  <View style={styles.ngoRow}>
                    <Text style={styles.ngoLabel}>Phone:</Text>
                    <Text style={styles.ngoValue}>{order.customerPhone}</Text>
                  </View>
                  <View style={styles.ngoRow}>
                    <Text style={styles.ngoLabel}>Pickup:</Text>
                    <Text style={styles.ngoValue}>{order.pickupTime}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.itemsSection}>
                <Text style={styles.sectionTitle}>Items Ordered:</Text>
                {order.items.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Text style={styles.itemName}>
                      {item.name} x {item.quantity}
                    </Text>
                    <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.divider} />

              <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalAmount}>₹{order.totalAmount}</Text>
              </View>

              {order.notes && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.notesSection}>
                    <Text style={styles.sectionTitle}>Notes:</Text>
                    <Text style={styles.notesText}>{order.notes}</Text>
                  </View>
                </>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FF6347',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  restaurantSection: {
    marginBottom: 12,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  restaurantInfo: {
    fontSize: 13,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  ngoSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  ngoDetails: {
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  ngoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ngoLabel: {
    fontSize: 13,
    color: '#666',
    width: 60,
    fontWeight: '500',
  },
  ngoValue: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  itemsSection: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 20,
    color: '#FF6347',
    fontWeight: 'bold',
  },
  notesSection: {
    marginTop: 4,
  },
  notesText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default DonorOrders;
