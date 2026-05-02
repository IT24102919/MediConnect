import React, { useContext, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function SplashScreen({ navigation }) {
  const { loading, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (loading) {
      return undefined;
    }

    const timer = setTimeout(() => {
      navigation.replace(isAuthenticated ? 'Home' : 'Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, navigation]);

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
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 240,
    height: 240
  }
});


