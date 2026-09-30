import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success && res.data) {
      const userData = res.data;
      const userToken = userData.token;

      setUser(userData);
      setToken(userToken);

      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, userToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success && res.data) {
      const newUser = res.data;
      const userToken = newUser.token;

      setUser(newUser);
      setToken(userToken);

      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, userToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error during logout storage cleanup:', error);
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        isAdmin: user?.isAdmin || false
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
