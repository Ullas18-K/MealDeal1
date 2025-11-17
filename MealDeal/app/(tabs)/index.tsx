// app/index.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={["#d4fc79", "#96e6a1"]} style={styles.container}>
      <View style={styles.overlayCard}>
        <Text style={styles.appName}>MealDeal</Text>
        <Text style={styles.tagline}>
          “Connecting extra meals with empty plates.” 🍛
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.buttonContainer}
          onPress={() => router.replace("/role")}
        >
          <LinearGradient
            colors={["#3FAE49", "#2b7a38"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Together, we reduce waste & feed hope 🌍
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayCard: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 25,
    paddingVertical: 60,
    paddingHorizontal: 35,
    alignItems: "center",
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    backdropFilter: "blur(10px)", // for web blur
  },
  appName: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#2b7a38",
    marginBottom: 15,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: "#1b4332",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
    fontStyle: "italic",
  },
  buttonContainer: {
    width: "80%",
  },
  button: {
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#3FAE49",
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  footerText: {
    marginTop: 40,
    fontSize: 14,
    color: "#1b4332",
    textAlign: "center",
    opacity: 0.8,
  },
});
