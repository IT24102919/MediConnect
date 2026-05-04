import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { PaymentContext } from '../context/PaymentContext';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../../constants/theme';

const statusColors = {
  Paid: COLORS.success,
  Pending: COLORS.warning,
  Failed: COLORS.error,
  Refunded: COLORS.purple || '#7c3aed',
  Cancelled: COLORS.textMuted
};

export default function PaymentHistoryScreen() {
  const { user } = useContext(AuthContext);
  const { payments, loading, error, fetchPaymentsByPatient, clearPaymentError } = useContext(PaymentContext);
  const [refreshing, setRefreshing] = useState(false);

  const patientId = user?._id || user?.id;

  useEffect(() => {
    let isMounted = true;

    const loadPayments = async () => {
      if (!patientId) return;

      if (clearPaymentError) {
        clearPaymentError();
      }

      await fetchPaymentsByPatient(patientId);
    };

    loadPayments();

    return () => {
      isMounted = false;
    };
  }, [patientId, fetchPaymentsByPatient, clearPaymentError]);

  const onRefresh = async () => {
    if (!patientId) return;

    setRefreshing(true);
    await fetchPaymentsByPatient(patientId);
    setRefreshing(false);
  };

  const formattedDate = (value) => {
    if (!value) return 'N/A';
    return new Date(value).toLocaleDateString();
  };

  const renderPaymentItem = ({ item }) => (
    <View key={item._id} style={styles.paymentCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.transactionId}>{item.transactionId || '—'}</Text>
        <Text style={[styles.statusBadge, { backgroundColor: statusColors[item.paymentStatus] || COLORS.border }]}>
          {item.paymentStatus}
        </Text>
      </View>

      <Text style={styles.amount}>Rs. {item.amount?.toFixed?.(2) ?? item.amount}</Text>
      <Text style={styles.metaText}>Method: {item.paymentMethod || 'N/A'}</Text>
      <Text style={styles.metaText}>Appointment: {item.appointmentId?.appointmentDate ? formattedDate(item.appointmentId.appointmentDate) : 'N/A'}</Text>
      <Text style={styles.metaText}>Paid: {formattedDate(item.paidAt)}</Text>
      <Text style={styles.metaText}>Brand: {item.cardBrand || 'N/A'} · Last 4: {item.cardLast4 || 'N/A'}</Text>
      <Text style={styles.description}>{item.description || 'No description provided.'}</Text>
    </View>
  );

  if (loading && !refreshing && payments.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading payment history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Payment History</Text>

      {error ? (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item._id}
          renderItem={renderPaymentItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No payment records found.</Text>
              </View>
            ) : null
          }
          contentContainerStyle={payments.length === 0 ? styles.emptyList : styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.lg
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textLight,
    fontSize: 16
  },
  messageBox: {
    marginTop: SPACING.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md
  },
  messageText: {
    color: COLORS.textLight,
    fontSize: 15,
    textAlign: 'center'
  },
  list: {
    paddingBottom: SPACING.xl
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyContainer: {
    alignItems: 'center',
    padding: SPACING.xl
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 16,
    textAlign: 'center'
  },
  paymentCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.md
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm
  },
  transactionId: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.dark
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.md,
    color: COLORS.white,
    fontWeight: '700',
    overflow: 'hidden'
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.sm
  },
  metaText: {
    color: COLORS.textLight,
    fontSize: 14,
    marginBottom: SPACING.xs
  },
  description: {
    marginTop: SPACING.sm,
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 20
  }
});
