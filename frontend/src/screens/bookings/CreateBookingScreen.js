import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bookingService } from '../../services/bookingService';
import { useToast } from '../../context/ToastContext';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';

export const CreateBookingScreen = ({ route, navigation }) => {
  const { showToast } = useToast();
  const { room } = route.params;

  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(nextMonth);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let valid = true;
    let err = {};

    if (!startDate) {
      err.startDate = 'Start date is required (YYYY-MM-DD)';
      valid = false;
    }

    if (!endDate) {
      err.endDate = 'End date is required (YYYY-MM-DD)';
      valid = false;
    } else if (new Date(endDate) <= new Date(startDate)) {
      err.endDate = 'End date must be after start date';
      valid = false;
    }

    setErrors(err);
    return valid;
  };

  const handleBookingSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        roomId: room._id,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        notes: notes.trim()
      };

      const res = await bookingService.createBooking(payload);
      if (res.success) {
        showToast('Room booking submitted successfully!', 'success');
        navigation.navigate('HomeTab');
      }
    } catch (error) {
      showToast(error.message || 'Failed to process booking request', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <View className="bg-primary-light rounded-2xl p-6 mb-4 border border-indigo-200">
          <Text className="text-xs font-bold text-primary uppercase tracking-wider">Selected Room</Text>
          <Text className="text-xl font-extrabold text-primary-dark mt-1">Room {room.roomNumber} ({room.roomType})</Text>
          <Text className="text-sm font-semibold text-primary mt-0.5">LKR {room.pricePerMonth?.toLocaleString()}/month</Text>
        </View>

        <View className="bg-card rounded-2xl p-6 border border-border">
          <Text className="text-base font-bold text-text mb-4">Booking Period</Text>

          <AppInput
            label="Start Date (YYYY-MM-DD)"
            placeholder="2026-10-01"
            value={startDate}
            onChangeText={setStartDate}
            error={errors.startDate}
          />

          <AppInput
            label="End Date (YYYY-MM-DD)"
            placeholder="2026-11-01"
            value={endDate}
            onChangeText={setEndDate}
            error={errors.endDate}
          />

          <AppInput
            label="Additional Notes / Special Requests (Optional)"
            placeholder="E.g. Ground floor preference, quiet study area..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />

          <AppButton
            title="Confirm Booking"
            onPress={handleBookingSubmit}
            loading={loading}
            className="mt-4"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateBookingScreen;
