import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import StatusBadge from '../../components/StatusBadge';
import AppButton from '../../components/AppButton';
import { LoadingSpinner, ErrorState } from '../../components/FeedbackStates';

export const BookingDetailsScreen = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const { user } = useContext(AuthContext);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookingDetails = async () => {
    try {
      setError(null);
      const res = await bookingService.getBookingById(bookingId);
      if (res.success) {
        setBooking(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const res = await bookingService.approveBooking(bookingId);
      if (res.success) {
        Alert.alert('Approved', 'Booking approved successfully. Room occupancy updated.');
        fetchBookingDetails();
      }
    } catch (err) {
      Alert.alert('Approval Failed', err.message || 'Error approving booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      const res = await bookingService.rejectBooking(bookingId);
      if (res.success) {
        Alert.alert('Rejected', 'Booking has been rejected.');
        fetchBookingDetails();
      }
    } catch (err) {
      Alert.alert('Rejection Failed', err.message || 'Error rejecting booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      const res = await bookingService.cancelBooking(bookingId);
      if (res.success) {
        Alert.alert('Cancelled', 'Booking has been cancelled.');
        fetchBookingDetails();
      }
    } catch (err) {
      Alert.alert('Cancel Failed', err.message || 'Error cancelling booking');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading booking details..." />;
  }

  if (error || !booking) {
    return <ErrorState message={error || 'Booking details unavailable'} onRetry={fetchBookingDetails} />;
  }

  const room = booking.roomId || {};
  const student = booking.userId || {};

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="bg-card rounded-2xl p-6 border border-border">
          <View className="flex-row justify-between items-center mb-4 border-b border-border pb-3">
            <Text className="text-xl font-extrabold text-text">Booking Summary</Text>
            <StatusBadge status={booking.status} />
          </View>

          <View className="mb-4">
            <Text className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Applicant Details</Text>
            <Text className="text-sm text-text">Name: {student.name}</Text>
            <Text className="text-sm text-text">Email: {student.email}</Text>
            <Text className="text-sm text-text">Phone: {student.phone}</Text>
          </View>

          <View className="mb-4">
            <Text className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Room Details</Text>
            <Text className="text-sm text-text">Room Number: {room.roomNumber}</Text>
            <Text className="text-sm text-text">Type: {room.roomType}</Text>
            <Text className="text-sm text-text">Price: LKR {room.pricePerMonth?.toLocaleString()}/month</Text>
            <Text className="text-sm text-text">Capacity: {room.currentOccupancy} / {room.capacity} occupied</Text>
          </View>

          <View className="mb-4">
            <Text className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Booking Period</Text>
            <Text className="text-sm text-text">Start Date: {new Date(booking.startDate).toLocaleDateString()}</Text>
            <Text className="text-sm text-text">End Date: {new Date(booking.endDate).toLocaleDateString()}</Text>
            <Text className="text-sm text-text">Request Date: {new Date(booking.createdAt).toLocaleDateString()}</Text>
          </View>

          {booking.notes ? (
            <View className="mb-4">
              <Text className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Notes / Remarks</Text>
              <Text className="text-sm text-text-muted italic">{booking.notes}</Text>
            </View>
          ) : null}
        </View>

        <View className="mt-6">
          {user?.isAdmin && booking.status === 'Pending' && (
            <View className="flex-row gap-4">
              <AppButton
                title="Approve Booking"
                variant="primary"
                onPress={handleApprove}
                loading={actionLoading}
                className="flex-1"
              />
              <AppButton
                title="Reject"
                variant="danger"
                onPress={handleReject}
                loading={actionLoading}
                className="flex-1"
              />
            </View>
          )}

          {!user?.isAdmin && booking.status !== 'Cancelled' && (
            <AppButton
              title="Cancel Booking"
              variant="danger"
              onPress={handleCancel}
              loading={actionLoading}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingDetailsScreen;
