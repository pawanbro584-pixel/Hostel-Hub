import React from 'react';
import { View, Text, TextInput } from 'react-native';

export const AppInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle
}) => {
  return (
    <View className="mb-4" style={style}>
      {label && <Text className="text-sm font-semibold text-text mb-1.5">{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        className={`h-12 bg-input rounded-xl px-4 text-base text-text border ${
          error ? 'border-danger' : 'border-border'
        } ${multiline ? 'h-24 pt-3' : ''}`}
        style={inputStyle}
      />
      {error ? <Text className="text-danger text-xs mt-1">{error}</Text> : null}
    </View>
  );
};

export default AppInput;
