import React, { createContext, useState, useCallback } from 'react';
import axiosInstance from '../api/axios';

export const PaymentContext = createContext();

export function PaymentProvider({ children }) {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearPaymentError = useCallback(() => {
    setError(null);
  }, []);

  const fetchAllPayments = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const query = new URLSearchParams(filters).toString();
      const response = await axiosInstance.get(`/payments${query ? `?${query}` : ''}`);

      if (response.data.success) {
        setPayments(response.data.payments || []);
        return {
          success: true,
          payments: response.data.payments || []
        };
      }

      return {
        success: false,
        message: response.data.message || 'Failed to load payments.'
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load payments.';
      setError(message);
      return {
        success: false,
        message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPaymentsByPatient = useCallback(async (patientId) => {
    try {
      if (!patientId) {
        setPayments([]);
        setLoading(false);
        return {
          success: false,
          message: 'Patient ID is required'
        };
      }

      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/payments/patient/${patientId}`);

      const paymentList = response.data?.payments || [];

      setPayments(paymentList);

      return {
        success: true,
        payments: paymentList
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch payments.';
      setError(message);
      setPayments([]);
      return {
        success: false,
        message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPaymentById = useCallback(async (paymentId) => {
    try {
      if (!paymentId) {
        return {
          success: false,
          message: 'Payment ID is required'
        };
      }

      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/payments/${paymentId}`);

      if (response.data.success) {
        setSelectedPayment(response.data.payment || null);
        return {
          success: true,
          payment: response.data.payment
        };
      }

      return {
        success: false,
        message: response.data.message || 'Failed to fetch payment.'
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch payment.';
      setError(message);
      return {
        success: false,
        message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPaymentByAppointment = useCallback(async (appointmentId) => {
    try {
      if (!appointmentId) {
        return {
          success: false,
          message: 'Appointment ID is required'
        };
      }

      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/payments/appointment/${appointmentId}`);

      if (response.data.success) {
        setSelectedPayment(response.data.payment || null);
        return {
          success: true,
          payment: response.data.payment
        };
      }

      return {
        success: false,
        message: response.data.message || 'Failed to fetch payment.'
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch payment.';
      setError(message);
      return {
        success: false,
        message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const createPayment = useCallback(async (paymentData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.post('/payments', paymentData);

      if (response.data.success) {
        const newPayment = response.data.payment;
        setPayments((prev) => [newPayment, ...prev]);
        return {
          success: true,
          payment: newPayment,
          message: response.data.message || 'Payment created successfully'
        };
      }

      return {
        success: false,
        message: response.data.message || 'Failed to create payment.'
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create payment.';
      setError(message);
      return {
        success: false,
        message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePayment = useCallback(async (paymentId, paymentData) => {
    try {
      if (!paymentId) {
        return {
          success: false,
          message: 'Payment ID is required'
        };
      }

      setLoading(true);
      setError(null);

      const response = await axiosInstance.put(`/payments/${paymentId}`, paymentData);

      if (response.data.success) {
        const updated = response.data.payment;
        setPayments((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
        setSelectedPayment(updated);
        return {
          success: true,
          payment: updated,
          message: response.data.message || 'Payment updated successfully'
        };
      }

      return {
        success: false,
        message: response.data.message || 'Failed to update payment.'
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update payment.';
      setError(message);
      return {
        success: false,
        message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePayment = useCallback(async (paymentId) => {
    try {
      if (!paymentId) {
        return {
          success: false,
          message: 'Payment ID is required'
        };
      }

      setLoading(true);
      setError(null);

      const response = await axiosInstance.delete(`/payments/${paymentId}`);

      if (response.data.success) {
        setPayments((prev) => prev.filter((item) => item._id !== paymentId));
        if (selectedPayment?._id === paymentId) {
          setSelectedPayment(null);
        }
        return {
          success: true,
          message: response.data.message || 'Payment deleted successfully'
        };
      }

      return {
        success: false,
        message: response.data.message || 'Failed to delete payment.'
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete payment.';
      setError(message);
      return {
        success: false,
        message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    payments,
    selectedPayment,
    loading,
    error,
    fetchAllPayments,
    fetchPaymentsByPatient,
    fetchPaymentById,
    fetchPaymentByAppointment,
    createPayment,
    updatePayment,
    deletePayment,
    clearPaymentError
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}



