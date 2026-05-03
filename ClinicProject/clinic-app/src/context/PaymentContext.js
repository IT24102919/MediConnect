import React, { createContext, useState } from 'react';
import axiosInstance from '../api/axios';

export const PaymentContext = createContext();

export function PaymentProvider({ children }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPaymentsByPatient = async (patientId) => {
    try {
      if (!patientId) {
        return {
          success: false,
          message: 'Patient ID is required'
        };
      }

      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/payments/patient/${patientId}`);

      if (response.data.success) {
        setPayments(response.data.payments || []);
        return {
          success: true,
          payments: response.data.payments || []
        };
      }

      return {
        success: false,
        message: response.data.message || 'Failed to fetch payments'
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch payments';
      setError(message);
      return {
        success: false,
        message
      };
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.post('/payments', paymentData);

      if (response.data.success) {
        setPayments((prev) => [response.data.payment, ...prev]);
        return {
          success: true,
          payment: response.data.payment,
          message: response.data.message || 'Payment saved successfully'
        };
      }

      return {
        success: false,
        message: response.data.message || 'Failed to process payment'
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to process payment';
      setError(message);
      return {
        success: false,
        message
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    payments,
    loading,
    error,
    fetchPaymentsByPatient,
    createPayment
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}



