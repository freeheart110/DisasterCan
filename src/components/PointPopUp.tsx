import React, { useEffect } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

interface PointPopUpProps {
  value: number;
  onComplete?: () => void;
}

export const PointPopUp: React.FC<PointPopUpProps> = ({ value, onComplete }) => {
  const opacity = new Animated.Value(1);
  const translateY = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -40,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete?.(); // Notify parent to remove the component
    });
  }, []);

  return (
    <Animated.View
      style={[
        styles.popUp,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={[styles.text, { color: value > 0 ? '#27ae60' : '#e74c3c' }]}>
        {value > 0 ? `✨ +${value}` : `${value}`} Point
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  popUp: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});