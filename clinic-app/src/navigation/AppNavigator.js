import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthContext } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Patient Screens
import HomeScreen from '../screens/HomeScreen';
import DoctorListScreen from '../screens/DoctorListScreen';
import DoctorDetailsScreen from '../screens/DoctorDetailsScreen';
import BookAppointmentScreen from '../screens/BookAppointmentScreen';
import PaymentScreen from '../screens/PaymentScreen';
import MyAppointmentsScreen from '../screens/MyAppointmentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MedicalHistoryScreen from '../screens/MedicalHistoryScreen';
import AppointmentRecordsScreen from '../screens/AppointmentRecordsScreen';

// Doctor Screens
import CompleteDoctorProfileScreen from '../screens/CompleteDoctorProfileScreen';
import DoctorDashboardScreen from '../screens/DoctorDashboardScreen';

const Stack = createNativeStackNavigator();

// Main App Navigator - handles all screens
function MainStack({ initialRoute }) {
  const { user } = useContext(AuthContext);
  const isDoctor = user?.role === 'doctor';

  return (
    <Stack.Navigator
      initialRouteName={initialRoute || (isDoctor ? 'DoctorDashboard' : 'Home')}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#0F172A' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        headerBackTitle: 'Back'
      }}
    >
      {isDoctor ? (
        // Doctor Screens
        <>
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
        </>
      ) : (
        // Patient Screens
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Doctors" component={DoctorListScreen} options={{ title: 'Find Doctors' }} />
          <Stack.Screen name="DoctorDetails" component={DoctorDetailsScreen} options={{ title: 'Doctor Profile' }} />
          <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} options={{ title: 'Book Appointment' }} />
          <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Payment' }} />
          <Stack.Screen name="MyAppointments" component={MyAppointmentsScreen} options={{ title: 'My Appointments' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile Settings' }} />
          <Stack.Screen name="MedicalHistory" component={MedicalHistoryScreen} options={{ title: 'Medical History' }} />
          <Stack.Screen name="AppointmentRecords" component={AppointmentRecordsScreen} options={{ title: 'Appointment Records' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

// Auth Stack (Login/Register)
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' }}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthStack />
      ) : user?.role === 'doctor' && needsProfile ? (
        <MainStack initialRoute="CompleteProfile" />
      ) : (
        <MainStack />
      )}
    </NavigationContainer>
  );
}