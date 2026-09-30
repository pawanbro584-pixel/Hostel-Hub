import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import StatusBadge from './StatusBadge';

export const BookingCard = ({ booking, onPress, onCancel, onApprove, onReject, isAdmin = false }) => {
  const room = booking.roomId || {};
  const user = booking.userId || {};

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-card rounded-2xl p-4 mb-4 border border-border shadow-sm"
    >
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-base font-bold text-text">
            Room {room.roomNumber || 'N/A'} ({room.roomType || 'Standard'})
          </Text>
          {isAdmin && <Text className="text-xs color-primary font-medium mt-0.5">Booked by: {user.name || 'Unknown User'}</Text>}
        </View>
        <StatusBadge status={booking.status} />
      </View>

      <View className="flex-row bg-input rounded-xl p-3 my-1 items-center">
        <View className="flex-1 items-center">
          <Text className="text-[10px] text-text-light uppercase tracking-wider">Check-in</Text>
          <Text className="text-xs font-semibold text-text mt-0.5">{formatDate(booking.startDate)}</Text>
        </View>
        <View className="w-[1px] h-full bg-border" />
        <View className="flex-1 items-center">
          <Text className="text-[10px] text-text-light uppercase tracking-wider">Check-out</Text>
          <Text className="text-xs font-semibold text-text mt-0.5">{formatDate(booking.endDate)}</Text>
        </View>
      </View>

      {booking.notes ? (
        <Text className="text-xs text-text-muted mt-1 italic" numberOfLines={2}>
          Notes: {booking.notes}
        </Text>
      ) : null}

      <View className="mt-2 border-t border-border pt-2">
        {!isAdmin && booking.status !== 'Cancelled' && (
          <TouchableOpacity className="bg-danger-light px-3 py-1.5 rounded-lg self-end" onPress={onCancel}>
            <Text className="text-danger font-bold text-xs">Cancel Booking</Text>
          </TouchableOpacity>
        )}

        {isAdmin && booking.status === 'Pending' && (
          <View className="flex-row justify-end gap-2">
            <TouchableOpacity className="bg-accent-light px-3 py-1.5 rounded-lg" onPress={onApprove}>
              <Text className="text-accent font-bold text-xs">Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-danger-light px-3 py-1.5 rounded-lg" onPress={onReject}>
              <Text className="text-danger font-bold text-xs">Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default BookingCard;
