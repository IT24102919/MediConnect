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
        navigation.replace("Home");
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
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
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
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
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
    backgroundColor: "#1D4ED8",
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#1D4ED8",
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
    backgroundColor: '#38BDF8',
    opacity: 0.15,
  },
  blob2: {
    bottom: -80,
    left: -80,
    width: 200,
    height: 200,
    backgroundColor: '#1D4ED8',
    opacity: 0.1,
  },
  blob3: {
    top: '50%',
    right: '-20%',
    width: 150,
    height: 150,
    backgroundColor: '#38BDF8',
    opacity: 0.08,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: "center",
  },
  glassCard: {
    backgroundColor: "rgba(29, 78, 216, 0.7)",
    borderRadius: 28,
    padding: 28,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 8,
    overflow: 'hidden',
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "rgba(56, 189, 248, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(56, 189, 248, 0.4)",
  },
  logoText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#38BDF8",
    letterSpacing: 1,
  },
  brandName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 12,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  welcomeText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "600",
  },
  formSection: {
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 10,
    marginLeft: 2,
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 16,
    paddingLeft: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backdropFilter: 'blur(10px)',
    transition: 'all 200ms ease-in-out',
  },
  inputContainerFocused: {
    backgroundColor: "rgba(56, 189, 248, 0.08)",
    borderColor: "rgba(56, 189, 248, 0.3)",
    shadowColor: "#38BDF8",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    fontSize: 18,
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 4,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 24,
    paddingVertical: 4,
  },
  forgotText: {
    color: "#38BDF8",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#38BDF8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    backgroundColor: "#38BDF8",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 13,
    fontWeight: "500",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  socialIcon: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  signupText: {
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: 14,
    fontWeight: "500",
  },
  signupLink: {
    color: "#38BDF8",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.3,
  },
});




