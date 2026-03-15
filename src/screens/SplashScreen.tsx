import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import LogoInMeta from '../assets/logo_inMeta.svg';

type Props = { onFinish: () => void };

export function SplashScreen({ onFinish }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
      ]),
      Animated.delay(1000),
      Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(onFinish);
  }, [onFinish, opacity, scale]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <LogoInMeta width={200} height={56} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E4737',
    alignItems: 'center',
    justifyContent: 'center',
  },
});