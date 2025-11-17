import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const gradient = ['#03040f', '#0b1226', '#111f3e'] as const;

const roleOptions = [
  {
    label: 'Donor operations',
    description: 'Hotels, caterers & event kitchens listing surplus batches.',
    icon: 'business-outline' as const,
    action: '/donor',
  },
  {
    label: 'NGO coordination',
    description: 'Volunteers confirming pickups and tracking last-mile drops.',
    icon: 'heart-outline' as const,
    action: '/ngo',
  },
];

export default function RoleScreen() {
  const router = useRouter();

  return (
    <LinearGradient style={styles.container} colors={gradient}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
          <Ionicons name="chevron-back" size={22} color="#9BE5C2" />
        </TouchableOpacity>
        <Text style={styles.eyebrow}>Select workspace</Text>
        <Text style={styles.title}>How are you helping today?</Text>
        <Text style={styles.subtitle}>
          Pick a role to unlock tailored dashboards, alerts, and ordering flows.
        </Text>
      </View>

      <View style={styles.cardList}>
        {roleOptions.map((role) => (
          <TouchableOpacity key={role.action} style={styles.roleCard} onPress={() => router.push(role.action)}>
            <View style={styles.roleIcon}>
              <Ionicons name={role.icon} size={22} color="#9BE5C2" />
            </View>
            <View style={styles.roleContent}>
              <Text style={styles.roleLabel}>{role.label}</Text>
              <Text style={styles.roleDescription}>{role.description}</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color="#9BE5C2" />
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginTop: 40,
  },
  eyebrow: {
    color: '#9BE5C2',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 12,
    marginTop: 24,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 12,
  },
  subtitle: {
    color: '#c8d0e7',
    marginTop: 8,
    lineHeight: 20,
  },
  cardList: {
    marginTop: 30,
    gap: 16,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  roleIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(155,229,194,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleContent: {
    flex: 1,
  },
  roleLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  roleDescription: {
    color: '#9aa3c2',
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
});
