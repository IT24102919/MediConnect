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

  // Register user
  const register = async (name, email, password, confirmPassword) => {
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
        role: 'patient'
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

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    getProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}



