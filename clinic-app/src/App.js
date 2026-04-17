import React from "react";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./navigation/AppNavigator";
import { AuthProvider } from "./context/AuthContext";
import { AppointmentProvider } from "./context/AppointmentContext";
import { PaymentProvider } from "./context/PaymentContext";

export default function App() {
  return (
    <AuthProvider>
      <PaymentProvider>
        <AppointmentProvider>
          <AppNavigator />
          <StatusBar style="light" />
        </AppointmentProvider>
      </PaymentProvider>
    </AuthProvider>
  );
}