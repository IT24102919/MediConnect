import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { AuthContext } from "../context/AuthContext";

const { width } = Dimensions.get("window");

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("patient");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validate fields
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Validation Error", "All fields are required");
      return;
    }

    // Check password match
    if (password !== confirmPassword) {
      console.log("❌ REGISTER ERROR: Passwords don't match");
      Alert.alert("Validation Error", "Passwords do not match");
      return;
    }

    // Check password length
    if (password.length < 6) {
      console.log("❌ REGISTER ERROR: Password too short");
      Alert.alert("Validation Error", "Password must be at least 6 characters");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      console.log("❌ REGISTER ERROR: Invalid email format");
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    console.log("📤 REGISTER: Attempting registration for:", email.trim());

    try {
      // Call register from context - it's now async
      const result = await register(
        name.trim(),
        email.trim(),
        password.trim(),
        confirmPassword.trim(),
        selectedRole
      );

      if (!result.success) {
        console.log("❌ REGISTER ERROR:", result.message);
        Alert.alert("Registration Failed", result.message);
      } else {
        console.log("✅ REGISTER SUCCESS:", result.message);
        Alert.alert("Success", result.message);
        navigation.replace("Home");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "An unexpected error occurred";
      console.log("❌ REGISTER ERROR:", errorMsg);
      console.log("Full error:", error);
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Background depth circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Glass Card */}
        <View style={styles.glassCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the MedConnect family</Text>
          </View>

          {/* Full Name Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.icon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Mhd Shifan"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.icon}>✉️</Text>
              <TextInput
                style={styles.input}
                placeholder="shifan@email.com"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.icon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.icon}>🛡️</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          </View>

          {/* Role Selection */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Account Type</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  selectedRole === "patient" && styles.roleButtonActive
                ]}
                onPress={() => setSelectedRole("patient")}
              >
                <Text style={styles.roleIcon}>👤</Text>
                <Text style={[
                  styles.roleText,
                  selectedRole === "patient" && styles.roleTextActive
                ]}>Patient</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  selectedRole === "doctor" && styles.roleButtonActive
                ]}
                onPress={() => setSelectedRole("doctor")}
              >
                <Text style={styles.roleIcon}>👨‍⚕️</Text>
                <Text style={[
                  styles.roleText,
                  selectedRole === "doctor" && styles.roleTextActive
                ]}>Doctor</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Creating Account..." : "Register Now"}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkHighlight}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#1D4ED8", 
    justifyContent: "center",
  },
  circle1: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#38BDF8',
    opacity: 0.4,
  },
  circle2: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#1D4ED8',
    opacity: 0.3,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 30,
    padding: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 5,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderRadius: 15,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  icon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: "#FFFFFF",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#38BDF8",
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#38BDF8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
    textTransform: "uppercase",
  },
  linkButton: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
  },
  linkHighlight: {
    color: "#38BDF8",
    fontWeight: "700",
  },
    roleContainer: {
    flexDirection: "row",
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderRadius: 15,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  roleButtonActive: {
    backgroundColor: "rgba(56, 189, 248, 0.15)",
    borderColor: "#38BDF8",
  },
  roleIcon: {
    fontSize: 18,
  },
  roleText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: "600",
  },
  roleTextActive: {
    color: "#38BDF8",
  },
});
