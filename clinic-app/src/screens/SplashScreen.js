import React, { useContext, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
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
      <View style={styles.gradientLayerDark} />
      <View style={styles.gradientLayerMid} />
      <View style={styles.gradientLayerSoft} />
      <View style={styles.logoWrap}>
        <Image
          source={require('../assets/splash.png')}
          style={styles.image}
          resizeMode="contain"
        />
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
  gradientLayerDark: {
    position: 'absolute',
    width: '140%',
    height: '72%',
    top: '-8%',
    borderBottomLeftRadius: 220,
    borderBottomRightRadius: 220,
    backgroundColor: COLORS.dark,
    opacity: 0.95
  },
  gradientLayerMid: {
    position: 'absolute',
    width: '150%',
    height: '72%',
    top: '18%',
    left: '-25%',
    borderRadius: 240,
    backgroundColor: COLORS.secondary,
    opacity: 0.55
  },
  gradientLayerSoft: {
    position: 'absolute',
    width: '130%',
    height: '62%',
    bottom: '-24%',
    right: '-15%',
    borderRadius: 220,
    backgroundColor: COLORS.background,
    opacity: 0.95
  },
  logoWrap: {
    padding: 22,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8
  },
  image: {
    width: 210,
    height: 210
  }
});



