import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import axiosInstance from '../api/axios';

const parseCSV = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

export default function MedicalHistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    bloodGroup: '',
    allergies: '',
    chronicConditions: '',
    currentMedications: '',
    surgeries: '',
    familyHistory: '',
    notes: ''
  });

  const fetchMedicalHistory = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/medical-history/me');

      if (response.data.success) {
        const history = response.data.medicalHistory;
        setForm({
          bloodGroup: history.bloodGroup || '',
          allergies: (history.allergies || []).join(', '),
          chronicConditions: (history.chronicConditions || []).join(', '),
          currentMedications: (history.currentMedications || []).join(', '),
          surgeries: (history.surgeries || []).join(', '),
          familyHistory: history.familyHistory || '',
          notes: history.notes || ''
        });
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to load medical history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        bloodGroup: form.bloodGroup.trim(),
        allergies: parseCSV(form.allergies),
        chronicConditions: parseCSV(form.chronicConditions),
        currentMedications: parseCSV(form.currentMedications),
        surgeries: parseCSV(form.surgeries),
        familyHistory: form.familyHistory.trim(),
        notes: form.notes.trim()
      };

      const response = await axiosInstance.put('/medical-history/me', payload);

      if (response.data.success) {
        Alert.alert('Saved', 'Medical history updated successfully.');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to save medical history.');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save medical history.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#38BDF8" />
        <Text style={styles.loadingText}>Loading medical history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Medical History</Text>
        <Text style={styles.subtitle}>Keep your core health information up to date.</Text>

        <Text style={styles.label}>Blood Group</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. A+, O-"
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={form.bloodGroup}
          onChangeText={(text) => handleChange('bloodGroup', text)}
        />

        <Text style={styles.label}>Allergies (comma separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Penicillin, Dust"
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={form.allergies}
          onChangeText={(text) => handleChange('allergies', text)}
        />

        <Text style={styles.label}>Chronic Conditions (comma separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Diabetes, Hypertension"
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={form.chronicConditions}
          onChangeText={(text) => handleChange('chronicConditions', text)}
        />

        <Text style={styles.label}>Current Medications (comma separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Metformin 500mg"
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={form.currentMedications}
          onChangeText={(text) => handleChange('currentMedications', text)}
        />

        <Text style={styles.label}>Surgeries (comma separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Appendectomy (2019)"
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={form.surgeries}
          onChangeText={(text) => handleChange('surgeries', text)}
        />

        <Text style={styles.label}>Family History</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Family health history..."
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={form.familyHistory}
          onChangeText={(text) => handleChange('familyHistory', text)}
          multiline
        />

        <Text style={styles.label}>Additional Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Any other medical notes..."
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={form.notes}
          onChangeText={(text) => handleChange('notes', text)}
          multiline
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
          <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Medical History'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: '#102A43'
=======
    backgroundColor: '#0F172A'
>>>>>>> b97bb2a5578a6ebbe5b954f4ae073ee17dd94cae
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 30
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    color: '#38BDF8',
    fontWeight: '600'
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 18
  },
  label: {
    color: '#38BDF8',
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
    fontSize: 13
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: '#FFFFFF'
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top'
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#38BDF8',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14
  },
  saveButtonText: {
    color: '#0F172A',
    fontWeight: '800'
  }
});