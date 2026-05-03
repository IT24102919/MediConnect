import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from "../../constants/theme";

const { width } = Dimensions.get("window");

export default function DoctorDetailsScreen({ route, navigation }) {
  const { doctor } = route.params;

  return (
    <View style={styles.mainContainer}>
      {/* Background depth circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        
        {/* Doctor Header Card */}
        <View style={styles.glassHeaderCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarGradient}>
               <Text style={styles.avatarEmoji}>{doctor.image || "👨‍⚕️"}</Text>
            </View>
          </View>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.specialization}>{doctor.specialization}</Text>
          <Text style={styles.hospitalText}>📍 {doctor.hospital}</Text>
        </View>

        {/* Quick Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Experience</Text>
            <Text style={styles.statValue}>{doctor.experience} yrs</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Rating</Text>
            <Text style={styles.statValue}>⭐ {doctor.rating || 0}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Fee</Text>
            <Text style={styles.statValue}>Rs. {doctor.fee}</Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Doctor Details</Text>
          <Text style={styles.detailLine}>Hospital: {doctor.hospital || 'N/A'}</Text>
          <Text style={styles.detailLine}>Specialization: {doctor.specialization || 'N/A'}</Text>
          <Text style={styles.detailLine}>Availability: {doctor.available ? 'Available' : 'Unavailable'}</Text>
          {!!doctor.phone && <Text style={styles.detailLine}>Contact: {doctor.phone}</Text>}
        </View>

        {/* About Section */}
        <View style={styles.aboutCard}>
          <Text style={styles.sectionTitle}>About Doctor</Text>
          <Text style={styles.descriptionText}>
            {doctor.description || "Experienced specialist dedicated to providing top-notch healthcare services and personalized patient care."}
          </Text>
        </View>

        {/* Booking Button */}
        <TouchableOpacity
          style={[styles.bookButton, !doctor.available && styles.bookButtonDisabled]}
          disabled={!doctor.available}
          onPress={() => navigation.navigate("BookAppointment", { doctor })}
        >
          <Text style={styles.bookButtonText}>
            {doctor.available ? 'Book Appointment' : 'Doctor Unavailable'}
          </Text>
        </TouchableOpacity>

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
    top: -50,
    right: -20,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primary,
    opacity: 0.1,
  },
  circle2: {
    position: 'absolute',
    bottom: 100,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.secondary,
    opacity: 0.08,
  },
  contentContainer: {
    padding: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  glassHeaderCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: "center",
    ...SHADOWS.lg,
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    padding: SPACING.sm,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  avatarGradient: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.md,
  },
  avatarEmoji: {
    fontSize: 45,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.dark,
    textAlign: "center",
  },
  specialization: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
    marginTop: SPACING.sm,
  },
  hospitalText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: SPACING.md,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.xl,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: "center",
    marginHorizontal: SPACING.sm,
    ...SHADOWS.sm,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.dark,
  },
  aboutCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOWS.md,
    marginBottom: SPACING.xxxl,
  },
  detailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
    marginBottom: SPACING.lg,
  },
  detailLine: {
    color: COLORS.text,
    marginTop: SPACING.md,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.dark,
    marginBottom: SPACING.md,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  bookButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: "center",
    ...SHADOWS.lg,
  },
  bookButtonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  bookButtonDisabled: {
    backgroundColor: COLORS.textMuted,
    ...SHADOWS.none,
  },
});

