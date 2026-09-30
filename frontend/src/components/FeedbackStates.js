import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <View className="p-8 items-center justify-center min-h-[200px]">
    <ActivityIndicator size="large" color="#4F46E5" />
    {message ? <Text className="mt-2 text-text-muted text-sm">{message}</Text> : null}
  </View>
);

export const EmptyState = ({ title = 'No Items Found', message = 'There are no records to display at this time.' }) => (
  <View className="p-8 items-center justify-center min-h-[200px]">
    <Text className="text-lg font-bold text-text mb-1">{title}</Text>
    <Text className="text-sm text-text-muted text-center">{message}</Text>
  </View>
);

export const ErrorState = ({ message = 'Something went wrong', onRetry }) => (
  <View className="p-8 items-center justify-center min-h-[200px]">
    <Text className="text-lg font-bold text-danger mb-1">Error</Text>
    <Text className="text-sm text-text-muted text-center">{message}</Text>
  </View>
);
