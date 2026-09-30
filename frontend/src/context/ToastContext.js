import React, { createContext, useState, useContext } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [fadeAnim] = useState(new Animated.Value(0));

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ visible: true, message, type });
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true
      }),
      Animated.delay(duration),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true
      })
    ]).start(() => {
      setToast({ visible: false, message: '', type: 'success' });
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <Animated.View
          style={[
            styles.toastContainer,
            toast.type === 'danger' ? styles.bgDanger : styles.bgSuccess,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.toastText}>
            {toast.type === 'danger' ? '❌ ' : '✅ '}
            {toast.message}
          </Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bgSuccess: {
    backgroundColor: '#10B981'
  },
  bgDanger: {
    backgroundColor: '#EF4444'
  },
  toastText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center'
  }
});
