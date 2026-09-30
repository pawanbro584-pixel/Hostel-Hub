import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import StatusBadge from './StatusBadge';

export const RoomCard = ({ room, onPress }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80';
  const imageUrl = room.image && room.image.trim() !== '' ? room.image : defaultImage;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="bg-card rounded-2xl mb-4 overflow-hidden border border-border shadow-sm"
    >
      <Image source={{ uri: imageUrl }} className="w-full h-40" resizeMode="cover" />
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-lg font-bold text-text">Room {room.roomNumber}</Text>
          <StatusBadge status={room.availabilityStatus} />
        </View>

        <Text className="text-sm text-text-muted mb-3">{room.roomType} Room</Text>

        <View className="flex-row justify-between items-end border-t border-border pt-3">
          <View>
            <Text className="text-[11px] text-text-light uppercase tracking-wider">Monthly Rent</Text>
            <Text className="text-base font-bold text-primary">
              LKR {room.pricePerMonth?.toLocaleString()}/mo
            </Text>
          </View>
          <View className="bg-primary-light px-3 py-1 rounded-md">
            <Text className="text-xs font-semibold text-primary">
              {room.currentOccupancy}/{room.capacity} Occupied
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RoomCard;
