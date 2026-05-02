import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../api/axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Restore token and user on app start
  useEffect(() => {
    const restoreToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('authToken');
        const savedUser = await AsyncStorage.getItem('user');

        if (savedToken) {
          setToken(savedToken);
          setIsAuthenticated(true);

          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }
      } catch (error) {
        console.error('Error restoring token:', error);
      } finally {
        setLoading(false);
      }
    };

    restoreToken();
  }, []);

  // Check if doctor has completed profile
  const checkDoctorProfile = async () => {
    try {
      const currentToken = await AsyncStorage.getItem('authToken');
      const currentUser = await AsyncStorage.getItem('user');

      console.log("🔍 checkDoctorProfile - token exists:", !!currentToken);
      console.log("🔍 checkDoctorProfile - user:", currentUser);

      if (!currentToken || !currentUser) return { exists: false };

      const parsedUser = JSON.parse(currentUser);
      console.log("🔍 checkDoctorProfile - parsed role:", parsedUser.role);

      if (parsedUser.role !== 'doctor') return { exists: true }; // Patients don't need profile

      // Check if doctor profile exists and is complete
      const response = await axiosInstance.get('/doctors', {
        headers: { Authorization: `Bearer ${currentToken}` }
      });

      console.log("🔍 checkDoctorProfile - doctors found:", response.data.doctors.length);

      // Find doctor profile linked to this user
      const doctorProfile = response.data.doctors.find(
        doc => doc.userId === parsedUser.id || doc.name === parsedUser.name
      );

      console.log("🔍 checkDoctorProfile - matching doctor:", doctorProfile);

      // Profile exists AND has required fields filled
      if (doctorProfile && doctorProfile.specialization && doctorProfile.hospital && doctorProfile.hospital !== '') {
        return { exists: true, profile: doctorProfile };
      } else {
        return { exists: false };
      }
    } catch (error) {
      console.log("Check doctor profile error:", error);
      return { exists: false };
    }
  };

  // Register user
  const register = async (name, email, password, confirmPassword, role = "patient") => {
    try {
      // Validation
      if (!name || !email || !password || !confirmPassword) {
        return {
          success: false,
          message: 'All fields are required.'
        };
      }

      if (password !== confirmPassword) {
        return {
          success: false,
          message: 'Passwords do not match.'
        };
      }

      if (password.length < 6) {
        return {
          success: false,
          message: 'Password must be at least 6 characters.'
        };
      }

      // API call
      console.log("📡 REGISTER API: Sending request to /auth/register");
      const response = await axiosInstance.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role: role
      });

      console.log("📡 REGISTER API: Response received:", response.data);

      if (response.data.success) {
        const { token, user } = response.data;

        // Save token and user
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        // Update state
        setToken(token);
        setUser(user);
        setIsAuthenticated(true);

        // If user registered as doctor, check/create doctor profile
        if (user.role === 'doctor') {
          try {
            console.log("👨‍⚕️ Checking doctor profile for:", user.id);

            // First check if doctor profile already exists
            const doctorsResponse = await axiosInstance.get('/doctors', {
              headers: { Authorization: `Bearer ${token}` }
            });

            const existingDoctor = doctorsResponse.data.doctors.find(
              doc => doc.userId === user.id || doc.name === user.name
            );

            if (!existingDoctor) {
              // Create a basic doctor profile (all fields empty - will need completion)
              const doctorResponse = await axiosInstance.post('/doctors', {
                name: user.name,
                userId: user.id,
                specialization: "",
                hospital: "",
                experience: 0,
                fee: 0,
                available: false,
                description: ""
              }, {
                headers: { Authorization: `Bearer ${token}` }
              });

              if (doctorResponse.data.success) {
                console.log("✅ Doctor profile created");
                // Store that profile needs completion
                await AsyncStorage.setItem('needsProfileCompletion', 'true');

                // Force refresh user data to ensure AppNavigator re-renders
                await getProfile();
              }
            } else {
              console.log("✅ Doctor profile already exists");
              // Check if profile is complete
              if (!existingDoctor.specialization || !existingDoctor.hospital) {
                await AsyncStorage.setItem('needsProfileCompletion', 'true');
              }
            }
          } catch (error) {
            console.log("⚠️ Doctor profile error:", error.response?.data?.message);
            // Don't block registration
          }
        }

        return {
          success: true,
          message: 'Registration successful!'
        };
      }

      return {
        success: false,
        message: response.data.message || 'Registration failed'
      };
    } catch (error) {
      console.log("❌ REGISTER API ERROR:", error.message);
      console.log("Response data:", error.response?.data);
      console.log("Response status:", error.response?.status);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      return {
        success: false,
        message
      };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      // Validation
      if (!email || !password) {
        return {
          success: false,
          message: 'Email and password are required.'
        };
      }

      // API call
      console.log("📡 LOGIN API: Sending request to /auth/login");
      const response = await axiosInstance.post('/auth/login', {
        email: email.trim(),
        password: password.trim()
      });

      console.log("📡 LOGIN API: Response received:", response.data);

      if (response.data.success) {
        const { token, user } = response.data;

        // Save token and user
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        // Update state
        setToken(token);
        setUser(user);
        setIsAuthenticated(true);

        return {
          success: true,
          message: 'Login successful!'
        };
      }

      return {
        success: false,
        message: response.data.message || 'Login failed'
      };
    } catch (error) {
      console.log("❌ LOGIN API ERROR:", error.message);
      console.log("Response data:", error.response?.data);
      console.log("Response status:", error.response?.status);
      const message = error.response?.data?.message || 'Invalid email or password.';
      return {
        success: false,
        message
      };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('needsProfileCompletion');

      setToken(null);
      setUser(null);
      setIsAuthenticated(false);

      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Logout failed'
      };
    }
  };

  // Get user profile from backend
  const getProfile = async () => {
    try {
      if (!token) {
        return {
          success: false,
          message: 'No token available'
        };
      }

      const response = await axiosInstance.get('/auth/profile');

      if (response.data.success) {
        const userData = response.data.user;

        // Update user state and storage
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));

        return {
          success: true,
          user: userData
        };
      }

      return {
        success: false,
        message: 'Failed to fetch profile'
      };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch profile';
      return {
        success: false,
        message
      };
    }
  };

  // Delete user account
  const deleteAccount = async () => {
    try {
      const currentToken = await AsyncStorage.getItem('authToken');

      if (!currentToken) {
        return {
          success: false,
          message: 'No token available'
        };
      }

      const response = await axiosInstance.delete('/auth/account', {
        headers: { Authorization: `Bearer ${currentToken}` }
      });

      if (response.data.success) {
        // Clear all local storage
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('needsProfileCompletion');

        // Clear state
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);

        return {
          success: true,
          message: 'Account deleted successfully'
        };
      }

      return {
        success: false,
        message: response.data.message || 'Failed to delete account'
      };
    } catch (error) {
      console.log("❌ DELETE ACCOUNT ERROR:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete account'
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    getProfile,
    checkDoctorProfile,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
