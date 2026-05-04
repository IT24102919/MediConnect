import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../../constants/theme';

export default function PatientManagementScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.card, SHADOWS.sm]}>
        <Text style={styles.title}>Patient Management</Text>
        <Text style={styles.subtitle}>View and manage patient records</Text>
      </View>

      <View style={[styles.card, SHADOWS.sm]}>
        <Text style={styles.cardTitle}>Total Patients</Text>
        <Text style={styles.cardValue}>125</Text>
        <Text style={styles.cardSubtitle}>Active patient accounts</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  content: {
    padding: SPACING.lg
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary
  },
  button: {
    marginTop: SPACING.md,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center'
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600'
  }
});