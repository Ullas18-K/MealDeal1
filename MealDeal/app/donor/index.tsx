import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { API_URL, storeTokens, storeUser } from '@/utils/auth';

const gradient = ['#03040f', '#0b1226', '#111f3e'] as const;

export default function DonorLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing details', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      if (data.user.role !== 'donor') {
        Alert.alert('Incorrect role', 'This account is not registered as a donor.');
        return;
      }

      await storeTokens(data.accessToken, data.refreshToken);
      await storeUser(data.user);
      router.replace('/donor/home');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={gradient} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#9BE5C2" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.eyebrow}>Hotel & event partners</Text>
          <Text style={styles.title}>Secure access to donor cockpit</Text>
          <Text style={styles.subtitle}>
            Track donations, update batches, and unlock curated NGO matches from one dashboard.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign in</Text>
          <Text style={styles.cardSubtitle}>Use the credentials shared during onboarding.</Text>

          <TextInput
            style={styles.input}
            placeholder="Work email"
            placeholderTextColor="#8890a6"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#8890a6"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.disabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#041018" /> : <Text style={styles.primaryText}>Enter workspace</Text>}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Need an account?</Text>
            <TouchableOpacity onPress={() => router.push('/donor/signup')}>
              <Text style={styles.footerLink}>Request access</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  header: {
    marginBottom: 28,
  },
  eyebrow: {
    color: '#9BE5C2',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 12,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 12,
  },
  subtitle: {
    color: '#c8d0e7',
    marginTop: 10,
    lineHeight: 20,
  },
  card: {
    backgroundColor: 'rgba(5,12,26,0.85)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  cardSubtitle: {
    color: '#9aa3c2',
    marginTop: 4,
    marginBottom: 18,
  },
  input: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    color: '#fff',
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: '#2CC28A',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  disabled: {
    opacity: 0.6,
  },
  primaryText: {
    color: '#041018',
    fontSize: 15,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
  },
  footerText: {
    color: '#9aa3c2',
  },
  footerLink: {
    color: '#9BE5C2',
    fontWeight: '600',
  },
});
