import React, { useContext } from 'react';
import { View, Text, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import AppButton from '../../components/AppButton';

export const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to sign out of HostelHub?')) {
        logout();
      }
    } else {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out of HostelHub?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: () => logout()
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="items-center bg-card rounded-2xl p-6 mb-4 border border-border shadow-sm">
          <View className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-3">
            <Text className="text-white text-3xl font-extrabold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <Text className="text-2xl font-extrabold text-text">{user?.name}</Text>
          <Text className="text-sm text-text-muted mt-0.5">{user?.email}</Text>

          <View className="bg-primary-light px-4 py-1 rounded-full mt-3">
            <Text className="text-primary text-xs font-bold">{user?.isAdmin ? 'Administrator' : 'Student Account'}</Text>
          </View>
        </View>

        <View className="bg-card rounded-2xl p-6 mb-4 border border-border">
          <Text className="text-base font-bold text-text mb-4">Account Details</Text>
          
          <View className="flex-row justify-between py-2 border-b border-border">
            <Text className="text-sm text-text-muted">Full Name</Text>
            <Text className="text-sm font-semibold text-text">{user?.name}</Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-border">
            <Text className="text-sm text-text-muted">Email Address</Text>
            <Text className="text-sm font-semibold text-text">{user?.email}</Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-border">
            <Text className="text-sm text-text-muted">Phone Number</Text>
            <Text className="text-sm font-semibold text-text">{user?.phone}</Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-border">
            <Text className="text-sm text-text-muted">Role</Text>
            <Text className="text-sm font-semibold text-text">{user?.isAdmin ? 'Admin' : 'Student'}</Text>
          </View>
        </View>

        {user?.isAdmin && (
          <View className="bg-card rounded-2xl p-6 mb-4 border border-border">
            <Text className="text-base font-bold text-text mb-3">Admin Controls</Text>
            <AppButton
              title="Admin Dashboard"
              variant="secondary"
              onPress={() => navigation.navigate('AdminDashboard')}
            />
          </View>
        )}

        <View className="mt-2">
          <AppButton
            title="Sign Out"
            variant="danger"
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
