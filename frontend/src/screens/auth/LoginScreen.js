import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';

export const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  const validateForm = () => {
    let valid = true;
    let err = {};
    setAuthError('');

    if (!email.trim()) {
      err.email = 'Email address is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      err.email = 'Invalid email address format';
      valid = false;
    }

    if (!password) {
      err.password = 'Password is required';
      valid = false;
    }

    setErrors(err);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setAuthError('');
    try {
      await login(email, password);
    } catch (error) {
      const msg = error.message || 'Invalid email or password';
      setAuthError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="p-6" keyboardShouldPersistTaps="handled">
        <View className="mb-8 items-center">
          <Text className="text-3xl font-extrabold text-primary mb-1">HostelHub</Text>
          <Text className="text-sm text-text-muted text-center">Sign in to manage your room bookings</Text>
        </View>

        <View className="bg-card rounded-2xl p-6 border border-border">
          {authError ? (
            <View className="bg-danger-light border border-danger/30 rounded-xl p-3.5 mb-4 flex-row items-center">
              <Text className="text-danger font-semibold text-xs flex-1 text-center">
                ⚠️ {authError}
              </Text>
            </View>
          ) : null}
          <AppInput
            label="Email Address"
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
          />

          <AppInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />

          <AppButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            className="mt-4"
          />
        </View>

        <View className="flex-row justify-center mt-8">
          <Text className="text-text-muted text-sm">Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text className="text-primary font-bold text-sm">Register here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
