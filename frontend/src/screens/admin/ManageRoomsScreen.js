import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, Alert, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { roomService } from '../../services/roomService';
import { useToast } from '../../context/ToastContext';
import AppButton from '../../components/AppButton';
import StatusBadge from '../../components/StatusBadge';
import { LoadingSpinner, EmptyState, ErrorState } from '../../components/FeedbackStates';

export const ManageRoomsScreen = ({ navigation }) => {
  const { showToast } = useToast();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchRooms = async () => {
    try {
      setError(null);
      const res = await roomService.getAllRooms();
      if (res.success) {
        setRooms(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch rooms');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRooms();
  };

  const performDelete = async (roomId, roomNumber) => {
    try {
      const res = await roomService.deleteRoom(roomId);
      if (res.success) {
        showToast(`Room ${roomNumber} deleted successfully!`, 'success');
        fetchRooms();
      }
    } catch (err) {
      showToast(err.message || 'Cannot delete room with active bookings', 'danger');
    }
  };

  const handleDeleteRoom = (roomId, roomNumber) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Are you sure you want to delete Room ${roomNumber}?`)) {
        performDelete(roomId, roomNumber);
      }
    } else {
      Alert.alert(
        'Delete Room',
        `Are you sure you want to delete Room ${roomNumber}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => performDelete(roomId, roomNumber)
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row justify-between items-center p-4 bg-card border-b border-border">
        <Text className="text-xl font-extrabold text-text">Manage Rooms</Text>
        <AppButton
          title="+ Add Room"
          onPress={() => navigation.navigate('AddRoom')}
          className="h-10 px-4"
        />
      </View>

      {loading ? (
        <LoadingSpinner message="Loading rooms inventory..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchRooms} />
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View className="bg-card rounded-xl p-4 mb-3 border border-border flex-row justify-between items-center shadow-sm">
              <View className="flex-1 pr-2">
                <View className="flex-row items-center gap-2 mb-1">
                  <Text className="text-base font-bold text-text">Room {item.roomNumber}</Text>
                  <StatusBadge status={item.availabilityStatus} />
                </View>
                <Text className="text-xs text-text-muted">
                  {item.roomType} • LKR {item.pricePerMonth?.toLocaleString()}/mo • {item.currentOccupancy}/{item.capacity} Occupied
                </Text>
              </View>

              <View className="flex-row gap-1.5">
                <TouchableOpacity
                  className="bg-primary-light px-3 py-1.5 rounded-md"
                  onPress={() => navigation.navigate('EditRoom', { room: item })}
                >
                  <Text className="text-primary font-bold text-xs">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-danger-light px-3 py-1.5 rounded-md"
                  onPress={() => handleDeleteRoom(item._id, item.roomNumber)}
                >
                  <Text className="text-danger font-bold text-xs">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />}
          ListEmptyComponent={
            <EmptyState
              title="No Rooms Configured"
              message="Click '+ Add Room' above to create your first hostel room."
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ManageRoomsScreen;
