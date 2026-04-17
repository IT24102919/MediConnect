import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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

const Stack = createNativeStackNavigator();

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