import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, RefreshControl, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import BookingCard from '../../components/BookingCard';
import { LoadingSpinner, EmptyState, ErrorState } from '../../components/FeedbackStates';

export const MyBookingsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setError(null);
      const res = await bookingService.getAllBookings();
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const performCancel = async (bookingId) => {
    try {
      const res = await bookingService.cancelBooking(bookingId);
      if (res.success) {
        if (Platform.OS === 'web') {
          alert('Your booking has been cancelled.');
        } else {
          Alert.alert('Booking Cancelled', 'Your booking has been cancelled.');
        }
        fetchBookings();
      }
    } catch (err) {
      if (Platform.OS === 'web') {
        alert(err.message || 'Could not cancel booking');
      } else {
        Alert.alert('Error', err.message || 'Could not cancel booking');
      }
    }
  };

  const handleCancelBooking = (bookingId) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to cancel this room booking?')) {
        performCancel(bookingId);
      }
    } else {
      Alert.alert(
        'Cancel Booking',
        'Are you sure you want to cancel this room booking?',
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes, Cancel',
            style: 'destructive',
            onPress: () => performCancel(bookingId)
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-4 bg-card border-b border-border">
        <Text className="text-2xl font-extrabold text-text">{user?.isAdmin ? 'All Student Bookings' : 'My Bookings'}</Text>
      </View>

      {loading ? (
        <LoadingSpinner message="Fetching bookings..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchBookings} />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              isAdmin={user?.isAdmin}
              onPress={() => navigation.navigate('BookingDetails', { bookingId: item._id })}
              onCancel={() => handleCancelBooking(item._id)}
            />
          )}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />}
          ListEmptyComponent={
            <EmptyState
              title="No Bookings Yet"
              message={user?.isAdmin ? 'No bookings have been made by students.' : 'You have not made any room bookings yet.'}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default MyBookingsScreen;
