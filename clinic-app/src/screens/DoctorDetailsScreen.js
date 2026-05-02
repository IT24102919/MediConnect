import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";

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
    backgroundColor: "#1D4ED8", 
  },
  circle1: {
    position: 'absolute',
    top: -50,
    right: -20,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#38BDF8',
    opacity: 0.2,
  },
  circle2: {
    position: 'absolute',
    bottom: 100,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#1D4ED8',
    opacity: 0.2,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
  },
  glassHeaderCard: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 30,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    marginBottom: 20,
  },
  avatarContainer: {
    padding: 5,
    borderRadius: 50,
    backgroundColor: "rgba(56, 189, 248, 0.2)",
    marginBottom: 15,
  },
  avatarGradient: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  avatarEmoji: {
    fontSize: 45,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },
  specialization: {
    fontSize: 16,
    color: "#38BDF8",
    fontWeight: "600",
    marginTop: 4,
  },
  hospitalText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  aboutCard: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 25,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 30,
  },
  detailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  detailLine: {
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    lineHeight: 22,
  },
  bookButton: {
    backgroundColor: "#38BDF8",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#38BDF8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  bookButtonDisabled: {
    backgroundColor: '#1D4ED8',
    shadowOpacity: 0,
    elevation: 0,
  },
});



