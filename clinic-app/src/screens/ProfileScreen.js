import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../../constants/theme';

export default function ProfileScreen({ navigation }) {
  const { user, logout, deleteAccount } = useContext(AuthContext);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', onPress: () => { } },
        {
          text: 'Logout',
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      '⚠️ WARNING: This action is permanent!\n\nDeleting your account will:\n• Remove your profile\n• Delete your user account\n• Cancel all your appointments\n\nThis cannot be undone.\n\nAre you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteAccount();
            if (result.success) {
              Alert.alert('Account Deleted', 'Your account has been deleted.');
            } else {
              Alert.alert('Error', result.message);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name || 'Patient'}</Text>
        <Text style={styles.role}>{user?.role || 'patient'}</Text>
      </View>

      {/* Profile Information Card */}
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email || 'Not provided'}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Joined</Text>
          <Text style={styles.value}>
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : 'Recently'}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Account Type</Text>
          <Text style={styles.value}>{user?.role || 'Patient'}</Text>
        </View>
      </View>

      {/* Quick Links */}
      <View style={styles.linksContainer}>
        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('MedicalHistory')}>
          <Text style={styles.linkIcon}>🩺</Text>
          <Text style={styles.linkText}>Medical History</Text>
          <Text style={styles.linkArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('AppointmentRecords')}
        >
          <Text style={styles.linkIcon}>📁</Text>
          <Text style={styles.linkText}>Appointment Records</Text>
          <Text style={styles.linkArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkIcon}>📞</Text>
          <Text style={styles.linkText}>Support</Text>
          <Text style={styles.linkArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>

      {/* Delete Account Button - Only for doctors */}
      {user?.role === 'doctor' && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteButtonText}>🗑️ Delete Account</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
    paddingVertical: SPACING.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderColor: COLORS.primary,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.white,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },
  role: {
    fontSize: 13,
    color: COLORS.textLight,
    textTransform: 'capitalize',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 0,
    borderColor: COLORS.primary,
    ...SHADOWS.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  linksContainer: {
    marginBottom: SPACING.xxxl,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  linkIcon: {
    fontSize: 18,
    marginRight: SPACING.md,
  },
  linkText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.dark,
  },
  linkArrow: {
    fontSize: 18,
    color: COLORS.textLight,
  },
  logoutButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: 'rgb(240, 132, 132)',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  logoutText: {
    color: COLORS.accent,
    fontWeight: '700',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.error,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  deleteButtonText: {
    color: COLORS.error,
    fontWeight: '700',
    fontSize: 16,
  },
});





