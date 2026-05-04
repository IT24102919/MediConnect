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
import * as ImageManipulator from 'expo-image-manipulator';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../../constants/theme';
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
        quality: 0.5
      });

      if (!result.canceled && result.assets?.length) {
        const pickedImage = result.assets[0];
        const resizedImage = await ImageManipulator.manipulateAsync(
          pickedImage.uri,
          [{ resize: { width: 1280 } }],
          {
            compress: 0.45,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true
          }
        );

        if (!resizedImage.base64) {
          Alert.alert('Error', 'Failed to process selected image.');
          return;
        }

        setReportImageData(`data:image/jpeg;base64,${resizedImage.base64}`);
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
        <ActivityIndicator size="large" color={COLORS.primary} />
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
    backgroundColor: COLORS.background
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    paddingBottom: SPACING.xxxl
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.primary,
    fontWeight: '600'
  },
  title: {
    color: COLORS.dark,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: SPACING.sm
  },
  subtitle: {
    color: COLORS.textLight,
    marginBottom: SPACING.xl
  },
  pickButton: {
    backgroundColor: COLORS.secondary,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    ...SHADOWS.sm,
  },
  pickButtonText: {
    color: COLORS.dark,
    fontWeight: '700'
  },
  previewWrap: {
    marginTop: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...SHADOWS.md,
  },
  previewImage: {
    width: '100%',
    height: 280,
    backgroundColor: COLORS.background
  },
  emptyPreview: {
    marginTop: SPACING.lg,
    height: 180,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white
  },
  emptyPreviewText: {
    color: COLORS.textLight,
    fontWeight: '600'
  },
  saveButton: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    ...SHADOWS.lg,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: '800'
  },
  deleteButton: {
    marginTop: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.error,
    backgroundColor: COLORS.white
  },
  deleteButtonText: {
    color: COLORS.error,
    fontWeight: '800'
  },
  buttonDisabled: {
    opacity: 0.65
  }
});

