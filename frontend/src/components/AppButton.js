import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

export const AppButton = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  style,
  textStyle
}) => {
  let btnClasses = "h-12 rounded-xl flex-row items-center justify-center px-6 ";
  let textClasses = "text-base font-semibold ";

  if (disabled) {
    btnClasses += "bg-border ";
    textClasses += "text-text-light ";
  } else if (variant === 'secondary') {
    btnClasses += "bg-primary-light ";
    textClasses += "text-primary ";
  } else if (variant === 'danger') {
    btnClasses += "bg-danger ";
    textClasses += "text-white ";
  } else {
    btnClasses += "bg-primary ";
    textClasses += "text-white ";
  }

  btnClasses += className;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      className={btnClasses.trim()}
      style={style}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#4F46E5' : '#FFFFFF'} />
      ) : (
        <Text className={textClasses} style={textStyle}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;
