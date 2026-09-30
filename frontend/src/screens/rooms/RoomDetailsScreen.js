import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import { roomService } from '../../services/roomService';
import StatusBadge from '../../components/StatusBadge';
import AppButton from '../../components/AppButton';
import { LoadingSpinner, ErrorState } from '../../components/FeedbackStates';

export const RoomDetailsScreen = ({ route, navigation }) => {
  const { roomId } = route.params;
  const { user } = useContext(AuthContext);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoomDetails = async () => {
    try {
      setError(null);
      const res = await roomService.getRoomById(roomId);
      if (res.success) {
        setRoom(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load room details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  if (loading) {
    return <LoadingSpinner message="Loading room details..." />;
  }

  if (error || !room) {
    return <ErrorState message={error || 'Room not found'} onRetry={fetchRoomDetails} />;
  }

  const defaultImage = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80';
  const imageUrl = room.image && room.image.trim() !== '' ? room.image : defaultImage;
  const remainingCapacity = room.capacity - room.currentOccupancy;
  const isBookable = room.availabilityStatus === 'Available' && remainingCapacity > 0;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Image source={{ uri: imageUrl }} className="w-full h-60" resizeMode="cover" />

        <View className="bg-card rounded-t-3xl -mt-6 p-6 min-h-[400px]">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-2xl font-extrabold text-text">Room {room.roomNumber}</Text>
              <Text className="text-sm text-text-muted mt-0.5">{room.roomType} Accommodation</Text>
            </View>
            <StatusBadge status={room.availabilityStatus} />
          </View>

          <View className="flex-row items-baseline my-4">
            <Text className="text-3xl font-extrabold text-primary">LKR {room.pricePerMonth?.toLocaleString()}</Text>
            <Text className="text-sm text-text-muted ml-1">/ month</Text>
          </View>

          <View className="flex-row bg-input rounded-xl p-4 my-4">
            <View className="flex-1 items-center">
              <Text className="text-[10px] text-text-light uppercase tracking-wider mb-1">Total Capacity</Text>
              <Text className="text-sm font-bold text-text">{room.capacity} Persons</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-[10px] text-text-light uppercase tracking-wider mb-1">Current Occupancy</Text>
              <Text className="text-sm font-bold text-text">{room.currentOccupancy} Occupied</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-[10px] text-text-light uppercase tracking-wider mb-1">Remaining Spots</Text>
              <Text className={`text-sm font-bold ${remainingCapacity > 0 ? 'text-accent' : 'text-danger'}`}>
                {remainingCapacity} Available
              </Text>
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-base font-bold text-text mb-1">Description & Facilities</Text>
            <Text className="text-sm text-text-muted leading-6">
              {room.description || 'No description provided for this room.'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {!user?.isAdmin && (
        <View className="absolute bottom-0 left-0 right-0 bg-card p-4 border-t border-border shadow-md">
          <AppButton
            title={isBookable ? 'Book This Room' : 'Room Unavailable'}
            disabled={!isBookable}
            onPress={() => navigation.navigate('CreateBooking', { room })}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default RoomDetailsScreen;
