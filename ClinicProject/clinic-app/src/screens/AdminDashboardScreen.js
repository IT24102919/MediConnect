import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function AdminDashboardScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalPayments: 0,
    pendingPayments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // In a real app, you'd fetch these from your API
      // For now, we'll use placeholder data
      setStats({
        totalUsers: 150,
        totalDoctors: 25,
        totalPatients: 125,
        totalAppointments: 320,
        totalPayments: 280,
        pendingPayments: 15
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  const StatCard = ({ title, value, icon, color, onPress }) => (
    <TouchableOpacity
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Text style={[styles.iconText, { color }]}>{icon}</Text>
      </View>
    </TouchableOpacity>
  );

  const MenuCard = ({ title, description, icon, onPress, color = COLORS.primary }) => (
    <TouchableOpacity
      style={[styles.menuCard, SHADOWS.sm]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, { backgroundColor: color + '20' }]}>
        <Text style={[styles.menuIconText, { color }]}>{icon}</Text>
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuDescription}>{description}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.adminName}>{user?.name || 'Admin'}</Text>
        <Text style={styles.adminRole}>System Administrator</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsContainer}>
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="#4CAF50"
          onPress={() => navigation.navigate('UserManagement')}
        />
        <StatCard
          title="Doctors"
          value={stats.totalDoctors}
          icon="👨‍⚕️"
          color="#2196F3"
          onPress={() => navigation.navigate('DoctorManagement')}
        />
        <StatCard
          title="Patients"
          value={stats.totalPatients}
          icon="🏥"
          color="#FF9800"
          onPress={() => navigation.navigate('PatientManagement')}
        />
        <StatCard
          title="Appointments"
          value={stats.totalAppointments}
          icon="📅"
          color="#9C27B0"
          onPress={() => navigation.navigate('AppointmentManagement')}
        />
        <StatCard
          title="Total Payments"
          value={stats.totalPayments}
          icon="💰"
          color="#4CAF50"
          onPress={() => navigation.navigate('AdminPaymentManagement')}
        />
        <StatCard
          title="Pending Payments"
          value={stats.pendingPayments}
          icon="⏳"
          color="#F44336"
          onPress={() => navigation.navigate('AdminPaymentManagement')}
        />
      </View>

      {/* Management Menu */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Management</Text>

        <MenuCard
          title="Payment Management"
          description="View and manage all payment transactions"
          icon="💳"
          onPress={() => navigation.navigate('AdminPaymentManagement')}
          color="#4CAF50"
        />

        <MenuCard
          title="User Management"
          description="Manage users, roles, and permissions"
          icon="👥"
          onPress={() => navigation.navigate('UserManagement')}
          color="#2196F3"
        />

        <MenuCard
          title="Doctor Management"
          description="Oversee doctor profiles and availability"
          icon="👨‍⚕️"
          onPress={() => navigation.navigate('DoctorManagement')}
          color="#FF9800"
        />

        <MenuCard
          title="Appointment Management"
          description="Monitor and manage all appointments"
          icon="📅"
          onPress={() => navigation.navigate('AppointmentManagement')}
          color="#9C27B0"
        />

        <MenuCard
          title="System Reports"
          description="Generate and view system analytics"
          icon="📊"
          onPress={() => navigation.navigate('SystemReports')}
          color="#607D8B"
        />

        <MenuCard
          title="Settings"
          description="Configure system settings and preferences"
          icon="⚙️"
          onPress={() => navigation.navigate('AdminSettings')}
          color="#795548"
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  adminName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  adminRole: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    flex: 1,
    minWidth: (width - SPACING.md * 3) / 2,
    borderLeftWidth: 4,
    ...SHADOWS.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  statTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  menuContainer: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuIconText: {
    fontSize: 24,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  menuDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  arrow: {
    fontSize: 24,
    color: COLORS.textSecondary,
    fontWeight: '300',
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: SPACING.xl,
  },
});