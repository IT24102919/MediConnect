import React, { createContext, useState, useCallback } from 'react';
import axiosInstance from '../api/axios';

export const AppointmentContext = createContext();

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState([]);
  const [appointmentRecords, setAppointmentRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch appointments for logged-in patient
  const fetchAppointmentsByPatient = useCallback(async (patientId) => {
    try {
      if (!patientId) {
        return {
          success: false,
          message: 'Patient ID is required'
        };
      }

      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/appointments/patient/${patientId}`);

      if (response.data.success) {
        setAppointments(response.data.appointments || []);
        return {
          success: true,
          appointments: response.data.appointments || []
        };
      }

      return {
        success: false,
        message: 'Failed to fetch appointments'
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch appointments';
      setError(message);
      return {
        success: false,
        message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch appointment records (past and cancelled) for logged-in patient
  const fetchAppointmentRecordsByPatient = useCallback(async (patientId) => {
    try {
      if (!patientId) {
        return {
          success: false,
          message: 'Patient ID is required'
        };
      }

      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/appointments/patient/${patientId}/records`);

      if (response.data.success) {
        setAppointmentRecords(response.data.records || []);
        return {
          success: true,
          records: response.data.records || []
        };
      }

      return {
        success: false,
        message: 'Failed to fetch appointment records'
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch appointment records';
      setError(message);
      return {
        success: false,
        message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new appointment
  const addAppointment = async (appointmentData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.post('/appointments', appointmentData);

      if (response.data.success) {
        // Add to local state
        setAppointments((prev) => [response.data.appointment, ...prev]);

        return {
          success: true,
          message: 'Appointment created successfully',
          appointment: response.data.appointment
        };
      }

      return {
        success: false,
        message: response.data.message || 'Failed to create appointment'
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create appointment';
      setError(message);
      return {
        success: false,
        message
      };
    } finally {
      setLoading(false);
    }
  };

  // Update appointment
  const updateAppointment = async (appointmentId, updates) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.put(`/appointments/${appointmentId}`, updates);

      if (response.data.success) {
        // Update local state
        setAppointments((prev) =>
          prev.map((apt) => (apt._id === appointmentId ? response.data.appointment : apt))
        );

        return {
          success: true,
          message: 'Appointment updated successfully'
        };
      }

      return {
        success: false,
        message: response.data.message || 'Failed to update appointment'
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update appointment';
      setError(message);
      return {
        success: false,
        message
      };
    } finally {
      setLoading(false);
    }
  };

  // Update local appointment after external actions (e.g., payment status updates)
  const replaceAppointmentInState = (appointmentId, nextAppointment) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt._id === appointmentId ? nextAppointment : apt))
    );
  };

  // Delete appointment
  const deleteAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.delete(`/appointments/${appointmentId}`);

      if (response.data.success) {
        // Remove from local state
        setAppointments((prev) => prev.filter((apt) => apt._id !== appointmentId));
        setAppointmentRecords((prev) => prev.filter((apt) => apt._id !== appointmentId));

        return {
          success: true,
          message: 'Appointment deleted successfully'
        };
      }

      return {
        success: false,
        message: response.data.message || 'Failed to delete appointment'
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete appointment';
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
    appointments,
    appointmentRecords,
    loading,
    error,
    fetchAppointmentsByPatient,
    fetchAppointmentRecordsByPatient,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    replaceAppointmentInState
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
}



