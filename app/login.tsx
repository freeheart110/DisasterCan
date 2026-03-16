import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/firebase/config';

function friendlyError(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':  return 'An account with this email already exists.';
    case 'auth/invalid-email':         return 'Please enter a valid email address.';
    case 'auth/weak-password':         return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':        return 'No account found with this email.';
    case 'auth/wrong-password':        return 'Incorrect password.';
    case 'auth/invalid-credential':    return 'Invalid email or password.';
    case 'auth/too-many-requests':     return 'Too many attempts. Please try again later.';
    default:                           return 'Something went wrong. Please try again.';
  }
}

export default function LoginScreen() {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const switchMode = (next: 'signin' | 'register') => {
    setMode(next);
    setError('');
    setConfirmPassword('');
  };

  const handleSubmit = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      // _layout.tsx auth guard redirects to /(tabs)/home on success
    } catch (e: any) {
      setError(friendlyError(e.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient colors={['#1a3a5c', '#2471a3', '#1a7abf']} style={styles.gradient}>
        {/* Hero header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="shield-checkmark" size={44} color="#fff" />
          </View>
          <Text style={styles.appName}>DisasterCan</Text>
          <Text style={styles.tagline}>Stay prepared. Stay safe.</Text>
        </View>

        {/* Form card */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {/* Tab toggle */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tab, mode === 'signin' && styles.tabActive]}
                onPress={() => switchMode('signin')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, mode === 'signin' && styles.tabTextActive]}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, mode === 'register' && styles.tabActive]}
                onPress={() => switchMode('register')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>

            {/* Error message */}
            {!!error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={15} color="#c0392b" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Email */}
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={18} color="#95a5a6" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#bdc3c7"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>

            {/* Password */}
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color="#95a5a6" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="••••••••"
                placeholderTextColor="#bdc3c7"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#95a5a6"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm password — register only */}
            {mode === 'register' && (
              <>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.inputRow}>
                  <Ionicons name="lock-closed-outline" size={18} color="#95a5a6" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="••••••••"
                    placeholderTextColor="#bdc3c7"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                  />
                </View>
              </>
            )}

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },

  // Header
  header: { alignItems: 'center', paddingTop: 72, paddingBottom: 32 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 14,
  },
  appName: { fontSize: 30, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.65)', marginTop: 4 },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f4f8',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#95a5a6' },
  tabTextActive: { color: '#2471a3' },

  // Error
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fdecea', borderRadius: 8,
    paddingVertical: 10, paddingHorizontal: 12, marginBottom: 16,
  },
  errorText: { fontSize: 13, color: '#c0392b', flex: 1 },

  // Inputs
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#34495e', marginBottom: 6 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f8f9fa', borderRadius: 10,
    borderWidth: 1, borderColor: '#e9ecef',
    paddingHorizontal: 12, marginBottom: 16, height: 48,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: '#2c3e50' },
  eyeBtn: { padding: 4 },

  // Submit
  submitBtn: {
    backgroundColor: '#2471a3', borderRadius: 12,
    height: 50, justifyContent: 'center', alignItems: 'center',
    marginTop: 4,
    shadowColor: '#2471a3', shadowOpacity: 0.35, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
