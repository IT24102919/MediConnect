import React, { useContext, useEffect } from 'react';
import { Image, StyleSheet, View, LinearGradient } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../../constants/theme';

export default function SplashScreen({ navigation }) {
  const { loading, isAuthenticated, user } = useContext(AuthContext);

  useEffect(() => {
    if (loading) {
      return undefined;
    }

    const timer = setTimeout(() => {
      const userRole = String(user?.role || '').toLowerCase();
      if (!isAuthenticated) {
        navigation.replace('Login');
      } else {
        navigation.replace(userRole === 'doctor' ? 'DoctorDashboard' : 'Home');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, user?.role, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.gradientContainer}>
        <View style={styles.gradientContent}>
          <Image
            source={require('../assets/splash.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15
  },
  gradientContent: {
    flex: 1,
    backgroundColor: COLORS.primary,
    transform: [{ scaleX: 2 }, { scaleY: 1.5 }]
  },
  image: {
    width: 240,
    height: 240
  }
});



