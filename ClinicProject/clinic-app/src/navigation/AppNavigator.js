import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS, SHADOWS } from '../../constants/theme';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import DoctorListScreen from '../screens/DoctorListScreen';
import DoctorDetailsScreen from '../screens/DoctorDetailsScreen';
import BookAppointmentScreen from '../screens/BookAppointmentScreen';
import PaymentScreen from '../screens/PaymentScreen';
import MyAppointmentsScreen from '../screens/MyAppointmentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MedicalHistoryScreen from '../screens/MedicalHistoryScreen';
import AppointmentRecordsScreen from '../screens/AppointmentRecordsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import DoctorDashboardScreen from '../screens/DoctorDashboardScreen';

// Doctor Screens
import CompleteDoctorProfileScreen from '../screens/CompleteDoctorProfileScreen';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

// Shared header options
const appHeaderOptions = {
  headerShown: true,
  headerStyle: {
    backgroundColor: COLORS.dark,
    ...SHADOWS.md
  },
  headerTintColor: COLORS.white,
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 18,
    color: COLORS.white
  },
  headerBackTitle: 'Back'
};

// Root Navigator
export default function AppNavigator() {
  const { isAuthenticated, loading, user, checkDoctorProfile } = useContext(AuthContext);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    const verifyDoctorProfile = async () => {
      if (isAuthenticated && user?.role === 'doctor') {
        const result = await checkDoctorProfile();
        console.log("🔍 [AppNavigator] checkDoctorProfile result:", result);
        console.log("🔍 [AppNavigator] result.exists:", result.exists);
        setNeedsProfile(!result.exists);
        console.log("🔍 [AppNavigator] needsProfile set to:", !result.exists);
      }
      setCheckingProfile(false);
    };
    verifyDoctorProfile();
  }, [isAuthenticated, user]);

  if (loading || checkingProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const isDoctor = user?.role === 'doctor';
  const initialRouteName = !isAuthenticated
    ? 'Splash'
    : isDoctor && needsProfile
      ? 'CompleteProfile'
      : isDoctor
        ? 'DoctorDashboard'
        : 'Home';

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.dark, ...SHADOWS.md },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontWeight: '700', fontSize: 18, color: COLORS.white },
          headerBackTitle: 'Back'
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />

        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="Doctors"
          component={DoctorListScreen}
          options={{ ...appHeaderOptions, title: 'Find Doctors' }}
        />
        <Stack.Screen
          name="DoctorDetails"
          component={DoctorDetailsScreen}
          options={{ ...appHeaderOptions, title: 'Doctor Profile' }}
        />
        <Stack.Screen
          name="BookAppointment"
          component={BookAppointmentScreen}
          options={{ ...appHeaderOptions, title: 'Book Appointment' }}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{ ...appHeaderOptions, title: 'Payment' }}
        />
        <Stack.Screen
          name="MyAppointments"
          component={MyAppointmentsScreen}
          options={{ ...appHeaderOptions, title: 'My Appointments' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ ...appHeaderOptions, title: 'Profile Settings' }}
        />
        <Stack.Screen
          name="MedicalHistory"
          component={MedicalHistoryScreen}
          options={{ ...appHeaderOptions, title: 'Medical History' }}
        />
        <Stack.Screen
          name="AppointmentRecords"
          component={AppointmentRecordsScreen}
          options={{ ...appHeaderOptions, title: 'Appointment Records' }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ ...appHeaderOptions, title: 'Notifications' }}
        />

        <Stack.Screen
          name="DoctorDashboard"
          component={DoctorDashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CompleteProfile"
          component={CompleteDoctorProfileScreen}
          options={{ title: 'Complete Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}