import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { roomService } from '../../services/roomService';
import { bookingService } from '../../services/bookingService';
import AppButton from '../../components/AppButton';
import { LoadingSpinner } from '../../components/FeedbackStates';

export const AdminDashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    fullRooms: 0,
    pendingBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const roomRes = await roomService.getAllRooms();
      const bookingRes = await bookingService.getAllBookings();

      if (roomRes.success && bookingRes.success) {
        const rooms = roomRes.data;
        const bookings = bookingRes.data;

        setStats({
          totalRooms: rooms.length,
          availableRooms: rooms.filter(r => r.availabilityStatus === 'Available').length,
          fullRooms: rooms.filter(r => r.availabilityStatus === 'Full').length,
          pendingBookings: bookings.filter(b => b.status === 'Pending').length
        });
      }
    } catch (error) {
      console.error('Error fetching admin dashboard stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return <LoadingSpinner message="Loading admin control panel..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />}
      >
        <Text className="text-2xl font-extrabold text-text">Admin Control Panel</Text>
        <Text className="text-sm text-text-muted mb-6">Overview & hostel operational status</Text>

        <View className="flex-row flex-wrap gap-4 mb-8">
          <View className="w-[47%] bg-card rounded-2xl p-6 items-center justify-center border border-border shadow-sm">
            <Text className="text-3xl font-extrabold text-text">{stats.totalRooms}</Text>
            <Text className="text-xs font-semibold text-text-muted mt-1 text-center">Total Rooms</Text>
          </View>
          <View className="w-[47%] bg-accent-light rounded-2xl p-6 items-center justify-center border border-border shadow-sm">
            <Text className="text-3xl font-extrabold text-accent">{stats.availableRooms}</Text>
            <Text className="text-xs font-semibold text-accent mt-1 text-center">Available Rooms</Text>
          </View>
          <View className="w-[47%] bg-danger-light rounded-2xl p-6 items-center justify-center border border-border shadow-sm">
            <Text className="text-3xl font-extrabold text-danger">{stats.fullRooms}</Text>
            <Text className="text-xs font-semibold text-danger mt-1 text-center">Full Capacity</Text>
          </View>
          <View className="w-[47%] bg-warning-light rounded-2xl p-6 items-center justify-center border border-border shadow-sm">
            <Text className="text-3xl font-extrabold text-warning">{stats.pendingBookings}</Text>
            <Text className="text-xs font-semibold text-warning mt-1 text-center">Pending Approvals</Text>
          </View>
        </View>

        <View className="bg-card rounded-2xl p-6 border border-border gap-3">
          <Text className="text-base font-bold text-text mb-1">Management Actions</Text>
          <AppButton
            title="Manage Rooms & Inventory"
            onPress={() => navigation.navigate('ManageRooms')}
          />
          <AppButton
            title="Add New Hostel Room"
            variant="secondary"
            onPress={() => navigation.navigate('AddRoom')}
          />
          <AppButton
            title="Review Booking Requests"
            variant="secondary"
            onPress={() => navigation.navigate('ManageBookings')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboardScreen;
