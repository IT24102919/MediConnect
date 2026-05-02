import React, { useContext, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';

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
      <Image
        source={require('../assets/splash.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B50D9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 240,
    height: 240
  }
});



