import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bookingService } from '../../services/bookingService';
import BookingCard from '../../components/BookingCard';
import { LoadingSpinner, EmptyState, ErrorState } from '../../components/FeedbackStates';

export const ManageBookingsScreen = ({ navigation }) => {
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
      setError(err.message || 'Failed to fetch bookings list');
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

  const handleApprove = async (bookingId) => {
    try {
      const res = await bookingService.approveBooking(bookingId);
      if (res.success) {
        Alert.alert('Approved', 'Booking request approved successfully.');
        fetchBookings();
      }
    } catch (err) {
      Alert.alert('Approval Error', err.message || 'Could not approve booking');
    }
  };

  const handleReject = async (bookingId) => {
    try {
      const res = await bookingService.rejectBooking(bookingId);
      if (res.success) {
        Alert.alert('Rejected', 'Booking request rejected.');
        fetchBookings();
      }
    } catch (err) {
      Alert.alert('Rejection Error', err.message || 'Could not reject booking');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-4 bg-card border-b border-border">
        <Text className="text-xl font-extrabold text-text">Manage Booking Requests</Text>
      </View>

      {loading ? (
        <LoadingSpinner message="Fetching pending requests..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchBookings} />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              isAdmin={true}
              onPress={() => navigation.navigate('BookingDetails', { bookingId: item._id })}
              onApprove={() => handleApprove(item._id)}
              onReject={() => handleReject(item._id)}
            />
          )}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />}
          ListEmptyComponent={
            <EmptyState
              title="No Booking Requests"
              message="There are currently no student room booking requests."
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ManageBookingsScreen;
