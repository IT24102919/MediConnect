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
import PaymentHistoryScreen from '../screens/PaymentHistoryScreen';
import AdminPaymentManagementScreen from '../screens/AdminPaymentManagementScreen';
import MyAppointmentsScreen from '../screens/MyAppointmentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MedicalHistoryScreen from '../screens/MedicalHistoryScreen';
import AppointmentRecordsScreen from '../screens/AppointmentRecordsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import DoctorDashboardScreen from '../screens/DoctorDashboardScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import UserManagementScreen from '../screens/UserManagementScreen';
import DoctorManagementScreen from '../screens/DoctorManagementScreen';
import PatientManagementScreen from '../screens/PatientManagementScreen';
import AppointmentManagementScreen from '../screens/AppointmentManagementScreen';
import SystemReportsScreen from '../screens/SystemReportsScreen';
import AdminSettingsScreen from '../screens/AdminSettingsScreen';

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
  const isAdmin = user?.role === 'admin';

  const renderAuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );

  const renderPatientStack = () => (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: COLORS.dark, ...SHADOWS.md },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: '700', fontSize: 18, color: COLORS.white },
        headerBackTitle: 'Back'
      }}
    >
      {isDoctor ? (
        <Stack.Screen 
          name="DoctorDashboard" 
          component={DoctorDashboardScreen} 
          options={{ headerShown: false }} 
        />
      ) : (
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      )}
      {isDoctor && <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />}
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
        name="PaymentHistory"
        component={PaymentHistoryScreen}
        options={{ ...appHeaderOptions, title: 'Payment History' }}
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
        name="CompleteProfile"
        component={CompleteDoctorProfileScreen}
        options={{ title: 'Complete Profile' }}
      />
    </Stack.Navigator>
  );

  const renderAdminStack = () => (
    <Stack.Navigator
      initialRouteName="AdminDashboard"
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: COLORS.dark, ...SHADOWS.md },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: '700', fontSize: 18, color: COLORS.white },
        headerBackTitle: 'Back'
      }}
    >
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="AdminPaymentManagement"
        component={AdminPaymentManagementScreen}
        options={{ ...appHeaderOptions, title: 'Payment Management' }}
      />
      <Stack.Screen
        name="UserManagement"
        component={UserManagementScreen}
        options={{ ...appHeaderOptions, title: 'User Management' }}
      />
      <Stack.Screen
        name="DoctorManagement"
        component={DoctorManagementScreen}
        options={{ ...appHeaderOptions, title: 'Doctor Management' }}
      />
      <Stack.Screen
        name="PatientManagement"
        component={PatientManagementScreen}
        options={{ ...appHeaderOptions, title: 'Patient Management' }}
      />
      <Stack.Screen
        name="AppointmentManagement"
        component={AppointmentManagementScreen}
        options={{ ...appHeaderOptions, title: 'Appointment Management' }}
      />
      <Stack.Screen
        name="SystemReports"
        component={SystemReportsScreen}
        options={{ ...appHeaderOptions, title: 'System Reports' }}
      />
      <Stack.Screen
        name="AdminSettings"
        component={AdminSettingsScreen}
        options={{ ...appHeaderOptions, title: 'Admin Settings' }}
      />
    </Stack.Navigator>
  );

  return (
    <NavigationContainer key={isAuthenticated ? 'auth' : 'guest'}>
      { !isAuthenticated ? renderAuthStack() : needsProfile ? (
        <Stack.Navigator screenOptions={appHeaderOptions}>
          <Stack.Screen 
            name="CompleteProfile" 
            component={CompleteDoctorProfileScreen} 
            options={{ title: 'Complete Profile', headerLeft: () => null }} 
          />
        </Stack.Navigator>
      ) : isAdmin ? renderAdminStack() : renderPatientStack() }
    </NavigationContainer>
  );
}