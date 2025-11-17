import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { API_URL } from '@/utils/auth';

const gradient = ['#03040f', '#0b1226', '#111f3e'] as const;

export default function NGOSignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing details', 'Please fill the required fields marked with *.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, role: 'ngo' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      const successMessage = 'Account created successfully! Please log in to continue.';
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.alert(successMessage);
        }
        router.replace('/ngo');
      } else {
        Alert.alert('Success', successMessage, [{ text: 'OK', onPress: () => router.replace('/ngo') }]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Unable to connect to server. Please try again.');
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
          <Text style={styles.eyebrow}>Volunteer & NGO teams</Text>
          <Text style={styles.title}>Get priority access to nearby meals</Text>
          <Text style={styles.subtitle}>
            Verified organizations can reserve batches, assign runners, and log delivery proof for every pickup.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Register NGO workspace</Text>
          <Text style={styles.cardSubtitle}>We will review and activate within 24 hours.</Text>

          <TextInput
            style={styles.input}
            placeholder="Organization / collective name *"
            placeholderTextColor="#8890a6"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Official email *"
            placeholderTextColor="#8890a6"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Primary contact number"
            placeholderTextColor="#8890a6"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Password *"
            placeholderTextColor="#8890a6"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.disabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#041018" />
            ) : (
              <Text style={styles.primaryText}>Submit for review</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already verified?</Text>
            <TouchableOpacity onPress={() => router.replace('/ngo')}>
              <Text style={styles.footerLink}>Back to login</Text>
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
    fontSize: 26,
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

