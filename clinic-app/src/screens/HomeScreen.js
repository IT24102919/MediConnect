import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { unreadCount, fetchUnreadCount } = useContext(NotificationContext);

  useEffect(() => {
    fetchUnreadCount();
    const unsubscribe = navigation.addListener("focus", () => {
      fetchUnreadCount();
    });
    return unsubscribe;
  }, [navigation, fetchUnreadCount]);

  return (
    <View style={styles.mainContainer}>
      {/* Background depth effects */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.contentContainer}
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <Text style={styles.title}>MedConnect</Text>
          <Text style={styles.subtitle}>
            Hello <Text style={styles.userName}>{user?.name || "Patient"}</Text>, {"\n"}
            How can we help you today?
          </Text>
        </View>

        {/* Options Grid/List */}
        <View style={styles.menuContainer}>
          
          {/* Card 1: View Doctors */}
          <TouchableOpacity
            style={styles.glassCard}
            onPress={() => navigation.navigate("Doctors")}
          >
            <View style={styles.iconCircle}>
              <Text style={styles.cardIcon}>👨‍⚕️</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Find Doctors</Text>
              <Text style={styles.cardText}>Search for specialists near you</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>

          {/* Card 2: My Appointments */}
          <TouchableOpacity
            style={styles.glassCard}
            onPress={() => navigation.navigate("MyAppointments")}
          >
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(29, 78, 216, 0.2)' }]}>
              <Text style={styles.cardIcon}>📅</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>My Appointments</Text>
              <Text style={styles.cardText}>Track your upcoming visits</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>

          {/* Card 3: Profile */}
          <TouchableOpacity
            style={styles.glassCard}
            onPress={() => navigation.navigate("Profile")}
          >
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(56, 189, 248, 0.2)' }]}>
              <Text style={styles.cardIcon}>⚙️</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Profile Settings</Text>
              <Text style={styles.cardText}>Manage your health records</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>

          {/* Card 4: Medical History */}
          <TouchableOpacity
            style={styles.glassCard}
            onPress={() => navigation.navigate("MedicalHistory")}
          >
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(29, 78, 216, 0.18)' }]}> 
              <Text style={styles.cardIcon}>🩺</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Medical History</Text>
              <Text style={styles.cardText}>Update allergies, medications and conditions</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>

          {/* Card 5: Appointment Records */}
          <TouchableOpacity
            style={styles.glassCard}
            onPress={() => navigation.navigate("AppointmentRecords")}
          >
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(29, 78, 216, 0.2)' }]}> 
              <Text style={styles.cardIcon}>📁</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Appointment Records</Text>
              <Text style={styles.cardText}>See your past and cancelled appointments</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>

          {/* Card 6: Notifications */}
          <TouchableOpacity
            style={styles.glassCard}
            onPress={() => navigation.navigate("Notifications")}
          >
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(29, 78, 216, 0.2)' }]}> 
              <Text style={styles.cardIcon}>N</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Notifications</Text>
              <Text style={styles.cardText}>See booking updates and alerts</Text>
            </View>
            {unreadCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            ) : null}
            <Text style={styles.arrowIcon}>â€º</Text>
          </TouchableOpacity>

        </View>

        {/* Support Card (Optional extra) */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Emergency? Call 1990 immediately.</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#1D4ED8", 
  },
  circle1: {
    position: 'absolute',
    top: -40,
    right: -20,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#38BDF8',
    opacity: 0.3,
  },
  circle2: {
    position: 'absolute',
    top: 250,
    left: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#1D4ED8',
    opacity: 0.2,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 35,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    lineHeight: 24,
  },
  userName: {
    color: "#38BDF8",
    fontWeight: "700",
  },
  menuContainer: {
    gap: 16,
  },
  glassCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "rgba(56, 189, 248, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  cardText: {
    marginTop: 4,
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.5)",
  },
  arrowIcon: {
    fontSize: 24,
    color: "rgba(255, 255, 255, 0.3)",
    marginLeft: 10,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#38BDF8",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginRight: 8
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700"
  },
  infoBox: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "rgba(29, 78, 216, 0.12)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(29, 78, 216, 0.22)",
    alignItems: "center",
  },
  infoText: {
    color: "#38BDF8",
    fontSize: 12,
    fontWeight: "600",
  },
});



