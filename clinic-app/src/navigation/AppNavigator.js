<<<<<<< HEAD
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
=======
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthContext } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// App Screens
>>>>>>> b97bb2a5578a6ebbe5b954f4ae073ee17dd94cae
import HomeScreen from '../screens/HomeScreen';
import DoctorListScreen from '../screens/DoctorListScreen';
import DoctorDetailsScreen from '../screens/DoctorDetailsScreen';
import BookAppointmentScreen from '../screens/BookAppointmentScreen';
import PaymentScreen from '../screens/PaymentScreen';
import MyAppointmentsScreen from '../screens/MyAppointmentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MedicalHistoryScreen from '../screens/MedicalHistoryScreen';
import AppointmentRecordsScreen from '../screens/AppointmentRecordsScreen';

const Stack = createNativeStackNavigator();

<<<<<<< HEAD
const appHeaderOptions = {
  headerShown: true,
  headerStyle: {
    backgroundColor: '#102A43'
  },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 18
  },
  headerBackTitle: 'Back'
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Doctors"
          component={DoctorListScreen}
          options={{
            ...appHeaderOptions,
            title: 'Find Doctors'
          }}
        />
        <Stack.Screen
          name="DoctorDetails"
          component={DoctorDetailsScreen}
          options={{
            ...appHeaderOptions,
            title: 'Doctor Profile'
          }}
        />
        <Stack.Screen
          name="BookAppointment"
          component={BookAppointmentScreen}
          options={{
            ...appHeaderOptions,
            title: 'Book Appointment'
          }}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{
            ...appHeaderOptions,
            title: 'Payment'
          }}
        />
        <Stack.Screen
          name="MyAppointments"
          component={MyAppointmentsScreen}
          options={{
            ...appHeaderOptions,
            title: 'My Appointments'
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            ...appHeaderOptions,
            title: 'Profile Settings'
          }}
        />
        <Stack.Screen
          name="MedicalHistory"
          component={MedicalHistoryScreen}
          options={{
            ...appHeaderOptions,
            title: 'Medical History'
          }}
        />
        <Stack.Screen
          name="AppointmentRecords"
          component={AppointmentRecordsScreen}
          options={{
            ...appHeaderOptions,
            title: 'Appointment Records'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
=======
// Authentication Stack (Login/Register)
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ animationEnabled: false }}
      />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// App Stack (Main app screens)
function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0F172A'
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18
        },
        headerBackTitle: 'Back'
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Doctors"
        component={DoctorListScreen}
        options={{
          title: 'Find Doctors'
        }}
      />
      <Stack.Screen
        name="DoctorDetails"
        component={DoctorDetailsScreen}
        options={{
          title: 'Doctor Profile'
        }}
      />
      <Stack.Screen
        name="BookAppointment"
        component={BookAppointmentScreen}
        options={{
          title: 'Book Appointment'
        }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          title: 'Payment'
        }}
      />
      <Stack.Screen
        name="MyAppointments"
        component={MyAppointmentsScreen}
        options={{
          title: 'My Appointments'
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile Settings'
        }}
      />
      <Stack.Screen
        name="MedicalHistory"
        component={MedicalHistoryScreen}
        options={{
          title: 'Medical History'
        }}
      />
      <Stack.Screen
        name="AppointmentRecords"
        component={AppointmentRecordsScreen}
        options={{
          title: 'Appointment Records'
        }}
      />
    </Stack.Navigator>
  );
}

// Root Navigator
export default function AppNavigator() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' }}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
>>>>>>> b97bb2a5578a6ebbe5b954f4ae073ee17dd94cae
