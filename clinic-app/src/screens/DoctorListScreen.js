import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Dimensions,
  ActivityIndicator,
  TextInput,
  TouchableOpacity
} from 'react-native';
import axiosInstance from '../api/axios';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import DoctorCard from '../components/DoctorCard';
import localDoctors from '../data/doctors';

const { width, height } = Dimensions.get('window');

export default function DoctorListScreen({ navigation }) {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [usingFallback, setUsingFallback] = useState(false);

  // Fetch doctors from backend on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingFallback(false);

      // Call backend API to get all doctors
      const response = await axiosInstance.get('/doctors');

      if (response.data.success) {
        const list = response.data.doctors || [];
        setDoctors(list);
        setFilteredDoctors(list);
      } else {
        setError('Failed to load doctors');
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
      const fallbackList = localDoctors.map((doctor) => ({
        ...doctor,
        _id: doctor.id,
      }));

      setDoctors(fallbackList);
      setFilteredDoctors(fallbackList);
      setUsingFallback(true);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let nextList = [...doctors];

    if (selectedSpecialization !== 'All') {
      nextList = nextList.filter(
        (item) => item.specialization?.toLowerCase() === selectedSpecialization.toLowerCase()
      );
    }

    if (searchText.trim()) {
      nextList = nextList.filter((item) =>
        item.name?.toLowerCase().includes(searchText.trim().toLowerCase())
      );
    }

    setFilteredDoctors(nextList);
  }, [doctors, searchText, selectedSpecialization]);

  const specializations = ['All', ...new Set(doctors.map((item) => item.specialization).filter(Boolean))];

  // Show loading state
  if (loading) {
    return (
      <View style={[styles.mainContainer, styles.centerContent]}>
        <ActivityIndicator size="large" color="#38BDF8" />
        <Text style={styles.loadingText}>Loading doctors...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={[styles.mainContainer, styles.centerContent]}>
        <Text style={styles.errorText}>❌ {error}</Text>
        <Text style={styles.retryText} onPress={fetchDoctors}>
          Tap to retry
        </Text>
      </View>
    );
  }

  // Show empty state
  if (doctors.length === 0) {
    return (
      <View style={[styles.mainContainer, styles.centerContent]}>
        <Text style={styles.emptyText}>No doctors available</Text>
      </View>
    );
  }
  return (
    <View style={styles.mainContainer}>
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Our Specialists</Text>
        <Text style={styles.subtitle}>Find the best care for your health</Text>
      </View>

      <View style={styles.searchSection}>
        {usingFallback ? (
          <Text style={styles.warningText}>
            Backend unreachable. Showing offline doctor list.
          </Text>
        ) : null}

        <TextInput
          style={styles.searchInput}
          placeholder="Search doctor by name"
          placeholderTextColor="rgba(255, 255, 255, 0.45)"
          value={searchText}
          onChangeText={setSearchText}
        />

        <FlatList
          data={specializations}
          horizontal
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedSpecialization === item && styles.filterChipActive
              ]}
              onPress={() => setSelectedSpecialization(item)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedSpecialization === item && styles.filterChipTextActive
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* List Section */}
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => String(item._id || item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <DoctorCard
            doctor={item}
            onPress={() => navigation.navigate('DoctorDetails', { doctor: item })}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyFilterBox}>
            <Text style={styles.emptyText}>No doctors matched your search/filter.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  retryText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    overflow: 'hidden',
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  
  circle1: {
    position: 'absolute',
    top: -height * 0.1,
    right: -width * 0.2,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: COLORS.primary,
    opacity: 0.1, 
  },
  
  circle2: {
    position: 'absolute',
    top: height * 0.3,
    left: -width * 0.2,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: COLORS.secondary,
    opacity: 0.08,
  },
 
  circle3: {
    position: 'absolute',
    bottom: -50,
    right: 20,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.accent,
    opacity: 0.08,
  },
  header: {
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.xxxl,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.dark,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  searchSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  warningText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  searchInput: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    color: COLORS.dark,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: 14,
    marginBottom: SPACING.md,
  },
  filterContainer: {
    paddingVertical: SPACING.sm,
    gap: SPACING.md,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    color: COLORS.dark,
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  emptyFilterBox: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
});

