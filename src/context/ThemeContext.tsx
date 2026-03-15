import React, { createContext, useContext, useRef, useState } from 'react';
import { Appearance, StyleSheet, useColorScheme } from 'react-native';
import { Animated } from 'react-native';


interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState<'light' | 'dark' | null>(null);

  const colorScheme = override ?? systemScheme ?? 'light';
  const isDark = colorScheme === 'dark';
  const flashOpacity = useRef(new Animated.Value(0)).current;


  const toggleTheme = () => {
    const next: 'light' | 'dark' = isDark ? 'light' : 'dark';

    Animated.sequence([
      Animated.timing(flashOpacity, { toValue: 0.3, duration: 80, useNativeDriver: true }),
      Animated.timing(flashOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start();

    setOverride(next);
    Appearance.setColorScheme(next);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, { backgroundColor: '#000', opacity: flashOpacity }]}
      />
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
