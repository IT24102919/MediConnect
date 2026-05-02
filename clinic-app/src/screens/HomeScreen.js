import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from "../../constants/theme";

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
            <View style={[styles.iconCircle, { backgroundColor: COLORS.light }]}>
              <Text style={styles.cardIcon}>📅</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>My Appointments</Text>
              <Text style={styles.cardText}>Track your upcoming visits</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>

          {/* Card 4: Medical History */}
          <TouchableOpacity
            style={styles.glassCard}
            onPress={() => navigation.navigate("MedicalHistory")}
          >
            <View style={[styles.iconCircle, { backgroundColor: COLORS.light }]}> 
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
            <View style={[styles.iconCircle, { backgroundColor: COLORS.light }]}> 
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
            <View style={[styles.iconCircle, { backgroundColor: COLORS.light }]}> 
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

        

          {/* Card 3: Profile */}
          <TouchableOpacity
            style={styles.glassCard}
            onPress={() => navigation.navigate("Profile")}
          >
            <View style={[styles.iconCircle, { backgroundColor: COLORS.light }]}>
              <Text style={styles.cardIcon}>⚙️</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Profile Settings</Text>
              <Text style={styles.cardText}>Manage your health records</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>

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
    backgroundColor: COLORS.background, 
  },
  circle1: {
    position: 'absolute',
    top: -40,
    right: -20,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primary,
    opacity: 0.1,
  },
  circle2: {
    position: 'absolute',
    top: 250,
    left: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.secondary,
    opacity: 0.08,
  },
  contentContainer: {
    padding: SPACING.xxl,
    paddingTop: SPACING.xxxl,
  },
  header: {
    marginBottom: SPACING.xxxl,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.dark,
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 24,
  },
  userName: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  menuContainer: {
    paddingBottom: SPACING.sm,
  },
  glassCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOWS.md,
    marginBottom: SPACING.lg,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.lg,
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
    color: COLORS.dark,
  },
  cardText: {
    marginTop: SPACING.sm,
    fontSize: 13,
    color: COLORS.textLight,
  },
  arrowIcon: {
    fontSize: 24,
    color: COLORS.textMuted,
    marginLeft: SPACING.md,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    marginRight: SPACING.md
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700"
  },
  infoBox: {
    marginTop: SPACING.xxxl,
    padding: SPACING.lg,
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    ...SHADOWS.sm,
  },
  infoText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },
});









