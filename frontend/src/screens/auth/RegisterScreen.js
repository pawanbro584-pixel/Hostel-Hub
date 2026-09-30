import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';

export const RegisterScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let valid = true;
    let err = {};

    if (!name.trim()) {
      err.name = 'Full name is required';
      valid = false;
    }

    if (!email.trim()) {
      err.email = 'Email address is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      err.email = 'Invalid email address format';
      valid = false;
    }

    if (!phone.trim()) {
      err.phone = 'Phone number is required';
      valid = false;
    }

    if (!password) {
      err.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      err.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (password !== confirmPassword) {
      err.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(err);
    return valid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register({ name, email, phone, password, isAdmin });
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="p-6" keyboardShouldPersistTaps="handled">
        <View className="mb-6 items-center">
          <Text className="text-2xl font-extrabold text-primary mb-1">Create Account</Text>
          <Text className="text-sm text-text-muted text-center">Join HostelHub to find and book student rooms</Text>
        </View>

        <View className="bg-card rounded-2xl p-6 border border-border">
          <AppInput
            label="Full Name"
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />

          <AppInput
            label="Email Address"
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
          />

          <AppInput
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            error={errors.phone}
          />

          <AppInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />

          <AppInput
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errors.confirmPassword}
          />

          <View className="flex-row items-center my-2 py-1">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-text">Register as Admin</Text>
              <Text className="text-xs text-text-muted">Enable room & booking management</Text>
            </View>
            <Switch
              value={isAdmin}
              onValueChange={setIsAdmin}
              trackColor={{ false: '#E2E8F0', true: '#EEF2FF' }}
              thumbColor={isAdmin ? '#4F46E5' : '#94A3B8'}
            />
          </View>

          <AppButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            className="mt-4"
          />
        </View>

        <View className="flex-row justify-center mt-6">
          <Text className="text-text-muted text-sm">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-primary font-bold text-sm">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
