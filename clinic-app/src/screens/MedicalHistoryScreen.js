import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axiosInstance from '../api/axios';

export default function MedicalHistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reportImageData, setReportImageData] = useState('');

  const fetchMedicalHistory = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/medical-history/me');

      if (response.data.success) {
        setReportImageData(response.data.medicalHistory?.reportImageData || '');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to load medical report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  const pickReportImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow photo library access to upload report images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5,
        base64: true
      });

      if (!result.canceled && result.assets?.length) {
        const pickedImage = result.assets[0];
        if (!pickedImage.base64) {
          Alert.alert('Error', 'Failed to process selected image.');
          return;
        }

        const mimeType = pickedImage.mimeType || 'image/jpeg';
        setReportImageData(`data:${mimeType};base64,${pickedImage.base64}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const handleSave = async () => {
    try {
      if (!reportImageData) {
        Alert.alert('No image selected', 'Please choose a medical report image first.');
        return;
      }

      setSaving(true);

      const response = await axiosInstance.put('/medical-history/me', {
        reportImageData
      });

      if (response.data.success) {
        Alert.alert('Saved', 'Medical report image uploaded successfully.');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to upload medical report image.');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to upload medical report image.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (saving || deleting) return;

    Alert.alert('Remove Image', 'Are you sure you want to remove this medical report image?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeleting(true);
            setReportImageData('');
            const response = await axiosInstance.put('/medical-history/me', {
              reportImageData: ''
            });

            if (response.data.success) {
              Alert.alert('Removed', 'Medical report image removed successfully.');
            } else {
              Alert.alert('Error', response.data.message || 'Failed to remove medical report image.');
            }
          } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to remove medical report image.');
          } finally {
            setDeleting(false);
          }
        }
      }
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#38BDF8" />
        <Text style={styles.loadingText}>Loading medical report...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Medical Report</Text>
        <Text style={styles.subtitle}>Upload your latest medical report image.</Text>

        <TouchableOpacity style={styles.pickButton} onPress={pickReportImage} disabled={saving || deleting}>
          <Text style={styles.pickButtonText}>Choose Report Image</Text>
        </TouchableOpacity>

        {reportImageData ? (
          <View style={styles.previewWrap}>
            <Image source={{ uri: reportImageData }} style={styles.previewImage} />
          </View>
        ) : (
          <View style={styles.emptyPreview}>
            <Text style={styles.emptyPreviewText}>No report image selected</Text>
          </View>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving || deleting}>
          <Text style={styles.saveButtonText}>{saving ? 'Uploading...' : 'Upload Medical Report'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.deleteButton, (saving || deleting) && styles.buttonDisabled]}
          onPress={handleDelete}
          disabled={saving || deleting}
        >
          <Text style={styles.deleteButtonText}>{deleting ? 'Removing...' : 'Remove Uploaded Image'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
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
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6
  },
  subtitle: {
    color: '#64748B',
    marginBottom: 18
  },
  pickButton: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#38BDF8',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14
  },
  pickButtonText: {
    color: '#0369A1',
    fontWeight: '700'
  },
  previewWrap: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CBD5E1'
  },
  previewImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#E2E8F0'
  },
  emptyPreview: {
    marginTop: 16,
    height: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  emptyPreviewText: {
    color: '#94A3B8',
    fontWeight: '600'
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#38BDF8',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  deleteButton: {
    marginTop: 12,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: 'rgba(220, 38, 38, 0.12)'
  },
  deleteButtonText: {
    color: '#FCA5A5',
    fontWeight: '800'
  },
  buttonDisabled: {
    opacity: 0.65
  }
});
