import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from "../../constants/theme";

const { width, height } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validate fields
    if (!email.trim() || !password.trim()) {
      Alert.alert("Validation Error", "Please enter email and password");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      console.log("❌ LOGIN ERROR: Invalid email format");
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    console.log("📤 LOGIN: Attempting login for:", email.trim());

    try {
      // Call login from context - it's now async
      const result = await login(email.trim(), password.trim());
      
      if (!result.success) {
        console.log("❌ LOGIN ERROR:", result.message);
        Alert.alert("Login Failed", result.message);
      } else {
        console.log("✅ LOGIN SUCCESS:", result.message);
        Alert.alert("Success", result.message);
        const userRole = String(result?.user?.role || "").toLowerCase();
        navigation.replace(userRole === "doctor" ? "DoctorDashboard" : "Home");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "An unexpected error occurred";
      console.log("❌ LOGIN ERROR:", errorMsg);
      console.log("Full error:", error);
      Alert.alert("Error", "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.mainContainer}
    >
      <View style={styles.mainContainer}>
        {/* Animated Background */}
        <View style={styles.backgroundGradient} />
        
        {/* Floating Blobs */}
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
        <View style={[styles.blob, styles.blob3]} />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Glass Card Container */}
          <View style={styles.glassCard}>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoGradient}>
                  <Text style={styles.logoText}>MC</Text>
                </View>
              </View>
              <Text style={styles.brandName}>සුව සෙවන</Text>
              <Text style={styles.tagline}>Your Health, Our Priority</Text>
              <Text style={styles.welcomeText}>Welcome back!</Text>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              {/* Email Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={[
                  styles.inputContainer,
                  emailFocused && styles.inputContainerFocused
                ]}>
                  <Text style={styles.icon}>📧</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="nimal@gmail.com"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={[
                  styles.inputContainer,
                  passwordFocused && styles.inputContainerFocused
                ]}>
                  <Text style={styles.icon}>🔐</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••••"
                    placeholderTextColor={COLORS.textMuted}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotButton}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleLogin}
                activeOpacity={0.8}
                disabled={loading}
              >
                <View style={styles.buttonGradient}>
                  <Text style={styles.buttonText}>
                    {loading ? "Logging in..." : "Log In"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.divider} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <Text style={styles.socialIcon}>G</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <Text style={styles.socialIcon}>🍎</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <Text style={styles.socialIcon}>f</Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={styles.footerContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.background,
  },
  // Floating animated blobs
  blob: {
    position: 'absolute',
    borderRadius: 100,
  },
  blob1: {
    top: -100,
    right: -50,
    width: 250,
    height: 250,
    backgroundColor: COLORS.primary,
    opacity: 0.08,
  },
  blob2: {
    bottom: -80,
    left: -80,
    width: 200,
    height: 200,
    backgroundColor: COLORS.secondary,
    opacity: 0.06,
  },
  blob3: {
    top: '50%',
    right: '-20%',
    width: 150,
    height: 150,
    backgroundColor: COLORS.accent,
    opacity: 0.05,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    justifyContent: "center",
  },
  glassCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    ...SHADOWS.lg,
    overflow: 'hidden',
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.xxxl,
  },
  logoContainer: {
    marginBottom: SPACING.lg,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.md,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: 1,
  },
  brandName: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.dark,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 12,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "600",
  },
  formSection: {
    marginBottom: SPACING.xxl,
  },
  formGroup: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: SPACING.md,
    marginLeft: 2,
    letterSpacing: 0.2,
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
  inputContainerFocused: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.accent,
    ...SHADOWS.md,
  },
  icon: {
    fontSize: 18,
    marginRight: SPACING.md,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    color: COLORS.dark,
    fontSize: 15,
    fontWeight: "500",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: SPACING.xxl,
    paddingVertical: SPACING.sm,
  },
  forgotText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  button: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.xxl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.textMuted,
    opacity: 0.2,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    color: COLORS.textLight,
    fontSize: 13,
    fontWeight: "500",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.sm,
  },
  socialIcon: {
    fontSize: 24,
    color: COLORS.dark,
    fontWeight: "600",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.textMuted,
    opacity: 0.2,
  },
  signupText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: "500",
  },
  signupLink: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.3,
  },
});







