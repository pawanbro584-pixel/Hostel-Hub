import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { roomService } from '../../services/roomService';
import RoomCard from '../../components/RoomCard';
import { LoadingSpinner, EmptyState, ErrorState } from '../../components/FeedbackStates';

export const RoomListScreen = ({ navigation }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const roomTypes = ['All', 'Single', 'Double', 'Triple'];
  const availabilityStatuses = ['All', 'Available', 'Full', 'Unavailable'];

  const fetchRooms = async () => {
    try {
      setError(null);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedType !== 'All') params.roomType = selectedType;
      if (selectedStatus !== 'All') params.availabilityStatus = selectedStatus;

      const res = await roomService.getAllRooms(params);
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
  }, [selectedType, selectedStatus]);

  const handleSearchSubmit = () => {
    setLoading(true);
    fetchRooms();
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRooms();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-4 bg-card border-b border-border">
        <Text className="text-2xl font-extrabold text-text mb-2">Find a Room</Text>

        <View className="flex-row gap-2 mb-2">
          <TextInput
            className="flex-1 h-11 bg-input rounded-xl px-4 text-sm text-text border border-border"
            placeholder="Search room number (e.g. A-101)..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          <TouchableOpacity className="bg-primary rounded-xl px-4 justify-center items-center" onPress={handleSearchSubmit}>
            <Text className="text-white font-semibold text-sm">Search</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mt-1">
          <Text className="text-xs font-bold text-text-muted w-12">Type:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 4 }}>
            {roomTypes.map((type) => (
              <TouchableOpacity
                key={type}
                className={`px-4 py-1 rounded-full border ${
                  selectedType === type ? 'bg-primary border-primary' : 'bg-input border-border'
                }`}
                onPress={() => setSelectedType(type)}
              >
                <Text className={`text-xs font-semibold ${selectedType === type ? 'text-white' : 'text-text-muted'}`}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="flex-row items-center mt-1">
          <Text className="text-xs font-bold text-text-muted w-12">Status:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 4 }}>
            {availabilityStatuses.map((status) => (
              <TouchableOpacity
                key={status}
                className={`px-4 py-1 rounded-full border ${
                  selectedStatus === status ? 'bg-primary border-primary' : 'bg-input border-border'
                }`}
                onPress={() => setSelectedStatus(status)}
              >
                <Text className={`text-xs font-semibold ${selectedStatus === status ? 'text-white' : 'text-text-muted'}`}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {loading ? (
        <LoadingSpinner message="Searching rooms..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchRooms} />
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <RoomCard
              room={item}
              onPress={() => navigation.navigate('RoomDetails', { roomId: item._id })}
            />
          )}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />}
          ListEmptyComponent={
            <EmptyState
              title="No Rooms Found"
              message="Try adjusting your search query or filter options."
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default RoomListScreen;
