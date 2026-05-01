import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CompleteDoctorProfileScreen({ navigation, route }) {
  const { token, user, getProfile } = useContext(AuthContext);
  const { params } = route;
  const isEditing = params?.isEditing || false;
  const existingDoctorData = params?.doctorData || null;
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  // Form fields - all start empty
  const [specialization, setSpecialization] = useState('');
  const [hospital, setHospital] = useState('');
  const [experience, setExperience] = useState('');
  const [fee, setFee] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');

  // Validation error messages
  const [hospitalError, setHospitalError] = useState('');
  const [experienceError, setExperienceError] = useState('');
  const [feeError, setFeeError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Custom specialization (for "Other" option)
  const [customSpecialization, setCustomSpecialization] = useState('');
  const [customSpecError, setCustomSpecError] = useState('');
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  const specializations = [
    'Cardiologist', 'Dermatologist', 'Neurologist',
    'Orthopedic', 'ENT Specialist', 'Gynecologist',
    'Pediatrician', 'General Practitioner', 'Psychiatrist', 'Dentist', 'Other'
  ];

  useEffect(() => {
    // If editing and we have existing data, pre-fill the form
    if (isEditing && existingDoctorData) {
      setSpecialization(existingDoctorData.specialization || '');
      setHospital(existingDoctorData.hospital || '');
      setExperience(existingDoctorData.experience?.toString() || '');
      setFee(existingDoctorData.fee?.toString() || '');
      setPhone(existingDoctorData.phone || '');
      setDescription(existingDoctorData.description || '');

      // Check if the specialization is from the predefined list
      const currentSpecialization = existingDoctorData.specialization || '';
      if (currentSpecialization && !specializations.includes(currentSpecialization)) {
        setIsOtherSelected(true);
        setCustomSpecialization(currentSpecialization);
      }

      if (existingDoctorData.image) {
        // Build URL dynamically using axios base URL
        const baseURL = axiosInstance.defaults.baseURL;
        const backendUrl = baseURL.replace('/api', '');
        setImage(`${backendUrl}${existingDoctorData.image}`);
      }
    }
  }, [isEditing, existingDoctorData]);

  const validateHospital = (text) => {
    if (text.length > 0 && text.length < 3) {
      setHospitalError('Hospital name must be at least 3 characters');
    } else {
      setHospitalError('');
    }
  };

  // Experience validation - no dot at beginning, no multiple dots
  const validateExperience = (text) => {
    let error = '';

    if (text.length > 0) {
      // Check if starts with dot
      if (text.startsWith('.')) {
        error = 'Experience cannot start with a dot';
      }
      // Check for multiple dots
      else if ((text.match(/\./g) || []).length > 1) {
        error = 'Experience can only have one decimal point';
      }
    }

    setExperienceError(error);
    return error === '';
  };

  // Fee validation - range 500-15000, no dot at beginning, no multiple dots
  const validateFee = (text) => {
    let error = '';

    if (text.length > 0) {
      // Check if starts with dot
      if (text.startsWith('.')) {
        error = 'Fee cannot start with a dot';
      }
      // Check for multiple dots
      else if ((text.match(/\./g) || []).length > 1) {
        error = 'Fee can only have one decimal point';
      }
      // Check range (only if value is a valid number)
      else {
        const numValue = parseFloat(text);
        if (!isNaN(numValue)) {
          if (numValue < 500) {
            error = 'Fee must be at least Rs. 500';
          } else if (numValue > 15000) {
            error = 'Fee cannot exceed Rs. 15,000';
          }
        }
      }
    }

    setFeeError(error);
    return error === '';
  };

  // Phone validation - must be exactly 10 digits (if entered)
  const validatePhone = (text) => {
    if (text.length > 0) {
      if (text.length !== 10) {
        setPhoneError('Phone number must be exactly 10 digits');
      } else {
        setPhoneError('');
      }
    } else {
      setPhoneError(''); // no error if empty
    }
  };

  // Custom specialization validation
  const validateCustomSpecialization = (text) => {
    let error = '';

    if (text.length > 0) {
      if (/\d/.test(text)) {
        error = 'Numbers are not allowed';
      }
      // Check for numbers
      else if (!/^[A-Za-z\s]+$/.test(text)) {
        error = 'Only letters and spaces are allowed';
      }
      // Check for special characters (allow only letters and spaces)
      else if (text.length < 3) {
        error = 'Specialization must be at least 3 characters';
      }
    } else {
      error = 'Please enter your specialization';
    }

    setCustomSpecError(error);
    return error === '';
  };

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!specialization) {
      Alert.alert('Error', 'Please select your specialization');
      return;
    }

    // Validate custom specialization if "Other" is selected
    if (isOtherSelected) {
      if (!customSpecialization.trim()) {
        Alert.alert('Error', 'Please enter your specialization');
        return;
      }
      if (customSpecError) {
        Alert.alert('Error', customSpecError);
        return;
      }
    }
    if (!hospital.trim()) {
      Alert.alert('Error', 'Please enter your hospital/clinic');
      return;
    }
    if (hospital.trim().length < 3) {
      Alert.alert('Error', 'Hospital name must be at least 3 characters');
      return;
    }
    if (!experience || parseInt(experience) < 0) {
      Alert.alert('Error', 'Please enter valid years of experience');
      return;
    }
    // Check experience dot validation
    if (experienceError) {
      Alert.alert('Error', experienceError);
      return;
    }
    if (!fee || parseInt(fee) <= 0) {
      Alert.alert('Error', 'Please enter a valid consultation fee');
      return;
    }
    // Check fee validation
    if (feeError) {
      Alert.alert('Error', feeError);
      return;
    }
    // Check fee range
    const feeNumber = parseInt(fee);
    if (feeNumber < 500) {
      Alert.alert('Error', 'Consultation fee must be at least Rs. 500');
      return;
    }
    if (feeNumber > 15000) {
      Alert.alert('Error', 'Consultation fee cannot exceed Rs. 15,000');
      return;
    }
    // Check phone length if provided
    if (phone && phone.length !== 10) {
      Alert.alert('Error', 'Phone number must be exactly 10 digits');
      return;
    }

    setLoading(true);

    try {
      // First, create/update doctor profile
      let doctorId = null;

      // Check if doctor already has a profile
      const doctorsResponse = await axiosInstance.get('/doctors');
      let existingDoctor = doctorsResponse.data.doctors.find(
        doc => doc.userId === user.id || doc.name === user.name
      );

      let doctorResponse;
      if (existingDoctor) {
        // Update existing
        doctorResponse = await axiosInstance.put(`/doctors/${existingDoctor._id}`, {
          name: user.name,
          specialization,
          hospital: hospital.trim(),
          experience: parseInt(experience),
          fee: parseInt(fee),
          phone: phone.trim() || '',
          description: description.trim() || '',
          available: true,
          userId: user.id
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        doctorId = existingDoctor._id;
      } else {
        // Create new
        doctorResponse = await axiosInstance.post('/doctors', {
          name: user.name,
          specialization,
          hospital: hospital.trim(),
          experience: parseInt(experience),
          fee: parseInt(fee),
          phone: phone.trim() || '',
          description: description.trim() || '',
          available: true,
          userId: user.id
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        doctorId = doctorResponse.data.doctor._id;
      }

      // Upload image if selected
      if (image) {
        const formData = new FormData();
        formData.append('image', {
          uri: image,
          name: `doctor_${user.id}.jpg`,
          type: 'image/jpeg'
        });

        await axiosInstance.post(`/doctors/${doctorId}/upload-image`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      await AsyncStorage.removeItem('needsProfileCompletion');

      Alert.alert('Success', isEditing ? 'Profile updated!' : 'Your profile is complete!', [
        {
          text: 'OK', onPress: () => {
            if (isEditing) {
              navigation.goBack();  // Go back to dashboard without reloading
            } else {
              navigation.replace('DoctorDashboard');  // First time completion
            }
          }
        }
      ]);
    } catch (error) {
      console.log("Error:", error.response?.data);
      Alert.alert('Error', error.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>Tell patients about yourself</Text>
      </View>

      <View style={styles.form}>
        {/* Image Upload */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Profile Image (Optional)</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.profileImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>📸 Tap to add photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Specialization - REQUIRED */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Specialization *</Text>
          <View style={styles.specializationContainer}>
            {specializations.map(spec => (
              <TouchableOpacity
                key={spec}
                style={[
                  styles.specChip,
                  specialization === spec && styles.specChipActive
                ]}
                onPress={() => {
                  setSpecialization(spec);
                  if (spec === 'Other') {
                    setIsOtherSelected(true);
                    // If editing and has custom value, pre-fill it
                    if (existingDoctorData && existingDoctorData.specialization &&
                      !specializations.includes(existingDoctorData.specialization)) {
                      setCustomSpecialization(existingDoctorData.specialization);
                    }
                  } else {
                    setIsOtherSelected(false);
                    setCustomSpecialization('');
                    setCustomSpecError('');
                  }
                }}
              >
                <Text style={[
                  styles.specChipText,
                  specialization === spec && styles.specChipTextActive
                ]}>{spec}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Specialization Input - only shows when "Other" is selected */}
        {isOtherSelected && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Enter Your Specialization *</Text>
            <TextInput
              style={[styles.input, customSpecError ? styles.inputError : null]}
              placeholder="e.g., Sports Medicine, Emergency Medicine"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={customSpecialization}
              onChangeText={(text) => {
                setCustomSpecialization(text);
                validateCustomSpecialization(text);
                // Update the specialization value for form submission
                setSpecialization(text);
              }}
            />
            {customSpecError ? <Text style={styles.errorText}>{customSpecError}</Text> : null}
          </View>
        )}

        {/* Hospital - REQUIRED */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Hospital/Clinic *</Text>
          <TextInput
            style={[styles.input, hospitalError ? styles.inputError : null]}
            placeholder="e.g., General Hospital, Colombo"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={hospital}
            onChangeText={(text) => {
              setHospital(text);
              validateHospital(text);
            }}
          />
          {hospitalError ? <Text style={styles.errorText}>{hospitalError}</Text> : null}
        </View>

        {/* Experience - REQUIRED */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Experience (years) *</Text>
          <TextInput
            style={[styles.input, experienceError ? styles.inputError : null]}
            placeholder="e.g., 5"
            placeholderTextColor="rgba(255,255,255,0.5)"
            keyboardType="numeric"
            value={experience}
            onChangeText={(text) => {
              setExperience(text);
              validateExperience(text);
            }}
          />
          {experienceError ? <Text style={styles.errorText}>{experienceError}</Text> : null}
        </View>

        {/* Fee - REQUIRED */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Consultation Fee (Rs.) *</Text>
          <TextInput
            style={[styles.input, feeError ? styles.inputError : null]}
            placeholder="e.g., 1500"
            placeholderTextColor="rgba(255,255,255,0.5)"
            keyboardType="numeric"
            value={fee}
            onChangeText={(text) => {
              setFee(text);
              validateFee(text);
            }}
          />
          {feeError ? <Text style={styles.errorText}>{feeError}</Text> : null}
        </View>

        {/* Phone - Optional */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number (Optional)</Text>
          <TextInput
            style={[styles.input, phoneError ? styles.inputError : null]}
            placeholder="e.g., 0771234567"
            placeholderTextColor="rgba(255,255,255,0.5)"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              validatePhone(text);
            }}
          />
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
        </View>

        {/* Description - Optional */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>About (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell patients about your experience and approach..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Saving...' : (isEditing ? 'Update Profile' : 'Complete Profile')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 8,
  },
  form: {
    padding: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  specializationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  specChipActive: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  specChipText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
  specChipTextActive: {
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#38BDF8',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  imagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 1,
  },
});