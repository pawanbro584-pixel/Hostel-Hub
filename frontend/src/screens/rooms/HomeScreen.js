import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import { roomService } from '../../services/roomService';
import { bookingService } from '../../services/bookingService';
import RoomCard from '../../components/RoomCard';
import BookingCard from '../../components/BookingCard';
import { LoadingSpinner } from '../../components/FeedbackStates';

export const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const roomRes = await roomService.getAllRooms({ availabilityStatus: 'Available' });
      if (roomRes.success) {
        setRooms(roomRes.data.slice(0, 3));
      }

      if (!user?.isAdmin) {
        const bookingRes = await bookingService.getAllBookings();
        if (bookingRes.success && bookingRes.data.length > 0) {
          const approvedOrPending = bookingRes.data.find(
            b => b.status === 'Approved' || b.status === 'Pending'
          );
          setActiveBooking(approvedOrPending || bookingRes.data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="p-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />}
      >
        <View className="flex-row justify-between items-center bg-primary rounded-2xl p-6 mb-4 shadow-md">
          <View>
            <Text className="text-indigo-200 text-sm font-medium">Welcome back,</Text>
            <Text className="text-white text-2xl font-bold mt-0.5">{user?.name || 'Student'}</Text>
          </View>
          <View className="bg-white/20 px-4 py-1.5 rounded-full">
            <Text className="text-white font-bold text-xs uppercase tracking-wider">{user?.isAdmin ? 'Admin' : 'Student'}</Text>
          </View>
        </View>

        <View className="flex-row gap-4 mb-6">
          <View className="flex-1 bg-card rounded-xl p-4 items-center justify-center border border-border shadow-sm">
            <Text className="text-2xl font-extrabold text-text">{rooms.length}</Text>
            <Text className="text-xs text-text-muted mt-0.5">Available Rooms</Text>
          </View>
          <TouchableOpacity
            className="flex-1 bg-primary-light rounded-xl p-4 items-center justify-center border border-border shadow-sm"
            onPress={() => navigation.navigate('RoomsTab')}
          >
            <Text className="text-2xl font-extrabold text-primary">Explore</Text>
            <Text className="text-xs text-primary mt-0.5">View All Rooms</Text>
          </TouchableOpacity>
        </View>

        {!user?.isAdmin && activeBooking && (
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-bold text-text">Your Active Booking</Text>
              <TouchableOpacity onPress={() => navigation.navigate('BookingsTab')}>
                <Text className="text-sm font-semibold text-primary">Manage</Text>
              </TouchableOpacity>
            </View>
            <BookingCard
              booking={activeBooking}
              onPress={() => navigation.navigate('BookingDetails', { bookingId: activeBooking._id })}
            />
          </View>
        )}

        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold text-text">Featured Available Rooms</Text>
            <TouchableOpacity onPress={() => navigation.navigate('RoomsTab')}>
              <Text className="text-sm font-semibold text-primary">See All ({rooms.length})</Text>
            </TouchableOpacity>
          </View>

          {rooms.length === 0 ? (
            <View className="bg-card rounded-xl p-6 items-center border border-border">
              <Text className="text-text-muted text-sm">No available rooms right now</Text>
            </View>
          ) : (
            rooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                onPress={() => navigation.navigate('RoomDetails', { roomId: room._id })}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
