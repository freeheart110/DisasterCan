import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

interface CompleteCelebrationProps {
  message: string;
  onComplete?: () => void;
}

const CompleteCelebration: React.FC<CompleteCelebrationProps> = ({ message, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.(); // Notify parent to hide the celebration
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ConfettiCannon count={100} origin={{ x: Dimensions.get('window').width / 2, y: 0 }} fadeOut />
      <View style={styles.messageBox}>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </View>
  );
};

export default CompleteCelebration;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)', // dimming background
  },
  messageBox: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  messageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    textAlign: 'center',
  },
});