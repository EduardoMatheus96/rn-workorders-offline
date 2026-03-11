import React, { createContext, useContext, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';

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

  const toggleTheme = () => {
    const next: 'light' | 'dark' = isDark ? 'light' : 'dark';
    setOverride(next);
    Appearance.setColorScheme(next);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
