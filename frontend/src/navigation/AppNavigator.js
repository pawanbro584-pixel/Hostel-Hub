import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

import { AuthContext } from '../context/AuthContext';
import HomeScreen from '../screens/rooms/HomeScreen';
import RoomListScreen from '../screens/rooms/RoomListScreen';
import RoomDetailsScreen from '../screens/rooms/RoomDetailsScreen';
import CreateBookingScreen from '../screens/bookings/CreateBookingScreen';
import MyBookingsScreen from '../screens/bookings/MyBookingsScreen';
import BookingDetailsScreen from '../screens/bookings/BookingDetailsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import ManageRoomsScreen from '../screens/admin/ManageRoomsScreen';
import AddEditRoomScreen from '../screens/admin/AddEditRoomScreen';
import ManageBookingsScreen from '../screens/admin/ManageBookingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ emoji }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 18 }}>{emoji}</Text>
  </View>
);

// Student Stack Navigators
const StudentHomeStack = () => (
  <Stack.Navigator screenOptions={{ headerBackTitleVisible: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="RoomDetails" component={RoomDetailsScreen} options={{ title: 'Room Info' }} />
    <Stack.Screen name="CreateBooking" component={CreateBookingScreen} options={{ title: 'Book Room' }} />
    <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} options={{ title: 'Booking Request' }} />
  </Stack.Navigator>
);

const StudentRoomsStack = () => (
  <Stack.Navigator screenOptions={{ headerBackTitleVisible: false }}>
    <Stack.Screen name="RoomListMain" component={RoomListScreen} options={{ headerShown: false }} />
    <Stack.Screen name="RoomDetails" component={RoomDetailsScreen} options={{ title: 'Room Info' }} />
    <Stack.Screen name="CreateBooking" component={CreateBookingScreen} options={{ title: 'Book Room' }} />
  </Stack.Navigator>
);

const StudentBookingsStack = () => (
  <Stack.Navigator screenOptions={{ headerBackTitleVisible: false }}>
    <Stack.Screen name="MyBookingsMain" component={MyBookingsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} options={{ title: 'Booking Details' }} />
  </Stack.Navigator>
);

// Admin Dedicated Stack Navigators
const AdminDashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerBackTitleVisible: false }}>
    <Stack.Screen name="AdminDashboardMain" component={AdminDashboardScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ManageRooms" component={ManageRoomsScreen} options={{ title: 'Manage Rooms' }} />
    <Stack.Screen name="AddRoom" component={AddEditRoomScreen} options={{ title: 'Add Room' }} />
    <Stack.Screen name="EditRoom" component={AddEditRoomScreen} options={{ title: 'Edit Room' }} />
    <Stack.Screen name="ManageBookings" component={ManageBookingsScreen} options={{ title: 'Manage Requests' }} />
  </Stack.Navigator>
);

const AdminRoomsStack = () => (
  <Stack.Navigator screenOptions={{ headerBackTitleVisible: false }}>
    <Stack.Screen name="ManageRoomsMain" component={ManageRoomsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="AddRoom" component={AddEditRoomScreen} options={{ title: 'Add Room' }} />
    <Stack.Screen name="EditRoom" component={AddEditRoomScreen} options={{ title: 'Edit Room' }} />
  </Stack.Navigator>
);

const AdminRequestsStack = () => (
  <Stack.Navigator screenOptions={{ headerBackTitleVisible: false }}>
    <Stack.Screen name="ManageBookingsMain" component={ManageBookingsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} options={{ title: 'Request Details' }} />
  </Stack.Navigator>
);

const SharedProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerBackTitleVisible: false }}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin Control Panel' }} />
    <Stack.Screen name="ManageRooms" component={ManageRoomsScreen} options={{ title: 'Manage Rooms' }} />
    <Stack.Screen name="AddRoom" component={AddEditRoomScreen} options={{ title: 'Add Room' }} />
    <Stack.Screen name="EditRoom" component={AddEditRoomScreen} options={{ title: 'Edit Room' }} />
    <Stack.Screen name="ManageBookings" component={ManageBookingsScreen} options={{ title: 'Manage Requests' }} />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.isAdmin || false;

  if (isAdmin) {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#4F46E5',
          tabBarInactiveTintColor: '#64748B',
          tabBarStyle: {
            height: 60,
            paddingBottom: 8,
            paddingTop: 8
          }
        }}
      >
        <Tab.Screen
          name="AdminDashboardTab"
          component={AdminDashboardStack}
          options={{
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ focused }) => <TabIcon emoji="📊" />
          }}
        />
        <Tab.Screen
          name="AdminRoomsTab"
          component={AdminRoomsStack}
          options={{
            tabBarLabel: 'Rooms',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🛌" />
          }}
        />
        <Tab.Screen
          name="AdminRequestsTab"
          component={AdminRequestsStack}
          options={{
            tabBarLabel: 'Requests',
            tabBarIcon: ({ focused }) => <TabIcon emoji="📋" />
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={SharedProfileStack}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ focused }) => <TabIcon emoji="👤" />
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8
        }
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={StudentHomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" />
        }}
      />
      <Tab.Screen
        name="RoomsTab"
        component={StudentRoomsStack}
        options={{
          tabBarLabel: 'Rooms',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🛌" />
        }}
      />
      <Tab.Screen
        name="BookingsTab"
        component={StudentBookingsStack}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" />
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={SharedProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" />
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
