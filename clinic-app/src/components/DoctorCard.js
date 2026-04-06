import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function DoctorCard({ doctor, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Profile Image/Emoji Section */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarInner}>
          <Text style={styles.avatarEmoji}>{doctor.image || "👨‍⚕️"}</Text>
        </View>
      </View>
      
      {/* Doctor Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.spec}>{doctor.specialization}</Text>
        
        <View style={styles.footer}>
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.hospital} numberOfLines={1}>{doctor.hospital}</Text>
          </View>
          
          <View style={styles.ratingBox}>
            <Text style={styles.ratingText}>⭐ {doctor.rating}</Text>
          </View>
        </View>
      </View>
      
      {/* Right Arrow Indicator */}
      <View style={styles.arrowContainer}>
        <Text style={styles.arrowIcon}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
   
    backgroundColor: "rgba(255, 255, 255, 0.08)", 
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    
    borderColor: "rgba(255, 255, 255, 0.12)", 
    
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarContainer: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: "rgba(56, 189, 248, 0.1)", // Light blue glass glow
  },
  avatarInner: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  avatarEmoji: {
    fontSize: 32,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF", // Pure white for titles
    letterSpacing: 0.3,
  },
  spec: {
    fontSize: 14,
    color: "#38BDF8", // Vibrant sky blue for highlight
    fontWeight: "600",
    marginTop: 2,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  hospital: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.45)", // Muted white for secondary info
    fontWeight: "400",
  },
  ratingBox: {
    backgroundColor: "rgba(56, 189, 248, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.2)",
  },
  ratingText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  arrowContainer: {
    marginLeft: 10,
  },
  arrowIcon: {
    fontSize: 26,
    color: "rgba(255, 255, 255, 0.25)",
    fontWeight: "300",
  },
});