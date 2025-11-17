// app/auth/index.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function AuthScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join MealDeal</Text>
      <Text style={styles.subtitle}>
        Choose your role to continue:
      </Text>

      <TouchableOpacity
        style={styles.roleButton}
        onPress={() => router.push("/donor")}
      >
        <Text style={styles.roleText}>🍽️ Donor (Hotel / Event)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.roleButton}
        onPress={() => router.push("/ngo")}
      >
        <Text style={styles.roleText}>🤝 NGO / Volunteer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.replace("/(tabs)")}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#3FAE49",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginBottom: 30,
  },
  roleButton: {
    backgroundColor: "#3FAE49",
    width: "80%",
    paddingVertical: 15,
    borderRadius: 30,
    marginVertical: 10,
  },
  roleText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  backBtn: {
    position: "absolute",
    top: 60,
    left: 20,
  },
  backText: {
    fontSize: 16,
    color: "#3FAE49",
  },
});
