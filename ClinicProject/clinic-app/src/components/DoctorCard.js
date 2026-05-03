import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from "../../constants/theme";

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
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0,
    borderColor: COLORS.primary,
    ...SHADOWS.md,
  },
  avatarContainer: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary,
  },
  avatarInner: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    borderColor: COLORS.primary,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  infoContainer: {
    flex: 1,
    marginLeft: SPACING.lg,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.dark,
    letterSpacing: 0.3,
  },
  spec: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: "600",
    marginTop: SPACING.sm,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: SPACING.md,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: SPACING.sm,
  },
  hospital: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "400",
  },
  ratingBox: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 0,
    borderColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.dark,
    fontWeight: "700",
  },
  arrowContainer: {
    marginLeft: SPACING.md,
  },
  arrowIcon: {
    fontSize: 26,
    color: COLORS.primary,
    fontWeight: "300",
  },
});