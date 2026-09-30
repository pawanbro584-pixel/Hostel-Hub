import React from 'react';
import { View, Text } from 'react-native';

export const StatusBadge = ({ status }) => {
  let bgClass = "bg-slate-100";
  let textClass = "text-text-muted";

  switch (status) {
    case 'Available':
    case 'Approved':
      bgClass = "bg-accent-light";
      textClass = "text-accent";
      break;
    case 'Pending':
      bgClass = "bg-warning-light";
      textClass = "text-warning";
      break;
    case 'Full':
    case 'Rejected':
    case 'Cancelled':
    case 'Unavailable':
      bgClass = "bg-danger-light";
      textClass = "text-danger";
      break;
  }

  return (
    <View className={`px-2.5 py-1 rounded-full self-start ${bgClass}`}>
      <Text className={`text-xs font-bold uppercase tracking-wider ${textClass}`}>{status}</Text>
    </View>
  );
};

export default StatusBadge;
