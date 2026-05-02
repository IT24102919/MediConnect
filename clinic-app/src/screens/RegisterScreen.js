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
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from "../../constants/theme";

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
    backgroundColor: COLORS.background, 
    justifyContent: "center",
  },
  circle1: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.primary,
    opacity: 0.1,
  },
  circle2: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: COLORS.secondary,
    opacity: 0.08,
  },
  contentContainer: {
    flexGrow: 1,
    padding: SPACING.lg,
    justifyContent: "center",
  },
  glassCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.dark,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: SPACING.md,
    marginLeft: SPACING.sm,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingLeft: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  icon: {
    fontSize: 16,
    marginRight: SPACING.md,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.lg,
    color: COLORS.dark,
    fontSize: 15,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    marginTop: SPACING.md,
    ...SHADOWS.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
    textTransform: "uppercase",
  },
  linkButton: {
    marginTop: SPACING.xxl,
    alignItems: "center",
  },
  linkText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  linkHighlight: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  roleContainer: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  roleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  roleButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  roleIcon: {
    fontSize: 18,
  },
  roleText: {
    color: COLORS.dark,
    fontSize: 14,
    fontWeight: "600",
  },
  roleTextActive: {
    color: COLORS.white,
  },
});
