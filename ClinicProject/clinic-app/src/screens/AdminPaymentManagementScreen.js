import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { PaymentContext } from '../context/PaymentContext';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../../constants/theme';

const STATUS_OPTIONS = ['All', 'Paid', 'Pending', 'Failed', 'Refunded', 'Cancelled'];
const METHOD_OPTIONS = ['All', 'Card', 'Cash', 'Online'];

export default function AdminPaymentManagementScreen() {
  const { user } = useContext(AuthContext);
  const { payments, loading, error, fetchAllPayments, updatePayment, deletePayment } = useContext(PaymentContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedMethod, setSelectedMethod] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const loadPayments = useCallback(async () => {
    await fetchAllPayments({
      status: selectedStatus !== 'All' ? selectedStatus : undefined,
      method: selectedMethod !== 'All' ? selectedMethod : undefined,
      search: searchQuery || undefined
    });
  }, [fetchAllPayments, selectedStatus, selectedMethod, searchQuery]);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadPayments();
    }
  }, [user, loadPayments]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPayments();
    setRefreshing(false);
  };

  const handleStatusUpdate = async (paymentId, status) => {
    Alert.alert('Confirm status update', `Are you sure you want to mark this payment as ${status}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          const updateData = {
            paymentStatus: status
          };
          if (status === 'Refunded') {
            updateData.refundReason = 'Refund processed by admin.';
          }
          const result = await updatePayment(paymentId, updateData);
          if (result.success) {
            loadPayments();
          } else {
            Alert.alert('Update failed', result.message);
          }
        }
      }
    ]);
  };

  const handleDelete = async (paymentId) => {
    Alert.alert(
      'Delete payment',
      'This will permanently delete the payment record. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deletePayment(paymentId);
            if (result.success) {
              loadPayments();
            } else {
              Alert.alert('Delete failed', result.message);
            }
          }
        }
      ]
    );
  };

  const formatDate = (value) => {
    if (!value) return 'N/A';
    return new Date(value).toLocaleDateString();
  };

  const statusColor = (status) => {
    switch (status) {
      case 'Paid':
        return COLORS.success;
      case 'Pending':
        return COLORS.warning;
      case 'Failed':
        return COLORS.error;
      case 'Refunded':
        return COLORS.purple || '#7c3aed';
      case 'Cancelled':
        return COLORS.textMuted;
      default:
        return COLORS.border;
    }
  };

  if (user?.role !== 'admin') {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Admin access required</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Payment Management</Text>

      <View style={styles.filterRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search transaction or description"
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={loadPayments}
        />
      </View>

      <View style={styles.filterButtonsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {STATUS_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.filterButton, selectedStatus === option && styles.filterButtonActive]}
              onPress={() => setSelectedStatus(option)}
            >
              <Text style={[styles.filterButtonText, selectedStatus === option && styles.filterButtonTextActive]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.filterButtonsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {METHOD_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.filterButton, selectedMethod === option && styles.filterButtonActive]}
              onPress={() => setSelectedMethod(option)}
            >
              <Text style={[styles.filterButtonText, selectedMethod === option && styles.filterButtonTextActive]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : error ? (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{error}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {payments.length === 0 ? (
            <View style={styles.messageBox}>
              <Text style={styles.messageText}>No payments match the selected criteria.</Text>
            </View>
          ) : payments.map((payment) => (
            <View key={payment._id} style={styles.paymentCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.transactionId}>{payment.transactionId || 'TBD'}</Text>
                <Text style={[styles.statusLabel, { backgroundColor: statusColor(payment.paymentStatus) }]}>
                  {payment.paymentStatus}
                </Text>
              </View>

              <Text style={styles.amount}>Rs. {payment.amount?.toFixed?.(2) ?? payment.amount}</Text>
              <Text style={styles.metaText}>Patient: {payment.patientId?.name || 'N/A'}</Text>
              <Text style={styles.metaText}>Email: {payment.patientId?.email || 'N/A'}</Text>
              <Text style={styles.metaText}>Method: {payment.paymentMethod || 'N/A'}</Text>
              <Text style={styles.metaText}>Appointment: {payment.appointmentId?.appointmentDate ? formatDate(payment.appointmentId.appointmentDate) : 'N/A'}</Text>
              <Text style={styles.metaText}>Created: {formatDate(payment.createdAt)}</Text>
              <View style={styles.actionsRow}>
                {['Paid', 'Pending', 'Failed', 'Refunded', 'Cancelled'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={styles.actionButton}
                    onPress={() => handleStatusUpdate(payment._id, status)}
                  >
                    <Text style={styles.actionText}>{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(payment._id)}>
                <Text style={styles.deleteText}>Delete Payment</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
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
  filterRow: {
    marginBottom: SPACING.md
  },
  searchInput: {
    width: '100%',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.dark
  },
  filterButtonsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm
  },
  filterButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  filterButtonText: {
    color: COLORS.textLight,
    fontWeight: '600'
  },
  filterButtonTextActive: {
    color: COLORS.white
  },
  list: {
    paddingBottom: SPACING.xl
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  messageBox: {
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
    alignItems: 'center',
    marginBottom: SPACING.sm
  },
  transactionId: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.dark
  },
  statusLabel: {
    color: COLORS.white,
    fontWeight: '700',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.md
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.sm
  },
  metaText: {
    fontSize: 13,
    marginBottom: SPACING.xs,
    color: COLORS.textLight
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
    gap: SPACING.xs
  },
  actionButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
    backgroundColor: COLORS.background
  },
  actionText: {
    color: COLORS.dark,
    fontSize: 12,
    fontWeight: '700'
  },
  deleteButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.md
  },
  deleteText: {
    color: COLORS.white,
    fontWeight: '700'
  }
});
